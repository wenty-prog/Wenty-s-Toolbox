// 抽獎頁背景：粉彩色的晨光天空、緩緩上升的熱氣球、淡淡的彩虹與底部雲海，輕快又舒服。
// 和首頁的藍天不同，這裡是雲層之上的清晨。位置與時間都寫死，避免 hydration 問題。

// 負的 delay 讓熱氣球一開始就散布在畫面各處
const balloons = [
  { left: "6%", size: 48, duration: 48, delay: -12, sway: -1, color: "#ffb5c2", stripe: "#ffe1e7" },
  { left: "20%", size: 30, duration: 62, delay: -40, sway: -3.5, color: "#a8d8ff", stripe: "#e2f2ff" },
  { left: "38%", size: 22, duration: 80, delay: -64, sway: -2, color: "#ffc9a3", stripe: "#ffeedd" },
  { left: "63%", size: 26, duration: 72, delay: -6, sway: -4.5, color: "#b8e6c9", stripe: "#e6f7ec" },
  { left: "79%", size: 56, duration: 54, delay: -26, sway: 0, color: "#ffe08a", stripe: "#fff5d4" },
  { left: "91%", size: 34, duration: 66, delay: -52, sway: -2.8, color: "#d4c1ff", stripe: "#efe8ff" },
];

const sparkles = [
  { top: "9%", left: "30%", size: 14, delay: 0 },
  { top: "18%", left: "70%", size: 10, delay: -1.2 },
  { top: "6%", left: "86%", size: 16, delay: -2.1 },
  { top: "32%", left: "12%", size: 10, delay: -0.6 },
  { top: "40%", left: "55%", size: 12, delay: -2.6 },
  { top: "26%", left: "46%", size: 8, delay: -1.8 },
  { top: "52%", left: "88%", size: 11, delay: -0.3 },
];

// 彩虹由外到內的顏色
const rainbow = ["#ffc4cf", "#ffd9b0", "#fff0a8", "#c9efc9", "#bfe0ff", "#d9cbff"];

function Balloon({ color, stripe }: { color: string; stripe: string }) {
  return (
    <svg viewBox="0 0 60 88" className="h-auto w-full" aria-hidden>
      <path d="M30 2 C12 2 2 16 2 30 C2 46 18 56 24 64 H36 C42 56 58 46 58 30 C58 16 48 2 30 2 Z" fill={color} />
      <path d="M30 2 C21 10 19 46 24 64 H36 C41 46 39 10 30 2 Z" fill={stripe} />
      {/* 左上角的亮面 */}
      <ellipse cx="16" cy="22" rx="5" ry="9" fill="#fff" opacity="0.45" transform="rotate(20 16 22)" />
      <path d="M25 64 L26.5 76 M35 64 L33.5 76" stroke="#b08968" strokeWidth="1.2" />
      <rect x="25" y="76" width="10" height="9" rx="2" fill="#c89b72" />
    </svg>
  );
}

function Sparkle() {
  return (
    <svg viewBox="0 0 20 20" className="h-full w-full" aria-hidden>
      <path d="M10 0 C11 7 13 9 20 10 C13 11 11 13 10 20 C9 13 7 11 0 10 C7 9 9 7 10 0 Z" fill="#fff" />
    </svg>
  );
}

export default function PastelSkyBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* 晨光漸層：上方淡藍紫，往下轉成粉紅與蜜桃色 */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#c3d0ff_0%,#d6e6ff_28%,#fbe0ec_62%,#ffeedd_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_105%,rgb(255_244_220/0.9),transparent_55%)]" />

      {/* 淡淡的彩虹 */}
      <svg viewBox="0 0 600 310" className="absolute -left-[8vw] top-[10%] w-[60vw] max-w-[640px] opacity-60">
        {rainbow.map((c, i) => {
          const r = 280 - i * 14;
          return (
            <path
              key={c}
              d={`M${300 - r} 305 A${r} ${r} 0 0 1 ${300 + r} 305`}
              fill="none"
              stroke={c}
              strokeWidth="14"
            />
          );
        })}
      </svg>

      {sparkles.map((s, i) => (
        <div
          key={i}
          className="twinkle"
          style={{ top: s.top, left: s.left, width: s.size, height: s.size, animationDelay: `${s.delay}s` }}
        >
          <Sparkle />
        </div>
      ))}

      {balloons.map((b, i) => (
        <div
          key={i}
          className="balloon-rise drop-shadow-[0_8px_12px_rgb(120_110_180/0.18)]"
          style={{ left: b.left, width: b.size, animationDuration: `${b.duration}s`, animationDelay: `${b.delay}s` }}
        >
          <div className="balloon-sway" style={{ animationDelay: `${b.sway}s` }}>
            <Balloon color={b.color} stripe={b.stripe} />
          </div>
        </div>
      ))}

      {/* 底部雲海，兩層反方向漂動 */}
      <svg
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        className="cloud-sea absolute -left-[5%] bottom-0 h-[20vh] w-[110%] opacity-70"
      >
        <g fill="#fff">
          <circle cx="80" cy="150" r="90" />
          <circle cx="300" cy="130" r="110" />
          <circle cx="560" cy="160" r="95" />
          <circle cx="800" cy="125" r="120" />
          <circle cx="1060" cy="155" r="100" />
          <circle cx="1300" cy="135" r="115" />
          <rect x="0" y="160" width="1440" height="60" />
        </g>
      </svg>
      <svg
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        className="cloud-sea cloud-sea-front absolute -left-[5%] bottom-0 h-[13vh] w-[110%]"
      >
        <g fill="#fff">
          <circle cx="180" cy="170" r="80" />
          <circle cx="420" cy="185" r="70" />
          <circle cx="680" cy="165" r="90" />
          <circle cx="940" cy="185" r="75" />
          <circle cx="1200" cy="168" r="85" />
          <circle cx="1420" cy="185" r="70" />
          <rect x="0" y="185" width="1440" height="35" />
        </g>
      </svg>
    </div>
  );
}
