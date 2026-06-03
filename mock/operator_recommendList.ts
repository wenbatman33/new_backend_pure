import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 賽事種類名稱：1 足球 / 2 籃球
const sportsNames = ["足球", "篮球"];
const leagues = [
  "英格兰超级联赛",
  "西班牙甲级联赛",
  "意大利甲级联赛",
  "德国甲级联赛",
  "NBA",
  "CBA"
];
const teams = [
  ["曼联", "切尔西"],
  ["皇家马德里", "巴塞罗那"],
  ["尤文图斯", "AC米兰"],
  ["拜仁慕尼黑", "多特蒙德"],
  ["湖人", "勇士"],
  ["凯尔特人", "热火"]
];

// 產生 16 筆假資料
const all = Array.from({ length: 16 }).map((_, i) => {
  const sportIdx = i % 2; // 0 足球 / 1 篮球
  const pair = teams[i % teams.length];
  const day = String((i % 28) + 1).padStart(2, "0");
  return {
    id: 1000 + i,
    sportsName: sportsNames[sportIdx],
    leagueName: leagues[i % leagues.length],
    eventID: `EV${20260600 + i}`,
    eventTime: `2026-06-${day} 20:00:00`,
    homeTeam: pair[0],
    awayTeam: pair[1],
    // 推薦項目：1 賽前投注 / 2 直播賽事
    recommendItem: i % 3 === 0 ? [1, 2] : [1],
    hasStreaming: (i % 2) + 1,
    isLive: i % 2 === 0 ? 1 : 2,
    recommendStartTime: i % 4 === 0 ? "" : `2026-06-${day} 10:00:00`,
    recommendEndTime: i % 4 === 0 ? "" : `2026-06-${day} 22:00:00`,
    updatedAt: `2026-05-${day} 15:30:00`,
    updatedUser: i % 3 === 0 ? "admin" : "operator01"
  };
});

export default defineFakeRoute([
  // 推薦賽事列表
  {
    url: "/backend/promotion/gameevent/recommendlist",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.sportsName) {
        const idx = Number(query.sportsName) - 1;
        if (sportsNames[idx]) {
          list = list.filter(v => v.sportsName === sportsNames[idx]);
        }
      }
      if (query.hasStreaming) {
        list = list.filter(v => v.hasStreaming === Number(query.hasStreaming));
      }
      if (query.isLive) {
        list = list.filter(v => v.isLive === Number(query.isLive));
      }
      if (query.keyWord) {
        const kw = String(query.keyWord);
        list = list.filter(
          v =>
            v.leagueName.includes(kw) ||
            v.homeTeam.includes(kw) ||
            v.awayTeam.includes(kw)
        );
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  // 編輯推薦上架時間
  {
    url: "/backend/promotion/gameevent/editrecommendtime",
    method: "put",
    response: () => ({ success: true, data: null })
  }
]);
