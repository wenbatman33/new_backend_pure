import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 千分号格式化（mock 端模拟后端已格式化字串）
function comma(n: number): string {
  return n.toLocaleString("en-US");
}

// 产生单日营运报表资料
function makeRow(dateStr: string, seed: number) {
  const betAmount = 1000000 + seed * 35000;
  const groupBetAmount = betAmount + seed * 1200;
  const winAmount = (seed % 4 === 0 ? -1 : 1) * (50000 + seed * 800);
  const rechargeAmount = 300000 + seed * 5000;
  const withdrawAmount = 250000 + seed * 4200;
  return {
    reportDate: dateStr,
    betAmount: comma(betAmount),
    groupBetAmount: comma(groupBetAmount),
    winAmount: comma(winAmount),
    kill: `${(seed % 15) - 5}%`,
    rechargeAmount: comma(rechargeAmount),
    withdrawAmount: comma(withdrawAmount),
    rechargeWithdrawDiff: comma(rechargeAmount - withdrawAmount),
    promotionAmount: comma(20000 + seed * 300),
    vipGift: comma(8000 + seed * 120),
    returnAmount: comma(6000 + seed * 90),
    agencyRechargeAmount: comma(40000 + seed * 600),
    agencyWithdrawAmount: comma(30000 + seed * 450),
    transferMainWallet: comma(15000 + seed * 200),
    transferLuckMoney: comma(12000 + seed * 180),
    registerPeople: comma(120 + seed),
    loginPeople: comma(900 + seed * 5),
    betPeople: comma(700 + seed * 4),
    depositNum: comma(200 + seed * 2),
    withdrawNum: comma(150 + seed),
    registerFirstDepositPeople: comma(60 + seed),
    firstDepositPeople: comma(45 + seed),
    maxOnlineMember: comma(500 + seed * 3),
    memberMoney: comma(5000000 + seed * 9000)
  };
}

export default defineFakeRoute([
  {
    url: "/backend/report/operation",
    method: "get",
    response: () => {
      // 产生 15 笔逐日资料
      const list = Array.from({ length: 15 }).map((_, i) =>
        makeRow(
          `2026-05-${String((i % 28) + 1).padStart(2, "0")}`,
          i + 1
        )
      );
      // 合计资料（含 lastUpdatedAt）
      const total = {
        reportDate: "总计",
        betAmount: comma(18000000),
        groupBetAmount: comma(18250000),
        winAmount: comma(620000),
        kill: "4%",
        rechargeAmount: comma(5400000),
        withdrawAmount: comma(4500000),
        rechargeWithdrawDiff: comma(900000),
        promotionAmount: comma(380000),
        vipGift: comma(150000),
        returnAmount: comma(110000),
        agencyRechargeAmount: comma(720000),
        agencyWithdrawAmount: comma(540000),
        transferMainWallet: comma(270000),
        transferLuckMoney: comma(216000),
        registerPeople: comma(2100),
        loginPeople: comma(15000),
        betPeople: comma(11500),
        depositNum: comma(3400),
        withdrawNum: comma(2500),
        registerFirstDepositPeople: comma(1050),
        firstDepositPeople: comma(800),
        maxOnlineMember: comma(8500),
        memberMoney: comma(82000000),
        lastUpdatedAt: "2026-06-03 08:00:00"
      };
      return { success: true, data: { list, total } };
    }
  }
]);
