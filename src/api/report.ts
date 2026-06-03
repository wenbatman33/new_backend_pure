import { http } from "@/utils/http";

/** 後端統一回應格式 */
type Result<T = any> = {
  success: boolean;
  data: T;
};


// ===== report/promotion 优惠报表 =====
export interface GetPromotionReportParams {
  /** 报表类型：1 日 / 2 周 / 3 月 */
  type: number;
  reportStart: string;
  reportEnd: string;
  agencyID?: string;
  walletType?: number;
}

export interface PromotionReportDetail {
  promotionID: number | string;
  promotionName: string;
  bonus: number | string;
  memberCnt: number | string;
}

export interface PromotionReportData {
  list: Array<{ date: string; list: PromotionReportDetail[] }>;
  bonus: Array<{
    promotionID: number | string;
    bonus: number | string;
    memberCnt: number | string;
  }>;
  total: number | string;
}

/** 优惠报表查询（沿用旧 endpoint /backend/report/promotion，GET 带 query） */

export const getPromotionReport = (params: GetPromotionReportParams) => {
  return http.request<Result<PromotionReportData>>(
    "get",
    "/backend/report/promotion",
    { params }
  );
};

// ===== report / gameSummary 模組 =====
// 沿用舊 endpoint：
//   /backend/game/summery (get)        游戏厂商日报表
//   /game/game/log/noc_manual (get)    手动补流水
//   /game/game/log/manual (delete)     清除手动补流水 Task
//   /backend/bettinglog/setting        厂商流水帐设定 CRUD
//   /backend/game/dropdown (get)       游戏厂商下拉（取代未移植的 @/utils/dropdown gameOptions）
export interface GameSummaryItem {
  date: string;
  name: string;
  betAmount: number;
  totalBetAmount: number;
}

export interface BettingLogItem {
  id: number;
  gameGroupID: number | string;
  gameGroupName: string;
  timeColumn: string;
  statusFilter: number;
  statusFilterString: string;
}

export interface GameGroupDropdown {
  gameGroup: Array<{ label: string; value: string | number; name?: string }>;
}

/** 游戏厂商日报表 */

export const getReport = (params: {
  start: string;
  end: string;
  gameGroupID: string | number;
}) => {
  return http.request<Result<{ list: GameSummaryItem[]; total: number }>>(
    "get",
    "/backend/game/summery",
    { params }
  );
};

/** 手动补流水（舊 defHttp.get，沿用 get + query） */

export const addTaskNoc = (params: {
  startTime: string;
  endTime: string;
  module: string | number;
}) => {
  return http.request<Result<null>>("get", "/game/game/log/noc_manual", {
    params
  });
};

/** 清除手动补流水 Task 状态 */

export const deleteTask = () => {
  return http.request<Result<null>>("delete", "/game/game/log/manual");
};

/** 厂商流水帐设定 - 列表 */

export const getBettingLog = (params?: Record<string, any>) => {
  return http.request<Result<{ list: BettingLogItem[]; total: number }>>(
    "get",
    "/backend/bettinglog/setting",
    { params }
  );
};

/** 厂商流水帐设定 - 新增（舊 defHttp.post 的 params 实为 body → 新碼用 data） */

export const addBettingLog = (data: Record<string, any>) => {
  return http.request<Result<any>>("post", "/backend/bettinglog/setting", {
    data
  });
};

/** 厂商流水帐设定 - 修改 */

export const updateBettingLog = (data: Record<string, any>) => {
  return http.request<Result<null>>("put", "/backend/bettinglog/setting", {
    data
  });
};

/** 厂商流水帐设定 - 删除（沿用旧碼 query 带 id） */

export const delBettingLogById = (id: number | string) => {
  return http.request<Result<null>>("delete", "/backend/bettinglog/setting", {
    params: { id }
  });
};

/** 游戏厂商下拉（取代旧 gameOptions().gameGroup；后端 endpoint 假设为 /backend/game/dropdown） */

export const getGameGroupDropdown = () => {
  return http.request<Result<GameGroupDropdown>>(
    "get",
    "/backend/game/dropdown"
  );
};

// ===== 营运报表 operation =====
// 营运报表合计资料结构（含最后更新时间 lastUpdatedAt）
export interface OperationReportTotal {
  lastUpdatedAt?: string;
  [key: string]: any;
}

export interface OperationReportResult {
  list: any[];
  total: OperationReportTotal;
}

/** 取得营运报表（沿用旧 endpoint /backend/report/operation；GET 带查询参数） */

export const getReportLgGame = (params?: object) => {
  return http.request<Result<any>>("get", "/backend/report/lg/game", {
    params
  });
};

/** 手动重算会员每日游戏报表 */

export const getReportToolRecalcReportMemberDailyGame = (params?: object) => {
  return http.request<Result<any>>(
    "get",
    "/backend/report/tool/recalcReportMemberDailyGame",
    { params }
  );
};

// 上下分報表查詢（沿用舊 endpoint /backend/report/adjustment）
export interface ReportAdjustmentRow {
  date: string;
  amountAdd: number;
  amountSub: number;
  applyCount: number;
  applyMember: number;
  approvedMember: number;
  applyAmount: number;
  approvedAmount: number;
  children?: ReportAdjustmentRow[];
}

export interface ReportAdjustmentParams {
  reportDateStart: string;
  reportDateEnd: string;
  reportType: string; // d 日 / w 週 / m 月
  adjustmentType?: string; // "" 全部 / "1" 上分 / "2" 下分
  agencyAccount?: string;
  reason?: number;
}

/** 取得上下分報表（樹狀彙總） */

export const getReportAdjustment = (params: ReportAdjustmentParams) => {
  return http.request<Result<{ list: ReportAdjustmentRow[]; total: number }>>(
    "get",
    "/backend/report/adjustment",
    { params }
  );
};

// ===== report / deposit 存款報表 =====
// 存款報表通用查詢參數
export interface GetDepositReportParams {
  reportDateStart?: string;
  reportDateEnd?: string;
  serviceCode?: string;
}

// 人數存款報表單列

export interface DepositPeopleReportItem {
  reportDate?: string;
  serviceCode?: string;
  uniquePeople?: number;
  firstPeople?: number;
  depositNum?: number;
  amount?: number;
  avgAmount?: number;
  fee?: number;
  actualAmount?: number;
  memberAmount?: number;
  agencyAmount?: number;
  depositRate?: number | string;
  updatedAt?: string;
}

// 人數存款報表回傳

export interface GetDepositPeopleReportResultModel {
  list?: DepositPeopleReportItem[];
  count?: number;
  totalDepositNum?: number;
  totalAmount?: number;
  totalFee?: number;
  totalActualAmount?: number;
  totalMemberAmount?: number;
  totalAgencyAmount?: number;
  updatedAt?: string;
}

// 金額區間存款報表單列

export interface DepositAmountRangeReportItem {
  reportDate?: string;
  serviceCode?: string;
  amount100?: number;
  amount500?: number;
  amount1000?: number;
  amount2000?: number;
  amount6000?: number;
  amount10000?: number;
  amount20000?: number;
  amountMore20000?: number;
  updatedAt?: string;
}

// 金額區間存款報表回傳

export interface GetDepositAmountRangeReportResultModel {
  list?: DepositAmountRangeReportItem[];
  count?: number;
  totalAmount100?: number;
  totalAmount500?: number;
  totalAmount1000?: number;
  totalAmount2000?: number;
  totalAmount6000?: number;
  totalAmount10000?: number;
  totalAmount20000?: number;
  totalAmountMore20000?: number;
  updatedAt?: string;
}

// 支付方式下拉項目（沿用舊 payChannelService dropdown，key->value）

export interface ServiceDropdownItem {
  [key: string]: unknown;
}

export interface GetServiceDropdownResponse {
  serviceCode: ServiceDropdownItem[];
  [key: string]: unknown;
}

/** 取得日存款報表（人數統計） */

export const getDepositPeopleReport = (params?: GetDepositReportParams) =>
  http.request<Result<GetDepositPeopleReportResultModel>>(
    "get",
    "/backend/report/deposit/people_report",
    { params }
  );

/** 取得週存款報表（人數統計） */

export const getDepositPeopleWeekReport = (params?: GetDepositReportParams) =>
  http.request<Result<GetDepositPeopleReportResultModel>>(
    "get",
    "/backend/report/deposit/people_week_report",
    { params }
  );

/** 取得月存款報表（人數統計） */

export const getDepositPeopleMonthReport = (params?: GetDepositReportParams) =>
  http.request<Result<GetDepositPeopleReportResultModel>>(
    "get",
    "/backend/report/deposit/people_month_report",
    { params }
  );

/** 取得日存款報表（金額區間統計） */

export const getDepositAmountRangeReport = (params?: GetDepositReportParams) =>
  http.request<Result<GetDepositAmountRangeReportResultModel>>(
    "get",
    "/backend/report/deposit/amount_range_report",
    { params }
  );

/** 取得週存款報表（金額區間統計） */

export const getDepositAmountRangeWeekReport = (params?: GetDepositReportParams) =>
  http.request<Result<GetDepositAmountRangeReportResultModel>>(
    "get",
    "/backend/report/deposit/amount_range_week_report",
    { params }
  );

/** 取得月存款報表（金額區間統計） */

export const getDepositAmountRangeMonthReport = (params?: GetDepositReportParams) =>
  http.request<Result<GetDepositAmountRangeReportResultModel>>(
    "get",
    "/backend/report/deposit/amount_range_month_report",
    { params }
  );

/** 取得支付方式下拉（搜尋列 serviceCode 用，沿用舊 payChannelService endpoint） */

export const getServiceDropdown = () =>
  http.request<Result<GetServiceDropdownResponse>>(
    "get",
    "/backend/pay_channel_service/dropdown"
  );

// ===== report/winner 輸贏報表 =====
// 沿用舊 endpoint：/backend/report/winner、/backend/report/winner/rank
// 遊戲廠商群組沿用 gameLog 的 /backend/bettinglog/group/list
export interface WinnerItem {
  topAgencyID: number;
  agencyID: number;
  memberID: number;
  memberAccount: string;
  betCnt: number;
  betAmount: number;
  eventBetAmount: number;
  killNum: number;
  profit: number;
  deposit: number;
  depositCount: number;
  withdraw: number;
  withdrawCount: number;
  bonus: number;
}

export interface WinnerListData {
  list: WinnerItem[];
  total: number;
  updatedAt?: string;
}

/** 輸贏報表列表 */

export const getWinnerReport = (params: any) => {
  return http.request<Result<WinnerListData>>(
    "get",
    "/backend/report/winner",
    { params }
  );
};

/** 匯出排行榜（產生後導向 winnerRank 頁） */

export const winnerReportRank = (params: any) => {
  return http.request<Result<any>>("get", "/backend/report/winner/rank", {
    params
  });
};

/** 遊戲廠商群組清單（搜尋下拉用） */

export const getWinnerGameGroups = (params: any) => {
  return http.request<Result<{ list: Array<{ id: number; name: string }> }>>(
    "get",
    "/backend/bettinglog/group/list",
    { params }
  );
};

// ===== 自訂會員報表 customMember (sip 用舊 endpoint /backend/report/custom*) =====
// 列表
export const getCustomMemberList = (params?: any) =>
  http.request<Result<{ list: any[]; total: number }>>(
    "get",
    "/backend/report/custom/list",
    { params }
  );

// 取得單筆（編輯/複製/檢視）

export const getCustomMember = (params: { id: number | string }) =>
  http.request<Result<any>>("get", "/backend/report/custom", { params });

// 新增（舊 defHttp.post 的 params 實為 body，故用 data）

export const postCustomMember = (data: any) =>
  http.request<Result<any>>("post", "/backend/report/custom", { data });

// 編輯（舊 defHttp.put 的 params 實為 body，故用 data）

export const putCustomMember = (data: any) =>
  http.request<Result<any>>("put", "/backend/report/custom", { data });

// 刪除（舊碼以 query string 帶 id）

export const deleteCustomMemberById = (id: number | string) =>
  http.request<Result<any>>("delete", `/backend/report/custom?id=${id}`);

// 報表查詢

export const getCustomMemberReport = (params: { id: number | string }) =>
  http.request<Result<{ list: any[]; total: number }>>(
    "get",
    "/backend/report/custom/report",
    { params }
  );

// VIP 等級設定清單（沿用舊 member api endpoint）

export const getVipSettingList = () =>
  http.request<Result<{ list: { level: number }[] }>>(
    "get",
    "/backend/member/vip/setting/list"
  );

// 注意：Result<T> = { success: boolean; data: T } 由 api 檔頭統一定義，勿重複宣告；http 亦勿重複 import
// 會員相關報表列表回應型別
export type MemberReportListResult = Result<{
  list: Array<Record<string, any>>;
  total: Record<string, any>;
}>;

// 會員相關報表（沿用舊 endpoint /backend/report/memberrelated；舊碼為 defHttp.get 帶 query）

export const getMemberReport = (params?: object) => {
  return http.request<MemberReportListResult>(
    "get",
    "/backend/report/memberrelated",
    { params }
  );
};

// ===== 加進 src/api/report.ts（沿用舊 endpoint /backend/report/game）=====
// 遊戲報表合計列
export interface GameReportTotal {
  betAmount: string | number;
  kill: string | number;
  winAmount: string | number;
  betPeople: string | number;
  betCount: string | number;
  lastUpdatedAt: string;
}
// 遊戲報表單筆

export interface GameReportItem {
  reportDate: string;
  betAmount: string | number;
  kill: string | number;
  winAmount: string | number;
  betPeople: string | number;
  betCount: string | number;
}

export interface GameReportData {
  list: GameReportItem[];
  total: GameReportTotal;
}

/** 遊戲報表查詢（GET，查詢條件走 params） */

export const getGameReport = (params?: object) => {
  return http.request<Result<GameReportData>>("get", "/backend/report/game", {
    params
  });
};

/** 手動更新遊戲報表（GET，無參數） */

export const gameReportRefresh = () => {
  return http.request<Result<null>>("get", "/backend/report/game/refresh");
};

// === 自定義聯賽報表 customLeague（沿用舊 endpoint） ===
// 注意：Result<T> 與 http 由主程式於 src/api/report.ts 檔頭統一定義，勿重複宣告。
export interface LeagueOption {
  leagueID: number;
  leagueName: string;
}

export interface ReportLeagueCell {
  leagueID: number;
  betPeople: number;
  betAmount: number;
  betAmountText?: string;
  totalBetAmount?: number;
  totalBetAmountText?: string;
  winAmount: number;
  winAmountText?: string;
  [k: string]: any;
}

export interface ReportRow {
  date: string;
  list: ReportLeagueCell[];
  [k: string]: any;
}

export interface ReportTotalCell {
  leagueID: number;
  totalBetPeople: number;
  totalBetAmount: number;
  totalBetAmountText?: string;
  totalTotalBetAmount?: number;
  totalTotalBetAmountText?: string;
  totalWinAmount: number;
  totalWinAmountText?: string;
  [k: string]: any;
}

export interface DetailRow {
  memberAccount: string;
  betCount: number;
  betAmount: number;
  winAmount: number;
}

export interface DetailTotal {
  totalBetCount: number;
  totalBetAmount: number;
  totalWinAmount: number;
}

// 取得聯賽清單（篩選器選項） GET /backend/league/custom/list

export const getLeagueList = (params?: object) =>
  http.request<Result<{ list: LeagueOption[] }>>(
    "get",
    "/backend/league/custom/list",
    { params }
  );

// 取得報表列表 GET /backend/league/custom/log/list

export const getCustomLeagueReport = (params: object) =>
  http.request<Result<{ list: ReportRow[]; total: ReportTotalCell[] }>>(
    "get",
    "/backend/league/custom/log/list",
    { params }
  );

// 取得報表詳情（會員層級） GET /backend/league/custom/log/list/detail

export const getCustomLeagueDetail = (params: object) =>
  http.request<Result<{ list: DetailRow[]; total: DetailTotal }>>(
    "get",
    "/backend/league/custom/log/list/detail",
    { params }
  );

// 匯出 URL（前端 exportExcel 直接帶字串，不需 api 函式）：
//   報表匯出：/backend/league/custom/log/list/export
//   詳情匯出：/backend/league/custom/log/list/detail/export

// ===== 廣告點擊報表 (report/bannerClick) =====
// 沿用舊 endpoint：列表 /backend/report/page/log/view、詳細 /backend/report/page/log/view/detail
// 匯出 /backend/report/page/log/view/export 走 exportExcel 直連下載，不經 http。
// 廣告名稱下拉沿用舊 /backend/site/banner（getBanner）。
export type BannerClickRow = {
  date: string;
  clickTotal: number | string;
  clickGuest: number | string;
  clickMember: number | string;
  countMember: number | string;
};

export type BannerClickListResult = Result<{
  list: BannerClickRow[];
  total: number;
  // 後端回傳合計列資料
  summary?: Record<string, number | string>;
}>;

export type BannerClickDetailResult = Result<{
  list: Array<{
    bannerID: number | string;
    bannerTitle: string;
    clickTotal: number | string;
    clickGuest: number | string;
    clickMember: number | string;
    countMember: number | string;
  }>;
  total: number;
  summary?: Record<string, number | string>;
}>;

/** 廣告點擊報表 - 每日彙總列表 */

export const getPageLogView = (params?: object) => {
  return http.request<BannerClickListResult>(
    "get",
    "/backend/report/page/log/view",
    { params }
  );
};

/** 廣告點擊報表 - 單日詳細記錄（依廣告細分） */

export const getPageLogViewDetail = (params?: object) => {
  return http.request<BannerClickDetailResult>(
    "get",
    "/backend/report/page/log/view/detail",
    { params }
  );
};

/** 廣告名稱下拉選項（沿用舊 /backend/site/banner，取 list.title） */

export const getBannerOptions = (params?: object) => {
  return http.request<Result<{ list: Array<{ id: number; title: string }> }>>(
    "get",
    "/backend/site/banner",
    { params }
  );
};

// ===== 聯賽輸贏報表 leagueWinReport（沿用舊 endpoint）=====
export function getReportLeagueWin(params?: object) {
  return http.request<Result<{ list: any[] }>>(
    "get",
    "/backend/bettinglog/report/league/win",
    { params }
  );
}

/** 運動下拉（含 gameGroup 清單） */

export function getDropdownSport() {
  return http.request<Result<{ gameGroup: { id: string; name: string }[] }>>(
    "get",
    "/backend/game/dropdown/list/sport"
  );
}

/** 注單聯動下拉（sport/league/team/betType） */

export function getDropdownBettingLog(params?: object) {
  return http.request<
    Result<{
      sport: string[];
      league: string[];
      team: string[];
      betType: string[];
    }>
  >("get", "/backend/game/dropdown/list/bettingLog", { params });
}

// ===== report/withdraw 提款報表 =====
// 取得日提款報表（以人數統計）
export const getWithdrawPeopleReport = (params?: { reportDateStart?: string; reportDateEnd?: string }) =>
  http.request<Result<any>>("get", "/backend/report/withdraw/people_report", { params });

// 取得週提款報表（以人數統計）

export const getWithdrawPeopleWeekReport = (params?: { reportDateStart?: string; reportDateEnd?: string }) =>
  http.request<Result<any>>("get", "/backend/report/withdraw/people_week_report", { params });

// 取得月提款報表（以人數統計）

export const getWithdrawPeopleMonthReport = (params?: { reportDateStart?: string; reportDateEnd?: string }) =>
  http.request<Result<any>>("get", "/backend/report/withdraw/people_month_report", { params });

// 取得日提款報表（以金額區間統計）

export const getWithdrawAmountRangeReport = (params?: { reportDateStart?: string; reportDateEnd?: string }) =>
  http.request<Result<any>>("get", "/backend/report/withdraw/amount_range_report", { params });

// 取得週提款報表（以金額區間統計）

export const getWithdrawAmountRangeWeekReport = (params?: { reportDateStart?: string; reportDateEnd?: string }) =>
  http.request<Result<any>>("get", "/backend/report/withdraw/amount_range_week_report", { params });

// 取得月提款報表（以金額區間統計）

export const getWithdrawAmountRangeMonthReport = (params?: { reportDateStart?: string; reportDateEnd?: string }) =>
  http.request<Result<any>>("get", "/backend/report/withdraw/amount_range_month_report", { params });

// ===== 以下函式請併入 src/api/report.ts（沿用舊 endpoint）。Result<T> 由 api 檔頭定義，勿重複宣告 =====
export const getReportLgGameList = (params?: any) =>
  http.request<Result>("get", "/backend/report/lg/game/list", { params });

/** 投注人數會員明細列表（GET；回 { list, total }） */

export const getReportLgGameMemberList = (params?: any) =>
  http.request<Result>("get", "/backend/report/lg/game/member/list", { params });

/** 遊戲廠商/類型/遊戲下拉（GET；回 { gameGroup, gameType, gameList }） */

export const getGameDropdownList = () =>
  http.request<Result>("get", "/backend/game/dropdown/list");

/** 遊戲報表匯出 endpoint（給 @/utils/report 的 exportExcel 使用，非 http.request） */

export const reportLgGameListExportUrl = "/backend/report/lg/game/list/export";

// 風控報表（report/risk）— 沿用舊 endpoint
// 舊 Vben 慣例：put/delete 的 params 實為 body / query，已按 playbook 轉正
export const getRiskReport = (params?: object) =>
  http.request<Result>("get", "/backend/report/risk", { params });

export const updateRiskReport = (data: object) =>
  http.request<Result>("put", "/backend/report/risk", { data });

export const getRiskDropdown = () =>
  http.request<Result>("get", "/backend/report/risk/dropdown");

// 舊碼為 DELETE /backend/report/risk?IDs=xxx，改用 params 傳 query

export const deleteRiskReport = (IDs: string) =>
  http.request<Result>("delete", "/backend/report/risk", { params: { IDs } });

export const calcRiskToday = () =>
  http.request<Result>("get", "/backend/report/risk/calc_today");

// ===== 游戏类型组报表 gameGroup（沿用旧 endpoint）=====
// 报表查询参数
export interface GameGroupReportParams {
  reportDateStart: string;
  reportDateEnd: string;
  memberAccount?: string;
  includesTest?: number;
}

// 报表列（树状：父层为游戏类型，children 为厂商明细）

export interface GameGroupReportRow {
  gameGroupID?: number | string;
  gameGroupName?: string;
  gameTypeName?: string;
  betAmount?: number | string;
  kill?: number | string;
  totalWinAmount?: number | string;
  betPeople?: number | string;
  betCount?: number | string;
  eventBetAmount?: number | string;
  children?: GameGroupReportRow[];
}

// list endpoint 实际回传：list 内每项为 { gameTypeData, data:[厂商明细] }

export interface GameGroupReportListItem {
  gameTypeData: GameGroupReportRow;
  data: GameGroupReportRow[];
}

// 取得游戏类型组报表

export const getGameGroupReport = (params: GameGroupReportParams) => {
  return http.request<Result<{ list: GameGroupReportListItem[]; total: number }>>(
    "get",
    "/backend/report/gamegroup/list",
    { params }
  );
};

// 取得报表合计（list[0] 为合计列，含 lastUpdatedAt）

export const getGameGroupReportTotal = (params: GameGroupReportParams) => {
  return http.request<Result<{ list: GameGroupReportRow[]; total: number }>>(
    "get",
    "/backend/report/gamegroup/total",
    { params }
  );
};

// 手动刷新报表

export const refreshGameGroupReport = () => {
  return http.request<Result<null>>("get", "/backend/report/gamegroup/refresh");
};

// 营运报表（operation 模組專用；與 gameSummary 的 getReport 同名不同端點，故獨立命名）
export const getOperationReport = (params?: object) => {
  return http.request<Result<OperationReportResult>>(
    "get",
    "/backend/report/operation",
    { params }
  );
};
