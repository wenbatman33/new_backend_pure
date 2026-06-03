import { defineFakeRoute } from "vite-plugin-fake-server/client";

/** 產生單筆遊戲投注紀錄假資料 */
function makeRow(i: number) {
  const bet = 100 + i * 13.5;
  const win = (i % 3 === 0 ? -1 : 1) * (50 + i * 7.2);
  const settlement = bet + win;
  return {
    memberID: 10000 + i,
    memberAccount: `member${i}`,
    gameAccount: `lm_acc_${i}`,
    gameListName: `乐享游戏${(i % 5) + 1}`,
    gameListID: 200 + (i % 5),
    betID: `LM${20260603000000 + i}`,
    totalBetAmount: bet,
    backendBetAmount: bet * 0.9,
    eventTurnover: bet * 0.5,
    returnBetAmount: bet * 0.8,
    winAmount: win,
    settlementAmount: settlement,
    betTimeLocal: "2026-06-02 10:00:00",
    settlementTimeLocal: "2026-06-02 10:05:00",
    betTime: "2026-06-02 02:00:00",
    settlementTime: "2026-06-02 02:05:00",
    betLogStatus: (i % 4) + 1,
    odds: Number((1 + i * 0.05).toFixed(2)),
    oddsType: (i % 9) + 1,
    response: `{"rawId":${i},"ok":true}`,
    betItem: `投注项目-${i}`
  };
}

function makeList(n: number) {
  return Array.from({ length: n }, (_, idx) => makeRow(idx + 1));
}

export default defineFakeRoute([
  {
    url: "/backend/bettinglog/luckmoney/record",
    method: "get",
    response: () => {
      const list = makeList(15);
      const total = {
        count: list.length,
        totalBetAmount: list.reduce((s, r) => s + r.totalBetAmount, 0),
        backendBetAmount: list.reduce((s, r) => s + r.backendBetAmount, 0),
        eventTurnover: list.reduce((s, r) => s + r.eventTurnover, 0),
        returnBetAmount: list.reduce((s, r) => s + r.returnBetAmount, 0),
        winAmount: list.reduce((s, r) => s + r.winAmount, 0),
        settlementAmount: list.reduce((s, r) => s + r.settlementAmount, 0)
      };
      return {
        success: true,
        data: { list, total }
      };
    }
  },
  {
    url: "/backend/bettinglog/luckmoney/group/list",
    method: "get",
    response: () => {
      return {
        success: true,
        data: {
          list: [
            { ID: 1, name: "群组A" },
            { ID: 2, name: "群组B" },
            { ID: 3, name: "群组C" }
          ]
        }
      };
    }
  },
  {
    url: "/backend/bettinglog/luckmoney/game/list",
    method: "get",
    response: () => {
      return {
        success: true,
        data: {
          list: [
            { ID: 200, name: "乐享游戏1" },
            { ID: 201, name: "乐享游戏2" },
            { ID: 202, name: "乐享游戏3" }
          ]
        }
      };
    }
  }
]);
