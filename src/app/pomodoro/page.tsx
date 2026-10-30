import type { Metadata } from "next";
import Link from "next/link";
import CalmSkyBackground from "@/components/CalmSkyBackground";
import PomodoroTimer from "@/components/PomodoroTimer";

export const metadata: Metadata = {
  title: "蕃茄鐘｜Wenty的小工具箱",
  description: "專注 25 分鐘、休息 5 分鐘，幫助你專心工作。",
};

export default function PomodoroPage() {
  return (
    // 這頁固定使用湖綠色天空主題，不跟隨深色模式
    <div className="relative isolate flex flex-1 justify-center font-sans text-slate-700">
      <CalmSkyBackground />

      <main className="relative flex w-full max-w-5xl flex-col items-center gap-8 overflow-x-clip px-4 py-8 sm:px-8 sm:py-12">
        <Link
          href="/"
          className="self-start rounded-full border-2 border-[#bcdcd4] bg-[#eef6f2]/80 px-4 py-1.5 text-sm font-medium text-slate-600 backdrop-blur-md transition hover:-translate-y-0.5"
        >
          ← 回首頁
        </Link>

        <div className="text-center">
          <p className="text-sm font-semibold tracking-[0.4em] text-[#3f9c8f]">FOCUS TIMER</p>
          <h1 className="mt-2 text-5xl font-black tracking-wider text-slate-700 sm:text-6xl">蕃茄鐘</h1>
          <p className="mt-3 text-slate-500">專注一段時間，再好好休息一下 🍅</p>
        </div>

        <PomodoroTimer />
      </main>
    </div>
  );
}
