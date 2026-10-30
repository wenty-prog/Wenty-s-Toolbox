import Link from "next/link";
import SkyBackground from "@/components/SkyBackground";

// 新工具做好後加到這裡，首頁的導覽列、介紹區塊和頁尾都會自動多出這個工具
const tools = [
  {
    href: "/lottery",
    icon: "🎡",
    name: "抽獎轉盤",
    tag: "LUCKY WHEEL",
    tagline: "公平又有趣的隨機抽獎",
    desc: "貼上名單、按下開始，轉盤在雲朵間轉動，替你抽出今天的幸運兒。活動抽獎、決定誰請飲料都適合。",
    features: ["一行一個名字，貼上就能抽", "可設定抽中後移除，不重複中獎", "自動保留中獎紀錄"],
    accent: "#7c83e0",
    panel: "bg-[linear-gradient(160deg,#c3d0ff_0%,#e4dcff_45%,#fbe0ec_100%)]",
    preview: WheelPreview,
  },
  {
    href: "/pomodoro",
    icon: "🍅",
    name: "蕃茄鐘",
    tag: "FOCUS TIMER",
    tagline: "專注工作，適時休息",
    desc: "專注 25 分鐘、休息 5 分鐘，每四輪來一次長休息。在安靜的湖綠色天空下，一次只做好一件事。",
    features: ["專注、短休息、長休息自動切換", "時間可自訂，結束時柔和提示音", "分頁標題顯示倒數，切走也看得到"],
    accent: "#3f9c8f",
    panel: "bg-[linear-gradient(160deg,#c9e6e1_0%,#dff0ea_50%,#f4ecdc_100%)]",
    preview: TimerPreview,
  },
  {
    href: "/fortune",
    icon: "🎋",
    name: "好運抽籤",
    tag: "DAILY FORTUNE",
    tagline: "搖一搖，看看今日運勢",
    desc: "在星空下搖動籤筒，從大吉到大凶隨機抽出一支籤，附上籤詩、各項運勢與今天的幸運小物。",
    features: ["大吉、吉、中吉、小吉、末吉、凶、大凶", "工作、愛情、財運、健康四項運勢", "幸運色、幸運數字與今日宜忌"],
    accent: "#e0703f",
    panel: "bg-[linear-gradient(160deg,#262c5e_0%,#3b3a78_45%,#8e6c9f_100%)]",
    preview: FortunePreview,
  },
];

const highlights = [
  { icon: "⚡", title: "打開就能用", desc: "不用安裝、不用註冊，點進去馬上開始。" },
  { icon: "🔒", title: "資料留在你身邊", desc: "所有計算都在瀏覽器裡完成，名單不會上傳。" },
  { icon: "🌤️", title: "看了就舒服", desc: "每個工具都有自己的天空，用起來心情也很好。" },
];

export default function Home() {
  return (
    // 首頁固定使用白天天空主題，不跟隨深色模式
    <div className="flex flex-1 flex-col bg-[#f8f6f0] font-sans text-slate-800">
      <Header />

      <main className="flex-1">
        <Hero />

        {/* 工具介紹 */}
        <section id="tools" className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold tracking-[0.35em] text-sky-600">TOOLS</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">三個小工具，照顧你的一天</h2>
            <p className="mt-4 text-slate-500">從抽獎、專注到看看運勢，每一個都簡單、好用、看起來很舒服。</p>
          </div>

          <div className="mt-16 flex flex-col gap-20 sm:gap-28">
            {tools.map((tool, i) => (
              <article
                key={tool.href}
                className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
              >
                {/* 預覽圖：偶數列在左、奇數列在右 */}
                <Link
                  href={tool.href}
                  aria-label={`前往${tool.name}`}
                  className={`group relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[2rem] border-2 border-white shadow-[0_30px_60px_-30px_rgb(40_60_110/0.5)] ring-1 ring-slate-900/5 transition duration-300 hover:-translate-y-1 ${tool.panel} ${
                    i % 2 ? "lg:order-2" : ""
                  }`}
                >
                  <span className="absolute left-5 top-5 rounded-full bg-white/70 px-3 py-1 text-xs font-bold tracking-widest text-slate-600 backdrop-blur">
                    0{i + 1}
                  </span>
                  <tool.preview />
                </Link>

                <div className={i % 2 ? "lg:order-1" : ""}>
                  <p className="text-xs font-bold tracking-[0.35em]" style={{ color: tool.accent }}>
                    {tool.tag}
                  </p>
                  <h3 className="mt-3 flex items-center gap-3 text-3xl font-black tracking-tight">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-slate-200 bg-white text-2xl shadow-sm">
                      {tool.icon}
                    </span>
                    {tool.name}
                  </h3>
                  <p className="mt-4 text-lg font-semibold text-slate-700">{tool.tagline}</p>
                  <p className="mt-2 leading-7 text-slate-500">{tool.desc}</p>
                  <ul className="mt-6 space-y-2.5">
                    {tool.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-slate-600">
                        <span
                          className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                          style={{ backgroundColor: tool.accent }}
                        >
                          ✓
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={tool.href}
                    className="group mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold text-white shadow-[0_12px_24px_-12px_rgb(40_60_110/0.6)] transition hover:brightness-110"
                    style={{ backgroundColor: tool.accent }}
                  >
                    開始使用{tool.name}
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 特色 */}
        <section className="border-y-2 border-[#ece6d8] bg-white/60">
          <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-16 sm:grid-cols-3 sm:px-8">
            {highlights.map((h) => (
              <div key={h.title} className="rounded-3xl border-2 border-[#ece6d8] bg-[#fdfbf6] p-6">
                <span className="text-3xl">{h.icon}</span>
                <h3 className="mt-4 text-lg font-bold">{h.title}</h3>
                <p className="mt-1 text-slate-500">{h.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 行動呼籲 */}
        <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-8">
          <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-white bg-[linear-gradient(120deg,#8fc8f0_0%,#b9c8ff_50%,#f6c9d9_100%)] px-6 py-14 text-center shadow-[0_30px_60px_-30px_rgb(60_90_160/0.55)] sm:px-12">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/30 blur-2xl" aria-hidden />
            <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-white/25 blur-2xl" aria-hidden />
            <h2 className="relative text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">今天想用哪一個？</h2>
            <p className="relative mt-3 text-slate-700">挑一個工具，讓今天輕鬆一點。</p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              {tools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="rounded-full border-2 border-white/80 bg-white/70 px-5 py-2.5 font-bold text-slate-700 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
                >
                  {tool.icon} {tool.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 font-black tracking-tight">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#8fc8f0,#b9c8ff_55%,#f6c9d9)] text-lg shadow-sm ring-2 ring-white">
        🧰
      </span>
      <span className="text-lg">Wenty的小工具箱</span>
    </Link>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-white/55 backdrop-blur-lg">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-8">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white/70 hover:text-slate-900"
            >
              {tool.name}
            </Link>
          ))}
        </nav>
        <a
          href="#tools"
          className="rounded-full bg-slate-800 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-700"
        >
          探索工具
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <SkyBackground />
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 pb-36 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-[1.1fr_1fr] lg:pb-44">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/60 px-4 py-1.5 text-sm font-semibold text-sky-700 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            免安裝・免登入・完全免費
          </p>
          <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight sm:text-6xl sm:leading-[1.1]">
            讓每天的小事，
            <br />
            變得
            <span className="bg-[linear-gradient(90deg,#3b82c4,#7c83e0,#e07aa0)] bg-clip-text text-transparent">輕鬆又有趣</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
            Wenty的小工具箱收集了日常會用到的貼心小工具。抽獎、專注、看看運勢，打開瀏覽器就能用。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#tools"
              className="rounded-full bg-slate-800 px-7 py-3.5 font-bold text-white shadow-[0_14px_30px_-12px_rgb(30_40_70/0.6)] transition hover:-translate-y-0.5 hover:bg-slate-700"
            >
              看看有哪些工具
            </a>
            <Link
              href={tools[0].href}
              className="rounded-full border-2 border-white bg-white/60 px-7 py-3.5 font-bold text-slate-700 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/80"
            >
              {tools[0].icon} 馬上試試{tools[0].name}
            </Link>
          </div>
        </div>

        {/* 三張微微傾斜、疊在一起的工具卡片 */}
        <div className="relative mx-auto h-80 w-full max-w-md sm:h-96">
          {tools.map((tool, i) => (
            <Link
              key={tool.href}
              href={tool.href}
              className={`absolute flex w-56 flex-col gap-3 rounded-3xl border-2 border-white/90 bg-white/75 p-4 shadow-[0_24px_50px_-20px_rgb(40_70_120/0.5)] backdrop-blur-md transition duration-300 hover:z-10 hover:-translate-y-2 hover:rotate-0 sm:w-60 ${
                ["left-0 top-6 -rotate-6", "right-0 top-0 rotate-3", "bottom-0 left-1/2 -translate-x-1/2 -rotate-1"][i]
              }`}
            >
              <div className={`flex h-28 items-center justify-center overflow-hidden rounded-2xl ${tool.panel}`}>
                <div className="scale-[0.55]">
                  <tool.preview />
                </div>
              </div>
              <span className="flex items-center gap-2 font-bold">
                {tool.icon} {tool.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t-2 border-[#ece6d8] bg-[#f1ede3]">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:grid-cols-[1.5fr_1fr_1fr] sm:px-8">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500">
            收集日常用得到的貼心小工具，打開就能用，讓每一天都輕鬆一點。
          </p>
        </div>
        <div>
          <h2 className="text-sm font-bold tracking-widest text-slate-700">工具</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {tools.map((tool) => (
              <li key={tool.href}>
                <Link href={tool.href} className="text-slate-500 transition hover:text-slate-900">
                  {tool.icon} {tool.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-bold tracking-widest text-slate-700">關於</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-500">
            <li>在瀏覽器裡執行，不收集資料</li>
            <li>持續增加新工具中</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#e3dccb]">
        <p className="mx-auto w-full max-w-6xl px-4 py-5 text-center text-xs text-slate-400 sm:px-8">
          © 2026 Wenty的小工具箱・用心做的小工具
        </p>
      </div>
    </footer>
  );
}

/* ===== 各工具的示意圖 ===== */

function WheelPreview() {
  const colors = ["#B9C6FF", "#FFC4D3", "#C2DFFB", "#FFD6B8", "#D6C8FF", "#FBE6AE"];
  const slice = (i: number) => {
    const p = (deg: number) =>
      `${(Math.sin((deg * Math.PI) / 180) * 70).toFixed(2)} ${(-Math.cos((deg * Math.PI) / 180) * 70).toFixed(2)}`;
    return `M0 0 L${p(i * 60)} A70 70 0 0 1 ${p((i + 1) * 60)} Z`;
  };
  return (
    <svg viewBox="-100 -100 200 200" className="w-[62%] max-w-72 drop-shadow-[0_14px_20px_rgb(90_100_170/0.35)]" aria-hidden>
      <circle r="86" fill="#a9b2ea" />
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2;
        return (
          <circle key={i} cx={(Math.sin(a) * 80).toFixed(2)} cy={(-Math.cos(a) * 80).toFixed(2)} r={i % 2 ? 10 : 13} fill="#e7e3fb" />
        );
      })}
      <circle r="80" fill="#e7e3fb" />
      {colors.map((c, i) => (
        <path key={c} d={slice(i)} fill={c} stroke="#f4f2ff" strokeWidth="1.5" />
      ))}
      <circle r="70" fill="none" stroke="#a9b2ea" strokeWidth="2" />
      <circle r="20" fill="#fcd9a8" stroke="#f3cfa9" strokeWidth="4" />
      <path d="M0 -92 C-5 -84 -10 -80 -10 -73 A10 10 0 0 0 10 -73 C10 -80 5 -84 0 -92 Z" fill="#ffa3b5" stroke="#e5899e" strokeWidth="2" transform="rotate(180 0 -80)" />
    </svg>
  );
}

function TimerPreview() {
  const len = 2 * Math.PI * 62;
  return (
    <svg viewBox="0 0 200 200" className="w-[56%] max-w-64 drop-shadow-[0_14px_20px_rgb(60_120_110/0.3)]" aria-hidden>
      <circle cx="100" cy="100" r="80" fill="#f6faf8" stroke="#bcdcd4" strokeWidth="2" />
      <circle cx="100" cy="100" r="62" fill="none" stroke="#cfe5df" strokeWidth="10" />
      <circle
        cx="100"
        cy="100"
        r="62"
        fill="none"
        stroke="#3f9c8f"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * 0.32}
        transform="rotate(-90 100 100)"
      />
      <text x="100" y="92" textAnchor="middle" fontSize="11" fontWeight="700" fill="#3f9c8f" letterSpacing="3">
        專注
      </text>
      <text x="100" y="118" textAnchor="middle" fontSize="30" fontWeight="800" fill="#334155">
        16:58
      </text>
    </svg>
  );
}

function FortunePreview() {
  return (
    <svg viewBox="0 0 220 200" className="w-[60%] max-w-72 drop-shadow-[0_14px_20px_rgb(10_5_40/0.45)]" aria-hidden>
      <path d="M178 22 a22 22 0 1 0 18 34 a18 18 0 1 1 -18 -34 Z" fill="#fff1c9" />
      {[
        [30, 30],
        [60, 70],
        [150, 90],
        [200, 120],
        [20, 120],
      ].map(([x, y]) => (
        <path key={`${x}-${y}`} d="M0 -5 C0.6 -1.4 1.4 -0.6 5 0 C1.4 0.6 0.6 1.4 0 5 C-0.6 1.4 -1.4 0.6 -5 0 C-1.4 -0.6 -0.6 -1.4 0 -5 Z" fill="#fff6d8" transform={`translate(${x} ${y})`} />
      ))}
      {[-14, -5, 4, 13].map((x) => (
        <rect key={x} x={106 + x} y="30" width="8" height="90" rx="3" fill="#ecd29b" stroke="#b98f52" />
      ))}
      <rect x="104" y="10" width="12" height="90" rx="4" fill="#f3dca8" stroke="#b98f52" />
      <rect x="104" y="10" width="12" height="16" rx="4" fill="#d24a5c" />
      <ellipse cx="110" cy="92" rx="42" ry="10" fill="#8f3b3b" />
      <path d="M68 92 V176 Q68 188 80 188 H140 Q152 188 152 176 V92 Z" fill="#c45a52" stroke="#8f3b3b" strokeWidth="2" />
      <ellipse cx="110" cy="92" rx="42" ry="10" fill="none" stroke="#e7b75c" strokeWidth="3" />
      <circle cx="110" cy="138" r="20" fill="#fbf1dc" stroke="#e7b75c" strokeWidth="3" />
      <text x="110" y="139" textAnchor="middle" dominantBaseline="central" fontSize="20" fontWeight="800" fill="#a8423f">
        籤
      </text>
    </svg>
  );
}
