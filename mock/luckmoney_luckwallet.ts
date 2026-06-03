import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 营运报表（新利币钱包）假资料：15 笔
const list = Array.from({ length: 15 }).map((_, i) => {
  const day = String(15 - i).padStart(2, "0");
  const win = (Math.random() * 200000 - 80000).toFixed(2);
  return {
    reportDate: `2026-05-${day}`,
    qSettlementPeopleDate: `2026-05-${day}`,
    betAmount: (Math.random() * 1000000).toFixed(2),
    winAmount: win,
    killNum: (Math.random() * 30 - 5).toFixed(2),
    totalBonus: Math.floor(Math.random() * 50000),
    promotion: Math.floor(Math.random() * 30000),
    manual: Math.floor(Math.random() * 10000),
    recharge: Math.floor(Math.random() * 60000),
    settlement: Math.floor(Math.random() * 40000),
    settlementPeople: Math.floor(Math.random() * 20),
    promotionPeople: Math.floor(Math.random() * 300),
    betPeople: Math.floor(Math.random() * 500),
    money: Math.floor(Math.random() * 800000)
  };
});

// 合计行
const total = {
  betAmount: list.reduce((s, v) => s + Number(v.betAmount), 0).toFixed(2),
  winAmount: list.reduce((s, v) => s + Number(v.winAmount), 0).toFixed(2),
  killNum: "0.00",
  totalBonus: list.reduce((s, v) => s + Number(v.totalBonus), 0),
  promotion: list.reduce((s, v) => s + Number(v.promotion), 0),
  manual: list.reduce((s, v) => s + Number(v.manual), 0),
  recharge: list.reduce((s, v) => s + Number(v.recharge), 0),
  settlement: list.reduce((s, v) => s + Number(v.settlement), 0),
  settlementPeople: list.reduce((s, v) => s + v.settlementPeople, 0),
  promotionPeople: list.reduce((s, v) => s + v.promotionPeople, 0),
  betPeople: list.reduce((s, v) => s + v.betPeople, 0),
  money: list.reduce((s, v) => s + Number(v.money), 0)
};

export default defineFakeRoute([
  {
    url: "/backend/report/operation/lm",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list,
        total,
        updatedAt: "2026-05-15 23:59:59"
      }
    })
  },
  {
    url: "/backend/report/operation/lmsettlementpeoplelist",
    method: "get",
    response: () => {
      const peopleList = Array.from({ length: 8 }).map((_, i) => ({
        memberID: 200000 + i,
        memberAccount: `member${i + 1}`,
        memberTransferOutList: [
          { name: "新年活动", amount: (Math.random() * 5000).toFixed(2) },
          { name: "签到优惠", amount: (Math.random() * 2000).toFixed(2) }
        ]
      }));
      return {
        success: true,
        data: { list: peopleList, total: peopleList.length }
      };
    }
  }
]);
