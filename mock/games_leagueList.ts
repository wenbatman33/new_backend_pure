import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 運動種類
const sports = ["足球", "篮球", "网球", "棒球", "电竞", "排球"];
const users = ["admin", "operator01", "operator02"];

const all = Array.from({ length: 16 }).map((_, i) => ({
  id: i + 1,
  leagueID: 9000 + i,
  leagueName: `联赛 ${i + 1}`,
  sportName: sports[i % sports.length],
  // 有些有 logo、有些没有，方便验证两种渲染
  leagueLogo: i % 3 === 0 ? "" : `league/logo_${i + 1}.png`,
  updatedAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 14:20:00`,
  updateUser: users[i % users.length]
}));

export default defineFakeRoute([
  {
    // 列表（GET）与编辑（PUT）共用同一 endpoint
    url: "/backend/game/game_group_league_list",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.leagueID) {
        list = list.filter(v => String(v.leagueID).includes(query.leagueID));
      }
      if (query.leagueName) {
        list = list.filter(v => v.leagueName.includes(query.leagueName));
      }
      const total = list.length;
      const page = Number(query.page) || 1;
      const pageSize = Number(query.pageSize) || 10;
      const start = (page - 1) * pageSize;
      return {
        success: true,
        data: { list: list.slice(start, start + pageSize), total }
      };
    }
  },
  {
    url: "/backend/game/game_group_league_list",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    // 共用图片上传
    url: "/file/file/upload",
    method: "post",
    response: () => ({
      success: true,
      data: { url: "league/logo_uploaded.png" }
    })
  }
]);
