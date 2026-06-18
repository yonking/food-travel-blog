import Link from "next/link";
import { getPostBySlug, getAllSlugs } from "@/lib/posts";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors mb-8"
      >
        ← 返回首页
      </Link>

      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mb-3">
          <span>{post.date}</span>
          <span>·</span>
          <span>📍 {post.location}</span>
        </div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
          {post.title}
        </h1>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      {/* Cover placeholder */}
      <div className="aspect-[16/9] rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 flex items-center justify-center mb-10">
        <span className="text-7xl">📸</span>
      </div>

      {/* Content - rendered from Markdown HTML */}
      <article
        className="prose-blog"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />

      {/* Nav */}
      <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
        <Link
          href="/"
          className="text-orange-600 dark:text-orange-400 hover:underline text-sm"
        >
          ← 返回所有游记
        </Link>
      </div>
    </main>
  );
}
