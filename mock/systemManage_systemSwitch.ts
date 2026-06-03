import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 系統設定總物件假資料
const systemConfig = {
  register: true,
  login: true,
  loginGame: true,
  deposit: true,
  depositNeedMobileVerify: false,
  depositNeedBankcardVerify: true,
  manualDepositDoubleReview: false,
  depositRemind: true,
  depositAllowChoosePayChannelService: true,
  depositShowPromotion: true,
  depositNeedWithdrawalPasswordSet: false,
  withNeedBankcardVerify: true,
  withdrawal: true,
  withdrawalRiskVerify: false,
  pcMaintain: false,
  h5Maintain: false,
  pcMaintainMessage: "系统维护中，请稍后再试",
  h5MaintainMessage: "H5 维护中",
  withdrawalNeedMobileVerify: true,
  withdrawalNeedLoginPassword: false,
  withdrawalShowPrompt: true,
  payInfoNeedSMSVerify: false,
  withdrawPassawordSetNeedSMSVerify: true,
  withdrawPassawordForgetNeedSMSVerify: true,
  withdrawalNeedWithdrawPassaword: true,
  withdrawalNeedWithdrawRealName: true,
  withdrawalNeedTurnoverInsufficient: true,
  withdrawalCheckHasDeposit: false,
  deleteZombieJob: false,
  canAddOtherBankcard: false,
  virtualWithdrawalLenient: true,
  withdrawalBankcardNeedVerify: true,
  withdrawalPassAmount: 5000,
  withdrawalPasswordCheckTimes: 5,
  withdrawalCheckPromotionEnable: true,
  usdtSmoothEnable: false,
  phoneOwnerAndRealNameSame: false,
  smsVerifySmooth: true,
  smsExpireMinutes: 10
};

// 操作紀錄假資料（10~20 筆）
const actions = ["注册开关", "登入开关", "存款开关", "提款开关", "USDT畅通开关"];
const accounts = ["admin", "operator01", "operator02"];
const operationLogs = Array.from({ length: 16 }).map((_, i) => ({
  createdAt: `2026-05-${String((i % 28) + 1).padStart(2, "0")} 14:25:0${i % 10}`,
  account: accounts[i % accounts.length],
  action: actions[i % actions.length],
  subData: [
    {
      column: actions[i % actions.length],
      oldValue: i % 2 === 0 ? "关闭" : "开启",
      newValue: i % 2 === 0 ? "开启" : "关闭"
    }
  ]
}));

export default defineFakeRoute([
  {
    url: "/backend/member/system/config",
    method: "get",
    response: () => ({ success: true, data: systemConfig })
  },
  {
    url: "/backend/member/system/config",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/config/autoupdatelggame",
    method: "get",
    response: () => ({ success: true, data: { autoStatus: 1 } })
  },
  {
    url: "/backend/config/autoupdatelggame",
    method: "put",
    response: () => ({ success: true, data: null })
  },
  {
    url: "/backend/admin/operation/logs",
    method: "get",
    response: () => ({
      success: true,
      data: { list: operationLogs, total: operationLogs.length }
    })
  }
]);
