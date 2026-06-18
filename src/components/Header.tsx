import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 backdrop-blur-md bg-white/80 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800">
      <nav className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
        >
          🍜 美食游记
        </Link>
        <div className="flex gap-6 text-sm font-medium">
          <Link
            href="/"
            className="text-zinc-600 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
          >
            游记
          </Link>
          <Link
            href="/about"
            className="text-zinc-600 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
          >
            关于
          </Link>
        </div>
      </nav>
    </header>
  );
}
