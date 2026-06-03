import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 廣播假資料
const titles = [
  "系统维护公告",
  "新用户专享活动",
  "充值返利上线",
  "周末加倍奖励",
  "VIP 专属福利",
  "签到送好礼",
  "限时折扣活动",
  "新游戏上线通知"
];

const all = Array.from({ length: 16 }).map((_, i) => ({
  id: i + 1,
  title: `${titles[i % titles.length]}#${i + 1}`,
  memberType: i % 3 === 0 ? 1 : 0,
  memberAccounts: i % 3 === 0 ? [`member${i}`, `member${i + 1}`] : [],
  deeplinkType: i % 4,
  deeplinkLink: i % 2 === 0 ? "" : `${100 + i}`,
  displayType: (i % 4) + 1,
  startType: (i % 2) + 1,
  startTime: `2026-06-${String((i % 28) + 1).padStart(2, "0")} 09:00:00`,
  sendTime: `2026-06-${String((i % 28) + 1).padStart(2, "0")} 09:00:02`,
  time: [5, 10, 15, 20, 30][i % 5],
  imageWeb: "",
  imageH5: "",
  updatedAt: `2026-06-${String((i % 28) + 1).padStart(2, "0")} 12:30:00`,
  updatedUser: i % 2 === 0 ? "admin" : "operator01"
}));

export default defineFakeRoute([
  {
    url: "/backend/websocket/list",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.title) {
        list = list.filter(v => v.title.includes(query.title));
      }
      if (query.startType && Number(query.startType) !== 0) {
        list = list.filter(v => v.startType === Number(query.startType));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    url: "/backend/websocket",
    method: "get",
    response: ({ query }) => {
      const found = all.find(v => v.id === Number(query.id)) ?? all[0];
      return { success: true, data: found };
    }
  },
  {
    url: "/backend/websocket",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/websocket",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/websocket",
    method: "delete",
    response: () => ({ success: true, data: null })
  }
]);
