import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 推荐人报表假资料（域 activity / 模组 recommender）
const list = Array.from({ length: 16 }).map((_, i) => {
  const recommendedCount = 50 + i * 7;
  const depositAmount = 12000.5 + i * 1830.25;
  const withdrawAmount = 8000.75 + i * 1200.4;
  return {
    memberID: 200000 + i,
    account: `inviter${i + 1}`,
    recommendedCount,
    activeCount: 30 + i * 4,
    bindingCount: 20 + i * 3,
    newCount: 15 + i * 2,
    firstDepositCount: 10 + i,
    depositCount: 25 + i * 2,
    depositAmount,
    withdrawCount: 18 + i,
    withdrawAmount,
    eventTurnover: 50000.33 + i * 6200.1,
    winLoseAmount: i % 2 === 0 ? 3200.5 + i * 400 : -(2100.25 + i * 300),
    bonus: 1500.6 + i * 220.15
  };
});

// 合计列：把数值栏位加总
const summary = list.reduce(
  (acc, cur) => {
    acc.recommendedCount += cur.recommendedCount;
    acc.activeCount += cur.activeCount;
    acc.bindingCount += cur.bindingCount;
    acc.newCount += cur.newCount;
    acc.firstDepositCount += cur.firstDepositCount;
    acc.depositCount += cur.depositCount;
    acc.depositAmount += cur.depositAmount;
    acc.withdrawCount += cur.withdrawCount;
    acc.withdrawAmount += cur.withdrawAmount;
    acc.eventTurnover += cur.eventTurnover;
    acc.winLoseAmount += cur.winLoseAmount;
    acc.bonus += cur.bonus;
    return acc;
  },
  {
    recommendedCount: 0,
    activeCount: 0,
    bindingCount: 0,
    newCount: 0,
    firstDepositCount: 0,
    depositCount: 0,
    depositAmount: 0,
    withdrawCount: 0,
    withdrawAmount: 0,
    eventTurnover: 0,
    winLoseAmount: 0,
    bonus: 0
  }
);

export default defineFakeRoute([
  {
    url: "/backend/event/inviter2023/recommender",
    method: "get",
    response: ({ query }) => {
      let result = list;
      // 简单模拟推荐人帐号搜寻
      if (query.account) {
        result = result.filter(v => v.account.includes(query.account));
      }
      return {
        success: true,
        data: {
          list: result,
          total: result.length,
          summary
        }
      };
    }
  }
]);
