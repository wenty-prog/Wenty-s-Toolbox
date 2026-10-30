// 麥當勞（台灣）漢堡清單：麥當勞沒有公開的菜單 API，所以從第三方整理的價目表網頁抓取並解析。
// 網頁改版或抓不到時，改用下面的內建清單（2026/10/30 整理）。

export const SOURCE_URL =
  "https://www.cashfeel.com.tw/article/%E9%BA%A5%E7%95%B6%E5%8B%9E-%E9%BA%A5%E7%95%B6%E5%8B%9E%E8%8F%9C%E5%96%AE-%E9%BB%9E%E9%A4%90";

export type Burger = {
  name: string;
  price: number;
  // 期間限定品的最後販售日（YYYY-MM-DD），常態品沒有
  until?: string;
};

export type BurgerMenu = {
  source: "live" | "fallback";
  items: Burger[];
  fetchedAt: string;
};

// 早餐（滿福堡等）只在早上供應，不列入
const FALLBACK: (Burger & { from?: string })[] = [
  { name: "大麥克", price: 78 },
  { name: "雙層牛肉吉士堡", price: 72 },
  { name: "四盎司牛肉堡", price: 92 },
  { name: "雙層四盎司牛肉堡", price: 132 },
  { name: "BLT安格斯牛肉堡", price: 122 },
  { name: "蕈菇安格斯牛肉堡", price: 132 },
  { name: "漢堡", price: 36 },
  { name: "吉事漢堡", price: 48 },
  { name: "麥香雞", price: 48 },
  { name: "勁辣雞腿堡", price: 78 },
  { name: "肯瓊勁脆雞腿堡", price: 99 },
  { name: "煙燻勁脆雞腿堡", price: 99 },
  { name: "炭燒醬烤雞腿堡", price: 99 },
  { name: "BLT香烙烤鷄腿堡", price: 129 },
  { name: "麥香魚", price: 52 },
  { name: "雙層麥香魚", price: 92 },
  { name: "松露安格斯牛肉黑堡", price: 109, from: "2026-10-21", until: "2026-11-24" },
  { name: "金薯松露安格斯牛肉黑堡", price: 119, from: "2026-10-21", until: "2026-11-24" },
  { name: "松露脆鷄腿黑堡", price: 109, from: "2026-10-21", until: "2026-11-24" },
  { name: "金薯松露脆鷄腿黑堡", price: 119, from: "2026-10-21", until: "2026-11-24" },
];

// 台灣時間的今天，格式 YYYY-MM-DD，可以直接用字串比大小
export const todayInTaipei = () => new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Taipei" });

const onSale = (today: string, from?: string, until?: string) =>
  (!from || from <= today) && (!until || today <= until);

export function fallbackBurgers(today: string): Burger[] {
  return FALLBACK.filter((b) => onSale(today, b.from, b.until)).map(({ name, price, until }) => ({
    name,
    price,
    until,
  }));
}

const strip = (s: string) =>
  s
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

const isBurger = (name: string) =>
  /堡|大麥克|麥香雞|麥香魚/.test(name) && !/雞塊|沙拉|雞翅|麥脆雞|套餐|分享|滿福/.test(name);

const pad = (n: string) => n.padStart(2, "0");

// 解析網頁：主餐價目表、點心表裡的漢堡，以及新品介紹中還在販售期間的限定漢堡
export function parseBurgers(html: string, today: string): Burger[] {
  const found = new Map<string, Burger>();
  const add = (b: Burger) => {
    if (!found.has(b.name)) found.set(b.name, b);
  };

  for (const [table] of html.matchAll(/<table[\s\S]*?<\/table>/g)) {
    const rows = [...table.matchAll(/<tr[\s\S]*?<\/tr>/g)].map(([row]) =>
      [...row.matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/g)].map((cell) => strip(cell[1])),
    );
    const header = rows[0] ?? [];
    // 主餐表的表頭是「品名 / 單點價格」，點心表的表頭是「點心類」；早餐表的表頭是「主餐」，不抓
    if (!(header[0] === "品名" && header[1] === "單點價格") && header[0] !== "點心類") continue;
    for (const [name = "", price = ""] of rows.slice(1)) {
      const n = price.match(/\d+/);
      if (n && isBurger(name)) add({ name, price: Number(n[0]) });
    }
  }

  // 新品介紹：「開賣時間：2026/10/21~11/24」之後列出的「XX堡－單點：$109」
  const text = strip(html.replace(/<script[\s\S]*?<\/script>/g, ""));
  const pattern =
    /開賣時間：(\d{4})\/(\d{1,2})\/(\d{1,2})~(?:(\d{4})\/)?(\d{1,2})\/(\d{1,2})|開賣時間：|([一-鿿A-Za-z]{2,14}堡)[－-]?\s*單點[：:]\s*\$(\d+)/g;
  let range: { from: string; until: string } | null = null;
  for (const m of text.matchAll(pattern)) {
    if (m[1]) {
      const [y, mo, d, y2, mo2, d2] = m.slice(1, 7);
      const endYear = y2 ?? String(Number(mo2) < Number(mo) ? Number(y) + 1 : Number(y));
      range = { from: `${y}-${pad(mo)}-${pad(d)}`, until: `${endYear}-${pad(mo2)}-${pad(d2)}` };
    } else if (m[0] === "開賣時間：") {
      // 沒有結束日的是長期供應品，已經在主餐表裡
      range = null;
    } else if (range && onSale(today, range.from, range.until)) {
      add({ name: m[7], price: Number(m[8]), until: range.until });
    }
  }

  return [...found.values()];
}
