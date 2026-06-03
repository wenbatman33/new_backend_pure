import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 隊伍假資料
const teams = [
  "巴西",
  "阿根廷",
  "法国",
  "德国",
  "西班牙",
  "英格兰",
  "葡萄牙",
  "荷兰",
  "比利时",
  "克罗地亚",
  "乌拉圭",
  "日本"
].map((team, i) => ({ id: i + 1, team }));

// 賽程假資料 15 筆
const schedules = Array.from({ length: 15 }).map((_, i) => {
  const awayId = (i % teams.length) + 1;
  const homeId = ((i + 3) % teams.length) + 1;
  return {
    id: i + 1,
    eventTime: `2026-06-${String((i % 28) + 1).padStart(2, "0")} 20:00:00`,
    matchType: (i % 2) + 1, // 1 小組賽 / 2 淘汰賽
    matchGroup: (i % 13) + 1,
    awayTeam: awayId,
    homeTeam: homeId,
    awayScore: i % 4,
    homeScore: (i + 1) % 4,
    awayResult: String((i % 3) + 1),
    homeResult: String(((i + 1) % 3) + 1),
    awayDiffer: (i % 4) - ((i + 1) % 4),
    homeDiffer: ((i + 1) % 4) - (i % 4),
    awayPoint: (i % 4) * 3,
    homePoint: ((i + 1) % 4) * 3,
    status: (i % 4) + 1, // 1~4
    isRed: (i % 2) + 1, // 1 Y / 2 N
    eventId: `EVT${1000 + i}`,
    updatedUser: i % 3 === 0 ? "admin" : "operator01",
    updatedAt: `2026-06-${String((i % 28) + 1).padStart(2, "0")} 18:30:00`
  };
});

export default defineFakeRoute([
  // 隊伍列表
  {
    url: "/backend/world_cup/team",
    method: "get",
    response: () => ({ success: true, data: { list: teams, total: teams.length } })
  },
  // 賽程列表
  {
    url: "/backend/world_cup/schedule/list",
    method: "get",
    response: ({ query }) => {
      let list = schedules;
      if (query.status && Number(query.status) !== 0) {
        list = list.filter(v => v.status === Number(query.status));
      }
      if (query.matchType && Number(query.matchType) !== 0) {
        list = list.filter(v => v.matchType === Number(query.matchType));
      }
      if (query.matchGroup && Number(query.matchGroup) !== 0) {
        list = list.filter(v => v.matchGroup === Number(query.matchGroup));
      }
      if (query.team) {
        const ids = teams
          .filter(t => t.team.includes(query.team))
          .map(t => t.id);
        list = list.filter(
          v => ids.includes(v.awayTeam) || ids.includes(v.homeTeam)
        );
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  // 賽程明細（依 id）
  {
    url: "/backend/world_cup/schedule",
    method: "get",
    response: ({ query }) => {
      const found =
        schedules.find(v => String(v.id) === String(query.id)) ?? schedules[0];
      return { success: true, data: found };
    }
  },
  // 新增賽程
  {
    url: "/backend/world_cup/schedule",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 編輯賽程
  {
    url: "/backend/world_cup/schedule",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 刪除賽程
  {
    url: "/backend/world_cup/schedule",
    method: "delete",
    response: () => ({ success: true, data: null })
  }
]);
