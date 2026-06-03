import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 廠商下拉
const groups = [
  { value: 1, label: "BG真人" },
  { value: 2, label: "PG电子" },
  { value: 3, label: "SBO体育" },
  { value: 4, label: "AG电竞" }
];

// 遊戲下拉
const games = [
  { value: 101, label: "百家乐", gameGroup: 1 },
  { value: 102, label: "龙虎斗", gameGroup: 1 },
  { value: 201, label: "麻将胡了", gameGroup: 2 },
  { value: 301, label: "英超联赛", gameGroup: 3 }
];

const statusList = [1, 2, 3, 4];
const oddsStyles = ["香港盘", "马来盘", "欧洲盘", "印尼盘"];

// 模擬一筆 betItem（序列化為 JSON 字串，與後端一致）
function makeBetItem(i: number) {
  return JSON.stringify([
    {
      playName: `让球盘(${i})`,
      eventName: `主队 vs 客队(${1000 + i})`,
      betOption: `主队 -0.5(${2000 + i})`,
      gameResult: i % 2 === 0 ? "赢" : "输",
      odds: (1.5 + (i % 5) * 0.1).toFixed(2),
      oddsStyle: oddsStyles[i % oddsStyles.length],
      sportsname: "足球",
      competitionName: "英格兰超级联赛",
      homeTeamName: "曼联",
      awayTeamName: "切尔西",
      deviceType: i % 2 === 0 ? "PC" : "Mobile",
      isLive: i % 3 === 0,
      preSettle: i % 4 === 0,
      platformName: "SBO",
      tableCode: `T${i}`
    }
  ]);
}

const all = Array.from({ length: 16 }).map((_, i) => {
  const total = 100 + (i % 5) * 50;
  const win = (i % 2 === 0 ? 1 : -1) * (i * 12);
  return {
    betID: `BET${20260601000 + i}`,
    memberID: 100000 + i,
    memberAccount: `member${i + 1}`,
    gameGroup: groups[i % groups.length].label,
    gameGroupID: groups[i % groups.length].value,
    gameListName: games[i % games.length].label,
    gameTypeID: (i % 4) + 1,
    oddsStyle: oddsStyles[i % oddsStyles.length],
    odds: (1.8 + (i % 3) * 0.2).toFixed(2),
    betSingleCombo: i % 5 === 0 ? 2 : 1,
    betSingleComboIntro:
      i % 5 === 0
        ? [
            {
              betOptionID: 1,
              comboMatchesCount: 2,
              comboBetsCount: 1,
              totalComboBetsCount: 3
            }
          ]
        : [],
    eventDateTime: `2026-06-0${(i % 9) + 1} 20:00:00`,
    eventID: `EV${5000 + i}`,
    totalBetAmount: total,
    backendBetAmount: total,
    eventTurnover: total - 10,
    returnBetAmount: total - 5,
    winAmount: win,
    settlementAmount: total + win,
    betTimeLocal: `2026-06-0${(i % 9) + 1} 19:55:00`,
    settlementTimeLocal: `2026-06-0${(i % 9) + 1} 22:10:00`,
    betTime: `2026-06-0${(i % 9) + 1} 11:55:00`,
    settlementTime: `2026-06-0${(i % 9) + 1} 14:10:00`,
    betLogStatus: statusList[i % statusList.length],
    response: JSON.stringify({ betId: `BET${20260601000 + i}`, raw: "demo data" }),
    resultUrl: i % 3 === 0 ? "https://example.com/result/" + i : "",
    showDetailLinkButton: i % 2,
    betItem: makeBetItem(i)
  };
});

export default defineFakeRoute([
  {
    url: "/backend/bettinglog/record",
    method: "get",
    response: ({ query }) => {
      let list = all;
      if (query.memberAccount) {
        list = list.filter(v => v.memberAccount.includes(query.memberAccount));
      }
      if (query.betId) {
        list = list.filter(v => v.betID.includes(query.betId));
      }
      if (query.gameGroupID) {
        list = list.filter(v => v.gameGroupID === Number(query.gameGroupID));
      }
      if (query.betLogStatus) {
        list = list.filter(v => v.betLogStatus === Number(query.betLogStatus));
      }
      // 合計列（後端 total 為物件）
      const total = {
        totalBetAmount: list.reduce((s, v) => s + v.totalBetAmount, 0),
        backendBetAmount: list.reduce((s, v) => s + v.backendBetAmount, 0),
        winAmount: list.reduce((s, v) => s + v.winAmount, 0),
        settlementAmount: list.reduce((s, v) => s + v.settlementAmount, 0)
      };
      return {
        success: true,
        data: { list, total, totalCount: list.length }
      };
    }
  },
  {
    url: "/backend/bettinglog/group/list",
    method: "get",
    response: () => ({ success: true, data: { list: groups } })
  },
  {
    url: "/backend/bettinglog/game/list",
    method: "get",
    response: () => ({ success: true, data: { list: games } })
  },
  {
    url: "/game/bo/result/detaillink",
    method: "get",
    response: () => ({
      success: true,
      data: { resultLink: "https://example.com/detail" }
    })
  }
]);
