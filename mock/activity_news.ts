import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 新聞假資料：category 1 新聞 / 2 紅單推薦
const titles = [
  "週末大放送活動上線",
  "新會員首儲好禮",
  "本週紅單精選推薦",
  "系統維護公告",
  "VIP 專屬回饋方案",
  "賽事下注指南",
  "限時加碼活動",
  "熱門場次推薦",
  "節慶特別企劃",
  "邀請好友送獎金"
];

const all = Array.from({ length: 14 }).map((_, i) => ({
  id: 1000 + i,
  title: `${titles[i % titles.length]} #${i + 1}`,
  category: (i % 2) + 1,
  status: i % 3 === 0 ? 0 : 1,
  startTime: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 09:00:00`,
  endTime: `2026-06-${String((i % 28) + 1).padStart(2, "0")} 23:59:59`,
  hot: i % 2 === 0,
  top: i % 4 === 0,
  betSetting: i % 5 === 0,
  eventId: i % 5 === 0 ? 88000 + i : 0,
  image: "",
  context: `<p>這是第 ${i + 1} 則新聞的內文範例。</p>`,
  updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 12:30:00`,
  updatedUser: i % 3 === 0 ? "admin" : "operator01"
}));

export default defineFakeRoute([
  {
    url: "/backend/news/list",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.title) {
        list = list.filter(v => v.title.includes(query.title));
      }
      if (query.category && Number(query.category) !== 0) {
        list = list.filter(v => v.category === Number(query.category));
      }
      // status 以布林字串傳入（true/false）
      if (query.status === "true" || query.status === "false") {
        const want = query.status === "true";
        list = list.filter(v => (v.status === 1) === want);
      }
      if (query.hot === "true" || query.hot === "false") {
        list = list.filter(v => v.hot === (query.hot === "true"));
      }
      if (query.top === "true" || query.top === "false") {
        list = list.filter(v => v.top === (query.top === "true"));
      }
      if (query.betSetting === "true" || query.betSetting === "false") {
        list = list.filter(v => v.betSetting === (query.betSetting === "true"));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    url: "/backend/news/detail",
    method: "get",
    response: ({ query }) => {
      const item = all.find(v => String(v.id) === String(query.id)) ?? all[0];
      return { success: true, data: item };
    }
  },
  {
    url: "/backend/news",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/news",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/news",
    method: "delete",
    response: () => ({ success: true, data: null })
  }
]);
