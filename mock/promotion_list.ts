import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 條件類型可選值（對應 hook 內 condTypeMap）
const condPool = [1, 2, 3, 5, 6, 7, 8, 9];

const all = Array.from({ length: 16 }).map((_, i) => {
  const status = (i % 2) + 1; // 1 啟用 2 停用
  return {
    ID: 1000 + i,
    name: `优惠活动 ${i + 1}`,
    internalName: `内部名称_${i + 1}`,
    promotionCondTypes: [condPool[i % condPool.length], condPool[(i + 1) % condPool.length]],
    status,
    startTime: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 00:00:00`,
    endTime: `2026-06-${String((i % 28) + 1).padStart(2, "0")} 23:59:59`,
    updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 12:30:00`,
    freedom: (i % 3) + 1, // 1 後台 2 獨立 3 指定存款
    code: `EVT${2000 + i}`,
    online: (i % 2) + 1, // 1 線上 2 線下
    updatedUser: i % 3 === 0 ? "admin" : "operator01",
    walletType: (i % 2) + 1
  };
});

// 下拉選單假資料（後端格式：[{ "1": "文字" }, ...]）
const dropdownData = {
  status: [{ "1": "启用" }, { "2": "停用" }],
  promotionCondType: [
    { "1": "存款条件" },
    { "2": "投注条件" },
    { "3": "流水条件" }
  ],
  activity: [{ "1": "无限制" }, { "2": "每日" }, { "3": "每周" }],
  cycleType: [],
  way: [],
  approveCycle: [],
  device: []
};

export default defineFakeRoute([
  {
    url: "/backend/promotion/list",
    method: "get",
    response: ({ query }) => {
      let list = all.slice();
      if (query.ID) list = list.filter(v => String(v.ID).includes(query.ID));
      if (query.name) list = list.filter(v => v.name.includes(query.name));
      if (query.internalName)
        list = list.filter(v => v.internalName.includes(query.internalName));
      if (query.status)
        list = list.filter(v => v.status === Number(query.status));
      if (query.freedom)
        list = list.filter(v => v.freedom === Number(query.freedom));
      if (query.walletType)
        list = list.filter(v => v.walletType === Number(query.walletType));
      // online 預設帶 "1,2"，不過濾
      if (query.online && query.online !== "1,2")
        list = list.filter(v => v.online === Number(query.online));
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    url: "/backend/promotion/dropdown",
    method: "get",
    response: () => ({ success: true, data: dropdownData })
  },
  {
    url: "/backend/promotion/status",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/promotion",
    method: "delete",
    response: () => ({ success: true, data: null })
  }
]);
