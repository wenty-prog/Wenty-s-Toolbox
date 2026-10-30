// 蕃茄鐘背景：午後安靜的湖綠色天空、慢慢呼吸的暖陽、薄薄的雲帶與遠山，讓人放鬆專注。
// 位置與時間都寫死，伺服器與瀏覽器算出的結果一致，不會有 hydration 問題。

// 細長的薄雲，左右來回飄動；每朵的速度和起點錯開，看起來自然不整齊
const strips = [
  { top: "10%", left: "6%", width: "34vw", height: 14, duration: 16, delay: -3, opacity: 0.75 },
  { top: "17%", left: "52%", width: "26vw", height: 10, duration: 19, delay: -11, opacity: 0.6 },
  { top: "29%", left: "22%", width: "40vw", height: 16, duration: 18, delay: -8, opacity: 0.55 },
  { top: "41%", left: "62%", width: "30vw", height: 12, duration: 20, delay: -14, opacity: 0.5 },
  { top: "50%", left: "4%", width: "24vw", height: 10, duration: 14, delay: -6, opacity: 0.45 },
];

export default function CalmSkyBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#c9e6e1_0%,#dff0ea_45%,#f4ecdc_100%)]" />

      {/* 慢慢呼吸的暖陽，跟著它的節奏深呼吸 */}
      <div className="calm-breathe absolute left-[72%] top-[16%] h-40 w-40 rounded-full bg-[radial-gradient(circle,rgb(255_236_200/0.95)_0%,rgb(255_226_190/0.6)_40%,transparent_70%)]" />

      {strips.map((s, i) => (
        <div
          key={i}
          className="calm-drift absolute rounded-full bg-white blur-[3px]"
          style={{
            top: s.top,
            left: s.left,
            width: s.width,
            height: s.height,
            opacity: s.opacity,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}

      {/* 遠近三層山，越近顏色越深 */}
      <svg
        viewBox="0 0 1440 260"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-[26vh] w-full"
      >
        <path d="M0 140 L180 70 L330 130 L520 50 L700 120 L880 60 L1080 130 L1260 70 L1440 120 V260 H0 Z" fill="#b9dbd3" />
        <path d="M0 180 C200 120 360 170 560 140 S940 110 1140 160 S1340 130 1440 150 V260 H0 Z" fill="#9fcdc2" />
        <path d="M0 220 C240 180 480 215 760 200 S1200 180 1440 210 V260 H0 Z" fill="#88bfb2" />
      </svg>
    </div>
  );
}
