import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 遊戲廠商 / 類型 假資料
const groups = ["PG", "PP", "JILI", "CQ9", "BNG"];
const types = ["电子", "捕鱼", "棋牌", "真人", "体育"];
const gameNames = [
  "麻将胡了",
  "金钱兔",
  "招财神龙",
  "龙之宝藏",
  "幸运财神",
  "森林舞会",
  "雷神之锤",
  "水浒传",
  "777",
  "宝石之轮",
  "财神到",
  "野狼传说",
  "甜蜜之恋",
  "黄金武士",
  "百搭小丑"
];

// 遊戲報表列表假資料（15 筆）
const gameList = Array.from({ length: 15 }).map((_, i) => {
  const betAmount = Math.round((Math.random() * 900000 + 10000) * 100) / 100;
  const winAmount =
    Math.round((Math.random() * 200000 - 100000) * 100) / 100;
  return {
    gameListId: 10000 + i,
    gameListName: gameNames[i % gameNames.length],
    gameGroupName: groups[i % groups.length],
    gameGroupID: (i % groups.length) + 1,
    gameTypeName: types[i % types.length],
    gameTypeID: (i % types.length) + 1,
    betAmount,
    winAmount,
    betPeople: Math.floor(Math.random() * 5000) + 1,
    betCount: Math.floor(Math.random() * 50000) + 10
  };
});

// 投注人數會員明細假資料（12 筆）
const memberList = Array.from({ length: 12 }).map((_, i) => {
  const betAmount = Math.round((Math.random() * 50000 + 100) * 100) / 100;
  const winAmount = Math.round((Math.random() * 20000 - 10000) * 100) / 100;
  return {
    memberID: 200000 + i,
    memberAccount: `member${String(i + 1).padStart(3, "0")}`,
    betCount: Math.floor(Math.random() * 2000) + 1,
    betAmount,
    winAmount
  };
});

// 廠商 / 類型 / 遊戲下拉
const dropdown = {
  gameGroup: groups.map((name, i) => ({
    id: i + 1,
    name,
    status: i === 1 ? 3 : 1 // 模擬一個維護中廠商
  })),
  gameType: types.map((name, i) => ({ id: i + 1, name })),
  gameList: gameNames.map((displayName, i) => ({
    id: 10000 + i,
    displayName
  }))
};

export default defineFakeRoute([
  {
    url: "/backend/report/lg/game/list",
    method: "get",
    response: () => {
      const sum = gameList.reduce(
        (acc, cur) => {
          acc.betAmount += cur.betAmount;
          acc.winAmount += cur.winAmount;
          acc.betPeople += cur.betPeople;
          acc.betCount += cur.betCount;
          return acc;
        },
        { betAmount: 0, winAmount: 0, betPeople: 0, betCount: 0 }
      );
      return {
        success: true,
        data: {
          list: gameList,
          total: gameList.length,
          betAmount: Math.round(sum.betAmount * 100) / 100,
          winAmount: Math.round(sum.winAmount * 100) / 100,
          betPeople: sum.betPeople,
          betCount: sum.betCount
        }
      };
    }
  },
  {
    url: "/backend/report/lg/game/member/list",
    method: "get",
    response: () => ({
      success: true,
      data: { list: memberList, total: memberList.length }
    })
  },
  {
    url: "/backend/game/dropdown/list",
    method: "get",
    response: () => ({ success: true, data: dropdown })
  }
]);
