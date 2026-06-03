import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 赛程假资料（id 对应竞猜名单的 worldCupScheduleId）
const schedules = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  awayTeam: i * 2 + 1,
  homeTeam: i * 2 + 2,
  matchType: (i % 2) + 1,
  matchGroup: (i % 8) + 1,
  eventTime: `2026-06-${String((i % 28) + 1).padStart(2, "0")} 20:00:00`
}));

// 队伍假资料
const teams = Array.from({ length: 20 }).map((_, i) => ({
  id: i + 1,
  team: `队伍${i + 1}`
}));

// 竞猜会员名单假资料
const members = Array.from({ length: 16 }).map((_, i) => ({
  id: i + 1,
  memberId: 100000 + i,
  memberAccount: `member${i + 1}`,
  createdAt: `2026-06-${String((i % 28) + 1).padStart(2, "0")} 12:30:00`,
  awayQuiz: i % 5,
  homeQuiz: (i + 2) % 5,
  worldCupScheduleId: (i % schedules.length) + 1
}));

export default defineFakeRoute([
  {
    url: "/backend/world_cup/quiz/member",
    method: "get",
    response: ({ query }) => {
      let list = members;
      if (query.memberAccount) {
        list = list.filter(v => v.memberAccount.includes(query.memberAccount));
      }
      if (query.awayQuiz !== undefined && query.awayQuiz !== "") {
        list = list.filter(v => String(v.awayQuiz) === String(query.awayQuiz));
      }
      if (query.homeQuiz !== undefined && query.homeQuiz !== "") {
        list = list.filter(v => String(v.homeQuiz) === String(query.homeQuiz));
      }
      if (query.worldCupScheduleId) {
        list = list.filter(
          v => String(v.worldCupScheduleId) === String(query.worldCupScheduleId)
        );
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
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
  }
]);
