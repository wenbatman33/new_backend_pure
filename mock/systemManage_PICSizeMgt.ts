import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 圖片尺寸限制設定 mock 假資料
const columns = ["pcBanner", "mobileBanner", "thumbnail", "icon"];
const users = ["admin", "operator01", "operator02"];

const all = Array.from({ length: 16 }).map((_, i) => ({
  id: i + 1,
  type: (i % 2) + 1, // 1 廣告 / 2 站內頁
  name: `${(i % 2) + 1 === 1 ? "廣告類別" : "站內頁"}${i + 1}`,
  content: [
    { column: columns[i % columns.length], size: 200 + i * 10 },
    { column: "extra", size: 80 + i }
  ],
  updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 14:20:00`,
  updatedUser: users[i % users.length]
}));

export default defineFakeRoute([
  {
    url: "/backend/picsize/list",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.type && Number(query.type) !== 0) {
        list = list.filter(v => v.type === Number(query.type));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    url: "/backend/picsize",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/picsize",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/picsize",
    method: "delete",
    response: () => ({ success: true, data: null })
  },
  // 表單：廣告類別下拉
  {
    url: "/backend/site/banner/category",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: Array.from({ length: 8 }).map((_, i) => ({
          id: i + 1,
          name: `廣告類別${i + 1}`
        }))
      }
    })
  },
  // 表單：站內頁（樂透/紅包）類別下拉
  {
    url: "/backend/red_packet/list",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: Array.from({ length: 8 }).map((_, i) => ({
          id: 100 + i,
          name: `站內頁${i + 1}`
        }))
      }
    })
  }
]);
