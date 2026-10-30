"use client";

import { useEffect, useRef, useState } from "react";

const SHAKE_MS = 1600;

// 籤的等級：weight 是抽中的機率權重，score 是各項運勢的基準星數
const LEVELS = [
  {
    name: "大吉",
    weight: 8,
    score: 5,
    color: "#d24a5c",
    poems: ["雲開見日光，萬事皆順遂", "春風得意時，所求皆如願", "好運正當頭，大膽向前行"],
    advice: "今天運勢極佳，想做的事就放手去做吧！",
  },
  {
    name: "吉",
    weight: 16,
    score: 4,
    color: "#e0703f",
    poems: ["穩步向前走，好事自然來", "貴人在身旁，難事迎刃解", "心定事亦定，順風好行船"],
    advice: "整體順利，把握機會，好事會一件接一件。",
  },
  {
    name: "中吉",
    weight: 16,
    score: 4,
    color: "#d9902f",
    poems: ["努力有回報，耐心見成果", "花開有時節，靜待好消息", "一步一腳印，福氣慢慢來"],
    advice: "付出會被看見，再多一點耐心就能開花結果。",
  },
  {
    name: "小吉",
    weight: 18,
    score: 3,
    color: "#5e9f6e",
    poems: ["平順安穩日，知足常樂多", "細水長流好，點滴皆是福", "小事有小喜，微笑過一天"],
    advice: "平平順順的一天，留意身邊的小確幸。",
  },
  {
    name: "末吉",
    weight: 14,
    score: 3,
    color: "#4f8fb0",
    poems: ["先難而後易，堅持見曙光", "今日宜沉澱，好運在後頭", "山重水複處，轉角又一村"],
    advice: "一開始或許不太順，但撐過去就會好轉。",
  },
  {
    name: "凶",
    weight: 6,
    score: 2,
    color: "#7a6fb0",
    poems: ["諸事宜謹慎，三思而後行", "放慢腳步走，避開小風波", "守成勝冒進，靜心待時機"],
    advice: "今天適合保守一點，重要決定可以晚點再做。",
  },
  {
    name: "大凶",
    weight: 3,
    score: 1,
    color: "#5d5a7a",
    poems: ["今日宜低調，休養待時機", "雨後會天晴，低谷是轉機", "退一步海闊，靜待雲散時"],
    advice: "運勢低迷也別擔心，抽到大凶代表接下來只會往上走！",
  },
];

// 各項運勢依星數給不同的提醒
const ASPECTS = [
  {
    name: "工作",
    icon: "💼",
    notes: {
      high: ["靈感源源不絕，適合提出新想法", "效率很高，可以挑戰難一點的任務"],
      mid: ["按部就班就能順利完成", "和同事多溝通，會更順利"],
      low: ["容易分心，先處理最重要的一件事", "細節多檢查一次，避免小失誤"],
    },
  },
  {
    name: "愛情",
    icon: "💗",
    notes: {
      high: ["桃花旺盛，適合主動表達心意", "和重要的人有甜蜜的互動"],
      mid: ["平穩溫馨，一句關心就很加分", "多聽對方說話，感情更融洽"],
      low: ["說話前先想一想，避免誤會", "給彼此一點空間也很好"],
    },
  },
  {
    name: "財運",
    icon: "💰",
    notes: {
      high: ["有意外之財的機會", "適合規劃理財或存錢目標"],
      mid: ["收支平衡，量入為出", "小額的好運，可能撿到優惠"],
      low: ["避免衝動購物，想清楚再下單", "暫時不適合借錢或投資"],
    },
  },
  {
    name: "健康",
    icon: "🌿",
    notes: {
      high: ["精神飽滿，適合運動流流汗", "身心狀態都很好"],
      mid: ["記得多喝水，起身走動", "作息規律就能保持好狀態"],
      low: ["早點休息，別熬夜", "注意保暖，吃清淡一點"],
    },
  },
];

const LUCKY_COLORS = [
  { name: "天空藍", hex: "#8ec5ea" },
  { name: "櫻花粉", hex: "#f6b8c8" },
  { name: "薄荷綠", hex: "#a8dcc4" },
  { name: "奶油黃", hex: "#f7dc8f" },
  { name: "薰衣草紫", hex: "#c7b8ef" },
  { name: "蜜桃橘", hex: "#f8bf98" },
  { name: "珍珠白", hex: "#f3efe6" },
  { name: "森林綠", hex: "#6f9f7f" },
];
const LUCKY_ITEMS = ["一杯熱茶", "藍色的筆", "耳機", "小盆栽", "巧克力", "雨傘", "筆記本", "零錢包", "舊照片", "香氛"];
const DIRECTIONS = ["東", "南", "西", "北", "東南", "東北", "西南", "西北"];
const GOOD = ["整理房間", "早起", "運動", "學新東西", "聯絡老朋友", "散步", "讀書", "做計畫", "下廚", "早點睡"];
const BAD = ["熬夜", "衝動購物", "拖延", "跟人爭論", "暴飲暴食", "滑手機太久", "抱怨", "借錢", "臨時改計畫", "太晚出門"];

type Fortune = {
  number: number;
  level: (typeof LEVELS)[number];
  poem: string;
  aspects: { name: string; icon: string; stars: number; note: string }[];
  color: (typeof LUCKY_COLORS)[number];
  luckyNumber: number;
  item: string;
  direction: string;
  good: string[];
  bad: string[];
};

function randomInt(n: number) {
  return crypto.getRandomValues(new Uint32Array(1))[0] % n;
}

const pick = <T,>(list: readonly T[]) => list[randomInt(list.length)];

// 不重複地挑出 k 個
function pickMany<T>(list: readonly T[], k: number) {
  const pool = [...list];
  return Array.from({ length: k }, () => pool.splice(randomInt(pool.length), 1)[0]);
}

function drawLevel() {
  const total = LEVELS.reduce((sum, l) => sum + l.weight, 0);
  let r = randomInt(total);
  return LEVELS.find((l) => (r -= l.weight) < 0) ?? LEVELS[0];
}

function drawFortune(): Fortune {
  const level = drawLevel();
  return {
    number: randomInt(100) + 1,
    level,
    poem: pick(level.poems),
    // 各項星數以等級為基準，上下浮動一顆
    aspects: ASPECTS.map((a) => {
      const stars = Math.min(5, Math.max(1, level.score + randomInt(3) - 1));
      const tier = stars >= 4 ? "high" : stars === 3 ? "mid" : "low";
      return { name: a.name, icon: a.icon, stars, note: pick(a.notes[tier]) };
    }),
    color: pick(LUCKY_COLORS),
    luckyNumber: randomInt(99) + 1,
    item: pick(LUCKY_ITEMS),
    direction: pick(DIRECTIONS),
    good: pickMany(GOOD, 2),
    bad: pickMany(BAD, 2),
  };
}

// 暖色和紙風卡片，邊框加深讓卡片有邊界感
const CARD = "rounded-3xl border-2 border-[#e3cfa6] bg-[#fbf4e6]/95 shadow-[0_20px_50px_-20px_rgb(20_10_60/0.6)]";

export default function FortuneDraw() {
  const [phase, setPhase] = useState<"idle" | "shaking" | "done">("idle");
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const timerRef = useRef<number>(undefined);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  function draw() {
    if (phase === "shaking") return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const result = drawFortune();
    setPhase("shaking");
    setFortune(null);
    timerRef.current = window.setTimeout(
      () => {
        setFortune(result);
        setPhase("done");
      },
      reduceMotion ? 0 : SHAKE_MS,
    );
  }

  return (
    <div className="grid w-full items-start gap-8 lg:grid-cols-[minmax(0,20rem)_1fr]">
      {/* 籤筒 */}
      <section className="flex flex-col items-center gap-6">
        <div className={`relative h-72 w-56 ${phase === "shaking" ? "fortune-shake" : ""}`}>
          <svg viewBox="0 0 160 220" className="h-full w-full drop-shadow-[0_14px_20px_rgb(10_5_40/0.45)]" aria-hidden>
            {/* 筒裡的籤：搖籤時每支各自上下跳動，節奏錯開，像在筒裡互相碰撞 */}
            {[-18, -9, 0, 9, 18, -13, 4, 13].map((x, i) => (
              <g key={i} className="fortune-rattle" style={{ animationDelay: `${-i * 0.07}s` }}>
                <rect
                  x={76 + x}
                  y={30 + (i % 3) * 8}
                  width="8"
                  height="110"
                  rx="3"
                  fill="#ecd29b"
                  stroke="#b98f52"
                  strokeWidth="1"
                  transform={`rotate(${x * 0.4} ${80 + x} 150)`}
                />
              </g>
            ))}

            {/* 抽出來的那支籤 */}
            <g className="fortune-rattle" style={{ animationDelay: "-0.3s" }}>
              <g className={`fortune-stick ${phase === "done" ? "fortune-stick-out" : ""}`}>
                <rect x="74" y="28" width="12" height="110" rx="4" fill="#f3dca8" stroke="#b98f52" strokeWidth="1.2" />
                <rect x="74" y="28" width="12" height="18" rx="4" fill={fortune?.level.color ?? "#c9564f"} />
              </g>
            </g>

            {/* 筒身 */}
            <ellipse cx="80" cy="96" rx="52" ry="12" fill="#8f3b3b" />
            <path d="M28 96 V196 Q28 210 44 210 H116 Q132 210 132 196 V96 Z" fill="#c45a52" stroke="#8f3b3b" strokeWidth="2" />
            <ellipse cx="80" cy="96" rx="52" ry="12" fill="none" stroke="#e7b75c" strokeWidth="4" />
            <rect x="28" y="182" width="104" height="7" fill="#e7b75c" />
            <circle cx="80" cy="142" r="24" fill="#fbf1dc" stroke="#e7b75c" strokeWidth="3" />
            <text x="80" y="143" textAnchor="middle" dominantBaseline="central" fontSize="24" fontWeight="800" fill="#a8423f">
              籤
            </text>
          </svg>
        </div>

        <button
          type="button"
          onClick={draw}
          disabled={phase === "shaking"}
          className="h-14 min-w-44 rounded-full border-2 border-[#f0c987] bg-linear-to-br from-[#f6c977] to-[#e8916f] px-8 text-lg font-bold text-white shadow-[0_10px_24px_-8px_rgb(240_150_90/0.7)] transition hover:brightness-105 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
        >
          <span className="drop-shadow-[0_1px_2px_rgb(160_80_40/0.5)]">
            {phase === "shaking" ? "搖籤中……" : phase === "done" ? "再抽一次" : "搖籤"}
          </span>
        </button>
        <p className="text-center text-sm text-indigo-100/80">閉上眼睛，心裡默念想問的事，再按下搖籤。</p>
      </section>

      {/* 結果 */}
      <section aria-live="polite">
        {fortune ? (
          <article key={fortune.number + fortune.poem} className={`${CARD} fortune-reveal p-6 text-slate-700 sm:p-8`}>
            <div className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-dashed border-[#e3cfa6] pb-6">
              <div>
                <p className="text-sm font-semibold tracking-widest text-[#a88a5a]">第 {fortune.number} 籤</p>
                <p className="mt-1 text-6xl font-black tracking-widest" style={{ color: fortune.level.color }}>
                  {fortune.level.name}
                </p>
              </div>
              <div className="text-right text-lg font-bold leading-9 tracking-[0.2em] text-slate-600">
                {fortune.poem.split("，").map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <p className="w-full text-slate-600">{fortune.level.advice}</p>
            </div>

            <ul className="grid gap-3 border-b-2 border-dashed border-[#e3cfa6] py-6 sm:grid-cols-2">
              {fortune.aspects.map((a) => (
                <li key={a.name} className="rounded-2xl border border-[#ead9b8] bg-[#fffaf0] px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold">
                      {a.icon} {a.name}
                    </span>
                    <span className="tracking-wider text-[#e0a23c]" aria-label={`${a.stars} 顆星`}>
                      {"★".repeat(a.stars)}
                      <span className="text-[#e6d8bd]">{"★".repeat(5 - a.stars)}</span>
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{a.note}</p>
                </li>
              ))}
            </ul>

            <dl className="grid grid-cols-2 gap-4 border-b-2 border-dashed border-[#e3cfa6] py-6 sm:grid-cols-4">
              <div>
                <dt className="text-xs text-slate-400">幸運色</dt>
                <dd className="mt-1 flex items-center gap-2 font-bold">
                  <span
                    className="h-4 w-4 rounded-full border border-[#d8c49c]"
                    style={{ backgroundColor: fortune.color.hex }}
                  />
                  {fortune.color.name}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">幸運數字</dt>
                <dd className="mt-1 font-bold tabular-nums">{fortune.luckyNumber}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">幸運物</dt>
                <dd className="mt-1 font-bold">{fortune.item}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">幸運方位</dt>
                <dd className="mt-1 font-bold">{fortune.direction}方</dd>
              </div>
            </dl>

            <div className="flex flex-wrap gap-6 pt-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-[#5e9f6e] px-2 py-0.5 text-sm font-bold text-white">宜</span>
                {fortune.good.map((g) => (
                  <span key={g} className="rounded-full border border-[#bcd9c3] bg-[#eef7f0] px-3 py-1 text-sm">
                    {g}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-[#c45a52] px-2 py-0.5 text-sm font-bold text-white">忌</span>
                {fortune.bad.map((b) => (
                  <span key={b} className="rounded-full border border-[#ecc6c0] bg-[#fbefed] px-3 py-1 text-sm">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ) : (
          <div className={`${CARD} flex min-h-80 flex-col items-center justify-center gap-3 p-8 text-center`}>
            <span className="text-5xl">{phase === "shaking" ? "🎋" : "🌙"}</span>
            <p className="text-lg font-bold text-slate-600">
              {phase === "shaking" ? "籤筒搖晃中，好運即將出現……" : "今天的運勢如何呢？"}
            </p>
            <p className="text-sm text-slate-500">按下「搖籤」，抽出屬於你的今日運勢。</p>
          </div>
        )}
      </section>
    </div>
  );
}
