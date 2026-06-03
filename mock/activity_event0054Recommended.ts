import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 被推薦會員假資料
const all = Array.from({ length: 16 }).map((_, i) => ({
  memberID: 200000 + i,
  account: `referred${String(i + 1).padStart(2, "0")}`,
  depositAmount: (Math.random() * 50000).toFixed(2),
  eventTurnover: (Math.random() * 120000).toFixed(2),
  withdrawAmount: (Math.random() * 30000).toFixed(2),
  registerAt: `2026-04-${String((i % 28) + 1).padStart(2, "0")} 09:15:00`,
  lastLoginAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 21:40:00`
}));

export default defineFakeRoute([
  {
    url: "/backend/event/event0054/recommended",
    method: "get",
    response: ({ query }) => {
      let list = [...all];
      // 模擬排序：1 存款 2 投注 3 提款 4 最後上線 5 註冊
      const fieldMap: Record<string, string> = {
        "1": "depositAmount",
        "2": "eventTurnover",
        "3": "withdrawAmount",
        "4": "lastLoginAt",
        "5": "registerAt"
      };
      if (query.orderBy && fieldMap[String(query.orderBy)]) {
        const field = fieldMap[String(query.orderBy)];
        const dir = query.order === "asc" ? 1 : -1;
        list.sort((a, b) => {
          const av = a[field];
          const bv = b[field];
          if (Number(av) && Number(bv)) {
            return (Number(av) - Number(bv)) * dir;
          }
          return String(av).localeCompare(String(bv)) * dir;
        });
      }

      const total = list.length;
      const page = Number(query.page) || 1;
      const pageSize = Number(query.pageSize) || 10;
      const start = (page - 1) * pageSize;
      const paged = list.slice(start, start + pageSize);

      return { success: true, data: { list: paged, total } };
    }
  }
]);
