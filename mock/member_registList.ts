import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 會員注冊列表假資料
const currencies = ["CNY", "USD", "THB", "VND"];
const list = Array.from({ length: 16 }).map((_, i) => ({
  memberID: 200000 + i,
  account: `regist_user${i + 1}`,
  currency: currencies[i % currencies.length],
  money: (Math.random() * 10000).toFixed(2),
  phone: `09${String(10000000 + i).slice(0, 8)}`,
  email: `user${i + 1}@example.com`,
  agencyID: i % 4 === 0 ? 0 : 300000 + (i % 5),
  createdAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 09:${String(
    (i * 3) % 60
  ).padStart(2, "0")}:00`,
  lastLoginAt: `2026-06-0${(i % 3) + 1} 18:${String((i * 5) % 60).padStart(
    2,
    "0"
  )}:00`
}));

export default defineFakeRoute([
  {
    // 沿用舊 endpoint /backend/member/register/export
    url: "/backend/member/register/export",
    method: "get",
    response: () => {
      return { success: true, data: { list, total: list.length } };
    }
  }
]);
