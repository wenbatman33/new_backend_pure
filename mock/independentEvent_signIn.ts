import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 簽到活動（promotion group）假資料
const all = Array.from({ length: 16 }).map((_, i) => ({
  id: i + 1,
  code: `SIGNIN${String(i + 1).padStart(3, "0")}`,
  name: `每日簽到活动 ${i + 1}`,
  internalName: `内部-签到-${i + 1}`,
  status: (i % 2) + 1,
  startTime: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 00:00:00`,
  endTime: `2026-06-${String((i % 28) + 1).padStart(2, "0")} 23:59:59`,
  updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 12:00:00`,
  updatedUser: i % 3 === 0 ? "admin" : "operator01"
}));

export default defineFakeRoute([
  {
    url: "/backend/promotion/group/list",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.name) {
        list = list.filter(v => v.name.includes(query.name));
      }
      if (query.code) {
        list = list.filter(v => v.code.includes(query.code));
      }
      if (query.internalName) {
        list = list.filter(v => v.internalName.includes(query.internalName));
      }
      if (query.status) {
        list = list.filter(v => v.status === Number(query.status));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    // 取明細：/backend/promotion/group?code=xxx
    url: "/backend/promotion/group",
    method: "get",
    response: ({ query }) => {
      const found = all.find(v => v.code === query.code) ?? all[0];
      return { success: true, data: found };
    }
  },
  {
    // 編輯
    url: "/backend/promotion/group",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    // 新增
    url: "/backend/promotion/group",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    // 批次更新狀態
    url: "/backend/promotion/group/status",
    method: "put",
    response: () => ({ success: true, data: null })
  }
]);
