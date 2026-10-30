import type { Metadata } from "next";
import Link from "next/link";
import FortuneDraw from "@/components/FortuneDraw";
import NightSkyBackground from "@/components/NightSkyBackground";

export const metadata: Metadata = {
  title: "好運抽籤｜Wenty的小工具箱",
  description: "搖一搖籤筒，隨機抽出大吉到大凶，看看今天的運勢。",
};

export default function FortunePage() {
  return (
    // 這頁固定使用夜空主題，不跟隨深色模式
    <div className="relative isolate flex flex-1 justify-center font-sans text-white">
      <NightSkyBackground />

      <main className="relative flex w-full max-w-5xl flex-col items-center gap-8 overflow-x-clip px-4 py-8 sm:px-8 sm:py-12">
        <Link
          href="/"
          className="self-start rounded-full border-2 border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium text-indigo-50 backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/20"
        >
          ← 回首頁
        </Link>

        <div className="text-center">
          <p className="text-sm font-semibold tracking-[0.4em] text-amber-200/90">DAILY FORTUNE</p>
          <h1 className="mt-2 text-5xl font-black tracking-wider drop-shadow-[0_2px_12px_rgb(255_220_160/0.35)] sm:text-6xl">
            好運抽籤
          </h1>
          <p className="mt-3 text-indigo-100/80">搖一搖籤筒，看看今天的運勢 ✨</p>
        </div>

        <FortuneDraw />
      </main>
    </div>
  );
}
