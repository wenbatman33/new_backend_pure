import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 提款風控審核 risk_check 模組 mock
// 涵蓋：會員資訊、提單、錢包、生涯、優惠、標籤、備註、資金記錄、流水詳情、字典、審核動作

const memberInfo = {
  id: "WD20260601001",
  member: { key: 100025, value: "member100025" },
  vip: 3,
  amount: "12800.50",
  createdAt: "2026-06-01 09:30:00",
  withdrawalStatus: true,
  dayUpper: "500000",
  dayUpperStatus: true,
  todayDepositAmount: "30000",
  todayWithdrawalAmount: "12800.5",
  spread: "17199.5",
  spread30: "85000",
  money: "8650.25",
  lockMoney: "1200",
  turnoverDurationStart: "2026-05-25 00:00:00",
  turnoverDurationEnd: "2026-06-01 23:59:59"
};

const withdrawalRow = {
  financialCheck: { key: 3, value: "已通过" },
  agencyID: "AG10086",
  riskCheckName: "待审核",
  status: { key: 1, value: "待审核" },
  riskCheck: { key: 1, value: "待审核" }
};

const promotionList = Array.from({ length: 6 }).map((_, i) => ({
  ID: i + 1,
  name: ["首充优惠", "周周礼金", "签到奖励", "返水活动"][i % 4],
  amount: (188 * (i + 1)).toFixed(2),
  statusName: "已发放",
  sendAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 12:00:00`
}));

const tagList = Array.from({ length: 5 }).map((_, i) => ({
  id: i + 1,
  name: ["高风险", "套利", "多账号", "正常", "VIP重点"][i],
  tagGroupID: (i % 3) + 1,
  updatedAt: `2026-05-2${i} 15:00:00`
}));

const tagGroups = [
  { id: 1, color: "#F56C6C" },
  { id: 2, color: "#E6A23C" },
  { id: 3, color: "#67C23A" }
];

const comments = Array.from({ length: 4 }).map((_, i) => ({
  id: i + 1,
  title: `备注${i + 1}`,
  content: `这是第${i + 1}条用户备注内容，用于风控审核参考。`,
  creator: "admin",
  updator: i % 2 === 0 ? "risk01" : "",
  createdAt: `2026-05-2${i} 10:00:00`,
  updatedAt: i % 2 === 0 ? `2026-05-2${i} 11:00:00` : ""
}));

const useTypeList = Array.from({ length: 8 }).map((_, i) => ({
  useTypeID: 100 + i,
  useTypeName: ["存款", "提款", "下注", "派彩", "礼金", "返水", "调整", "转账"][i]
}));

const inOutTypeList = [
  { inOutTypeID: 1, inOutTypeName: "收入" },
  { inOutTypeID: 2, inOutTypeName: "支出" }
];

const walletLogList = Array.from({ length: 15 }).map((_, i) => ({
  id: i + 1,
  date: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 14:30:00`,
  inOut: (i % 2) + 1,
  inOutName: i % 2 === 0 ? "支出" : "收入",
  type: 100 + (i % 8),
  typeName: ["存款", "提款", "下注", "派彩", "礼金", "返水", "调整", "转账"][i % 8],
  before: (10000 - i * 100).toFixed(2),
  amount: (i * 50 + 100).toFixed(2),
  after: (10000 - i * 100 + (i * 50 + 100)).toFixed(2),
  turnoverMultiple: (i % 5) + 1,
  turnoverLimit: (i * 200).toFixed(2),
  note: `交易备注 ${i + 1}`
}));

const stakeList = [
  {
    name: "电子游戏",
    betAmount: "120000",
    winAmount: "-8500",
    list: [
      { name: "PG电子", betAmount: "80000", winAmount: "-5000" },
      { name: "PP电子", betAmount: "40000", winAmount: "-3500" }
    ]
  },
  {
    name: "真人娱乐",
    betAmount: "95000",
    winAmount: "12000",
    list: [{ name: "DG真人", betAmount: "95000", winAmount: "12000" }]
  },
  { name: "体育竞技", betAmount: "30000", winAmount: "4500" }
];

export default defineFakeRoute([
  // 提款管理：取得會員資訊
  {
    url: "/backend/withdrawal/member/info",
    method: "get",
    response: () => ({ success: true, data: memberInfo })
  },
  // 提款管理：列表與篩選
  {
    url: "/backend/withdrawal",
    method: "get",
    response: () => ({
      success: true,
      data: { list: [withdrawalRow], total: 1 }
    })
  },
  // 提款管理：流水明細（樹狀）
  {
    url: "/backend/withdrawal/betting",
    method: "get",
    response: () => ({
      success: true,
      data: { list: stakeList, totalBetAmount: "245000", totalWinAmount: "8000" }
    })
  },
  // 提款管理：風控進入審核（鎖定）
  {
    url: "/backend/withdrawal/riskaudit",
    method: "post",
    response: () => ({ success: true, data: { adminAccount: "" } })
  },
  // 提款管理：風控審核
  {
    url: "/backend/withdrawal/risk/check",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 會員：錢包資料
  {
    url: "/backend/member/detail/money",
    method: "get",
    response: () => ({
      success: true,
      data: {
        totalMoney: "8650.25",
        gameWallet: "0",
        WithdrawDetailTotal: "50000",
        DepositDetailTotal: "65000",
        totalLock: "1200"
      }
    })
  },
  // 會員：生涯資料
  {
    url: "/backend/member/career",
    method: "get",
    response: () => ({
      success: true,
      data: { totalRate: "1250000", totalWin: "-23000" }
    })
  },
  // 會員：優惠明細
  {
    url: "/backend/promotion/member/list",
    method: "get",
    response: () => ({
      success: true,
      data: { list: promotionList, total: promotionList.length }
    })
  },
  // 會員：標籤
  {
    url: "/backend/member/tag",
    method: "get",
    response: () => ({
      success: true,
      data: { list: tagList, total: tagList.length }
    })
  },
  // 會員：標籤分組（顏色）
  {
    url: "/backend/member/tag/groups",
    method: "get",
    response: () => ({ success: true, data: { list: tagGroups } })
  },
  // 會員：備註
  {
    url: "/backend/member/comments",
    method: "get",
    response: () => ({
      success: true,
      data: { list: comments, total: comments.length }
    })
  },
  // 會員：資金記錄（提款風控用）
  {
    url: "/backend/member/walletlogs/withdrawallist",
    method: "get",
    response: () => ({
      success: true,
      data: { list: walletLogList, total: walletLogList.length }
    })
  },
  // 金流：使用類型字典
  {
    url: "/backend/money/useType",
    method: "get",
    response: () => ({ success: true, data: { list: useTypeList } })
  },
  // 金流：收支類型字典
  {
    url: "/backend/money/inOutType",
    method: "get",
    response: () => ({ success: true, data: { list: inOutTypeList } })
  }
]);
