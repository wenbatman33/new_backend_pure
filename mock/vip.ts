import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 黑名單型別：1 禮金黑名單 / 2 反水黑名單
const reasons = ["異常下注", "套利行為", "多帳號關聯", "風控標記"];
const all = Array.from({ length: 23 }).map((_, i) => ({
  id: i + 1,
  memberID: 100000 + i,
  memberAccount: `member${i + 1}`,
  type: (i % 2) + 1,
  reason: reasons[i % reasons.length],
  createdAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 10:30:00`,
  editorName: i % 3 === 0 ? "admin" : "operator01"
}));

export default defineFakeRoute([
  {
    url: "/backend/vip/black/list",
    method: "get",
    response: ({ query }) => {
      let list = all;
      // 簡單模擬搜尋條件
      if (query.memberID) {
        list = list.filter(v => String(v.memberID).includes(query.memberID));
      }
      if (query.memberAccount) {
        list = list.filter(v => v.memberAccount.includes(query.memberAccount));
      }
      if (query.type) {
        list = list.filter(v => v.type === Number(query.type));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    url: "/backend/vip/black/add",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/vip/black/delete",
    method: "delete",
    response: () => ({ success: true, data: null })
  }
]);
