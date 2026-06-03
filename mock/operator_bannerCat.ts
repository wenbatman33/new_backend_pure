import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 廣告分類假資料
const names = [
  "首頁輪播",
  "活動專區",
  "體育推廣",
  "電子遊戲",
  "真人視訊",
  "彩票專區",
  "棋牌遊戲",
  "VIP 專屬",
  "新手禮包",
  "節慶活動",
  "存款優惠",
  "返水活動",
  "代理招募",
  "APP 下載",
  "公告通知"
];

const all = Array.from({ length: 15 }).map((_, i) => ({
  id: i + 1,
  name: names[i],
  description: `${names[i]}的廣告分類說明`,
  hidden: i % 4 === 0,
  editor: 1000 + i,
  editorName: i % 3 === 0 ? "admin" : "operator01",
  createdAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 09:00:00`,
  updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 18:30:00`
}));

export default defineFakeRoute([
  {
    url: "/backend/site/banner/category",
    method: "get",
    response: () => {
      return { success: true, data: { list: all, count: all.length } };
    }
  },
  {
    url: "/backend/site/banner/category",
    method: "post",
    response: () => ({ success: true, data: { success: true } })
  },
  {
    url: "/backend/site/banner/category",
    method: "put",
    response: () => ({ success: true, data: { success: true } })
  }
]);
