import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 優惠模板類型可選值
const condTypePool = [1, 2, 3, 5, 6, 7, 8, 9];
const names = [
  "首存禮金",
  "每日簽到",
  "週週返水",
  "VIP升級禮",
  "存款加碼",
  "體育返水",
  "電子救援金",
  "推薦好友",
  "假日紅包",
  "連續登入獎"
];

const all = Array.from({ length: 16 }).map((_, i) => ({
  ID: 1000 + i,
  name: `${names[i % names.length]}活动${i + 1}`,
  internalName: `internal_${i + 1}`,
  // 隨機 1~2 個模板類型
  promotionCondTypes: condTypePool.slice(i % 5, (i % 5) + ((i % 2) + 1)),
  status: (i % 2) + 1, // 1啟用 2停用
  startTime: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 00:00:00`,
  endTime: `2026-06-${String((i % 28) + 1).padStart(2, "0")} 23:59:59`,
  updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 12:30:00`,
  freedom: (i % 3) + 1, // 1背景 2獨立 3指定存款
  code: `EVT${10000 + i}`,
  online: (i % 2) + 1, // 1銷售 2代理
  updatedUser: i % 3 === 0 ? "admin" : "operator01"
}));

export default defineFakeRoute([
  {
    url: "/backend/ai/promotion/list",
    method: "get",
    response: ({ query }) => {
      let list = [...all];
      if (query.ID) {
        list = list.filter(v => String(v.ID).includes(String(query.ID)));
      }
      if (query.name) {
        list = list.filter(v => v.name.includes(String(query.name)));
      }
      if (query.internalName) {
        list = list.filter(v => v.internalName.includes(String(query.internalName)));
      }
      if (query.status) {
        list = list.filter(v => v.status === Number(query.status));
      }
      if (query.eventCode) {
        list = list.filter(v => v.code.includes(String(query.eventCode)));
      }
      if (query.freedom) {
        list = list.filter(v => v.freedom === Number(query.freedom));
      }
      // online 帶 "1,2" 時不過濾
      if (query.online && query.online !== "1,2") {
        list = list.filter(v => v.online === Number(query.online));
      }
      const total = list.length;
      const page = Number(query.page ?? 1);
      const pageSize = Number(query.pageSize ?? 10);
      const start = (page - 1) * pageSize;
      return {
        success: true,
        data: { list: list.slice(start, start + pageSize), total }
      };
    }
  },
  {
    url: "/backend/ai/promotion/status",
    method: "post",
    response: () => ({ success: true, data: null })
  }
]);
