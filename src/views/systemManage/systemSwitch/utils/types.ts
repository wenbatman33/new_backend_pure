// 系統設定總物件型別（站台/存款/提款各開關）
interface SystemConfig {
  register: boolean;
  login: boolean;
  loginGame: boolean;
  deposit: boolean;
  depositNeedMobileVerify: boolean;
  depositNeedBankcardVerify: boolean;
  manualDepositDoubleReview: boolean;
  depositRemind: boolean;
  depositAllowChoosePayChannelService: boolean;
  depositShowPromotion: boolean;
  depositNeedWithdrawalPasswordSet: boolean;
  withNeedBankcardVerify: boolean;
  withdrawal: boolean;
  withdrawalRiskVerify: boolean;
  pcMaintain: boolean;
  h5Maintain: boolean;
  pcMaintainMessage: string;
  h5MaintainMessage: string;
  withdrawalNeedMobileVerify: boolean;
  withdrawalNeedLoginPassword: boolean;
  withdrawalShowPrompt: boolean;
  payInfoNeedSMSVerify: boolean;
  withdrawPassawordSetNeedSMSVerify: boolean;
  withdrawPassawordForgetNeedSMSVerify: boolean;
  withdrawalNeedWithdrawPassaword: boolean;
  withdrawalNeedWithdrawRealName: boolean;
  withdrawalNeedTurnoverInsufficient: boolean;
  withdrawalCheckHasDeposit: boolean;
  deleteZombieJob: boolean;
  canAddOtherBankcard: boolean;
  virtualWithdrawalLenient: boolean;
  withdrawalBankcardNeedVerify: boolean;
  withdrawalPassAmount: number;
  withdrawalPasswordCheckTimes: number;
  withdrawalCheckPromotionEnable: boolean;
  usdtSmoothEnable: boolean;
  phoneOwnerAndRealNameSame: boolean;
  autoupdatelggame: boolean;
  smsVerifySmooth: boolean;
  smsExpireMinutes: number;
}

// 操作紀錄表格列
interface OperationLogItem {
  createdAt: string;
  account: string;
  action: string;
  subData: { column: string; oldValue: string; newValue: string }[];
}

export type { SystemConfig, OperationLogItem };
