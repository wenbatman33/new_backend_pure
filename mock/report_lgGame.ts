import { defineFakeRoute } from "vite-plugin-fake-server/client";

// LG 游戏报表假资料
const groups = [
  "百家乐",
  "龙虎",
  "轮盘",
  "骰宝",
  "牛牛",
  "炸金花",
  "二八杠",
  "番摊",
  "色碟",
  "三公",
  "斗地主",
  "捕鱼"
];

const all = Array.from({ length: 12 }).map((_, i) => {
  const betAmount = 100000 + i * 8888;
  const groupBetAmount = 80000 + i * 6666;
  const winAmount = (i % 2 === 0 ? 1 : -1) * (5000 + i * 1234);
  return {
    gameGroupName: groups[i % groups.length],
    betAmount,
    groupBetAmount,
    winAmount,
    feeRatio: `${(i % 5) + 1}%`,
    // 1 来自会员投注 / 2 来自抽水
    bettingFrom: String((i % 2) + 1),
    platformCharge: 1000 + i * 321
  };
});

export default defineFakeRoute([
  {
    // 报表列表
    url: "/backend/report/lg/game",
    method: "get",
    response: ({ query }) => {
      let list = all;
      // 钱包类型仅作示意过滤（假资料不真分组，回全部）
      if (query.walletType) {
        list = all;
      }
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    // 手动重算
    url: "/backend/report/tool/recalcReportMemberDailyGame",
    method: "get",
    response: () => ({ success: true, data: null })
  }
]);
