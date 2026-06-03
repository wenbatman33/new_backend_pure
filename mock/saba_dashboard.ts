import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 沙巴儀表板假資料產生器
const sports = ["足球", "篮球", "网球", "棒球", "电竞"];
const leagues = ["英超", "西甲", "NBA", "MLB", "中超", "意甲", "德甲"];
const teams = ["曼联", "皇马", "湖人", "勇士", "巨人", "国米", "拜仁"];
const betTypes = ["让球", "大小", "独赢", "波胆", "半全场"];

const rnd = (min: number, max: number) =>
  Math.round((Math.random() * (max - min) + min) * 100) / 100;

// 排名類列表
function rankList(n = 12) {
  return Array.from({ length: n }).map((_, i) => {
    const turnover = rnd(10000, 500000);
    const winloss = rnd(-50000, 80000);
    return {
      Rank: i + 1,
      SportType: (i % sports.length) + 1,
      SportName: sports[i % sports.length],
      LeagueId: 1000 + i,
      LeagueName: leagues[i % leagues.length],
      TeamName: teams[i % teams.length],
      BetTypeName: betTypes[i % betTypes.length],
      HomeName: teams[i % teams.length],
      AwayName: teams[(i + 1) % teams.length],
      PlayerCount: Math.round(rnd(10, 500)),
      BetCount: Math.round(rnd(50, 3000)),
      BetTurnOver: turnover,
      BetWinloss: winloss,
      Margin: rnd(1, 15),
      BetTurnOverPercentage: rnd(1, 40),
      BetWinlossPercentage: rnd(-20, 30),
      IsLive: i % 2,
      MatchId: 8000 + i,
      MatchName: `${teams[i % teams.length]} vs ${teams[(i + 1) % teams.length]}`
    };
  });
}

// 站台每日概況
function overviewList(n = 14) {
  return Array.from({ length: n }).map((_, i) => ({
    Date: `2026-05-${String(i + 1).padStart(2, "0")}`,
    PlayerCount: Math.round(rnd(100, 2000)),
    BetTurnOver: rnd(100000, 900000),
    BetWinloss: rnd(-80000, 120000),
    Margin: rnd(1, 12),
    BasketballPlayerCount: Math.round(rnd(50, 800)),
    BasketballTurnOver: rnd(50000, 400000),
    BasketballWinloss: rnd(-40000, 60000),
    BasketballMargin: rnd(1, 10),
    SoccerPlayerCount: Math.round(rnd(50, 1000)),
    SoccerTurnOver: rnd(60000, 500000),
    SoccerWinloss: rnd(-50000, 70000),
    SoccerMargin: rnd(1, 10)
  }));
}

const ok = (Data: any[]) => ({ success: true, data: { Data } });

// 所有會被呼叫的 endpoint
const rankUrls = [
  // bysite
  "/game/bo/saba/recentlysportsrankbysite",
  "/game/bo/saba/recentlyleaguerankbysite",
  "/game/bo/saba/recentlyleaguebettyperankbysite",
  "/game/bo/saba/recentlymatchrankbysite",
  "/game/bo/saba/recentlybetsportsrankbysite",
  "/game/bo/saba/recentlybetleaguerankbysite",
  "/game/bo/saba/recentlybetteamrankbysite",
  // bypool
  "/game/bo/saba/recentlysportsrankbypool",
  "/game/bo/saba/recentlyleaguerankbypool",
  "/game/bo/saba/recentlyleaguebettyperankbypool",
  "/game/bo/saba/recentlymatchrankbypool",
  "/game/bo/saba/recentlybetsportsrankbypool",
  "/game/bo/saba/recentlybetleaguerankbypool",
  "/game/bo/saba/recentlybetteamrankbypool"
];

const rankRoutes = rankUrls.map(url => ({
  url,
  method: "get" as const,
  response: () => ok(rankList())
}));

export default defineFakeRoute([
  {
    url: "/game/bo/saba/overviewbysite",
    method: "get",
    response: () => ok(overviewList())
  },
  {
    url: "/game/bo/saba/recentlybetoverviewbysite",
    method: "get",
    response: () =>
      ok([{ BetTurnOver: rnd(1000000, 5000000), BetWinloss: rnd(-200000, 600000) }])
  },
  ...rankRoutes
]);
