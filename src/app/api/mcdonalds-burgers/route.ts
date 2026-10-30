import { connection } from "next/server";
import { type BurgerMenu, SOURCE_URL, fallbackBurgers, parseBurgers, todayInTaipei } from "@/lib/mcdonalds";

// 每次請求都重新抓取最新的漢堡清單，抓不到就回傳內建清單
export async function GET() {
  await connection();
  const today = todayInTaipei();
  const fetchedAt = new Date().toISOString();

  try {
    const res = await fetch(SOURCE_URL, {
      cache: "no-store",
      headers: { "user-agent": "Mozilla/5.0 (Kai-tools menu fetcher)" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const items = parseBurgers(await res.text(), today);
    // 解析出來太少，多半是網頁改版了，改用內建清單
    if (items.length < 8) throw new Error(`only ${items.length} items parsed`);
    return Response.json({ source: "live", items, fetchedAt } satisfies BurgerMenu);
  } catch (error) {
    console.warn("[mcdonalds-burgers] fallback:", error);
    return Response.json({ source: "fallback", items: fallbackBurgers(today), fetchedAt } satisfies BurgerMenu);
  }
}
