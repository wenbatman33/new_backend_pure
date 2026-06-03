import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 運動種類假資料
const sports = ["Basketball", "Soccer", "Baseball", "Tennis", "eSports"];
const leagues = ["NBA", "WNBA", "EPL", "MLB", "ATP"];
const teams = ["Lakers", "Warriors", "Arsenal", "Yankees", "Nadal"];
const betTypes = ["让分", "大小", "独赢", "波胆"];

// 列表假資料
const list = Array.from({ length: 16 }).map((_, i) => {
  const betItemArr = [
    {
      competitionName: leagues[i % leagues.length],
      homeTeamName: teams[i % teams.length],
      awayTeamName: teams[(i + 1) % teams.length],
      handicap: `-${(i % 3) + 1}.5`,
      odds: (1.8 + (i % 5) * 0.1).toFixed(2),
      betOption: i % 2 === 0 ? "Home" : "Away"
    }
  ];
  return {
    betID: 9000000 + i,
    memberID: 100000 + i,
    memberAccount: `member${i + 1}`,
    gameGroupName: `游戏组${(i % 4) + 1}`,
    sport: sports[i % sports.length],
    league: leagues[i % leagues.length],
    homeTeam: teams[i % teams.length],
    awayTeam: teams[(i + 1) % teams.length],
    eventTime: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 19:30:00`,
    betType: betTypes[i % betTypes.length],
    betOption: i % 2 === 0 ? "主队" : "客队",
    oddsStyle: "欧洲盘",
    odds: (1.8 + (i % 5) * 0.1).toFixed(2),
    isLive: i % 2,
    betSingleCombo: i % 3 === 0 ? 1 : 2,
    betItem: JSON.stringify(betItemArr),
    betAmountText: `${(i + 1) * 100}.00`,
    winAmountText: `${(i + 1) * 150}.00`,
    betTime: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 18:00:00`,
    settlementTime: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 22:00:00`
  };
});

export default defineFakeRoute([
  {
    // 聯賽投注記錄列表
    url: "/backend/bettinglog/league/bet/list",
    method: "get",
    response: () => {
      return {
        success: true,
        data: {
          list,
          total: {
            totalBetAmountText: "13600.00",
            totalWinAmountText: "20400.00"
          }
        }
      };
    }
  },
  {
    // 運動種類（game group）下拉
    url: "/backend/game/dropdown/list/sport",
    method: "get",
    response: () => {
      return {
        success: true,
        data: {
          gameGroup: [
            { id: 25, name: "体育" },
            { id: 26, name: "电竞" },
            { id: 27, name: "真人" }
          ]
        }
      };
    }
  },
  {
    // betting log 相關下拉（运动/联赛/队伍/玩法）
    url: "/backend/game/dropdown/list/bettingLog",
    method: "get",
    response: () => {
      return {
        success: true,
        data: {
          sport: sports,
          league: leagues,
          team: teams,
          betType: betTypes
        }
      };
    }
  }
]);
