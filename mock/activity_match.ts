import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 联赛对照（与 enums.ts leagueList 一致）
const leagueNames: Record<number, string> = {
  1: "2022_world_cup",
  2: "NBA",
  3: "英超",
  4: "西甲",
  5: "意甲"
};

const teamNames = [
  "湖人",
  "勇士",
  "凯尔特人",
  "公牛",
  "热火",
  "马刺",
  "火箭",
  "雷霆"
];

// 列表假资料 15 笔
const all = Array.from({ length: 15 }).map((_, i) => {
  const league = (i % 5) + 1;
  const redPacket = i % 2;
  return {
    id: i + 1,
    eventTime: `2026-06-${String((i % 28) + 1).padStart(2, "0")} 20:00:00`,
    league,
    matchType: (i % 5) + 1,
    matchGroup: (i % 8) + 1,
    awayTeam: ((i % 8) + 1).toString(),
    homeTeam: (((i + 1) % 8) + 1).toString(),
    awayTeamName: teamNames[i % teamNames.length],
    homeTeamName: teamNames[(i + 1) % teamNames.length],
    awayScore: i % 3,
    homeScore: (i + 1) % 3,
    redPacket,
    redPacketStartTime: redPacket
      ? `2026-06-${String((i % 28) + 1).padStart(2, "0")} 19:00:00`
      : "",
    redPacketEndTime: redPacket
      ? `2026-06-${String((i % 28) + 1).padStart(2, "0")} 21:40:00`
      : "",
    remark: `测试赛程备注 ${i + 1}`,
    updatedUser: i % 3 === 0 ? "admin" : "operator01",
    updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 10:30:00`,
    eventId: `evt_${1000 + i}`
  };
});

export default defineFakeRoute([
  // 赛程列表
  {
    url: "/backend/match/schedule/list",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.league) {
        list = list.filter(v => String(v.league) === String(query.league));
      }
      if (query.matchType) {
        list = list.filter(v => String(v.matchType) === String(query.matchType));
      }
      if (query.matchGroup) {
        list = list.filter(v => String(v.matchGroup) === String(query.matchGroup));
      }
      if (query.redPacket !== undefined && query.redPacket !== "") {
        list = list.filter(v => String(v.redPacket) === String(query.redPacket));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  // 赛程明细（编辑用）
  {
    url: "/backend/match/schedule",
    method: "get",
    response: ({ query }) => {
      const item = all.find(v => String(v.id) === String(query.id)) ?? all[0];
      return { success: true, data: { ...item } };
    }
  },
  // 新增
  {
    url: "/backend/match/schedule",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 编辑
  {
    url: "/backend/match/schedule",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 删除
  {
    url: "/backend/match/schedule",
    method: "delete",
    response: () => ({ success: true, data: null })
  },
  // 联赛清单
  {
    url: "/backend/league_schedule/list",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: Object.keys(leagueNames).map(k => ({
          league: Number(k),
          name: leagueNames[Number(k)],
          isActive: 1
        }))
      }
    })
  },
  // 队伍清单（依联赛）
  {
    url: "/backend/world_cup/team",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: teamNames.map((team, idx) => ({ id: idx + 1, team }))
      }
    })
  }
]);
