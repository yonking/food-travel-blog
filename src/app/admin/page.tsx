"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface PostData {
  slug: string;
  title: string;
  date: string;
  location: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
  content: string;
}

const EMPTY_POST: PostData = {
  slug: "",
  title: "",
  date: new Date().toISOString().split("T")[0],
  location: "",
  excerpt: "",
  coverImage: "",
  tags: [],
  content: "",
};

export default function AdminPage() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [current, setCurrent] = useState<PostData>(EMPTY_POST);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [message, setMessage] = useState("");
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(data);
  }

  function loadPost(post: PostData) {
    setCurrent({ ...post });
    setTagInput((post.tags || []).join(", "));
    setTab("edit");
  }

  function newPost() {
    setCurrent({ ...EMPTY_POST, date: new Date().toISOString().split("T")[0] });
    setTagInput("");
    setTab("edit");
  }

  async function savePost() {
    setSaving(true);
    setMessage("");
    try {
      const tags = tagInput
        .split(/[,，]/)
        .map((t) => t.trim())
        .filter(Boolean);

      // Auto-generate slug from title if empty (english only, use timestamp for Chinese titles)
      let slug = current.slug;
      if (!slug) {
        const hasChinese = /[\u4e00-\u9fff]/.test(current.title);
        if (hasChinese) {
          slug = `post-${Date.now()}`;
        } else {
          slug = current.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        }
      }

      const body = { ...current, slug, tags };

      const isEdit = posts.some((p) => p.slug === slug);
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch("/api/posts", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setMessage("保存成功");
        await fetchPosts();
        setCurrent({ ...body });
      } else {
        const err = await res.json();
        setMessage("保存失败: " + (err.error || ""));
      }
    } catch (e) {
      setMessage("保存失败: " + String(e));
    } finally {
      setSaving(false);
    }
  }

  async function deletePost(slug: string) {
    if (!confirm(`确定删除「${slug}」？`)) return;
    const res = await fetch(`/api/posts?slug=${slug}`, { method: "DELETE" });
    if (res.ok) {
      setMessage("已删除");
      await fetchPosts();
      if (current.slug === slug) newPost();
    }
  }

  async function deploy() {
    setDeploying(true);
    setMessage("");
    try {
      const res = await fetch("/api/deploy", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setMessage("发布成功！1-2分钟后线上更新 → " + data.message);
      } else {
        setMessage("发布失败: " + (data.error || ""));
      }
    } catch (e) {
      setMessage("发布失败: " + String(e));
    } finally {
      setDeploying(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (data.success && data.url) {
        // Insert markdown image syntax at cursor
        const textarea = contentRef.current;
        if (textarea) {
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const imgMd = `![${file.name}](${data.url})`;
          const newContent = current.content.slice(0, start) + imgMd + current.content.slice(end);
          setCurrent({ ...current, content: newContent });
          // Set cursor after insertion
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start + imgMd.length;
            textarea.focus();
          }, 0);
        }
      }
    }
    // Reset file input
    e.target.value = "";
  }

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const textarea = e.currentTarget;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newContent = current.content.slice(0, start) + "  " + current.content.slice(end);
        setCurrent({ ...current, content: newContent });
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
        }, 0);
      }
      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        savePost();
      }
    },
    [current.content, savePost]
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex">
      {/* Sidebar - Post List */}
      <aside className="w-72 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <button
            onClick={newPost}
            className="w-full py-2.5 rounded-lg bg-orange-600 text-white font-medium hover:bg-orange-700 transition-colors text-sm"
          >
            + 新建游记
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {posts.map((post) => (
            <div
              key={post.slug}
              className={`px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 group flex items-start justify-between ${
                current.slug === post.slug ? "bg-orange-50 dark:bg-orange-900/20" : ""
              }`}
              onClick={() => loadPost(post)}
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                  {post.title || post.slug}
                </div>
                <div className="text-xs text-zinc-500 mt-0.5">
                  {post.date} · {post.location}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deletePost(post.slug);
                }}
                className="opacity-0 group-hover:opacity-100 text-xs text-red-400 hover:text-red-600 ml-2 mt-0.5"
              >
                删除
              </button>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="p-4 text-sm text-zinc-400 text-center">暂无游记</div>
          )}
        </div>
      </aside>

      {/* Main Editor */}
      <main className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-3 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setTab("edit")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                tab === "edit"
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              编辑
            </button>
            <button
              onClick={() => setTab("preview")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                tab === "preview"
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              预览
            </button>
          </div>
          <div className="flex items-center gap-3">
            {message && (
              <span
                className={`text-sm ${message.includes("成功") ? "text-green-600" : message.includes("失败") ? "text-red-500" : "text-zinc-500"}`}
              >
                {message}
              </span>
            )}
            <button
              onClick={savePost}
              disabled={saving}
              className="px-4 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "保存中..." : "保存 (Ctrl+S)"}
            </button>
            <button
              onClick={deploy}
              disabled={deploying}
              className="px-4 py-1.5 rounded-lg bg-orange-600 text-white text-sm font-medium hover:bg-orange-700 disabled:opacity-50"
            >
              {deploying ? "发布中..." : "🚀 一键发布"}
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 overflow-y-auto">
          {tab === "edit" ? (
            <div className="max-w-3xl mx-auto px-6 py-6 space-y-5">
              {/* Metadata Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">标题 *</label>
                  <input
                    type="text"
                    value={current.title}
                    onChange={(e) => setCurrent({ ...current, title: e.target.value })}
                    placeholder="成都寻味之旅"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Slug（留空自动生成）</label>
                  <input
                    type="text"
                    value={current.slug}
                    onChange={(e) => setCurrent({ ...current, slug: e.target.value })}
                    placeholder="chengdu-spice-journey"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">日期</label>
                  <input
                    type="date"
                    value={current.date}
                    onChange={(e) => setCurrent({ ...current, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">城市</label>
                  <input
                    type="text"
                    value={current.location}
                    onChange={(e) => setCurrent({ ...current, location: e.target.value })}
                    placeholder="成都"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">标签（逗号分隔）</label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="火锅, 串串, 川菜"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">摘要</label>
                <textarea
                  value={current.excerpt}
                  onChange={(e) => setCurrent({ ...current, excerpt: e.target.value })}
                  placeholder="简短描述这篇游记..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              {/* Image upload + Content */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-zinc-500">正文（Markdown）</label>
                  <label className="cursor-pointer px-3 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                    📷 上传图片
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <textarea
                  ref={contentRef}
                  value={current.content}
                  onChange={(e) => setCurrent({ ...current, content: e.target.value })}
                  onKeyDown={handleKeyDown}
                  placeholder={"## Day 1：出发\n\n今天来到了...\n\n![照片描述](/images/photo.jpg)"}
                  rows={20}
                  className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm font-mono leading-relaxed focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-y"
                />
              </div>
            </div>
          ) : (
            /* Preview */
            <div className="max-w-2xl mx-auto px-6 py-10">
              <article className="prose-blog">
                <header className="mb-8 not-prose">
                  <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
                    {current.title || "未命名游记"}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <span>{current.date}</span>
                    {current.location && (
                      <>
                        <span>·</span>
                        <span>📍 {current.location}</span>
                      </>
                    )}
                  </div>
                  {tagInput && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {tagInput.split(/[,，]/).filter(Boolean).map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </header>
                {current.content ? (
                  <div
                    className="prose-blog"
                    dangerouslySetInnerHTML={{
                      __html: simpleMarkdown(current.content),
                    }}
                  />
                ) : (
                  <p className="text-zinc-400">暂无内容，切换到编辑模式开始撰写...</p>
                )}
              </article>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Simple client-side markdown for preview (doesn't need remark)
function simpleMarkdown(md: string): string {
  return md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/!\[(.+?)\]\((.+?)\)/g, '<img alt="$1" src="$2" style="max-width:100%;border-radius:0.75rem" />')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color:#ea580c">$1</a>')
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
    .replace(/\n{2,}/g, "</p><p>")
    .replace(/^(?!<[hulo])/gm, (m, offset, str) => {
      const before = str[offset - 1];
      return before === ">" || before === undefined ? m : "<br/>";
    })
    .replace(/^/, "<p>")
    .replace(/$/, "</p>");
}
