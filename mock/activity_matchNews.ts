import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 戰情文章（matchNews）模組 mock
// 涵蓋 endpoint：
//   GET    /backend/match/news/list
//   GET    /backend/match/news
//   PUT    /backend/match/news
//   DELETE /backend/match/news
//   PUT    /backend/match/news/status
//   GET    /backend/world_cup/team
//   GET    /backend/league_schedule/list

const teams = [
  "曼城", "皇馬", "拜仁", "巴黎", "利物浦", "巴薩",
  "國米", "阿森納", "尤文", "馬競", "切爾西", "多特"
];

// 假球隊清單（編輯時以 id 對照名稱）
const teamList = teams.map((team, i) => ({ id: i + 1, team }));

const newsAll = Array.from({ length: 15 }).map((_, i) => {
  const homeId = (i % teams.length) + 1;
  const awayId = ((i + 3) % teams.length) + 1;
  const league = (i % 15) + 1;
  return {
    id: i + 1,
    matchScheduleId: 5000 + i,
    eventTime: `2026-06-${String((i % 28) + 1).padStart(2, "0")} 20:00:00`,
    league,
    homeId,
    awayId,
    homeTeamName: teams[homeId - 1],
    awayTeamName: teams[awayId - 1],
    homeScore: String(i % 5),
    awayScore: String((i + 2) % 5),
    homePc: i % 3 === 0 ? "match/home_pc.png" : "",
    homeH5: i % 3 === 0 ? "match/home_h5.png" : "",
    awayPc: i % 4 === 0 ? "match/away_pc.png" : "",
    awayH5: i % 4 === 0 ? "match/away_h5.png" : "",
    homeExplain: `主隊說明 ${i + 1}`,
    awayExplain: `客隊說明 ${i + 1}`,
    recommend: `推薦文字 ${i + 1}`,
    matchExplain: `<p>賽事分析內容 ${i + 1}</p>`,
    status: (i % 2) + 1, // 1 顯示 / 2 隱藏
    updatedUser: i % 3 === 0 ? "admin" : "operator01",
    updatedAt: `2026-06-${String((i % 28) + 1).padStart(2, "0")} 12:00:00`
  };
});

// 聯賽賽程清單（搜尋下拉用）
const leagueScheduleList = [
  { name: "英超", league: 3, isActive: 1 },
  { name: "西甲", league: 4, isActive: 1 },
  { name: "意甲", league: 5, isActive: 1 },
  { name: "德甲", league: 6, isActive: 0 },
  { name: "2026FIFA_WC", league: 15, isActive: 1 }
];

export default defineFakeRoute([
  {
    url: "/backend/match/news/list",
    method: "get",
    response: ({ query }) => {
      let list = newsAll.slice();
      if (query.league !== undefined && query.league !== "") {
        list = list.filter(v => v.league === Number(query.league));
      }
      if (query.status !== undefined && query.status !== "") {
        list = list.filter(v => v.status === Number(query.status));
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    url: "/backend/match/news",
    method: "get",
    response: ({ query }) => {
      const found = newsAll.find(v => v.id === Number(query.id)) ?? newsAll[0];
      return { success: true, data: found };
    }
  },
  {
    url: "/backend/match/news",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/match/news",
    method: "delete",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/match/news/status",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/world_cup/team",
    method: "get",
    response: () => ({ success: true, data: { list: teamList } })
  },
  {
    url: "/backend/league_schedule/list",
    method: "get",
    response: () => ({ success: true, data: { list: leagueScheduleList } })
  }
]);
