import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 自定義聯賽報表 mock
// 聯賽清單 [GET] /backend/league/custom/list
// 報表列表 [GET] /backend/league/custom/log/list
// 報表詳情 [GET] /backend/league/custom/log/list/detail

// 聯賽清單（篩選器選項）
const leagueList = [
  { leagueID: 1, leagueName: "英超" },
  { leagueID: 2, leagueName: "西甲" },
  { leagueID: 3, leagueName: "意甲" },
  { leagueID: 4, leagueName: "德甲" },
  { leagueID: 5, leagueName: "法甲" },
  { leagueID: 6, leagueName: "NBA" }
];

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default defineFakeRoute([
  {
    url: "/backend/league/custom/list",
    method: "get",
    response: () => ({ success: true, data: { list: leagueList } })
  },
  {
    url: "/backend/league/custom/log/list",
    method: "get",
    response: ({ query }) => {
      const ids = String(query.leagueID || "1")
        .split(",")
        .map(s => parseInt(s))
        .filter(n => !isNaN(n));
      // 產 14 天日期列
      const days = 14;
      const list = Array.from({ length: days }).map((_, i) => {
        const date = `2026-05-${String(i + 1).padStart(2, "0")}`;
        const cellList = ids.map(leagueID => {
          const betPeople = rand(0, 200);
          const betAmount = rand(10000, 5000000);
          const winAmount = rand(-2000000, 2000000);
          return {
            leagueID,
            betPeople,
            betAmount,
            betAmountText: betAmount.toLocaleString(),
            totalBetAmount: betAmount,
            totalBetAmountText: betAmount.toLocaleString(),
            winAmount,
            winAmountText: winAmount.toLocaleString()
          };
        });
        return { date, list: cellList };
      });
      // 總計（每聯賽彙總）
      const total = ids.map(leagueID => {
        const totalBetPeople = rand(500, 3000);
        const totalBetAmount = rand(1000000, 50000000);
        const totalWinAmount = rand(-10000000, 10000000);
        return {
          leagueID,
          totalBetPeople,
          totalBetAmount,
          totalBetAmountText: totalBetAmount.toLocaleString(),
          totalTotalBetAmount: totalBetAmount,
          totalTotalBetAmountText: totalBetAmount.toLocaleString(),
          totalWinAmount,
          totalWinAmountText: totalWinAmount.toLocaleString()
        };
      });
      return { success: true, data: { list, total } };
    }
  },
  {
    url: "/backend/league/custom/log/list/detail",
    method: "get",
    response: () => {
      const list = Array.from({ length: rand(10, 18) }).map((_, i) => {
        const betAmount = rand(1000, 500000);
        const winAmount = rand(-200000, 200000);
        return {
          memberAccount: `member${String(i + 1).padStart(3, "0")}`,
          betCount: rand(1, 80),
          betAmount,
          winAmount
        };
      });
      const total = {
        totalBetCount: list.reduce((s, v) => s + v.betCount, 0),
        totalBetAmount: list.reduce((s, v) => s + v.betAmount, 0),
        totalWinAmount: list.reduce((s, v) => s + v.winAmount, 0)
      };
      return { success: true, data: { list, total } };
    }
  }
]);
