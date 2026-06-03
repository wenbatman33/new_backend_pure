import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 類型對照（launchedType）
const launchedType = [{ "1": "活动" }, { "2": "存款" }, { "3": "小游戏" }];
const deviceMap = [{ "1": "WEB" }, { "2": "H5" }, { "3": "APP" }];
const displayMap = [{ "1": "显示" }, { "2": "隐藏" }];
const activityMap = [
  { "": "全部" },
  { "1": "进行中" },
  { "2": "未开始" },
  { "3": "已结束" }
];

const langs = ["zh_CN", "en"];

// 產 15 筆假資料
const all = Array.from({ length: 15 }).map((_, i) => {
  const types = [String((i % 3) + 1), String(((i + 1) % 3) + 1)];
  return {
    ID: 1000 + i,
    orderNo: i + 1,
    type: types.join(","),
    languageText: langs.map(l => ({
      language: l,
      name: `${l === "zh_CN" ? "优惠上架" : "Promotion"} ${i + 1}`
    })),
    device: ((i % 3) + 1).toString(),
    top: i % 4 === 0 ? 1 : 2,
    display: (i % 2) + 1,
    promotions: [
      { id: i * 2 + 1, name: `活动A-${i + 1}` },
      { id: i * 2 + 2, name: `活动B-${i + 1}` }
    ],
    imageWeb: "",
    imageH5: "",
    startTime: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 00:00:00`,
    endTime: `2026-06-${String((i % 28) + 1).padStart(2, "0")} 23:59:59`,
    updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 12:30:00`,
    updatedUser: i % 3 === 0 ? "admin" : "operator01",
    summary: `这是优惠上架 ${i + 1} 的摘要`,
    content: `<p>优惠内容 ${i + 1}</p>`
  };
});

export default defineFakeRoute([
  // 下拉選單
  {
    url: "/backend/promotion/dropdown",
    method: "get",
    response: () => ({
      success: true,
      data: {
        launchedType,
        device: deviceMap,
        display: displayMap,
        activity: activityMap,
        status: [],
        openWay: [],
        launchedGame: []
      }
    })
  },
  // 上架列表
  {
    url: "/backend/promotion/launched/list",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.id) {
        list = list.filter(v => String(v.ID).includes(String(query.id)));
      }
      if (query.name) {
        list = list.filter(v =>
          v.languageText.some(l => l.name.includes(String(query.name)))
        );
      }
      if (query.display) {
        list = list.filter(v => v.display === Number(query.display));
      }
      if (query.device) {
        list = list.filter(v => v.device === String(query.device));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  // 取得單一上架
  {
    url: "/backend/promotion/launched",
    method: "get",
    response: ({ query }) => {
      const item = all.find(v => v.ID === Number(query.ID)) ?? all[0];
      return {
        success: true,
        data: {
          ID: item.ID,
          name: item.languageText[0].name,
          summary: item.summary,
          type: item.type,
          content: item.content,
          device: item.device,
          orderNo: item.orderNo,
          top: item.top,
          display: item.display,
          loginBonus: 0,
          startTime: item.startTime,
          endTime: item.endTime,
          imageWeb: item.imageWeb,
          imageH5: item.imageH5,
          updatedUser: item.updatedUser,
          updatedAt: item.updatedAt,
          promotions: item.promotions,
          deeplinkType: 0,
          deeplinkPage: "",
          deeplinkID: "",
          promotionStartTime: item.startTime,
          promotionEndTime: item.endTime
        }
      };
    }
  },
  // 新增上架
  {
    url: "/backend/promotion/launched",
    method: "post",
    response: () => ({ success: true, data: { success: true } })
  },
  // 編輯上架
  {
    url: "/backend/promotion/launched",
    method: "put",
    response: () => ({ success: true, data: { success: true } })
  },
  // 優惠列表（關聯優惠下拉用）
  {
    url: "/backend/promotion/list",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: Array.from({ length: 12 }).map((_, i) => ({
          ID: i + 1,
          name: `优惠活动 ${i + 1}`
        })),
        total: 12
      }
    })
  }
]);
