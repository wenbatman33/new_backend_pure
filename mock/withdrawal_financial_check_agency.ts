import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 代理提款財審詳情頁 mock

// 使用型別字典
const useTypeList = [
  { useTypeID: 1, useTypeName: "存款", useTypeEnName: "Deposit" },
  { useTypeID: 2, useTypeName: "提款", useTypeEnName: "Withdraw" },
  { useTypeID: 3, useTypeName: "下注", useTypeEnName: "Bet" },
  { useTypeID: 10, useTypeName: "返水", useTypeEnName: "Rebate" }
];

// 進出款型別字典
const inOutTypeList = [
  { inOutTypeID: 1, inOutTypeName: "收入" },
  { inOutTypeID: 2, inOutTypeName: "支出" }
];

// 錢包異動列表（15 筆）
const walletLogList = Array.from({ length: 15 }).map((_, i) => ({
  date: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 12:${String(i % 60).padStart(2, "0")}:00`,
  inOut: (i % 2) + 1,
  type: [1, 2, 3, 10][i % 4],
  before: 100000 + i * 1000,
  amount: (i % 2 === 0 ? 1 : -1) * (500 + i * 100),
  after: 100500 + i * 900,
  turnoverMultiple: (i % 3) + 1,
  turnoverLimit: 20000 + i * 500,
  note: `備註說明 ${i + 1}`,
  refID: `REF${10000 + i}`
}));

// 代理提款詳情
const agencyDetail = {
  agencyID: 8888,
  agencyAccount: "agent_001",
  id: "WD20260520001",
  createdAt: "2026-05-20 09:30:00",
  amount: 50000,
  statusStr: "待审核",
  bankName: "张三",
  bankcard: "6222 **** **** 1234",
  thirdID: "中国工商银行",
  hasSuccessDeposit: true,
  agencyWithdrawStatus: true,
  limitLower: 1000,
  limitUpper: 100000,
  limitStatus: true,
  withdrawDayLimit: 200000,
  dayUpperStatus: true,
  todayDepositAmount: 30000,
  spread: 20000,
  money: 150000,
  lockMoney: 0,
  todayWithdrawalAmount: 50000,
  turnover: 0,
  turnoverStatus: true
};

// 提款單列表（給右側列表與當前單）
const withdrawalList = Array.from({ length: 12 }).map((_, i) => ({
  transactionID: `WD2026052000${i + 1}`,
  transactionTime: `2026-05-20 0${(i % 9) + 1}:00:00`,
  amount: 50000 - i * 1000,
  bankCode: "ICBC",
  member: "agent_001",
  status: { key: i === 0 ? 1 : (i % 6) + 1, value: ["待审核", "审核中", "已通过", "已退回", "已派彩", "风控中"][i % 6] },
  financialCheck: { key: (i % 6) + 1, value: "财审" },
  updatedBy: "system",
  checkNote: ["首次审核", "金额正常"]
}));

export default defineFakeRoute([
  // 代理提款詳情
  {
    url: "/backend/withdrawal/agency/info",
    method: "get",
    response: () => ({ success: true, data: agencyDetail })
  },
  // 提款單列表（沿用 /backend/withdrawal）
  {
    url: "/backend/withdrawal",
    method: "get",
    response: ({ query }) => {
      // orderSn 指定時回傳該單（並標 status.key=1 讓按鈕出現）
      if (query?.orderSn) {
        const first = { ...withdrawalList[0], transactionID: query.orderSn };
        return { success: true, data: { list: [first], total: 1 } };
      }
      return {
        success: true,
        data: { list: withdrawalList, total: withdrawalList.length }
      };
    }
  },
  // 錢包異動列表
  {
    url: "/backend/agency/walletlogs/withdrawallist",
    method: "get",
    response: () => ({
      success: true,
      data: { list: walletLogList, total: walletLogList.length }
    })
  },
  // 使用型別字典
  {
    url: "/backend/money/useType",
    method: "get",
    response: () => ({ success: true, data: { list: useTypeList } })
  },
  // 進出款型別字典
  {
    url: "/backend/money/inOutType",
    method: "get",
    response: () => ({ success: true, data: { list: inOutTypeList } })
  },
  // 財審通過
  {
    url: "/backend/withdrawal/finance/pass",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 財審退回
  {
    url: "/backend/withdrawal/finance/reject",
    method: "put",
    response: () => ({ success: true, data: null })
  }
]);
