import PostCard from "@/components/PostCard";
import { getAllPosts } from "@/lib/posts";

export default function Home() {
  const posts = getAllPosts();

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      {/* Hero */}
      <section className="mb-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
          用味蕾丈量世界 🌍
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
          每一座城市都有属于它的味道，每一次旅行都是一场味觉的冒险。
          <br />
          这里记录我在路上遇见的美食与故事。
        </p>
        <div className="flex justify-center gap-3 mt-6 text-sm">
          <span className="px-3 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">
            🍲 火锅
          </span>
          <span className="px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
            🍣 日料
          </span>
          <span className="px-3 py-1.5 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300">
            🥟 点心
          </span>
          <span className="px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
            🍜 街头小吃
          </span>
        </div>
      </section>

      {/* Posts Grid */}
      <section>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">
          最新游记
        </h2>
        <div className="grid gap-8 md:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </main>
  );
}
