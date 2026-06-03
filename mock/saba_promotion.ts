import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 活動狀態：1 停用 / 2 上架中 / 3 下架中
const sportNames = ["足球", "篮球"];
const all = Array.from({ length: 16 }).map((_, i) => ({
  id: 10001 + i,
  name: `${sportNames[i % 2]}活动 ${i + 1}`,
  route: `/promo${i + 1}`,
  status: (i % 3) + 1,
  sportId: (i % 2) + 1,
  start: `2026-06-${String((i % 28) + 1).padStart(2, "0")} 00:00:00`,
  end: `2026-07-${String((i % 28) + 1).padStart(2, "0")} 00:00:00`
}));

export default defineFakeRoute([
  // 活動列表
  {
    url: "/backend/event/saba_promotion/list",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.name) list = list.filter(v => v.name.includes(query.name));
      if (query.id) list = list.filter(v => String(v.id).includes(query.id));
      if (query.sportId && Number(query.sportId) > 0) {
        list = list.filter(v => v.sportId === Number(query.sportId));
      }
      if (query.status && Number(query.status) > 0) {
        list = list.filter(v => v.status === Number(query.status));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  // 建立活動主檔
  {
    url: "/backend/event/saba_promotion",
    method: "post",
    response: () => ({ success: true, data: { id: Date.now() } })
  },
  // 更新活動主檔
  {
    url: "/backend/event/saba_promotion",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // saba 後台：產品/體育下拉
  {
    url: "/game/bo/saba/get_selector",
    method: "post",
    response: () => ({
      success: true,
      data: { productList: [{ label: "Saba", value: 1 }] }
    })
  },
  {
    url: "/game/bo/saba/get_sport_list",
    method: "post",
    response: () => ({
      success: true,
      data: {
        sportList: [
          { label: "足球", value: 1 },
          { label: "篮球", value: 2 }
        ]
      }
    })
  }
]);
