import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 提款財務審核 detail 頁 mock
// 涵蓋本模組所有 endpoint，回傳結構與 hook 讀取一致

const member = { key: 100001, value: { account: "demoMember", name: "demo" } };

const withdrawalItem = {
  transactionID: "WD20260603001",
  id: "WD20260603001",
  createdAt: "2026-06-03 10:30:00",
  transactionTime: "2026-06-03 10:30:00",
  amount: 50000,
  status: { key: 1, value: "财务审核中" },
  member,
  financialCheck: { key: 1, value: "未审核" },
  riskCheck: { key: 4, value: "待风控" },
  financialCheckName: "operator01",
  withdrawalName: "王小明",
  bankcard: "6222021234567890",
  bankName: "中国工商银行",
  bankCode: "ICBC",
  bankGroup: { key: 1, value: "A组" },
  thirdGroup: { key: 2, value: "金流B" },
  checkNote: ["2026-06-03 系统自动审核通过流水", "2026-06-03 财务接手审核"]
};

// 側邊待審列表
const withdrawalList = Array.from({ length: 12 }).map((_, i) => ({
  transactionID: `WD2026060300${i + 1}`,
  amount: 10000 + i * 1000,
  status: { key: 1, value: "财务审核中" },
  bankCode: i % 2 ? "ICBC" : "CCB",
  member: {
    key: 100001 + i,
    value: { account: `member${i + 1}`, name: `会员${i + 1}` }
  }
}));

// 流水明细（tree）
const stakeList = Array.from({ length: 6 }).map((_, i) => ({
  name: `平台${i + 1}`,
  betAmount: (i + 1) * 1000,
  winAmount: (i + 1) * 800,
  list:
    i < 2
      ? [
          { name: `子游戏${i + 1}-1`, betAmount: 500, winAmount: 400 },
          { name: `子游戏${i + 1}-2`, betAmount: 500, winAmount: 400 }
        ]
      : []
}));

// 钱包纪录
const walletLog = Array.from({ length: 15 }).map((_, i) => ({
  date: `2026-06-03 ${String(8 + (i % 12)).padStart(2, "0")}:00:00`,
  inOut: (i % 2) + 1,
  type: (i % 4) + 1,
  before: 100000 - i * 1000,
  amount: i % 2 ? 1000 : -1000,
  after: 100000 - i * 1000 + (i % 2 ? 1000 : -1000),
  turnoverMultiple: 1,
  turnoverLimit: 5000,
  note: `备注${i + 1}`
}));

export default defineFakeRoute([
  // 提款列表 / 单笔提款
  {
    url: "/backend/withdrawal",
    method: "get",
    response: ({ query }) => {
      if (query.orderSn) {
        return { success: true, data: { list: [withdrawalItem], total: 1 } };
      }
      return {
        success: true,
        data: { list: withdrawalList, total: withdrawalList.length }
      };
    }
  },
  // 会员资讯
  {
    url: "/backend/withdrawal/member/info",
    method: "get",
    response: () => ({
      success: true,
      data: {
        hasSuccessDeposit: true,
        createdAt: "2026-06-03 10:30:00",
        turnoverDurationStart: "2026-06-01 00:00:00",
        turnoverDurationEnd: "2026-06-03 23:59:59",
        needTurnover: 100000,
        betAmount: 120000,
        diffWithdrawLimitation: 20000,
        vip: 3,
        todayDepositAmount: 80000,
        spread: 5000,
        money: 60000,
        lockMoney: 0,
        todayWithdrawalAmount: 30000,
        limitLower: 100,
        limitUpper: 100000,
        limitStatus: true,
        dayUpper: 200000,
        dayUpperStatus: true,
        withdrawalStatus: true,
        bankCode: "ICBC"
      }
    })
  },
  // 流水明细
  {
    url: "/backend/withdrawal/betting",
    method: "get",
    response: () => ({
      success: true,
      data: { list: stakeList, totalBetAmount: 21000, totalWinAmount: 16800 }
    })
  },
  // 钱包纪录
  {
    url: "/backend/member/walletlogs/withdrawallist",
    method: "get",
    response: () => ({
      success: true,
      data: { list: walletLog, total: walletLog.length }
    })
  },
  // 历史提款帐号
  {
    url: "/backend/withdrawal/history",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: [
          {
            createdAt: "2026-05-20 10:00:00",
            name: "中国工商银行",
            address: "6222021234567890",
            success: true
          },
          {
            createdAt: "2026-05-21 12:00:00",
            name: "USDT-TRC20",
            address: "TXxxxxAddress",
            success: false
          }
        ]
      }
    })
  },
  // 流水稽核列表
  {
    url: "/backend/withdrawal/turnover/list",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: Array.from({ length: 5 }).map((_, i) => ({
          eventID: i + 1,
          eventTime: `2026-06-0${i + 1} 10:00:00`,
          type: (i % 4) + 1,
          eventAmount: (i + 1) * 1000,
          limitTurnover: 5000,
          usedTurnover: 3000,
          success: i % 2 === 0
        }))
      }
    })
  },
  // 流水稽核通过
  {
    url: "/backend/withdrawal/turnover/pass",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 一键洗码
  {
    url: "/backend/withdrawal/smooth",
    method: "post",
    response: () => ({ success: true, data: null })
  },
  // 财务通过
  {
    url: "/backend/withdrawal/finance/pass",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 财务退回
  {
    url: "/backend/withdrawal/finance/reject",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 财务通过并送风控
  {
    url: "/backend/withdrawal/finance/submitrisk",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  // 资金用途类型
  {
    url: "/backend/money/useType",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: [
          { useTypeID: 1, useTypeName: "存款", useTypeEnName: "Deposit", color: "#01A39D" },
          { useTypeID: 2, useTypeName: "提款", useTypeEnName: "Withdraw", color: "#FF3857" },
          { useTypeID: 3, useTypeName: "投注", useTypeEnName: "Bet", color: "#404244" },
          { useTypeID: 4, useTypeName: "派彩", useTypeEnName: "Payout", color: "#01A39D" }
        ]
      }
    })
  },
  // 收支类型
  {
    url: "/backend/money/inOutType",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: [
          { inOutTypeID: 1, inOutTypeName: "收入" },
          { inOutTypeID: 2, inOutTypeName: "支出" }
        ]
      }
    })
  },
  // 会员标签
  {
    url: "/backend/member/tag",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: [
          { name: "高风险", tagGroupID: 100 },
          { name: "VIP", tagGroupID: 100 },
          { name: "其他", tagGroupID: 200 }
        ]
      }
    })
  },
  // 优惠领取
  {
    url: "/backend/promotion/member/withdrw",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: [
          {
            promotionID: 1,
            promotionName: "首存优惠",
            adjustmentLimit: [{ gameTypeName: "电子", gameGroupName: "PG" }]
          }
        ]
      }
    })
  },
  // 调整申请
  {
    url: "/backend/adjustment/search",
    method: "get",
    response: () => ({
      success: true,
      data: {
        list: [
          {
            adjustmentID: 5001,
            subject: "活动补偿",
            adjustmentLimit: [{ gameTypeName: "真人", gameGroupName: "" }]
          }
        ]
      }
    })
  }
]);
