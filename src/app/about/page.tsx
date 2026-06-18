export default function About() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">
        关于我
      </h1>
      <div className="prose prose-zinc dark:prose-invert max-w-none space-y-6">
        <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
          你好！我是一名热爱旅行和美食的探索者。
        </p>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          每到一个新城市，我做的第一件事不是去景点打卡，而是钻进当地的市场和小馆子。
          我相信，一座城市的灵魂藏在它的食物里——街边的烟火气、老字号的传承味、
          还有那些只有当地人才知道的隐秘好店。
        </p>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          这个博客记录了我在旅途中遇见的美味与故事。希望这些文字和照片，
          也能带给你一些出发的灵感。
        </p>
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
            旅行足迹 🗺️
          </h3>
          <div className="flex flex-wrap gap-2">
            {["成都", "大阪", "广州", "更多城市待解锁..."].map((city) => (
              <span
                key={city}
                className="px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 text-sm"
              >
                📍 {city}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
