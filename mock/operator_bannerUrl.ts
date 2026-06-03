import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 網址群組假資料：keyword 為標籤陣列，recommendTypeSort 為推薦類型值排序陣列
const names = ["首頁推薦", "活動banner", "VIP專區", "新手引導", "賽事推廣"];
const all = Array.from({ length: 15 }).map((_, i) => ({
  ID: i + 1,
  name: `${names[i % names.length]}-${i + 1}`,
  keyword: [`kw${i + 1}`, `tag${(i % 3) + 1}`],
  recommendTypeSort: [(i % 4) + 1, ((i + 1) % 4) + 1],
  status: (i % 2) + 1,
  updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 14:20:00`,
  editor: i % 3 === 0 ? "admin" : "operator01"
}));

export default defineFakeRoute([
  // 列表
  {
    url: "/backend/site/banner/url/list",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.keyword) {
        list = list.filter(v =>
          v.keyword.some(k => k.includes(query.keyword))
        );
      }
      if (query.name) {
        list = list.filter(v => v.name.includes(query.name));
      }
      if (query.status) {
        list = list.filter(v => v.status === Number(query.status));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  // 單筆查詢
  {
    url: "/backend/site/banner/url",
    method: "get",
    response: ({ query }) => {
      const item = all.find(v => v.ID === Number(query.id)) ?? all[0];
      return { success: true, data: item };
    }
  },
  // 新增
  {
    url: "/backend/site/banner/url",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 編輯
  {
    url: "/backend/site/banner/url",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 刪除（後端走 query string ?id=xxx）
  {
    url: "/backend/site/banner/url",
    method: "delete",
    response: () => ({ success: true, data: null })
  }
]);
