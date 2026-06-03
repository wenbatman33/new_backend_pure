import { http } from "@/utils/http";

/** 後端統一回應格式 */
type Result<T = any> = {
  success: boolean;
  data: T;
};


// ===== 假数据工具 - 存款 deposit =====
// 线路列表
export function getChannelService() {
  return http.request<Result<{ list: { id: number; name: string }[] }>>(
    "get",
    "/backend/pay_channel_service"
  );
}

// 新增存款

export function createDeposit(data: Record<string, any>) {
  return http.request<Result<null>>("post", "/fake/tools/payment/deposit", {
    data
  });
}

// 搜寻存款列表

export function searchDeposit(params: Record<string, any>) {
  return http.request<Result<{ list: any[]; total: number }>>(
    "get",
    "/fake/tools/payment/deposit",
    { params }
  );
}

// 删除存款

export function delDeposit(data: { orderIDs: string[] }) {
  return http.request<Result<null>>("post", "/fake/tools/payment/deldeposit", {
    data
  });
}

// 重算会员基本报表存提（更新存款报表）

export function getReportDeposit(params: { startTime: string; endTime: string }) {
  return http.request<Result<{ list: any[]; total: number }>>(
    "get",
    "/backend/report/tool/recalcreportmemberdaily",
    { params }
  );
}

// ===== faketools / agency 相關 =====
// 沿用舊 endpoint：批次造帳、存款流水、報表重算；遊戲群組沿用 bettinglog/group/list
export interface BulkAgencyData {
  startNumber: number;
  endNumber: number;
  accountPrefix?: string;
  regDate?: string;
  childAgencyCnt?: number;
  memberCnt?: number;
}

export interface BulkMemberData {
  startNumber: number;
  endNumber: number;
  accountPrefix?: string;
  regDate?: string;
  agencyID?: number;
}

export interface DepositAndLogData {
  agencyIDs: string;
  memberCnt: number;
  depositAmount: number;
  gameAgency?: string;
  gameListID: number;
  bettingAmount: number;
  date?: string;
}

export interface ReportDateData {
  startTime: string;
  endTime: string;
}

export interface GameGroupItem {
  id: number;
  name: string;
}

// 批次建立代理（後端實為 post，但沿用舊碼以 get 帶 query）

export const bulkCreateAgency = (params: BulkAgencyData) =>
  http.request<Result<{ list: Array<{ agency_id: number; agency_account: string }> }>>(
    "get",
    "/fake/tools/batchgenagency",
    { params }
  );

// 批次建立代理直屬會員

export const bulkCreateMember = (params: BulkMemberData) =>
  http.request<Result<{ list: Array<{ agency_id: number; agency_account: string }> }>>(
    "get",
    "/fake/tools/batchgenmember",
    { params }
  );

// 新增指定代理直屬會員的存款單與投注流水

export const createDepositAndLog = (params: DepositAndLogData) =>
  http.request<Result<any>>(
    "get",
    "/fake/tools/makebettingloganddepositbyagencyids",
    { params }
  );

// 重算全部基本報表

export const recalcReportMemberAll = (params: ReportDateData) =>
  http.request<Result<any>>(
    "get",
    "/backend/report/tool/recalcreportmemberall",
    { params }
  );

// 重算代理每日報表

export const recalcReportAgencyDaily = (params: ReportDateData) =>
  http.request<Result<any>>(
    "get",
    "/backend/report/tool/recalcReportAgencyDaily",
    { params }
  );

// 重算代理佣金報表

export const recalcAgencyCommissionMonthly = (params: ReportDateData) =>
  http.request<Result<any>>(
    "get",
    "/backend/report/tool/recalcAgencyCommissionMonthly",
    { params }
  );

// 遊戲代理群組（沿用 bettinglog group list）

export const getGameGroups = () =>
  http.request<Result<{ list: GameGroupItem[] }>>(
    "get",
    "/backend/bettinglog/group/list",
    { params: {} }
  );

// ===== 假工具 - 會員 (faketools/member) 沿用舊 endpoint =====
export interface FakeMemberRow {
  id: number | string;
  account: string;
  name_cert: number;
  phone_cert: number;
  has_bank_card: number;
  vip_level: number | string;
  created_date: string;
}

/** 批次建立假會員 */

export function fakeMemberCreate(data: {
  accountPrefix: string;
  startNumber: number;
  endNumber: number;
}) {
  return http.request<Result<null>>("post", "/fake/tools/member/register", {
    data
  });
}

/** 依帳號（前綴/多筆）取得會員資料 */

export function fakeMemberSearch(params: { account: string }) {
  return http.request<Result<{ list: FakeMemberRow[]; total: number }>>(
    "get",
    "/fake/tools/member/search",
    { params }
  );
}

/** 修改單筆會員基本資料 */

export function fakeMemberEdit(data: {
  id: number | string;
  name_cert: number;
  phone_cert: number;
  has_bank_card: number;
  vip_level: number | string;
  created_date: string;
}) {
  return http.request<Result<null>>("put", "/fake/tools/member/edit", { data });
}

/** 批次修改密碼 */

export function fakeMemberPassword(data: {
  account: string[];
  password: string;
}) {
  return http.request<Result<null>>("put", "/fake/tools/member/password", {
    data
  });
}

// ===== 加進 src/api/faketools.ts（沿用舊 endpoint，勿重複宣告 Result/http） =====
// 取得遊戲廠商與遊戲類型
export function getGameGroupCategory() {
  return http.request<Result>(
    "get",
    "/backend/game/gamegroup/getgamegroupcategorizedbygametype"
  );
}

// 取得遊戲廠商分組（含遊戲清單）

export function getGameGroup(params?: object) {
  return http.request<Result>("get", "/fake/tools/game/gamegroup", { params });
}

// 新增流水

export function create(data?: object) {
  return http.request<Result>("post", "/fake/tools/betlog/add", { data });
}

// 新增流水（檔案模式）

export function createWithFile(data?: object) {
  return http.request<Result>("post", "/fake/tools/betlog/addforfile", { data });
}

// 搜尋流水

export function search(params?: object) {
  return http.request<Result>("get", "/fake/tools/betlog/search", { params });
}

// 刪除流水

export function delBetlog(data?: object) {
  return http.request<Result>("post", "/fake/tools/betlog/delete", { data });
}

// 重算會員基本報表 Game（gameMode 為 url 後綴）

export function getReportGame(
  gameMode = "recalcreportmemberdailygame",
  params?: object
) {
  return http.request<Result>("get", `/backend/report/tool/${gameMode}`, {
    params
  });
}
