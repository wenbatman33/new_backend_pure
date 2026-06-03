import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 上架類型對照（舊碼 dropdown.launchedType）
const typeMap: Record<string, string> = {
  "1": "首充优惠",
  "2": "签到优惠",
  "3": "活动优惠",
  "4": "返水优惠"
};

const languages = ["EN", "ZH"];

// 優惠上架列表假資料
const all = Array.from({ length: 16 }).map((_, i) => {
  const status = (i % 2) + 1; // 1 上架 / 2 下架
  const display = status === 1 ? 1 : 2;
  const day = String((i % 28) + 1).padStart(2, "0");
  return {
    ID: i + 1,
    display,
    type: i % 3 === 0 ? "1,3" : `${(i % 4) + 1}`,
    languageText: [
      {
        language: languages[i % 2],
        name: `小游戏活动${i + 1}`,
        imageWeb: "",
        imageH5: ""
      }
    ],
    promotions: [
      {
        ID: 1000 + i,
        id: 1000 + i,
        name: `promo_${i + 1}`,
        internalName: `内部名称${i + 1}`,
        status
      }
    ],
    timeInterval: [
      { startTime: `2026-05-${day} 00:00:00`, endTime: `2026-06-${day} 23:59:59` }
    ],
    updatedAt: `2026-05-${day} 12:00:00`,
    updatedUser: i % 3 === 0 ? "admin" : "operator01"
  };
});

export default defineFakeRoute([
  // 優惠上架列表
  {
    url: "/backend/promotion/launched/list",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.id) list = list.filter(v => String(v.ID).includes(query.id));
      if (query.name)
        list = list.filter(v =>
          v.languageText.some(l => l.name.includes(query.name))
        );
      if (query.display)
        list = list.filter(v => v.display === Number(query.display));
      return { success: true, data: { list, total: list.length } };
    }
  },
  // 小遊戲圖片列表（含 typeMap 供前端類型對照）
  {
    url: "/backend/promotion/launched/bonus/list",
    method: "get",
    response: () => ({
      success: true,
      data: {
        typeMap,
        list: all.slice(0, 8).map(v => ({
          id: v.ID,
          url: ""
        }))
      }
    })
  },
  // 取得單一上架優惠
  {
    url: "/backend/promotion/launched",
    method: "get",
    response: ({ query }) => {
      const target = all.find(v => v.ID === Number(query.ID)) ?? all[0];
      return {
        success: true,
        data: {
          ID: target.ID,
          display: target.display,
          type: target.type,
          device: "1,2",
          promotions: target.promotions,
          promotionButtons: [],
          languageText: target.languageText,
          timeInterval: target.timeInterval
        }
      };
    }
  },
  // 編輯優惠上架
  {
    url: "/backend/promotion/launched",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 操作紀錄
  {
    url: "/backend/promotion/log/list",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: Array.from({ length: 6 }).map((_, i) => ({
          updatedAt: `2026-05-${String(i + 1).padStart(2, "0")} 10:00:00`,
          updatedUser: i % 2 === 0 ? "admin" : "operator01",
          action: i % 2 === 0 ? "新增" : "修改",
          content: `<span>操作内容 ${i + 1}</span>`
        }))
      }
    })
  }
]);
