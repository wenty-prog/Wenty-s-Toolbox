// 抽籤頁背景：入夜時分的紫藍色天空、一閃一閃的星星、彎彎的月亮與偶爾劃過的流星。
// 星星位置用固定種子的整數亂數產生，伺服器與瀏覽器算出的結果一致，不會有 hydration 問題。

let seed = 20261030;
const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

const stars = Array.from({ length: 48 }, () => ({
  top: `${(rand() * 70).toFixed(2)}%`,
  left: `${(rand() * 100).toFixed(2)}%`,
  size: Math.round(4 + rand() * 9),
  delay: `${(-rand() * 3.2).toFixed(2)}s`,
}));

// 流星：每顆的角度、週期與起點都錯開，大約每一兩秒就有一顆劃過，但不會同時一大堆
const meteors = [
  { top: "4%", left: "8%", angle: 28, duration: 7, delay: 0 },
  { top: "12%", left: "42%", angle: 22, duration: 9, delay: -2.5 },
  { top: "2%", left: "62%", angle: 34, duration: 8, delay: -5 },
  { top: "24%", left: "18%", angle: 25, duration: 11, delay: -7.5 },
  { top: "30%", left: "54%", angle: 30, duration: 10, delay: -3.8 },
  { top: "16%", left: "-4%", angle: 20, duration: 12, delay: -9.6 },
  { top: "40%", left: "30%", angle: 32, duration: 9.5, delay: -6.4 },
];

function Star() {
  return (
    <svg viewBox="0 0 20 20" className="h-full w-full" aria-hidden>
      <path d="M10 0 C11 7 13 9 20 10 C13 11 11 13 10 20 C9 13 7 11 0 10 C7 9 9 7 10 0 Z" fill="#fff6d8" />
    </svg>
  );
}

export default function NightSkyBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#262c5e_0%,#3b3a78_35%,#64559a_70%,#a9819f_100%)]" />

      {/* 彎月與月光 */}
      <div className="absolute right-[10%] top-[8%] h-56 w-56 rounded-full bg-[radial-gradient(circle,rgb(255_240_200/0.35),transparent_65%)]" />
      <svg viewBox="0 0 100 100" className="absolute right-[14%] top-[12%] w-20 sm:w-24">
        <defs>
          <mask id="moon-cut">
            <rect width="100" height="100" fill="#fff" />
            <circle cx="64" cy="40" r="38" fill="#000" />
          </mask>
        </defs>
        <circle cx="50" cy="50" r="40" fill="#fff1c9" mask="url(#moon-cut)" />
      </svg>

      {stars.map((s, i) => (
        <div
          key={i}
          className="twinkle"
          style={{ top: s.top, left: s.left, width: s.size, height: s.size, animationDelay: s.delay }}
        >
          <Star />
        </div>
      ))}

      {meteors.map((m, i) => (
        // 外層決定方向，內層沿著這個方向飛行：前端是發光的星點，後面拖著漸淡的尾巴
        <div key={i} className="absolute" style={{ top: m.top, left: m.left, rotate: `${m.angle}deg` }}>
          <div
            className="meteor relative h-[2px] w-36 rounded-full bg-linear-to-r from-transparent via-[#fff3d6]/50 to-white sm:w-48"
            style={{ animationDuration: `${m.duration}s`, animationDelay: `${m.delay}s` }}
          >
            <span className="absolute -right-0.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-white shadow-[0_0_8px_3px_rgb(255_240_200/0.8)]" />
          </div>
        </div>
      ))}

      {/* 底部淡淡的夜霧 */}
      <svg
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-[16vh] w-full opacity-40"
      >
        <path d="M0 120 C240 70 480 130 720 100 S1200 70 1440 110 V200 H0 Z" fill="#e9c7d6" />
        <path d="M0 160 C300 120 600 170 900 145 S1300 130 1440 155 V200 H0 Z" fill="#f3d9e2" />
      </svg>
    </div>
  );
}
