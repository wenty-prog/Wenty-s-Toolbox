import type { Metadata } from "next";
import Link from "next/link";
import LotteryWheel from "@/components/LotteryWheel";
import PastelSkyBackground from "@/components/PastelSkyBackground";

export const metadata: Metadata = {
  title: "抽獎轉盤｜Wenty的小工具箱",
  description: "輸入名單，轉動轉盤隨機抽出得獎者。",
};

export default function LotteryPage() {
  return (
    // 這頁固定使用粉彩晨光天空主題，不跟隨深色模式
    <div className="relative isolate flex flex-1 justify-center font-sans text-slate-700">
      <PastelSkyBackground />

      <main className="relative flex w-full max-w-5xl flex-col items-center gap-8 overflow-x-clip px-4 py-8 sm:px-8 sm:py-12">
        <Link
          href="/"
          className="self-start rounded-full border border-white/70 bg-white/55 px-4 py-1.5 text-sm font-medium text-slate-600 shadow-[0_6px_20px_-10px_rgb(90_100_170/0.4)] backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/75"
        >
          ← 回首頁
        </Link>

        <div className="text-center">
          <p className="text-sm font-semibold tracking-[0.4em] text-indigo-400">LUCKY WHEEL</p>
          <h1 className="mt-2 text-5xl font-black tracking-wider text-slate-700 drop-shadow-[0_2px_12px_rgb(255_255_255/0.9)] sm:text-6xl">
            抽獎轉盤
          </h1>
          <p className="mt-3 text-slate-500">輸入這次的名單，轉動轉盤抽出幸運兒 ✨</p>
        </div>

        <LotteryWheel />
      </main>
    </div>
  );
}
