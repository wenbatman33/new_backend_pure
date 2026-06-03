import { http } from "@/utils/http";

/** 後端統一回應格式 */
type Result<T = any> = {
  success: boolean;
  data: T;
};


// ===== finance_report / day_reconciliation 日對帳報表 =====
export interface DayReconciliationItem {
  id: number;
  payChannelSn: string;
  payChannelName: string;
  serviceName: string;
  serviceCode: string;
  startingSystemBalance: number;
  depositAmount: number;
  payoutAmount: number;
  payoutNum: number;
  settlementUAmount: number;
  settlementUNum: number;
  frozenAmount: number;
  endingSystemBalance: number;
  endingChannelBalance: number;
  endingBalanceDiff: number;
  note: string;
}

/** 日對帳列表查詢參數 */

export interface DayReconciliationListParams {
  reportDateStart: string;
  reportDateEnd: string;
  payChannelName?: string;
  payChannelSn?: string;
  balanceDiff?: number;
  balanceChange?: number;
}

/** 日對帳列表回傳（含 list 與各 total* 合計欄位） */

export interface DayReconciliationListResult {
  list: DayReconciliationItem[];
  count?: number;
  updatedAt?: string;
  totalStartingSystemBalance?: number;
  totalDepositAmount?: number;
  totalPayoutAmount?: number;
  totalPayoutNum?: number;
  totalSettlementUAmount?: number;
  totalSettlementNum?: number;
  totalFrozenAmount?: number;
  totalEndingSystemBalance?: number;
  totalEndingChannelBalance?: number;
  totalEndingBalanceDiff?: number;
}

/** 取得日對帳報表列表（沿用舊 endpoint /backend/report/channel/day_reconciliation） */

export const getDayReconciliationList = (params?: DayReconciliationListParams) =>
  http.request<Result<DayReconciliationListResult>>(
    "get",
    "/backend/report/channel/day_reconciliation",
    { params }
  );

/** 變更日對帳備註（舊 defHttp.put({params}) → body，故用 data） */

export const setDayReconciliationNote = (data: { id: number; note: string }) =>
  http.request<Result<null>>(
    "put",
    "/backend/report/channel/day_reconciliation",
    { data }
  );

/** 取得報表用商戶號下拉選項（沿用舊 endpoint /backend/pay/pay_channel/4report） */

export const getReportPayChannelOptions = () =>
  http.request<Result<{ list: { id: string | number; name: string }[] }>>(
    "get",
    "/backend/pay/pay_channel/4report"
  );

// ===== finance_report 域：單一線路進款表（single_reached_report）相關 =====
export interface SingleReachedReportItem {
  id: number;
  reportDate: string;
  reportHour: number | string;
  serviceCode?: string;
  payChannelServiceID?: number;
  payChannelServiceName?: string;
  depositNum: number;
  amount: number;
  note: string;
  updatedAt?: string;
  createdAt?: string;
}

/** 取得單一線路進款表查詢參數 */

export interface GetSingleChannelDepositParams {
  reportDateStart?: string;
  reportDateEnd?: string;
  reportHourStart?: string;
  reportHourEnd?: string;
  serviceCode?: string;
  payChannelServiceID?: number | string;
}

/** 取得單一線路進款表返回資訊 */

export interface SingleChannelDepositResult {
  list?: SingleReachedReportItem[];
  count?: number;
  totalDepositNum?: number;
  totalAmount?: number;
  updatedAt?: string;
}

/** 變更備註請求資訊 */

export interface PutSingleChannelDepositNoteData {
  id?: string;
  note?: string;
}

/** 線路搜尋下拉項目 */

export interface PayChannel4ReportItem {
  id: number;
  name: string;
}

/** 取得單一線路進款表 */

export const getChannelSingleChannelDepositReport = (
  params?: GetSingleChannelDepositParams
) =>
  http.request<Result<SingleChannelDepositResult>>(
    "get",
    "/backend/report/channel/single_channel_deposit",
    { params }
  );

/** 變更單一線路進款表備註（舊 Vben put 的 params 實為 body，改用 data） */

export const putChannelSingleChannelDepositNote = (
  data?: PutSingleChannelDepositNoteData
) =>
  http.request<Result<any>>(
    "put",
    "/backend/report/channel/single_channel_deposit_note",
    { data }
  );

/** 金流報表搜尋線路下拉選單 */

export const getSearchCheckbox = () =>
  http.request<Result<{ list: PayChannel4ReportItem[] }>>(
    "get",
    "/backend/pay/pay_channel/4report"
  );

// ===== 會員提款統計報表 / 金流群組（供 member_report_withdrawal 模組）=====
// 金流群組項目（三方 type=1 / 銀行卡 type=2）
export interface PayGroupItem {
  ID?: number;
  name?: string;
  type?: number;
}

// 取得會員提款報表（沿用舊 endpoint，注意 URL 中 Withdraw 首字母大寫）

export const getWithdrawMemberReport = (params?: Record<string, any>) =>
  http.request<Result<any>>("get", "/backend/report/Withdraw/member_report", {
    params
  });

// 取得金流組別列表（共用 endpoint；type=1 三方、type=2 銀行卡）

export const getPayGroups = (params?: { type?: number }) =>
  http.request<Result<{ list: PayGroupItem[]; total?: number }>>(
    "get",
    "/backend/pay_group/groups",
    { params }
  );

// ===== 會員存款報表 / 金流群組 =====
// 會員存款報表查詢參數
export interface GetDepositMemberReportParams {
  reportDateStart?: string; // 報表日期：開始 YYYY-MM-DD
  reportDateEnd?: string; // 報表日期：結束 YYYY-MM-DD
  currency?: string | number; // 幣別 [1:人民幣 2:USDT-ERC 3:USDT-TRC]
  showNum?: string | number; // 顯示筆數（排名）
  paymentGroup?: string | number; // 三方金流群組
  bankcardGroup?: string | number; // 銀行卡群組
  page?: number;
  pageSize?: number;
}

// 會員存款報表單筆

export interface DepositMemberReportItem {
  memberID?: number | string;
  memberName?: string;
  amount?: string | number;
  maxAmount?: string | number;
  minAmount?: string | number;
  avgAmount?: string | number;
  dayAvgAmount?: string | number;
  payGroupName?: string;
  bankGroupName?: string;
  registedDate?: string;
}

export interface DepositMemberReportResult {
  list: DepositMemberReportItem[];
  total: number;
  totalAmount?: string | number;
  updatedAt?: string;
}

// 取得會員存款報表（沿用舊 endpoint /backend/report/deposit/member_report）

export const getDepositMemberReport = (params?: GetDepositMemberReportParams) =>
  http.request<Result<DepositMemberReportResult>>(
    "get",
    "/backend/report/deposit/member_report",
    { params }
  );

// 金流群組查詢參數

export interface GetPayGroupsParams {
  type: number; // 1:三方金流 2:銀行卡
}

// ===== 時段對帳報表 hour_reconciliation 所需 api（沿用舊 endpoint）=====
// 沿用舊 /@/api/report/daily.ts 的 hour_reconciliation 與 /@/api/report/channel.ts 的 4report
export interface HourReconciliationRow {
  id?: number;
  payChannelSn?: string;
  payChannelName?: string;
  serviceCode?: string;
  startingSystemBalance?: number;
  depositAmount?: number;
  payoutAmount?: number;
  payoutNum?: number;
  settlementUAmount?: number;
  settlementUNum?: number;
  frozenAmount?: number;
  endingSystemBalance?: number;
  endingChannelBalance?: number;
  endingBalanceDiff?: number;
  note?: string;
}

// 後端 list 為「以時段名稱為 key」的物件，value 為 { list: HourReconciliationRow[] }

export interface HourReconciliationList {
  list: Record<string, { list: HourReconciliationRow[] }>;
}

export interface GetHourReconciliationParams {
  reportDateStart: string;
  reportDateEnd: string;
  reportHourStart?: number;
  reportHourEnd?: number;
  shift?: number;
  payChannelName?: string;
  payChannelSn?: string;
  balanceDiff?: number;
  balanceChange?: number;
}

/** 取得時段對帳報表 */

export const getHourReconciliationList = (
  params?: GetHourReconciliationParams
) =>
  http.request<Result<HourReconciliationList>>(
    "get",
    "/backend/report/channel/hour_reconciliation",
    { params }
  );

/** 變更時段對帳報表備註（舊 Vben put 的 params 實為 body，轉成 data） */

export const setHourReconciliationNote = (data: {
  id: number;
  note: string;
}) =>
  http.request<Result<any>>(
    "put",
    "/backend/report/channel/hour_reconciliation",
    { data }
  );

/** 取得報表用支付通道下拉 */

export const getPayChannel4Report = () =>
  http.request<Result<{ list: { id: string; name: string }[] }>>(
    "get",
    "/backend/pay/pay_channel/4report"
  );

// ===== 銀行卡明細（finance_report / bankcard_report）相關 =====
export interface GetBankCardLogParams {
  /** 交易時間開始 */
  logTimeStart?: string;
  /** 交易時間結束 */
  logTimeEnd?: string;
  /** 銀行卡號 */
  cardNo?: number | string;
  /** 科目（多選，逗號分隔字串） */
  subjects?: string;
  /** 排序[1倒序2正序] */
  orderBy?: number;
}

/** 銀行卡明細單筆 */

export interface BankCardLogItem {
  ID: number;
  logTime: string;
  bankcardID: number;
  subjectID: number;
  /** 收支類型[1收2支] */
  type: number;
  amount: number;
  fee: number;
  balance: number;
  tradeID: number;
  thirdParty: string;
  tradeObjectType: number;
  tradeObject: string;
  note: string;
  updatedUser: string;
  updatedAt: string;
}

/** 銀行卡明細：列表回應 */

export interface GetBankCardLogResponse {
  list: BankCardLogItem[];
  /** 總筆數 */
  count: number;
  /** 收入筆數 */
  countIn: number;
  /** 支出筆數 */
  countOut: number;
}

/** 銀行卡明細：增加/修改備註參數 */

export interface PostBankCardLogNoteParams {
  /** 銀行卡明細 ID */
  bankcardLogID: number;
  /** 備註 */
  note: string;
}

/** 銀行卡下拉：單筆銀行卡 */

export interface BankCardDropdownItem {
  id: number;
  card_no: string;
  account_name: string;
  /** 狀態[1啟用2停用] */
  status: number;
}

/** 銀行卡下拉回應 */

export interface GetBankCardDropdownResponse {
  bankcards: BankCardDropdownItem[];
}

/** 共用下拉：科目 */

export interface ChannelDropdownSubject {
  subjectID: number;
  name: string;
}

/** 共用下拉回應（僅取本模組需要的 subjects） */

export interface GetChannelDropdownResponse {
  subjects: ChannelDropdownSubject[];
}

/** 銀行卡明細：帳務明細列表 */

export const getBankCardLog = (params?: GetBankCardLogParams) => {
  return http.request<Result<GetBankCardLogResponse>>(
    "get",
    "/backend/pay_bankcard/log",
    { params }
  );
};

/** 銀行卡明細：增加/修改備註 */

export const postBankCardLogNote = (data: PostBankCardLogNoteParams) => {
  return http.request<Result<{ success: boolean }>>(
    "post",
    "/backend/pay_bankcard/note",
    { data }
  );
};

/** 取得銀行卡下拉清單 */

export const getBankCardDropdown = () => {
  return http.request<Result<GetBankCardDropdownResponse>>(
    "get",
    "/backend/pay_bankcard/dropdown"
  );
};

/** 取得共用下拉清單（含科目 subjects） */

export const getChannelDropdown = () => {
  return http.request<Result<GetChannelDropdownResponse>>(
    "get",
    "/backend/pay/pay_channel/dropdown"
  );
};

// ===== usdt_report（U 钱包帐变明细）相关，沿用旧 endpoint =====
export interface UsdtReportItem {
  id: number;
  createdAt: string;
  subjectID: number;
  /** 1=收入 2=支出 */
  type: number;
  amount: number;
  in: number;
  out: number;
  fee: number;
  balance: number;
  relationID: string;
  thirdID: string;
  targetName: string;
  editorName: string;
  note: string;
}

interface UsdtLogResult {
  list: UsdtReportItem[];
  total?: number;
  count?: number;
  countIn?: number;
  countOut?: number;
}

/** U 钱包帐变明细列表 GET /backend/pay/usdt/log */

export function getUcardLog(params?: object) {
  return http.request<Result<UsdtLogResult>>(
    "get",
    "/backend/pay/usdt/log",
    { params }
  );
}

/** U 钱包帐户下拉列表 GET /backend/pay/usdt */

export function getUcardList(params?: object) {
  return http.request<Result<{ list: { id: number; name: string }[]; total?: number }>>(
    "get",
    "/backend/pay/usdt",
    { params }
  );
}

/** 共用搜寻下拉（取 subjects 科目） GET /backend/pay/pay_channel/dropdown */

export function editUcardLogNote(data: { id: number; note: string }) {
  return http.request<Result<null>>(
    "put",
    "/backend/pay/usdt/log/note",
    { data }
  );
}

// 速度報表（存/提款各時段完成速度）
// 沿用舊 endpoint：/backend/report/payment/speed（舊 defHttp.get({url,params})）
export function getSpeedList(params?: { date?: string }) {
  return http.request<Result<SpeedResult>>(
    "get",
    "/backend/report/payment/speed",
    { params }
  );
}

// 速度報表回傳資料結構（陣列皆長度 24，對應 0~23 時段）

export interface SpeedResult {
  depositTotalSpeed: number;
  withdrawalTotalSpeed: number;
  depositCount: (number | string)[];
  depositAmount: (number | string)[];
  depositSpeed: (number | string)[];
  withdrawalCount: (number | string)[];
  withdrawalAmount: (number | string)[];
  withdrawalSpeed: (number | string)[];
  payoutSpeed: (number | string)[];
  withdrawalRiskCheckSpeed: (number | string)[];
  withdrawalFinancialCheckSpeed: (number | string)[];
}

// ===== finance_report 域：商戶號/線路帳務明細報表（paychannel_report）=====
// 沿用舊 endpoint：
//   getPayChannelLog        -> GET  /backend/pay/pay_channel/log（舊 api/payment/payChannel.ts）
//   putPayChannelLogNote    -> PUT  /backend/pay/pay_channel/log/note（同上）
//   getChannelDropdown      -> GET  /backend/pay/pay_channel/dropdown（舊 api/payment/payChannelService.ts）
//   getSearchCheckbox       -> GET  /backend/pay/pay_channel/4report（舊 api/report/channel.ts）
// 帳務明細列表單筆
export type PayChannelLogItem = {
  id: number;
  createdAt: string;
  subjectID: number;
  in: number;
  out: number;
  fee: number;
  remainBalance: number;
  frozenBalance: number;
  relationID: string;
  thirdID: string;
  targetName: string;
  editorName: string;
  note: string;
};

// 列表查詢回傳（含合計）

export type PayChannelLogResult = {
  list: PayChannelLogItem[];
  total: number;
  in: number;
  out: number;
  fee: number;
};

// 科目 + 線路下拉

export type ChannelDropdownResult = {
  subjects: { subjectID: number; name: string }[];
  payChannelService: { key: string; value: string; status: number }[];
};

// 報表商戶號下拉

export type SearchCheckboxResult = {
  list: { id: number; name: string; status: number }[];
  total: number;
};

/** 帳務明細：列表 + 合計 */

export const getPayChannelLog = (params?: object) =>
  http.request<Result<PayChannelLogResult>>(
    "get",
    "/backend/pay/pay_channel/log",
    { params }
  );

/** 帳務明細：修改備註（舊 Vben put 的 params 實為 body，轉成 data） */

export const putPayChannelLogNote = (data: { id: number; note: string }) =>
  http.request<Result<null>>("put", "/backend/pay/pay_channel/log/note", {
    data
  });

/** 取得科目 + 線路下拉清單 */

// ===== 沿用舊 endpoint，放入 src/api/finance_report.ts =====
// 注意：Result<T> 與 http 由主程式於檔頭定義/匯入，勿重複宣告
// 進款統計報表查詢參數
export interface GetChannelDepositParams {
  reportDateStart?: string;
  reportDateEnd?: string;
  reportHourStart?: string;
  reportHourEnd?: string;
  serviceCode?: string;
  payChannelServiceID?: string | number;
}

// 進款統計報表回傳

export interface GetChannelDepositResultModel {
  // 線路名稱對照（key -> 顯示名稱），亦可能為字串陣列
  channels?: Record<string, string> | string[];
  // 報表列資料
  list?: Record<string, any> | any[];
  count?: number;
  updatedAt?: string;
}

// 支付方式下拉項目（[{key: label}] 結構）

export type DropdownItem = Record<string, string>;

export interface GetServiceDropdownResponse {
  groups?: DropdownItem[];
  status?: DropdownItem[];
  serviceCode?: DropdownItem[];
  method?: DropdownItem[];
}

// 商戶號（線路 id）下拉回傳

export interface GetSearchCheckboxResult {
  list: Array<{ id: number; name: string }>;
}

/** 取得進款統計報表 */

export const getChannelDepositReport = (params?: GetChannelDepositParams) =>
  http.request<Result<GetChannelDepositResultModel>>(
    "get",
    "/backend/report/channel/deposit",
    { params }
  );

/** 取得支付方式下拉清單 */

export const getServiceDropdown = () =>
  http.request<Result<GetServiceDropdownResponse>>(
    "get",
    "/backend/pay_channel_service/dropdown"
  );

/** 取得商戶號（線路 id）搜尋下拉 */

// ===== 商戶號存提報表（payChannelDepositWithdraw）相關 =====
// 商戶號存提報表查詢參數
export interface GetPayChannelReportParams {
  payChannelIDList?: Array<number | string>;
  payGroupIdList?: Array<number | string>;
  reportDateStart?: string;
  reportDateEnd?: string;
  completedDateStart?: string;
  completedDateEnd?: string;
}

// 金流報表 / 商戶號存提報表

export const getPayChannelReport = (params?: GetPayChannelReportParams) =>
  http.request<Result<any>>(
    "get",
    "/backend/report/channel/deposit_withdraw",
    { params }
  );

// 商戶號存提報表搜尋選單（取得商戶號清單）
