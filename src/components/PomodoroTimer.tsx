"use client";

import { useEffect, useRef, useState } from "react";

type Mode = "focus" | "short" | "long";

const MODES: Record<Mode, { label: string; color: string; track: string; hint: string }> = {
  focus: { label: "專注", color: "#3f9c8f", track: "#cfe5df", hint: "專心做一件事，其他的等一下再說。" },
  short: { label: "短休息", color: "#5b97cf", track: "#d5e4f2", hint: "站起來伸展一下，喝口水。" },
  long: { label: "長休息", color: "#8a7fcf", track: "#e0dcf3", hint: "做得很好！離開螢幕，好好休息。" },
};
const ORDER: Mode[] = ["focus", "short", "long"];

// 每完成幾次專注換一次長休息
const LONG_EVERY = 4;
const RING_R = 88;
const RING_LEN = 2 * Math.PI * RING_R;

// 淡湖綠色卡片，邊框加深讓卡片有邊界感
const CARD =
  "rounded-3xl border-2 border-[#bcdcd4] bg-[#eef6f2]/80 p-5 shadow-[0_16px_40px_-20px_rgb(60_120_110/0.45)] backdrop-blur-md";

function format(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

// 時間到時的提示音：三個由低到高的柔和音
function playChime(ctx: AudioContext) {
  [523, 659, 784].forEach((freq, i) => {
    const t = ctx.currentTime + i * 0.28;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.25, t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.95);
  });
}

// 下一段：休息後回到專注；專注後每 LONG_EVERY 次換長休息
const nextMode = (mode: Mode, done: number): Mode =>
  mode !== "focus" ? "focus" : done % LONG_EVERY === 0 ? "long" : "short";

export default function PomodoroTimer() {
  const [minutes, setMinutes] = useState<Record<Mode, number>>({ focus: 25, short: 5, long: 15 });
  const [mode, setMode] = useState<Mode>("focus");
  const [remaining, setRemaining] = useState(25 * 60000);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [autoStart, setAutoStart] = useState(false);
  const [sound, setSound] = useState(true);
  const [task, setTask] = useState("");
  const endAtRef = useRef(0);
  const audioRef = useRef<AudioContext | null>(null);

  const total = minutes[mode] * 60000;
  const progress = Math.min(1, Math.max(0, 1 - remaining / total));
  const theme = MODES[mode];

  // 用結束時間點計算剩餘時間，分頁在背景被降速時也不會跑慢
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      const left = endAtRef.current - Date.now();
      if (left > 0) {
        setRemaining(left);
        return;
      }
      if (sound && audioRef.current) playChime(audioRef.current);
      const done = mode === "focus" ? completed + 1 : completed;
      const next = nextMode(mode, done);
      const nextMs = minutes[next] * 60000;
      setCompleted(done);
      setMode(next);
      setRemaining(nextMs);
      if (autoStart) endAtRef.current = Date.now() + nextMs;
      else setRunning(false);
    }, 250);
    return () => window.clearInterval(id);
  }, [running, mode, completed, minutes, autoStart, sound]);

  // 計時中把剩餘時間顯示在分頁標題，切到別的分頁也看得到
  useEffect(() => {
    if (!running) return;
    document.title = `${format(remaining)} ${theme.label}｜蕃茄鐘`;
    return () => {
      document.title = "蕃茄鐘｜Wenty的小工具箱";
    };
  }, [running, remaining, theme.label]);

  function toggle() {
    if (running) {
      setRemaining(endAtRef.current - Date.now());
      setRunning(false);
      return;
    }
    // 瀏覽器只允許在使用者點擊後建立音效，所以在按開始時準備好
    audioRef.current ??= new AudioContext();
    endAtRef.current = Date.now() + remaining;
    setRunning(true);
  }

  function switchMode(next: Mode) {
    setRunning(false);
    setMode(next);
    setRemaining(minutes[next] * 60000);
  }

  function changeMinutes(m: Mode, value: number) {
    const v = Math.min(90, Math.max(1, Math.round(value) || 1));
    setMinutes({ ...minutes, [m]: v });
    if (m === mode) setRemaining(v * 60000);
  }

  // 這一輪（到長休息為止）已完成幾次專注
  const dots = mode === "long" && completed > 0 ? LONG_EVERY : completed % LONG_EVERY;

  return (
    <div className="grid w-full items-start gap-8 lg:grid-cols-[1fr_minmax(0,20rem)]">
      {/* 計時器 */}
      <section className={`${CARD} flex flex-col items-center gap-6 px-4 py-8 sm:px-8`}>
        <div className="flex rounded-full border-2 border-[#bcdcd4] bg-[#e2efea] p-1" role="tablist">
          {ORDER.map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => switchMode(m)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition sm:px-5 ${
                mode === m ? "text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
              style={mode === m ? { backgroundColor: MODES[m].color } : undefined}
            >
              {MODES[m].label}
            </button>
          ))}
        </div>

        <div className="relative aspect-square w-full max-w-[20rem]">
          <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90" aria-hidden>
            <circle cx="100" cy="100" r="96" fill="#f6faf8" stroke="#bcdcd4" strokeWidth="2" />
            <circle cx="100" cy="100" r={RING_R} fill="none" stroke={theme.track} strokeWidth="10" />
            <circle
              cx="100"
              cy="100"
              r={RING_R}
              fill="none"
              stroke={theme.color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={RING_LEN}
              strokeDashoffset={RING_LEN * (1 - progress)}
              className="transition-[stroke-dashoffset,stroke] duration-300 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm font-semibold tracking-widest" style={{ color: theme.color }}>
              {theme.label}
            </span>
            <span className="mt-1 text-6xl font-bold tabular-nums text-slate-700 sm:text-7xl" aria-live="off">
              {format(remaining)}
            </span>
            <span className="mt-3 flex gap-1.5" aria-label={`這一輪已完成 ${dots} / ${LONG_EVERY} 次專注`}>
              {Array.from({ length: LONG_EVERY }, (_, i) => (
                <span
                  key={i}
                  className={`h-2.5 w-2.5 rounded-full border ${
                    i < dots ? "border-[#e0796a] bg-[#f29b8c]" : "border-[#bcdcd4] bg-white/60"
                  }`}
                />
              ))}
            </span>
          </div>
        </div>

        <p className="text-center text-sm text-slate-500">{theme.hint}</p>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => switchMode(mode)}
            className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#bcdcd4] bg-white/60 text-xl text-slate-500 transition hover:text-slate-700"
            aria-label="重設"
            title="重設"
          >
            ↺
          </button>
          <button
            type="button"
            onClick={toggle}
            className="h-14 min-w-36 rounded-full px-8 text-lg font-bold text-white shadow-[0_10px_24px_-10px_rgb(40_90_80/0.6)] transition hover:brightness-105 active:translate-y-px"
            style={{ backgroundColor: theme.color }}
          >
            {running ? "暫停" : remaining < total ? "繼續" : "開始"}
          </button>
          <button
            type="button"
            onClick={() => switchMode(nextMode(mode, completed + 1))}
            className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#bcdcd4] bg-white/60 text-lg text-slate-500 transition hover:text-slate-700"
            aria-label="跳到下一段"
            title="跳到下一段"
          >
            ⏭
          </button>
        </div>

        <label className="w-full max-w-sm">
          <span className="text-sm font-semibold text-slate-600">現在專注在：</span>
          <input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="例如：寫完報告第一段"
            className="mt-2 w-full rounded-2xl border border-[#bcdcd4] bg-[#f6faf8] px-4 py-2.5 text-slate-700 focus:outline-none focus:ring-4 focus:ring-[#cfe5df]"
          />
        </label>
      </section>

      {/* 統計與設定 */}
      <section className="flex flex-col gap-6">
        <div className={CARD}>
          <h2 className="font-bold text-slate-700">今天的成果</h2>
          <p className="mt-3 text-4xl font-bold text-slate-700">
            {completed}
            <span className="ml-2 text-base font-medium text-slate-500">顆蕃茄 🍅</span>
          </p>
          <p className="mt-1 text-sm text-slate-500">共專注了約 {completed * minutes.focus} 分鐘</p>
          <p className="mt-2 text-xs text-slate-400">重新整理頁面後會歸零。</p>
        </div>

        <div className={CARD}>
          <h2 className="font-bold text-slate-700">時間設定（分鐘）</h2>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {ORDER.map((m) => (
              <label key={m} className="flex flex-col gap-1.5 text-sm text-slate-600">
                {MODES[m].label}
                <input
                  type="number"
                  min={1}
                  max={90}
                  value={minutes[m]}
                  disabled={running}
                  onChange={(e) => changeMinutes(m, Number(e.target.value))}
                  className="w-full rounded-xl border border-[#bcdcd4] bg-[#f6faf8] px-3 py-2 text-center font-semibold text-slate-700 tabular-nums focus:outline-none focus:ring-4 focus:ring-[#cfe5df] disabled:opacity-60"
                />
              </label>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-400">計時中無法修改，先暫停再調整。</p>

          <label className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={autoStart}
              onChange={(e) => setAutoStart(e.target.checked)}
              className="h-4 w-4 accent-[#3f9c8f]"
            />
            時間到自動開始下一段
          </label>
          <label className="mt-2 flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={sound}
              onChange={(e) => setSound(e.target.checked)}
              className="h-4 w-4 accent-[#3f9c8f]"
            />
            時間到播放提示音
          </label>
        </div>
      </section>
    </div>
  );
}
