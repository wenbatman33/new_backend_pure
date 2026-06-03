import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 代理业绩报表 — 单笔汇总资料（产品/代理/会员三区块共用同一物件的不同栏位）
const performance = {
  // 产品维度
  netProfitOption: [
    { key: "totalBonus", value: 1 },
    { key: "totalCharge", value: 1 },
    { key: "platformCharge", value: 1 }
  ],
  giveOffer: 1,
  playerCount: 1280,
  betAmount: 9852300.55,
  totalWinAmount: -125800.32,
  killPercent: -1.28,
  // 产品/会员区块共用的红利与手续费
  totalBonus: 56200.0,
  totalCharge: 12800.5,
  platformCharge: 8600.25,
  // 代理维度
  regMemberCount: 320,
  agencyRechargeAmount: 1580000.0,
  agencyWithdrawAmount: 980000.0,
  agencyWithdrawRechargeDiff: 600000.0,
  agencyManualDepositCount: 45,
  agencyManualDepositAmount: 230000.0,
  agencyNetProfit: 458200.18,
  agencyLastNetProfit: -32100.66,
  agencyCommissionAmount: 88000.0,
  totalChildCommissionAmount: 23500.0,
  totalCommission: 111500.0,
  agencyWallet: 765400.99,
  // 会员维度
  rechargeCount: 860,
  rechargeAmount: 4520000.0,
  withdrawAmount: 3980000.0,
  withdrawDepositDiff: 540000.0,
  firstDepositCount: 210,
  firstDepositAmount: 630000.0,
  continueDepositCount: 650,
  continueDepositAmount: 3890000.0,
  transferMemberCount: 75,
  transferMemberAmount: 158000.0
};

// 游戏厂商分组（V2 平台）资料
const gameGroups = [
  "电子游艺",
  "真人视讯",
  "体育竞技",
  "棋牌游戏",
  "彩票",
  "捕鱼",
  "区块链",
  "电竞",
  "斗鸡",
  "快速游戏",
  "老虎机",
  "百家乐"
];

const v2List = gameGroups.map(name => ({
  gameGroupName: name,
  betAmount: Math.round((Math.random() * 2000000 + 100000) * 100) / 100,
  totalWinAmount:
    Math.round((Math.random() * 400000 - 200000) * 100) / 100
}));

export default defineFakeRoute([
  {
    // 代理业绩主报表（单笔汇总）
    url: "/backend/report/agencyperformance/list",
    method: "get",
    response: () => ({ success: true, data: performance })
  },
  {
    // V1 平台分组（页面预设隐藏，仍 mock 起来避免报错）
    url: "/backend/report/agencyPerformance/gameGroupV1",
    method: "get",
    response: () => ({ success: true, data: { list: v2List, total: v2List.length } })
  },
  {
    // V2 平台分组（游戏厂商分组绩效）
    url: "/backend/report/agencyPerformance/gameGroupV2",
    method: "get",
    response: () => ({ success: true, data: { list: v2List, total: v2List.length } })
  }
]);
