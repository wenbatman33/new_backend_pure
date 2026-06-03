import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 抢红包(进球抢红包)模組 mock
// 状态：1 进行中 / 2 待启用 / 3 已结束 / 4 即将启用
const durations = [5, 10, 15, 20, 30];
const users = ["admin", "operator01", "operator02"];

const list = Array.from({ length: 16 }).map((_, i) => {
  const status = (i % 4) + 1;
  return {
    id: i + 1,
    name: `进球抢红包活动 ${i + 1}`,
    eventTime: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 20:30:00`,
    status,
    time: durations[i % durations.length],
    people: 100 + i * 13,
    sendTime:
      status === 1 || status === 3
        ? `2026-05-${String((i % 28) + 1).padStart(2, "0")} 20:31:00`
        : "",
    updatedUser: users[i % users.length]
  };
});

// 单笔明细(getLotteryById 回传结构，含 verifyData / bonus 等)
function detailOf(id: number) {
  const base = list.find(v => v.id === id) ?? list[0];
  return {
    ...base,
    amountMax: 100000,
    peopleMax: 500,
    withdrawLimit: 3,
    verifyData: [
      { verifyType: 1, verifyAmount: 1000 },
      { verifyType: 2, verifyAmount: 2000 }
    ],
    bonus: [
      { amount: 18, percent: 50 },
      { amount: 88, percent: 30 },
      { amount: 188, percent: 20 }
    ],
    matchScheduleTimes: 3,
    matchScheduleId: 0,
    websocketDeeplinkLink: "1",
    websocketTitle: "恭喜发财，红包拿来！",
    websocketImaage: ""
  };
}

const logList = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  updatedAt: `2026-05-2${i % 9} 12:0${i % 6}:00`,
  updatedUser: users[i % users.length],
  item: i % 2 === 0 ? "状态" : "奖励设定",
  content: i % 2 === 0 ? "由待启用改为进行中" : "调整奖励概率"
}));

export default defineFakeRoute([
  {
    url: "/backend/red_packet/list",
    method: "get",
    response: ({ query }) => {
      let result = [...list];
      if (query.name) {
        result = result.filter(v => v.name.includes(query.name));
      }
      if (query.time) {
        result = result.filter(v => v.time === Number(query.time));
      }
      return { success: true, data: { list: result, total: result.length } };
    }
  },
  {
    url: "/backend/red_packet",
    method: "get",
    response: ({ query }) => {
      return { success: true, data: detailOf(Number(query.id)) };
    }
  },
  {
    url: "/backend/red_packet",
    method: "post",
    response: () => ({ success: true, data: { id: list.length + 1 } })
  },
  {
    url: "/backend/red_packet",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/red_packet",
    method: "delete",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/red_packet/status",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/red_packet/log",
    method: "get",
    response: () => ({ success: true, data: { list: logList, total: logList.length } })
  },
  {
    url: "/file/file/upload",
    method: "post",
    response: () => ({ success: true, data: { url: "mock/red_packet_broadcast.png" } })
  }
]);
