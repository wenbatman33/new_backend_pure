import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 優惠上架列表 mock
const types = ["1", "2", "1,2"];
const promotionNames = ["首存優惠", "週週返水", "新會員禮包", "VIP 專屬", "限時加碼"];

const list = Array.from({ length: 16 }).map((_, i) => {
  const id = i + 1;
  return {
    ID: id,
    name: [`zh-CN : 優惠活動 ${id}`, `en : Promotion ${id}`],
    languageText: [
      { language: "zh-CN", name: `優惠活動 ${id}` },
      { language: "en", name: `Promotion ${id}` }
    ],
    type: types[i % types.length],
    summary: `這是第 ${id} 筆優惠摘要`,
    content: `<p>優惠內容 ${id}</p>`,
    device: ["1", "2", "1,2,3,4"][i % 3],
    orderNo: id,
    top: i % 4 === 0 ? 1 : 0,
    display: (i % 2) + 1,
    startTime: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 00:00:00`,
    endTime: `2026-06-${String((i % 28) + 1).padStart(2, "0")} 23:59:59`,
    imageWeb: "",
    imageH5: "",
    updatedUser: i % 3 === 0 ? "admin" : "operator01",
    updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 12:00:00`,
    promotions: [promotionNames[i % promotionNames.length]]
  };
});

// 單筆詳情（供 getLaunched 使用）
function buildDetail(ID: number) {
  const item = list.find(v => v.ID === ID) ?? list[0];
  return {
    ID,
    name: `優惠活動 ${ID}`,
    summary: item.summary,
    type: item.type,
    content: item.content,
    device: item.device,
    orderNo: item.orderNo,
    top: item.top,
    display: item.display,
    startTime: item.startTime,
    endTime: item.endTime,
    imageWeb: item.imageWeb,
    imageH5: item.imageH5,
    updatedUser: item.updatedUser,
    updatedAt: item.updatedAt,
    promotions: [{ id: 1, name: promotionNames[ID % promotionNames.length] }]
  };
}

export default defineFakeRoute([
  // 列表
  {
    url: "/backend/ai/promotion/launched/list",
    method: "get",
    response: ({ query }) => {
      let result = list.slice();
      if (query.id) {
        result = result.filter(v => String(v.ID).includes(String(query.id)));
      }
      if (query.display) {
        result = result.filter(v => v.display === Number(query.display));
      }
      return { success: true, data: { list: result, total: result.length } };
    }
  },
  // 取得單筆
  {
    url: "/backend/ai/promotion/launched",
    method: "get",
    response: ({ query }) => {
      const ID = Number(query.ID ?? 1);
      return { success: true, data: buildDetail(ID) };
    }
  },
  // 更新
  {
    url: "/backend/ai/promotion/launched",
    method: "put",
    response: () => ({ success: true, data: { success: true } })
  },
  // 新增
  {
    url: "/backend/ai/promotion/launched",
    method: "post",
    response: () => ({ success: true, data: { success: true } })
  },
  // 關聯優惠下拉（getPromotionList）
  {
    url: "/backend/ai/promotion/list",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: promotionNames.map((name, i) => ({ ID: i + 1, name })),
        total: promotionNames.length
      }
    })
  }
]);
