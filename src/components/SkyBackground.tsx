// 首頁背景：白天的天空、飄過的雲、飛翔的鳥與微風，營造躺在草地上看天空的放鬆感。
// 位置與時間都寫死，伺服器與瀏覽器算出的結果一致，不會有 hydration 問題。

// 負的 delay 讓雲一開始就散布在畫面各處，而不是全部從左邊出發
const clouds = [
  { top: "6%", width: 230, duration: 110, delay: -20, opacity: 0.95, variant: 0 },
  { top: "20%", width: 150, duration: 90, delay: -62, opacity: 0.8, variant: 1 },
  { top: "36%", width: 290, duration: 140, delay: -95, opacity: 0.9, variant: 0 },
  { top: "54%", width: 180, duration: 120, delay: -40, opacity: 0.75, variant: 1 },
  { top: "13%", width: 120, duration: 80, delay: -72, opacity: 0.7, variant: 1 },
  { top: "66%", width: 250, duration: 150, delay: -12, opacity: 0.85, variant: 0 },
];

const flocks = [
  { top: "17%", duration: 38, delay: -8, scale: 1 },
  { top: "31%", duration: 54, delay: -32, scale: 0.7 },
];

// 一群鳥裡每隻的相對位置，拍翅節奏也錯開
const birds = [
  { x: 0, y: 0, flap: 0 },
  { x: 34, y: 16, flap: -0.3 },
  { x: -26, y: 20, flap: -0.55 },
];

const breezes = [
  { top: "12%", width: "30vw", duration: 10, delay: -1 },
  { top: "28%", width: "36vw", duration: 9, delay: -4 },
  { top: "47%", width: "28vw", duration: 12, delay: -7 },
  { top: "61%", width: "40vw", duration: 14, delay: -10 },
];

function Cloud({ variant }: { variant: number }) {
  return (
    <svg viewBox="0 0 200 90" className="h-auto w-full" aria-hidden>
      <g fill="#fff">
        {variant === 0 ? (
          <>
            <circle cx="52" cy="54" r="28" />
            <circle cx="92" cy="38" r="36" />
            <circle cx="138" cy="50" r="28" />
            <rect x="36" y="52" width="122" height="30" rx="15" />
          </>
        ) : (
          <>
            <circle cx="70" cy="50" r="26" />
            <circle cx="112" cy="44" r="30" />
            <rect x="46" y="50" width="104" height="26" rx="13" />
          </>
        )}
      </g>
    </svg>
  );
}

export default function SkyBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* 天空漸層與右上角的陽光 */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#78bff0_0%,#aedcf6_40%,#dff2fb_72%,#fdf3dc_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgb(255_251_225/0.95),rgb(255_251_225/0.35)_14%,transparent_32%)]" />

      {clouds.map((c, i) => (
        <div
          key={i}
          className="sky-cloud drop-shadow-[0_6px_10px_rgb(100_150_190/0.18)]"
          style={{
            top: c.top,
            width: c.width,
            opacity: c.opacity,
            animationDuration: `${c.duration}s`,
            animationDelay: `${c.delay}s`,
          }}
        >
          <Cloud variant={c.variant} />
        </div>
      ))}

      {breezes.map((b, i) => (
        <svg
          key={i}
          viewBox="0 0 240 20"
          preserveAspectRatio="none"
          className="sky-breeze h-4"
          style={{
            top: b.top,
            width: b.width,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
          }}
        >
          <path
            d="M0 10 C40 2 80 18 120 10 S200 2 240 10"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      ))}

      {flocks.map((f, i) => (
        <div
          key={i}
          className="sky-flock"
          style={{ top: f.top, animationDuration: `${f.duration}s`, animationDelay: `${f.delay}s` }}
        >
          <div className="sky-bob" style={{ scale: f.scale }}>
            {birds.map((b, j) => (
              <svg
                key={j}
                viewBox="0 0 40 16"
                className="sky-wing absolute w-7"
                style={{ left: b.x, top: b.y, animationDelay: `${b.flap}s` }}
              >
                <path
                  d="M2 12 Q11 2 20 11 Q29 2 38 12"
                  fill="none"
                  stroke="#3f5368"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ))}
          </div>
        </div>
      ))}

      {/* 遠方柔和的山丘，像躺在草地上看天空 */}
      <svg
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-[16vh] w-full"
      >
        <path d="M0 120 C240 60 420 90 640 110 S1080 50 1440 100 V200 H0 Z" fill="#cfe9c3" />
        <path d="M0 160 C300 110 560 150 820 140 S1240 110 1440 150 V200 H0 Z" fill="#b5dca5" />
      </svg>
    </div>
  );
}
