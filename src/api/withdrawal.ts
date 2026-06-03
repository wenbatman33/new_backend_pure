import { http } from "@/utils/http";

/** 後端統一回應格式 */
type Result<T = any> = {
  success: boolean;
  data: T;
};


// ===== withdrawal 域 / financial_check_agency 模組所需 api（沿用舊 endpoint） =====
// 注意：Result<T> = { success: boolean; data: T } 由 api 檔頭統一定義，勿重複宣告
// 代理提款 / 會員詳情（舊：getAgencyWithdrawalDetail，GET /backend/withdrawal/agency/info）
export const getAgencyWithdrawalDetail = (params?: { id: string }) =>
  http.request<Result<any>>("get", "/backend/withdrawal/agency/info", { params });

// 提款單列表（舊：getWithdrawal，GET /backend/withdrawal）
// 本模組同時用於「取得當前提款單」與「右側近一日代理提款單列表」

export const getAgencyWithdrawalList = (params?: any) =>
  http.request<Result<{ list: any[]; total: number }>>(
    "get",
    "/backend/withdrawal",
    { params }
  );

// 代理錢包異動列表（舊：getWalletLog，GET /backend/agency/walletlogs/withdrawallist）

export const getAgencyWalletLog = (params?: any) =>
  http.request<Result<{ list: any[]; total: number }>>(
    "get",
    "/backend/agency/walletlogs/withdrawallist",
    { params }
  );

// 使用型別字典（舊：getUseType，GET /backend/money/useType）

export const getMoneyUseType = () =>
  http.request<Result<{ list: any[] }>>("get", "/backend/money/useType");

// 進出款型別字典（舊：getInOutType，GET /backend/money/inOutType）

export const getMoneyInOutType = () =>
  http.request<Result<{ list: any[] }>>("get", "/backend/money/inOutType");

// 財審通過（舊：putFinancePass，PUT /backend/withdrawal/finance/pass，body）

export const putWithdrawalFinancePass = (data?: { orderSn: string; note: string }) =>
  http.request<Result<any>>("put", "/backend/withdrawal/finance/pass", { data });

// 財審退回（舊：putFinanceReject，PUT /backend/withdrawal/finance/reject，body）

export const putWithdrawalFinanceReject = (data?: {
  orderSn: string;
  note: string;
  rejectID: string | number;
}) =>
  http.request<Result<any>>("put", "/backend/withdrawal/finance/reject", { data });

// ===== 代理出款（payout_agency）相關 endpoint，沿用舊 endpoint 字串 =====
export interface AgencyWithdrawalDetailParams {
  id: string;
}
// 提款主資料

export interface GetPayoutInfoParams {
  orderSn: string;
}
// 手動出款資訊

export const getPayoutInfo = (params: GetPayoutInfoParams) =>
  http.request<Result<any>>("get", "/backend/withdrawal/payout/info", { params });

// 查詢三方回調狀態（舊 Vben 用 post body）

export const postWithdrawalCallback = (data?: { id?: number }) =>
  http.request<Result<any>>("post", "/backend/withdrawal/callback", { data });

export interface PostWithdrawalPayData {
  orderSN: string;
  type?: number;
  id?: number;
  amount?: number;
  fee?: number;
  otherAmount?: number;
  exchangeRate?: number;
}
// 手動出款

export const postWithdrawalPay = (data: PostWithdrawalPayData) =>
  http.request<Result<any>>("post", "/backend/withdrawal/pay", { data });

// 出款單轉失敗（舊碼 defHttp.post({url, params}) 之 params 實為 body，轉成 data）

export const payoutToFail = (data: { id: number; reason: string }) =>
  http.request<Result<any>>("post", "/backend/withdrawal/payout/fail", { data });

// 出款單轉成功

export const payoutToSuccess = (data: { id: number; reason: string }) =>
  http.request<Result<any>>("post", "/backend/withdrawal/payout/success", { data });

// 出款可選銀行卡清單（沿用 /backend/pay_bankcard/bankcards）

export const getPayoutBankCardList = (params?: { type?: number; status?: number }) =>
  http.request<Result<{ list: any[]; total?: number }>>("get", "/backend/pay_bankcard/bankcards", { params });

// 出款可選三方通道清單（沿用 /backend/pay/pay_channel）

export const getPayoutPayChannel = (params?: { supplyAp?: boolean }) =>
  http.request<Result<{ list: any[]; total?: number }>>("get", "/backend/pay/pay_channel", { params });

// 出款可選 USDT 清單（沿用 /backend/pay/usdt）

export const getPayoutUsdtList = (params?: { type?: number; status?: number }) =>
  http.request<Result<{ list: any[]; total?: number }>>("get", "/backend/pay/usdt", { params });

// ==== 提款風控審核 risk_check 模組（沿用舊 endpoint）====
// 提款管理：取得會員資訊（依提單號）
export const getRiskMemberInfo = (params: { id: string }) =>
  http.request<Result<any>>("get", "/backend/withdrawal/member/info", { params });

// 提款管理：提單列表（取單筆提單狀態與風控狀態）

export const getRiskWithdrawal = (params: {
  orderSn: string;
  withdrawalStart?: string;
  withdrawalEnd?: string;
}) => http.request<Result<{ list: any[]; total: number }>>("get", "/backend/withdrawal", { params });

// 提款管理：取得流水明細（樹狀，children 欄位為 list）

export const getRiskStake = (params: { id: any; startTime?: string; endTime?: string }) =>
  http.request<Result<any>>("get", "/backend/withdrawal/betting", { params });

// 提款管理：風控進入審核（鎖定提示），舊碼 defHttp.post 的 params 實為 body

export const postRiskAuditLock = (data: { id: string }) =>
  http.request<Result<{ adminAccount: string }>>("post", "/backend/withdrawal/riskaudit", { data });

// 提款管理：風控審核（通過 / 退回），舊碼 defHttp.put 的 params 實為 body

export const putRiskCheck = (data: {
  orderSn: string | number;
  status: number;
  note: string;
  rejectID?: string | number;
}) => http.request<Result<any>>("put", "/backend/withdrawal/risk/check", { data });

// 會員：錢包資料

export const getRiskWalletDetail = (params: { id: any }) =>
  http.request<Result<any>>("get", "/backend/member/detail/money", { params });

// 會員：生涯資料

export const getRiskCareer = (params: { memberID: any }) =>
  http.request<Result<any>>("get", "/backend/member/career", { params });

// 會員：優惠明細

export const getRiskPromotionDetail = (params: {
  memberID: any;
  sendAtStart?: string;
  sendAtEnd?: string;
  status?: number;
  walletType?: number;
}) => http.request<Result<{ list: any[] }>>("get", "/backend/promotion/member/list", { params });

// 會員：標籤

export const getRiskMemberTag = (params: { id: any }) =>
  http.request<Result<{ list: any[] }>>("get", "/backend/member/tag", { params });

// 會員：備註

export const getRiskComments = (params: { id: any }) =>
  http.request<Result<{ list: any[] }>>("get", "/backend/member/comments", { params });

// 會員：資金記錄（提款風控專用列表）

export const getRiskWalletLog = (params: any) =>
  http.request<Result<{ list: any[] }>>("get", "/backend/member/walletlogs/withdrawallist", {
    params
  });

// 金流：使用類型字典

export const getRiskUseType = () =>
  http.request<Result<{ list: any[] }>>("get", "/backend/money/useType");

// 金流：收支類型字典

export const getRiskInOutType = () =>
  http.request<Result<{ list: any[] }>>("get", "/backend/money/inOutType");

// 標籤分組（顏色對應）

export const getRiskTagGroup = () =>
  http.request<Result<{ list: any[] }>>("get", "/backend/member/tag/groups");

// ===== 提款財務審核 financial_check 模組所需 (沿用舊 endpoint) =====
export interface UseTypeItem {
  useTypeID: number;
  useTypeName: string;
  useTypeEnName?: string;
  color?: string;
}

export interface InOutTypeItem {
  inOutTypeID: number;
  inOutTypeName: string;
}

/** 提款列表 / 單筆提款查詢（沿用 GET /backend/withdrawal） */

export const getWithdrawalList = (params?: any) =>
  http.request<Result<any>>("get", "/backend/withdrawal", { params });

/** 會員提款資訊 GET /backend/withdrawal/member/info */

export const getWithdrawalMemberInfo = (params?: { id: string | number }) =>
  http.request<Result<any>>("get", "/backend/withdrawal/member/info", { params });

/** 流水明細 GET /backend/withdrawal/betting */

export const getWithdrawalStake = (params?: any) =>
  http.request<Result<any>>("get", "/backend/withdrawal/betting", { params });

/** 歷史提款帳號 GET /backend/withdrawal/history */

export const getWithdrawalHistory = (params: { id: number }) =>
  http.request<Result<any>>("get", "/backend/withdrawal/history", { params });

/** 流水稽核列表 GET /backend/withdrawal/turnover/list */

export const getWithdrawalTurnoverList = (params?: any) =>
  http.request<Result<any>>("get", "/backend/withdrawal/turnover/list", { params });

/** 流水稽核通過 POST /backend/withdrawal/turnover/pass（舊碼 params 實為 body） */

export const postWithdrawalTurnoverPass = (data?: any) =>
  http.request<Result<any>>("post", "/backend/withdrawal/turnover/pass", { data });

/** 一鍵洗碼 POST /backend/withdrawal/smooth */

export const postWithdrawalSmooth = (memberID?: number) =>
  http.request<Result<any>>("post", "/backend/withdrawal/smooth", {
    data: { memberID }
  });

/** 財務通過 PUT /backend/withdrawal/finance/pass */

export const putWithdrawalFinanceSubmitRisk = (data?: {
  orderSn: string;
  note: string;
}) =>
  http.request<Result<any>>("put", "/backend/withdrawal/finance/submitrisk", { data });

/** 錢包紀錄（提款用） GET /backend/member/walletlogs/withdrawallist */

export const getWithdrawalWalletLog = (params?: any) =>
  http.request<Result<{ list: any[]; total?: number }>>(
    "get",
    "/backend/member/walletlogs/withdrawallist",
    { params }
  );

/** 資金用途類型 GET /backend/money/useType */

export const getMemberTag = (id?: number) =>
  http.request<Result<{ list: any[] }>>("get", "/backend/member/tag", {
    params: { id }
  });

/** 優惠領取（提款用） GET /backend/promotion/member/withdrw */

export const getPromotionMemberWithdraw = (params?: any) =>
  http.request<Result<{ list: any[] }>>(
    "get",
    "/backend/promotion/member/withdrw",
    { params }
  );

/** 調整申請查詢 GET /backend/adjustment/search */

export const getAdjustmentSearch = (params?: any) =>
  http.request<Result<{ list: any[] }>>("get", "/backend/adjustment/search", {
    params
  });

// ===== 提现时间轴 timeline 模组 =====
export type TimelineBetItem = {
  game_list_id: number | string;
  gameGroupDisplayName: string;
  gameGroupName: string;
  typeName: string;
  typeSecondName: string;
  betAmount: number | string;
  winAmount: number | string;
  withdrawalTurnover: number | string;
  vipTurnover: number | string;
  eventTurnover: number | string;
};

export type TimelineItem = {
  useTypeID: number;
  color: string;
  beforeMoney: number | string;
  adjustMoney: number | string;
  afterMoney: number | string;
  turnoverMultiple: number | string;
  turnoverLimit: number | string;
  note: string;
  right: {
    startTime: string;
    endTime: string;
    bets: TimelineBetItem[];
  };
};

export type MoneyUseTypeItem = {
  useTypeID: number;
  useTypeName: string;
  useTypeEnName: string;
};

/** 提现时间轴列表（沿用旧 endpoint /backend/withdrawal/timeline，GET 带 route.query 如 memberID） */

export const getWithdrawalTimeline = (params?: object) => {
  return http.request<Result<{ list: TimelineItem[]; total?: number }>>(
    "get",
    "/backend/withdrawal/timeline",
    { params }
  );
};

/** 用途类型对照表（沿用旧 endpoint /backend/money/useType） */

// ===== 出款頁 payout 模組相關 API（沿用舊 endpoint）=====
// 注意：函式採模組化命名避免跨模組碰撞；Result<T> 型別由 api 檔頭統一定義，勿重複宣告。
// 取得會員/提款基本資訊（舊：getMemberInfo, /backend/withdrawal/member/info）
export const getPayoutMemberInfo = (params: { id: string }) =>
  http.request<Result<any>>("get", "/backend/withdrawal/member/info", { params });

// 取得出款單資訊（舊：getPayoutInfo, /backend/withdrawal/payout/info）

export const getPayoutWithdrawHistory = (params: { id: string }) =>
  http.request<Result<any>>("get", "/backend/withdrawal/history", { params });

// 手動出款（舊：postWithdrawalPay, /backend/withdrawal/pay；舊 post 的 params 實為 body → 改 data）

export const postPayoutPay = (data: {
  orderSN: string;
  type?: number;
  id?: number;
  amount?: number;
  fee?: number;
  otherAmount?: number;
  exchangeRate?: number;
}) => http.request<Result<any>>("post", "/backend/withdrawal/pay", { data });

// 查詢三方回調狀態（舊：postWithdrawalCallback, /backend/withdrawal/callback；params→data）

export const postPayoutCallback = (data: { id?: number }) =>
  http.request<Result<any>>("post", "/backend/withdrawal/callback", { data });

// 出款單轉失敗（舊：payoutToFail, /backend/withdrawal/payout/fail；params→data）
