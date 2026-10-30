"use client";

import { useEffect, useRef, useState } from "react";

const SPIN_MS = 5000;
const R = 95;
const LIGHTS = 12;
const SAMPLE = ["王小明", "李小華", "陳大同", "林美美", "張阿傑", "黃小芬"].join("\n");

// 取自背景晨光天空的顏色（藍紫、天藍、粉紅、蜜桃…），不用純白以免太刺眼，統一用深灰字
const PALETTE = [
  { fill: "#B9C6FF", text: "#3f4a66" },
  { fill: "#FFC4D3", text: "#3f4a66" },
  { fill: "#C2DFFB", text: "#3f4a66" },
  { fill: "#FFD6B8", text: "#3f4a66" },
  { fill: "#D6C8FF", text: "#3f4a66" },
  { fill: "#FBE6AE", text: "#3f4a66" },
  { fill: "#B8E2EC", text: "#3f4a66" },
  { fill: "#F1D3EC", text: "#3f4a66" },
];

// 外圈雲朵：一圈圓球，大小交錯，像轉盤被雲包圍
const PUFFS = 20;

// grow 會讓每顆圓球都放大，用來畫雲朵的外框
function cloudPuffs(grow: number) {
  return (
    <>
      <circle r={108 + grow} />
      {Array.from({ length: PUFFS }, (_, i) => {
        const a = (i / PUFFS) * Math.PI * 2;
        // 四捨五入，避免伺服器與瀏覽器算出的小數尾數不同造成 hydration 錯誤
        return (
          <circle
            key={i}
            cx={(Math.sin(a) * 107).toFixed(2)}
            cy={(-Math.cos(a) * 107).toFixed(2)}
            r={(i % 2 ? 10 : 13) + grow}
          />
        );
      })}
    </>
  );
}

// 最後一格若和第一格同色（兩格相鄰），換成另一個顏色
function colorOf(i: number, count: number) {
  const c = i % PALETTE.length;
  return PALETTE[count > 1 && i === count - 1 && c === 0 ? 3 : c];
}

const point = (deg: number) => {
  const rad = (deg * Math.PI) / 180;
  return `${(Math.sin(rad) * R).toFixed(3)} ${(-Math.cos(rad) * R).toFixed(3)}`;
};

// 名字太長時截斷，避免超出扇形
const shorten = (name: string) => (name.length > 6 ? `${name.slice(0, 6)}…` : name);

// 名單越多字越小，太多時就不顯示文字
const labelSize = (count: number) => (count <= 8 ? 9 : count <= 16 ? 6.5 : count <= 30 ? 4.5 : 0);

function randomIndex(count: number) {
  return crypto.getRandomValues(new Uint32Array(1))[0] % count;
}

// -0.5 ~ 0.5 的隨機偏移，讓指針不會每次都停在扇形正中央
const randomOffset = () => Math.random() - 0.5;

// 淡藍紫色的玻璃卡片，不用白色以免太亮，邊框加深讓卡片有邊界感
const CARD =
  "rounded-3xl border-2 border-[#c3c9f2] bg-[#e9ebfb]/80 p-5 shadow-[0_16px_40px_-20px_rgb(90_100_170/0.45)] backdrop-blur-md";

export default function LotteryWheel() {
  const [text, setText] = useState(SAMPLE);
  const [rotation, setRotation] = useState(0);
  const [duration, setDuration] = useState(SPIN_MS);
  const [spinning, setSpinning] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [removeWinner, setRemoveWinner] = useState(false);
  const timerRef = useRef<number>(undefined);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const names = text
    .split("\n")
    .map((n) => n.trim())
    .filter(Boolean);
  const slice = 360 / Math.max(names.length, 1);
  const fontSize = labelSize(names.length);

  function spin() {
    if (spinning) return;

    // 勾選「抽中後移除」時，先把上一位得獎者從名單拿掉再抽
    let list = names;
    if (removeWinner && winnerIndex !== null) {
      list = names.filter((_, i) => i !== winnerIndex);
      setText(list.join("\n"));
    }
    if (list.length < 2) return;

    const index = randomIndex(list.length);
    const size = 360 / list.length;
    // 指針停在扇形內的隨機位置，但避開邊線
    const target = index * size + size / 2 + randomOffset() * size * 0.7;
    const current = ((rotation % 360) + 360) % 360;
    const delta = (((360 - target - current) % 360) + 360) % 360;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ms = reduceMotion ? 0 : SPIN_MS;

    setWinnerIndex(null);
    setSpinning(true);
    setDuration(ms);
    setRotation(rotation + 360 * 8 + delta);
    timerRef.current = window.setTimeout(() => {
      setWinnerIndex(index);
      setHistory((h) => [list[index], ...h]);
      setSpinning(false);
    }, ms);
  }

  const winner = winnerIndex !== null ? names[winnerIndex] : null;
  const remaining = removeWinner && winnerIndex !== null ? names.length - 1 : names.length;

  return (
    <div className="grid w-full items-start gap-10 lg:grid-cols-[1fr_minmax(0,22rem)]">
      {/* 轉盤：漂浮在天空中的雲朵轉盤 */}
      <section className="flex flex-col items-center">
        <div className="flex w-full max-w-[34rem] flex-col items-center px-1 py-2 sm:px-4">
          <div className={`relative aspect-square w-full max-w-[28rem] ${spinning ? "spinning" : ""}`}>
            {/* 雲朵外圈與星光（不旋轉） */}
            <svg
              viewBox="-120 -120 240 240"
              className="absolute inset-0 h-full w-full drop-shadow-[0_12px_24px_rgb(110_120_200/0.28)]"
              aria-hidden
            >
              <defs>
                <linearGradient id="cloud-rim" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#dfe3ff" />
                  <stop offset="100%" stopColor="#f6dbe8" />
                </linearGradient>
              </defs>
              {/* 先畫放大一點的深色雲當外框，再疊上淡紫粉的雲，讓雲朵有清楚的邊界 */}
              <g fill="#a9b2ea">{cloudPuffs(1.8)}</g>
              <g fill="url(#cloud-rim)">{cloudPuffs(0)}</g>
              {Array.from({ length: LIGHTS }, (_, i) => {
                // 星光放在兩朵雲之間，避開最上方的指針
                const deg = ((i + 0.5) / LIGHTS) * 360;
                const a = (deg * Math.PI) / 180;
                return (
                  <path
                    key={i}
                    d="M0 -6 C0.6 -1.6 1.6 -0.6 6 0 C1.6 0.6 0.6 1.6 0 6 C-0.6 1.6 -1.6 0.6 -6 0 C-1.6 -0.6 -0.6 -1.6 0 -6 Z"
                    transform={`translate(${(Math.sin(a) * 112).toFixed(2)} ${(-Math.cos(a) * 112).toFixed(2)})`}
                    className={`wheel-light ${i % 2 ? "wheel-light-alt" : ""}`}
                  />
                );
              })}
            </svg>

            {/* 旋轉中的方形外框，轉角會超出圓形撐出捲軸，用外層圓形裁掉 */}
            <div className="absolute inset-[8.333%] overflow-hidden rounded-full">
              <div
                className="h-full w-full"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: `transform ${duration}ms cubic-bezier(0.15, 0.7, 0.1, 1)`,
                }}
              >
                <svg viewBox="-100 -100 200 200" className="h-full w-full" aria-hidden>
                  {names.length === 0 && <circle r={R} fill="#f1f5f9" />}
                  {names.length === 1 && <circle r={R} fill={PALETTE[0].fill} />}
                  {names.length > 1 &&
                    names.map((name, i) => (
                      <path
                        key={i}
                        d={`M0 0 L${point(i * slice)} A${R} ${R} 0 0 1 ${point((i + 1) * slice)} Z`}
                        fill={colorOf(i, names.length).fill}
                        stroke="#f4f2ff"
                        strokeWidth="1.5"
                        opacity={winnerIndex === null || winnerIndex === i ? 1 : 0.45}
                      />
                    ))}
                  {fontSize > 0 &&
                    names.map((name, i) => {
                      const mid = (i + 0.5) * slice;
                      // 左半邊的字轉 180 度，才不會上下顛倒
                      const flip = mid > 180;
                      return (
                        <text
                          key={i}
                          transform={`rotate(${mid - 90}) translate(84 0)${flip ? " rotate(180)" : ""}`}
                          fill={colorOf(i, names.length).text}
                          fontSize={fontSize}
                          fontWeight="700"
                          textAnchor={flip ? "start" : "end"}
                          dominantBaseline="central"
                        >
                          {shorten(name)}
                        </text>
                      );
                    })}
                  <circle r={R} fill="none" stroke="#a9b2ea" strokeWidth="2.5" />
                </svg>
              </div>
            </div>

            {/* 指針：倒過來的粉紅水滴，像一顆小氣球 */}
            <svg
              viewBox="0 0 32 42"
              className="absolute left-1/2 top-[-1%] z-10 h-[14%] -translate-x-1/2 drop-shadow-[0_4px_6px_rgb(200_90_120/0.3)]"
              aria-hidden
            >
              <path
                d="M16 39 C10 30 3 24 3 15 A13 13 0 0 1 29 15 C29 24 22 30 16 39 Z"
                fill="#ffa3b5"
                stroke="#e5899e"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <ellipse cx="11" cy="11" rx="3" ry="5" fill="#fff" opacity="0.6" transform="rotate(25 11 11)" />
            </svg>

            {/* 中央的太陽光芒，慢慢轉動 */}
            <svg
              viewBox="-50 -50 100 100"
              className="sun-rays absolute left-[31%] top-[31%] z-10 h-[38%] w-[38%]"
              aria-hidden
            >
              {Array.from({ length: 12 }, (_, i) => (
                <rect key={i} x="-3" y="-48" width="6" height="14" rx="3" fill="#ffe1a8" transform={`rotate(${i * 30})`} />
              ))}
            </svg>

            {/* 中央的開始按鈕：暖暖的太陽（不旋轉） */}
            <button
              type="button"
              onClick={spin}
              disabled={spinning || remaining < 2}
              className="absolute left-1/2 top-1/2 z-10 flex aspect-square w-[26%] -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full border-4 border-[#f3cfa9] bg-linear-to-br from-amber-200 via-orange-200 to-rose-300 text-lg font-black text-white shadow-[0_0_0_6px_rgb(255_236_200/0.6),0_10px_24px_-8px_rgb(240_140_120/0.6)] transition hover:brightness-105 active:translate-y-[calc(-50%+2px)] disabled:cursor-not-allowed disabled:opacity-60 sm:text-2xl"
            >
              {/* 左上角的亮面反光 */}
              <span className="absolute left-[18%] top-[12%] h-[22%] w-[38%] -rotate-[30deg] rounded-full bg-white/45" />
              <span className="relative drop-shadow-[0_1px_3px_rgb(200_100_80/0.55)]">
                {spinning ? "抽獎中" : winner ? "再抽" : "開始"}
              </span>
            </button>
          </div>

          {/* 結果 */}
          <div
            aria-live="polite"
            className="mt-6 flex min-h-20 w-full max-w-sm flex-col items-center justify-center rounded-2xl border-2 border-[#c3c9f2] bg-[#e9ebfb]/80 px-4 py-3 text-center shadow-[0_12px_30px_-15px_rgb(90_100_170/0.45)] backdrop-blur-md"
          >
            {winner ? (
              <>
                <p className="text-sm font-semibold text-rose-400">🎉 恭喜中獎 🎉</p>
                <p className="mt-1 text-3xl font-black text-indigo-500">{winner}</p>
              </>
            ) : (
              <p className="font-medium text-slate-500">
                {spinning ? "轉盤轉動中……" : names.length < 2 ? "請至少輸入 2 個名字" : "準備好了嗎？"}
              </p>
            )}
          </div>
        </div>

        <p className="mt-4 text-sm text-slate-500">點擊中間的「開始」，抽出幸運兒！</p>
      </section>

      {/* 名單與紀錄 */}
      <section className="flex flex-col gap-6">
        <div className={CARD}>
          <div className="flex items-center justify-between">
            <label htmlFor="names" className="font-bold text-slate-700">
              抽獎名單
            </label>
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-500">
              共 {names.length} 人
            </span>
          </div>
          <textarea
            id="names"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setWinnerIndex(null); // 名單變了，原本的得獎位置就不準了
            }}
            disabled={spinning}
            rows={10}
            placeholder={"一行輸入一個名字，例如：\n王小明\n李小華"}
            className="mt-4 min-h-48 w-full resize-y rounded-2xl border border-[#c3c9f2] bg-[#f4f4fd] px-4 py-3 leading-7 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:opacity-60"
          />
          <p className="mt-2 text-xs text-slate-500">一行一個名字，空白行會自動忽略。</p>

          <label className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={removeWinner}
              onChange={(e) => setRemoveWinner(e.target.checked)}
              disabled={spinning}
              className="h-4 w-4 accent-indigo-400"
            />
            抽中後從名單移除（不重複中獎）
          </label>
        </div>

        {history.length > 0 && (
          <div className={CARD}>
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-700">中獎紀錄</h2>
              <button
                type="button"
                onClick={() => setHistory([])}
                disabled={spinning}
                className="text-sm text-slate-400 hover:text-slate-700 disabled:opacity-40"
              >
                清除
              </button>
            </div>
            <ol className="mt-4 space-y-2">
              {history.map((name, i) => (
                <li key={i} className="flex items-center gap-3 font-medium">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs text-rose-500 tabular-nums">
                    {history.length - i}
                  </span>
                  <span>{name}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </section>
    </div>
  );
}
