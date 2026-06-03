import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 任務型別：1 每日 / 2 每週 / 3 自訂
const names = ["每日簽到", "週末加碼", "首儲任務", "連續登入", "投注挑戰"];
const all = Array.from({ length: 16 }).map((_, i) => ({
  id: i + 1,
  name: `${names[i % names.length]}${i + 1}`,
  internalName: `task_internal_${i + 1}`,
  status: i % 3 === 0 ? 0 : 1,
  type: (i % 3) + 1,
  week: ((i % 3) + 1) === 2 ? (i % 7) + 1 : undefined,
  activeReset: i % 2 === 0,
  receiveDay: i % 5,
  startTime: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 00:00:00`,
  endTime: `2026-06-${String((i % 28) + 1).padStart(2, "0")} 23:59:59`,
  updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 10:30:00`,
  updatedUser: i % 3 === 0 ? "admin" : "operator01"
}));

export default defineFakeRoute([
  // 任務列表
  {
    url: "/backend/task/list",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.id) {
        list = list.filter(v => String(v.id) === String(query.id));
      }
      if (query.name) {
        list = list.filter(v => v.name.includes(query.name));
      }
      if (query.internalName) {
        list = list.filter(v => v.internalName.includes(query.internalName));
      }
      if (query.type) {
        list = list.filter(v => v.type === Number(query.type));
      }
      if (query.status !== undefined && query.status !== "") {
        list = list.filter(v => v.status === Number(query.status));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  // 任務明細
  {
    url: "/backend/task/detail",
    method: "get",
    response: ({ query }) => {
      const found = all.find(v => String(v.id) === String(query.id)) ?? all[0];
      return { success: true, data: { ...found } };
    }
  },
  // 新增任務
  {
    url: "/backend/task/",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 編輯任務（含啟停切換）
  {
    url: "/backend/task/",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 優惠下拉（活動 / 任務週期）
  {
    url: "/backend/promotion/dropdown",
    method: "get",
    response: () => ({
      success: true,
      data: {
        activity: [{ "1": "活動A" }, { "2": "活動B" }],
        serviceCode: []
      }
    })
  },
  // 金流線路下拉
  {
    url: "/backend/pay/pay_channel/dropdown",
    method: "get",
    response: () => ({
      success: true,
      data: { serviceCode: [{ "1": "線路一" }, { "2": "線路二" }] }
    })
  }
]);
