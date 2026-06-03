import { defineFakeRoute } from "vite-plugin-fake-server/client";

// UEFA5 board1 賽事積分榜假資料
const teams = [
  "曼城",
  "阿森纳",
  "利物浦",
  "切尔西",
  "热刺",
  "曼联",
  "纽卡斯尔",
  "阿斯顿维拉",
  "布莱顿",
  "西汉姆联",
  "皇家马德里",
  "巴塞罗那",
  "拜仁慕尼黑",
  "巴黎圣日耳曼",
  "国际米兰",
  "尤文图斯"
];

const board1List = teams.map((team, i) => {
  const win = (i * 3) % 11;
  const tie = (i * 2) % 5;
  const lose = (i + 1) % 7;
  const matchTimes = win + tie + lose;
  return {
    worldCupTeamId: i + 1,
    year: 2026,
    league: 3,
    matchType: (i % 5) + 1,
    matchGroup: (i % 8) + 1,
    team,
    rank: i + 1,
    matchTimes,
    win,
    tie,
    lose,
    difference: win - lose,
    winPercent: matchTimes ? Math.round((win / matchTimes) * 100) : 0,
    score: win * 3 + tie,
    updatedUser: i % 3 === 0 ? "admin" : "operator01",
    updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 10:30:00`
  };
});

// 聯賽 schedule 下拉假資料
const leagueScheduleList = [
  { league: 3, name: "英超", isActive: 1, eventTime: "2026-05-01 20:00:00" },
  { league: 4, name: "西甲", isActive: 1, eventTime: "2026-05-02 20:00:00" },
  { league: 5, name: "意甲", isActive: 1, eventTime: "2026-05-03 20:00:00" },
  { league: 6, name: "德甲", isActive: 0, eventTime: "2026-05-04 20:00:00" },
  { league: 13, name: "2024UEFA", isActive: 1, eventTime: "2026-05-05 20:00:00" }
];

export default defineFakeRoute([
  {
    url: "/backend/match/uefa5/board1",
    method: "get",
    response: ({ query }) => {
      let list = board1List;
      if (query.team) {
        list = list.filter(v => v.team.includes(query.team));
      }
      if (query.matchType && Number(query.matchType) !== 0) {
        list = list.filter(v => v.matchType === Number(query.matchType));
      }
      if (query.matchGroup) {
        const groups = String(query.matchGroup)
          .split(",")
          .map(Number);
        list = list.filter(v => groups.includes(v.matchGroup));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    url: "/backend/match/uefa5/board1",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/league_schedule/list",
    method: "get",
    response: () => ({
      success: true,
      data: { list: leagueScheduleList, total: leagueScheduleList.length }
    })
  }
]);
