import { defineFakeRoute } from "vite-plugin-fake-server/client";

// IP 黑名單假資料
const reasons = ["異常下注", "套利行為", "多帳號關聯", "代理刷單", "風控標記"];
const all = Array.from({ length: 18 }).map((_, i) => ({
  id: i + 1,
  ip: `192.168.${Math.floor(i / 10)}.${(i * 7 + 11) % 255}`,
  reason: reasons[i % reasons.length],
  createdAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 10:30:00`,
  createUserAccount: i % 3 === 0 ? "admin" : "operator01"
}));

export default defineFakeRoute([
  // 列表查詢（精準 ip / 模糊 ipPart）
  {
    url: "/backend/member/ip/blacklist",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.ip) {
        list = list.filter(v => v.ip === query.ip);
      } else if (query.ipPart) {
        list = list.filter(v => v.ip.includes(query.ipPart));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  // 新增
  {
    url: "/backend/member/ip/blacklist",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 刪除（ip 以 query 帶入）
  {
    url: "/backend/member/ip/blacklist",
    method: "delete",
    response: () => ({ success: true, data: null })
  },
  // 編輯原因
  {
    url: "/backend/member/ip/reason",
    method: "put",
    response: () => ({ success: true, data: null })
  }
]);
