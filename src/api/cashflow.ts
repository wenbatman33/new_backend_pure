import { http } from "@/utils/http";

/** 後端統一回應格式 */
type Result<T = any> = {
  success: boolean;
  data: T;
};


// ===== 存款管理 deposit 相關 =====
export interface DepositItem {
  id?: string;
  type?: number;
  status?: number;
  memberAccount?: string;
  memberName?: string;
  memberID?: number;
  amount?: number;
  fee?: number;
  exchangeRate?: number;
  otherAmount?: number;
  currency?: number;
  gatway?: string;
  payGroupId?: number;
  bankcardGroupId?: number;
  payment?: string;
  depositName?: string;
  thirdID?: string;
  refNum?: string;
  userRemark?: string;
  bankcard?: string;
  device?: number;
  balanceDate?: string;
  editorName?: string;
  agencyID?: number;
  promotion?: { value?: string | number }[];
  createdAt?: string;
  updatedAt?: string;
  createdAtUTC?: string;
  updatedAtUTC?: string;
}

/** 存款單列表 */

export const getDepositList = (params?: object) =>
  http.request<Result<any>>("get", "/backend/pay/deposit", { params });

/** 新增存款單 */

export const postDeposit = (data?: object) =>
  http.request<Result<{ success: boolean }>>("post", "/backend/pay/deposit", {
    data
  });

/** 查看訂單紀錄 */

export const getDepositNote = (params?: { id?: string }) =>
  http.request<Result<{ list: any[] }>>("get", "/backend/pay/deposit/note", {
    params
  });

/** 新增存款單備註 */

export const postDepositNote = (data?: { id?: string; note?: string }) =>
  http.request<Result<{ success: boolean }>>(
    "post",
    "/backend/pay/deposit/note",
    { data }
  );

/** 修改存款單入帳日 */

export const putDepositBalanceDate = (data?: {
  id?: string;
  balanceDate?: string;
  note?: string;
}) =>
  http.request<Result<{ success: boolean }>>(
    "put",
    "/backend/pay/deposit/balancedate",
    { data }
  );

/** 查詢三方回調狀態 */

export const postDepositCallback = (data?: { id?: string }) =>
  http.request<Result<{ success: boolean }>>(
    "post",
    "/backend/pay/deposit/callback",
    { data }
  );

/** 計算手續費 */

export const postDepositFee = (data?: {
  amount?: number;
  payChannelServiceID?: string | number;
}) =>
  http.request<Result<{ fee?: number }>>("post", "/backend/pay/deposit/fee", {
    data
  });

/** 強制失敗（舊 Vben put params 即 body） */

export const putDepositForceFail = (data: { orderSn?: string; note: string }) =>
  http.request<Result<{ success: boolean }>>(
    "put",
    "/backend/pay/deposit/hardcancel",
    { data }
  );

/** 強制成功 */

export const putDepositForceSuccess = (data: {
  orderSn?: string;
  note: string;
  thirdID?: string;
}) =>
  http.request<Result<{ success: boolean }>>(
    "put",
    "/backend/pay/deposit/hardsuccess",
    { data }
  );

/** 高權限強制成功（審核） */

export const putDepositReview = (data: { orderSn?: string; note?: string }) =>
  http.request<Result<{ success: boolean }>>(
    "put",
    "/backend/pay/deposit/review",
    { data }
  );

/** 偵測是否有新會員存款單（beep 提示音用） */

export const postDepositHaveNewList = (data?: object) =>
  http.request<Result<{ hasMemberDeposit?: boolean }>>(
    "post",
    "/backend/payment/beep",
    { data }
  );

// ===== deposit 模組依賴的下拉資料（沿用 payment 域舊 endpoint） =====

/** 金流組別列表 type:1 三方 / type:2 銀行卡 */

export const getPayGroupList = (params?: { type?: number }) =>
  http.request<Result<{ list: any[] }>>("get", "/backend/pay_group/groups", {
    params
  });

/** 線路（存款方式）下拉 */

export const getPayChannelServiceDropdown = () =>
  http.request<Result<{ serviceCode?: any[] }>>(
    "get",
    "/backend/pay_channel_service/dropdown"
  );

/** 商戶號列表 */

export const getPayChannelList = (params?: object) =>
  http.request<Result<{ list: any[] }>>("get", "/backend/pay/pay_channel", {
    params
  });

/** 商戶列表 */

export const getPayChannelNameList = () =>
  http.request<Result<{ list: any[] }>>(
    "get",
    "/backend/pay/pay_channel_name"
  );

/** 線路列表（新增存款單線路下拉用） */

export const getPayChannelServiceList = (params?: {
  status?: number;
  page?: number;
  pageSize?: number;
}) =>
  http.request<Result<{ list: any[] }>>("get", "/backend/pay_channel_service/", {
    params
  });

// ===== 提款管理 withdrawal（沿用舊 endpoint）=====
// 鍵值物件：key 傳後端、value 前台顯示
export interface KeyValueItem {
  key?: number;
  value?: string;
}

export interface MemberKeyValueItem {
  key?: number;
  value?: { account: string; name: string };
}
// 提款單列表項目

export interface WithdrawalItem {
  transactionID?: string;
  transactionTime?: string;
  transactionTimeUTC?: string;
  amount?: number;
  payAmount?: number;
  status?: KeyValueItem;
  bankGroup?: KeyValueItem;
  thirdGroup?: KeyValueItem;
  member?: MemberKeyValueItem;
  bankAccount?: string;
  bankCode?: string;
  bankName?: string;
  memberBankNo?: string;
  snList?: string[];
  agencyName?: string;
  agencyID?: string;
  financialCheck?: KeyValueItem;
  riskCheck?: KeyValueItem;
  riskCheckName?: string;
  lastUpdate?: string;
  lastUpdateUTC?: string;
  updatedBy?: string;
  remark?: string;
  creditDate?: string;
  isWithdrawalColor?: boolean;
}

export interface WithdrawalListResult {
  list?: WithdrawalItem[];
  count?: number;
  total?: number;
  fee?: number;
  erctotal?: number;
  trctotal?: number;
}

/** 提款管理：列表與篩選查詢（舊 GET /backend/withdrawal） */

export const getWithdrawal = (params?: object) =>
  http.request<Result<WithdrawalListResult>>("get", "/backend/withdrawal", {
    params
  });

/** 提款管理：提款提示音檢查（舊 POST /backend/payment/beep，原 postHaveNewList） */

export const postWithdrawalBeep = (data?: object) =>
  http.request<Result<{ hasMemberWithdrawal: boolean }>>(
    "post",
    "/backend/payment/beep",
    { data }
  );

// ===== cashflow / withdrawLimit（存提款設定 + USDT 匯率設定）=====
// 沿用舊 endpoint：/backend/payment/config、/backend/payment/rate/config
export interface DynamicPaymentConfig {
  serviceCode: string;
  serviceName: string;
  min: number | string;
  max: number | string;
  minAgency: number | string;
  maxAgency: number | string;
  maxAddressCount: number | string;
  icon: string;
  available: boolean;
  maintain: boolean;
  type?: number;
  docTitle?: string;
  docURL?: string;
  downloadTitle?: string;
  downloadURL?: string;
}

/** 存提款設定主物件 */

export interface PaymentLimitConfig {
  dynamicConfigs: DynamicPaymentConfig[];
  depositTimeoutMinutes: number | string;
  depositProcessLimit: number | string;
  autoPayoutEnable: boolean;
  depositRemarkShow: boolean;
  autoPayoutDayTotalAmount: number | string;
  autoPayoutAmountMax: number | string;
  skipPayingThird: boolean;
  defaultWithdrawTimesLimit: number | string;
  defaultWithdrawAmountLimit: number | string;
  defaultSingleWithdrawAmountLimit: number | string;
}

/** USDT 匯率設定列 */

export interface UsdtRateItem {
  displayName: string;
  type: number;
  percentageMultiplier: number | string;
  addendRate: number | string;
  customRate: number | string;
  scale: number;
  publicRate: number | string;
  finalRate: number | string;
}

/** USDT 匯率設定（存款/提款） */

export interface UsdtRateConfig {
  deposit: UsdtRateItem[];
  withdrawal: UsdtRateItem[];
}

/** 取得存提款設定（含提現渠道 dynamicConfigs） */

export const getPaymentLimitConfig = () => {
  return http.request<Result<PaymentLimitConfig>>(
    "get",
    "/backend/payment/config"
  );
};

/** 更新存提款設定（body 帶整包設定） */

export const updatePaymentLimitConfig = (data: PaymentLimitConfig) => {
  return http.request<Result<null>>("put", "/backend/payment/config", { data });
};

/** 取得 USDT 存/提款匯率設定 */

export const getUsdtRateConfig = () => {
  return http.request<Result<UsdtRateConfig>>(
    "get",
    "/backend/payment/rate/config"
  );
};

/** 更新 USDT 存/提款匯率設定（body 帶 deposit / withdrawal） */

export const updateUsdtRateConfig = (data: UsdtRateConfig) => {
  return http.request<Result<null>>("put", "/backend/payment/rate/config", {
    data
  });
};

// === 出款面板（payout navi）相關 ===
// 單列資料型別
export type PayoutNaviItem = {
  id: number;
  sort: number;
  name: string;
  thirdBalance: string;
  thirdSecondBalance: string;
  paying: boolean;
  status: number;
  eighteenApLowerLimit: string;
  eighteenApUpperLimit: string;
};

export type PayoutNaviListResult = Result<{
  list: PayoutNaviItem[];
  total: number;
}>;

/** 提款管理: 取得出款面板列表 */

export const getPayoutNavi = () => {
  return http.request<PayoutNaviListResult>(
    "get",
    "/backend/withdrawal/payout/navi"
  );
};

/** 提款管理: 出款面板排序 */

export const putPayoutNaviSort = (data?: object) => {
  return http.request<Result>("put", "/backend/withdrawal/payout/navi/sort", {
    data
  });
};

/** 提款管理: 出款面板狀態開關（1 開 / 2 關） */

export const putPayoutNaviStatus = (data?: object) => {
  return http.request<Result>("put", "/backend/withdrawal/payout/navi/status", {
    data
  });
};

/** 商戶號管理: 刷新三方餘額（回傳更新後的單列） */

export const postPayChannelBalance = (data?: object) => {
  return http.request<Result<PayoutNaviItem>>(
    "post",
    "/backend/pay/pay_channel/balance",
    { data }
  );
};

/** 商戶號管理: 更新 18 單筆限額 */

export const updatePayChannelAp18limit = (data?: object) => {
  return http.request<Result>("put", "/backend/pay/pay_channel/ap/18limit", {
    data
  });
};

// ===== 提款風控（cashflow/withdrawRisk）=====
// 沿用舊 endpoint：列表 GET /backend/withdrawal（帶 source=1）；風控進入審核 POST /backend/withdrawal/riskaudit
export interface WithdrawRiskItem {
  transactionID: string;
  transactionTime: string;
  agencyID: string;
  member: { key: string; value: { account: string } };
  bankAccount: string;
  status: { key: number; value: string };
  amount: number;
  bankName: string;
  bankCode: string;
  memberBankNo: string;
  financialCheck: { key: number; value: string };
  riskCheck: { key: number; value: string };
  riskCheckName: string;
  lastUpdate: string;
  updatedBy: string;
  remark: string;
}

export interface WithdrawRiskListResult {
  list: WithdrawRiskItem[];
  total: number;
  count?: number;
  total_amount?: number;
  fee?: number;
}

/** 提款風控：列表與篩選（source=1 由呼叫端帶入 params） */

export const getWithdrawRiskList = (params?: object) =>
  http.request<Result<WithdrawRiskListResult>>("get", "/backend/withdrawal", {
    params
  });

/** 提款風控：風控進入審核（鎖單）。回傳 adminAccount 非空代表已被他人鎖定 */

export const postRiskAuditLock = (data: { id: string }) =>
  http.request<Result<{ adminAccount: string }>>(
    "post",
    "/backend/withdrawal/riskaudit",
    { data }
  );
