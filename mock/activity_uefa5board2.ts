import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 聯賽：3 英超 / 4 西甲 / 5 意甲 / 6 德甲 / 7 法甲
const leagues = [
  { league: 3, name: "英超", isActive: 1 },
  { league: 4, name: "西甲", isActive: 1 },
  { league: 5, name: "意甲", isActive: 1 },
  { league: 6, name: "德甲", isActive: 0 },
  { league: 7, name: "法甲", isActive: 1 }
];

const teamNames = [
  "曼城",
  "阿森纳",
  "利物浦",
  "切尔西",
  "曼联",
  "热刺",
  "纽卡斯尔",
  "阿斯顿维拉",
  "布莱顿",
  "西汉姆",
  "皇家马德里",
  "巴塞罗那",
  "马德里竞技",
  "塞维利亚",
  "瓦伦西亚",
  "尤文图斯",
  "国际米兰",
  "AC米兰"
];

// 預設產生英超(3) 18 支球隊資料
const buildList = (league: number) =>
  teamNames.map((team, i) => {
    const matchTimes = 30 + (i % 5);
    const over = 10 + (i % 8);
    const draw = 5 + (i % 4);
    const under = matchTimes - over - draw;
    return {
      worldCupTeamId: league * 100 + i + 1,
      league,
      team,
      rank: i + 1,
      matchTimes,
      over,
      draw,
      under,
      overPercent: Math.round((over / matchTimes) * 1000) / 10,
      drawPercent: Math.round((draw / matchTimes) * 1000) / 10,
      underPercent: Math.round((under / matchTimes) * 1000) / 10,
      updatedUser: i % 3 === 0 ? "admin" : "operator01",
      updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 12:00:00`
    };
  });

export default defineFakeRoute([
  // 聯賽下拉
  {
    url: "/backend/league_schedule/list",
    method: "get",
    response: () => ({ success: true, data: { list: leagues } })
  },
  // board2 列表
  {
    url: "/backend/match/uefa5/board2",
    method: "get",
    response: ({ query }) => {
      const league = Number(query.league) || 3;
      let list = buildList(league);
      if (query.team) {
        list = list.filter(v => v.team.includes(query.team));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  // board2 全部儲存
  {
    url: "/backend/match/uefa5/board2",
    method: "post",
    response: () => ({ success: true, data: null })
  }
]);
