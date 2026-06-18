import Link from "next/link";
import { Post } from "@/lib/posts";

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/posts/${post.slug}`} className="group block">
      <article className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:shadow-lg hover:shadow-orange-100 dark:hover:shadow-orange-900/20 transition-all duration-300 hover:-translate-y-1">
        <div className="aspect-[16/9] bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 flex items-center justify-center">
          <span className="text-6xl">📸</span>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-2">
            <span>{post.date}</span>
            <span>·</span>
            <span>📍 {post.location}</span>
          </div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors mb-2">
            {post.title}
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
            {post.excerpt}
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
}
