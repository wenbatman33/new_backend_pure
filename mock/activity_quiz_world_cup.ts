import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 队伍假资料
const teams = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  team: `Team ${String.fromCharCode(65 + i)}`
}));

// 赛程假资料（与 quiz 透过 worldCupScheduleId 关联）
const schedules = Array.from({ length: 15 }).map((_, i) => ({
  id: i + 1,
  awayTeam: ((i % 8) + 1),
  homeTeam: (((i + 1) % 8) + 1),
  matchType: (i % 2) + 1,
  matchGroup: (i % 8) + 1,
  eventTime: `2026-06-${String((i % 28) + 1).padStart(2, "0")} 20:00:00`
}));

// 竞猜假资料
const quizList = Array.from({ length: 15 }).map((_, i) => ({
  id: i + 1,
  worldCupScheduleId: i + 1,
  status: (i % 2) + 1,
  startTime: `2026-06-${String((i % 28) + 1).padStart(2, "0")} 10:00:00`,
  endTime: `2026-06-${String((i % 28) + 1).padStart(2, "0")} 19:00:00`,
  worldCupQuizMemberCnt: 100 + i * 7,
  updatedUser: i % 3 === 0 ? "admin" : "operator01",
  updatedAt: `2026-06-${String((i % 28) + 1).padStart(2, "0")} 21:30:00`
}));

export default defineFakeRoute([
  {
    url: "/backend/world_cup/team",
    method: "get",
    response: () => ({ success: true, data: { list: teams, total: teams.length } })
  },
  {
    url: "/backend/world_cup/schedule/list",
    method: "get",
    response: () => ({
      success: true,
      data: { list: schedules, total: schedules.length }
    })
  },
  {
    url: "/backend/world_cup/quiz/list",
    method: "get",
    response: ({ query }) => {
      let list = quizList;
      // 是否显示筛选：1 显示 / 2 隐藏 / 0 全部
      if (query.isLive && Number(query.isLive) !== 0) {
        list = list.filter(v => v.status === Number(query.isLive));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    url: "/backend/world_cup/quiz",
    method: "get",
    response: ({ query }) => {
      const id = Number(query.id);
      const found = quizList.find(v => v.id === id) ?? quizList[0];
      return { success: true, data: found };
    }
  },
  {
    url: "/backend/world_cup/quiz",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/world_cup/quiz/status",
    method: "put",
    response: () => ({ success: true, data: null })
  }
]);
