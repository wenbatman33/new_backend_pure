import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 产生单日代理日报假资料
function genDailyRow(dateStr: string, seed: number) {
  return {
    date: dateStr,
    activeAgencyCount: 10 + (seed % 7),
    activeMemberCount: 120 + seed * 3,
    betAmount: 1000000 + seed * 53217,
    regMemberCount: 30 + (seed % 12),
    regAlsoDepositMemberCount: 12 + (seed % 8),
    firstDepositCount: 8 + (seed % 6),
    totalWinAmount: seed % 3 === 0 ? -(50000 + seed * 1234) : 80000 + seed * 1234,
    rechargeMemberCount: 40 + (seed % 10),
    rechargeAmount: 500000 + seed * 31000,
    rechargeFee: 1500 + seed * 70,
    withdrawMemberCount: 20 + (seed % 9),
    withdrawAmount: 300000 + seed * 21000,
    payoutFee: 900 + seed * 40,
    transferMemberCount: 5 + (seed % 4),
    transferMember: 7 + (seed % 5),
    promotionAmount: 20000 + seed * 800,
    vipGift: 5000 + seed * 200,
    returnAmount: 8000 + seed * 300,
    platformCharge: 12000 + seed * 500,
    netProfit: 60000 + seed * 1700,
    agencyWallet: 250000 + seed * 9000
  };
}

// 列表 15 笔
const dailyList = Array.from({ length: 15 }).map((_, i) =>
  genDailyRow(`2026-05-${String(i + 1).padStart(2, "0")}`, i + 1)
);

// 合计 brief（数值型，hook 会拼成合计列）
const dailyBrief = {
  activeAgencyCount: 150,
  activeMemberCount: 2100,
  betAmount: 18000000,
  regMemberCount: 480,
  regAlsoDepositMemberCount: 180,
  firstDepositCount: 120,
  totalWinAmount: 1200000,
  rechargeMemberCount: 600,
  rechargeAmount: 9000000,
  rechargeFee: 32000,
  withdrawMemberCount: 320,
  withdrawAmount: 5400000,
  payoutFee: 18000,
  transferMemberCount: 80,
  transferMember: 110,
  promotionAmount: 360000,
  vipGift: 90000,
  returnAmount: 145000,
  platformCharge: 210000,
  netProfit: 1080000,
  agencyWallet: 4500000
};

// 活跃代理明细 12 笔
const activeList = Array.from({ length: 12 }).map((_, i) => ({
  agencyID: 1001 + i,
  agencyAccount: `agency${String(i + 1).padStart(3, "0")}`,
  activeMemberCount: 30 + i * 4,
  betAmount: 200000 + i * 31000,
  totalWinAmount: i % 3 === 0 ? -(10000 + i * 900) : 25000 + i * 900,
  rechargeAmount: 120000 + i * 8000,
  rechargeFee: 600 + i * 30,
  withdrawAmount: 80000 + i * 6000,
  payoutFee: 400 + i * 20,
  depositWithdrawDiff: 40000 + i * 2000,
  totalBonus: 5000 + i * 300,
  transferMember: 3 + (i % 4),
  platformCharge: 3000 + i * 150,
  netProfit: 15000 + i * 700
}));

export default defineFakeRoute([
  {
    // 代理日报列表
    url: "/backend/report/agencydaily/list",
    method: "get",
    response: () => ({
      success: true,
      data: { list: dailyList, total: dailyList.length }
    })
  },
  {
    // 代理日报合计
    url: "/backend/report/agencydaily/brief",
    method: "get",
    response: () => ({
      success: true,
      data: dailyBrief
    })
  },
  {
    // 活跃代理明细
    url: "/backend/report/agencydaily/activeagencylist",
    method: "get",
    response: () => ({
      success: true,
      data: { list: activeList, total: activeList.length }
    })
  }
]);
