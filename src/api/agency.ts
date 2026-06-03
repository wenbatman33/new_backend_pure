import { http } from "@/utils/http";

/** 後端統一回應格式 */
type Result<T = any> = {
  success: boolean;
  data: T;
};


// ===== 子代理申请审核（沿用旧 endpoint） =====
// 注意：旧 Vben put/post 的 params 实为 body，故新码一律转 { data }
export function getAgencyChildList(params: any) {
  return http.request<Result<{ list: any[]; total: number }>>(
    "get",
    "/backend/agency/childapplication/list",
    { params }
  );
}

/** 子代理申请详情（GET 带 id） */

export function getAgencyChildDetail(params: { id: number | string }) {
  return http.request<Result<any>>(
    "get",
    "/backend/agency/childapplication",
    { params }
  );
}

/** 子代理申请-通过（PUT，body 带 id/remark） */

export function putAgencyChildPermit(data: { id: number | string; remark?: string }) {
  return http.request<Result<{ id: number | string }>>(
    "put",
    "/backend/agency/childapplication/permit",
    { data }
  );
}

/** 子代理申请-拒绝（PUT，body 带 id/remark） */

export function putAgencyChildDeny(data: { id: number | string; remark?: string }) {
  return http.request<Result<{ id: number | string }>>(
    "put",
    "/backend/agency/childapplication/deny",
    { data }
  );
}

/** 子代理申请-批次审核（PUT，reviewIDs 逗号分隔的申请单ID；reviewType 1同意 2拒绝） */

export function putAgencyBatchReview(data: { reviewIDs: string; reviewType: 1 | 2 }) {
  return http.request<Result<null>>(
    "put",
    "/backend/agency/childapplication/batchReview",
    { data }
  );
}

// ===== 代理佣金（agency/commission） =====
// 佣金資料列（一代/二代/派發欄位超集）
export type AgencyCommissionItem = {
  id: number;
  date: string;
  deliveredAt: string;
  childDeliveredAt?: string;
  agencyID: number;
  agencyName: string;
  agencyAccount: string;
  parentAgencyId: number;
  wallet: number | string;
  commissionPercent?: number | string;
  activeMemberCount?: number;
  firstDepositCount?: number;
  totalWinAmount?: number | string;
  childTotalWinAmount?: number | string;
  rechargeAmount?: number | string;
  withdrawAmount?: number | string;
  betAmount?: number | string;
  platformCharge?: number | string;
  totalBonus?: number | string;
  totalCharge?: number | string;
  netProfit?: number | string;
  totalCommission: number;
  lastTotalCommission?: number | string;
  childCommissionAmount: number;
  childBonusAmount: number;
  percentOfSameDevice?: number | string;
  billingCycle?: number;
  status: number;
  childStatus?: number;
};

export type AgencyCommissionListResult = Result<{
  list: AgencyCommissionItem[];
  total: number;
}>;

type CommissionListParams = {
  date: string;
  billingCycle?: string | number;
  displayZero?: number;
  agencyID?: string | number;
};

type ReviewParams = {
  date: string;
  agreeIDs: string;
  denyIDs: string;
  delayIDs?: string;
  billingCycle?: number;
};

/** 一代佣金列表 */

export const getAgencyCommissionList = (params: CommissionListParams) => {
  return http.request<AgencyCommissionListResult>(
    "get",
    "/backend/agency/commission/list",
    { params }
  );
};

/** 二代佣金列表 */

export const getChildAgencyCommissionList = (params: CommissionListParams) => {
  return http.request<AgencyCommissionListResult>(
    "get",
    "/backend/agency/commission/childlist",
    { params }
  );
};

/** 佣金派發列表 */

export const getOfferAgencyCommissionList = (params: CommissionListParams) => {
  return http.request<AgencyCommissionListResult>(
    "get",
    "/backend/agency/commission/listoffer",
    { params }
  );
};

/** 一代派發合計 */

export const getCommissionDistributedCalc = (params: CommissionListParams) => {
  return http.request<Result<{ cnt: number; amount: number }>>(
    "get",
    "/backend/agency/commission/getdistributedcalc",
    { params }
  );
};

/** 二代/派發 合計 */

export const getChildCommissionDistributedCalc = (
  params: CommissionListParams
) => {
  return http.request<
    Result<{ cnt: number; childCommissionAmount: number; childBonusAmount: number }>
  >("get", "/backend/agency/commission/getchilddistributedcalc", { params });
};

/** 一代佣金審核派發 */

export const reviewAgencyCommission = (data: ReviewParams) => {
  return http.request<Result>("put", "/backend/agency/commission/review", {
    data
  });
};

/** 二代佣金審核派發 */

export const reviewChildAgencyCommission = (data: ReviewParams) => {
  return http.request<Result>("put", "/backend/agency/commission/childreview", {
    data
  });
};

/** 佣金派發審核 */

export const reviewOfferAgencyCommission = (data: ReviewParams) => {
  return http.request<Result>("put", "/backend/agency/commission/reviewOffer", {
    data
  });
};

export type AgencySiteFunctionSettings = {
  phone_edit: number;
  phone_active: number;
  child_account: number;
  subagency_benefits: number;
  modify_password_mode: number;
  modify_withdraw_password_mode: number;
  create_new_member: number;
  create_new_member_black_list: string;
};

/** 後台取得網站功能設定 */

export const getSiteFunctionSettings = () => {
  return http.request<Result<AgencySiteFunctionSettings>>(
    "get",
    "/backend/agency/config/page"
  );
};

/** 後台更新網站功能設定（舊 Vben put 的 params 實為 body，故用 data） */

export const putSiteFunctionSettings = (data: object) => {
  return http.request<Result<AgencySiteFunctionSettings>>(
    "put",
    "/backend/agency/config/page",
    { data }
  );
};

// ===== 代理上下分（agencyWallet manualOperationBatch）=====
export interface AdjustmentItem {
  id?: number;
  subject?: string;
  type?: number;
  status?: number;
  applyAdminAccount?: string;
  applyDate?: string;
  reviewAdminAccount?: string;
  reviewDate?: string;
  desc?: string;
  applyCount?: number;
  auditCount?: number;
  turnoverTimes?: number;
}

/** 申請單明細裡的單筆代理 */

export interface AdjustmentDetailListItem {
  id?: number;
  agencyID?: number;
  agencyAccount?: string;
  memberID?: number;
  memberAccount?: string;
  status?: number;
  amount?: number;
  remark?: string;
}

/** 申請單詳情 */

export interface AdjustmentDetail extends AdjustmentItem {
  list?: AdjustmentDetailListItem[];
}

export interface GetAgencyAdjustmentListReq {
  type?: number;
  status?: number;
  applyStartTime?: string;
  applyEndTime?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateAgencyAdjustmentReq {
  subject: string;
  type: number;
  turnoverTimes: number;
  desc: string;
  targetList: { agencyAccount: string; amount: number }[];
}

export interface ReviewAgencyAdjustmentReq {
  batchID?: number;
  targetList: { operationID?: number; permitStatus?: number; reason?: string }[];
}

/** 代理上下分申請單列表 */

export const getAgencyAdjustmentList = (params?: GetAgencyAdjustmentListReq) => {
  return http.request<Result<{ list: AdjustmentItem[]; total: number }>>(
    "get",
    "/backend/agencyWallet/manualOperationBatch/list",
    { params }
  );
};

/** 代理上下分申請單詳情 */

export const getAgencyAdjustmentDetail = (params: { id?: number }) => {
  return http.request<Result<AdjustmentDetail>>(
    "get",
    "/backend/agencyWallet/manualOperationBatch/detail",
    { params }
  );
};

/** 建立代理上下分申請單 */

export const createAgencyAdjustment = (data: CreateAgencyAdjustmentReq) => {
  return http.request<Result<{ id?: number }>>(
    "post",
    "/backend/agencyWallet/manualOperationBatch/create",
    { data }
  );
};

/** 審核代理上下分申請單 */

export const reviewAgencyAdjustment = (data: ReviewAgencyAdjustmentReq) => {
  return http.request<Result<null>>(
    "put",
    "/backend/agencyWallet/manualOperationBatch/review",
    { data }
  );
};

// ===== 代理存款 deposit（域 agency；沿用舊 cashflow/deposit + payment 端點）=====
export type AgencyDepositItem = {
  id?: string;
  type?: number; // 到帳方式 1系統 2手動 4代理
  memberAccount?: string;
  memberName?: string;
  memberID?: number;
  amount?: number;
  fee?: number;
  status?: number; // 1處理中 2取消 3完成 4逾時 5失敗 6審核中
  depositName?: string;
  gatway?: string;
  payment?: string;
  thirdID?: string;
  bankcard?: string;
  device?: number;
  balanceDate?: string;
  editorName?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AgencyDepositListResult = Result<{
  list: AgencyDepositItem[];
  count: number;
  amount?: number;
  fee?: number;
  erctotal?: number;
  trctotal?: number;
}>;

export type PayChannelServiceItem = {
  id: number;
  name: string;
  status: number;
};

/** 代理存款單列表（source=2） */

export const getAgencyDepositList = (params?: object) => {
  return http.request<AgencyDepositListResult>(
    "get",
    "/backend/pay/deposit",
    { params }
  );
};

/** 新增代理存款單 */

export const postAgencyDeposit = (data?: object) => {
  return http.request<Result>("post", "/backend/pay/deposit", { data });
};

/** 查詢三方回調狀態 */

export const postAgencyDepositCallback = (data?: object) => {
  return http.request<Result>("post", "/backend/pay/deposit/callback", {
    data
  });
};

/** 審核中強制成功（review） */

export const putAgencyDepositReview = (data?: object) => {
  return http.request<Result>("put", "/backend/pay/deposit/review", { data });
};

/** 強制失敗 */

export const putAgencyDepositForceFail = (data?: object) => {
  return http.request<Result>("put", "/backend/pay/deposit/hardcancel", {
    data
  });
};

/** 強制成功 */

export const putAgencyDepositForceSuccess = (data?: object) => {
  return http.request<Result>("put", "/backend/pay/deposit/hardsuccess", {
    data
  });
};

/** 修改入帳日期 */

export const putAgencyDepositBalanceDate = (data?: object) => {
  return http.request<Result>("put", "/backend/pay/deposit/balancedate", {
    data
  });
};

/** 查看操作記錄 */

export const getAgencyDepositNote = (params?: object) => {
  return http.request<Result<{ list: any[] }>>(
    "get",
    "/backend/pay/deposit/note",
    { params }
  );
};

/** 新增備註 */

export const postAgencyDepositNote = (data?: object) => {
  return http.request<Result>("post", "/backend/pay/deposit/note", { data });
};

/** 計算參考手續費 */

export const postAgencyDepositFee = (data?: object) => {
  return http.request<Result<{ fee: number }>>(
    "post",
    "/backend/pay/deposit/fee",
    { data }
  );
};

/** 是否有新單（提示音） */

export const getAgencyDepositBeep = (data?: object) => {
  return http.request<Result<{ hasAgencyDeposit: boolean }>>(
    "post",
    "/backend/payment/beep",
    { data }
  );
};

/** 存款方式下拉 */

export const getPayChannelServiceDropdown = (params?: object) => {
  return http.request<Result<{ serviceCode: any[] }>>(
    "get",
    "/backend/pay_channel_service/dropdown",
    { params }
  );
};

/** 商戶號下拉 */

export const getPayChannelDropdown = (params?: object) => {
  return http.request<Result<{ list: any[] }>>(
    "get",
    "/backend/pay/pay_channel",
    { params }
  );
};

/** 商戶下拉 */

export const getPayChannelNameDropdown = (params?: object) => {
  return http.request<Result<{ list: any[] }>>(
    "get",
    "/backend/pay/pay_channel_name",
    { params }
  );
};

/** 線路列表（用於新增表單與入帳日期換名） */

export const getPayChannelServiceList = (params?: object) => {
  return http.request<Result<{ list: PayChannelServiceItem[] }>>(
    "get",
    "/backend/pay_channel_service/",
    { params }
  );
};

// 代理钱包异动纪录 报表（沿用旧 endpoint /backend/agency/walletlogs）
export const AgencyWalletLogReportUrl = "/backend/agency/walletlogs";

export interface AgencyWalletLogItem {
  date: string;
  agencyID: number | string;
  agencyAccount: string;
  depoWithType: number | string;
  adjUseType: number | string;
  adjustMoney: number | string;
  afterMoney: number | string;
  remark: string;
}

export interface AgencyWalletLogReportData {
  list: AgencyWalletLogItem[];
  total: number;
  totalAdjustMoney: number;
}

// GET 查询：条件走 query params

export const getAgencyWalletLogReport = (params?: any) =>
  http.request<Result<AgencyWalletLogReportData>>(
    "get",
    AgencyWalletLogReportUrl,
    { params }
  );

// ===== agency / dailyReport（代理日报表）=====
// 沿用旧 endpoint：/backend/report/agencydaily/*
export type DailyReportRow = {
  date: string;
  activeAgencyCount: number;
  activeMemberCount: number;
  betAmount: number;
  regMemberCount: number;
  regAlsoDepositMemberCount: number;
  firstDepositCount: number;
  totalWinAmount: number;
  rechargeMemberCount: number;
  rechargeAmount: number;
  rechargeFee: number;
  withdrawMemberCount: number;
  withdrawAmount: number;
  payoutFee: number;
  transferMemberCount: number;
  transferMember: number;
  promotionAmount: number;
  vipGift: number;
  returnAmount: number;
  platformCharge: number;
  netProfit: number;
  agencyWallet: number;
  [key: string]: any;
};

export type ActiveAgencyItem = {
  agencyID: number;
  agencyAccount: string;
  activeMemberCount: number;
  betAmount: number;
  totalWinAmount: number;
  rechargeAmount: number;
  rechargeFee: number;
  withdrawAmount: number;
  payoutFee: number;
  depositWithdrawDiff: number;
  totalBonus: number;
  transferMember: number;
  platformCharge: number;
  netProfit: number;
  [key: string]: any;
};

export type DailyReportListResult = Result<{
  list: DailyReportRow[];
  total: number;
}>;

// 合计 brief：后端回数值物件

export type DailyTotalResult = Result<Record<string, number>>;

export type ActiveAgencyListResult = Result<{
  list: ActiveAgencyItem[];
  total: number;
}>;

/** 代理日报列表 */

export const getAgencyDailyReport = (params?: object) => {
  return http.request<DailyReportListResult>(
    "get",
    "/backend/report/agencydaily/list",
    { params }
  );
};

/** 代理日报合计（brief） */

export const getAgencyDailyTotal = (params?: object) => {
  return http.request<DailyTotalResult>(
    "get",
    "/backend/report/agencydaily/brief",
    { params }
  );
};

/** 活跃代理明细 */

export const getAgencyDailyActive = (params?: object) => {
  return http.request<ActiveAgencyListResult>(
    "get",
    "/backend/report/agencydaily/activeagencylist",
    { params }
  );
};

// ===== agency / withdrawal（代理提款管理）沿用舊 endpoint =====
// key/value 結構
export interface WithdrawalKeyValue {
  key: number;
  value: string;
}

export interface WithdrawalMemberKeyValue {
  key: number | string;
  value: { account: string };
}
// 提款列表單筆

export interface WithdrawalItem {
  transactionID: string;
  transactionTime: string;
  amount: number | string;
  member: WithdrawalMemberKeyValue;
  bankAccount: string;
  snList: string[] | string;
  bankCode: string;
  bankName: string;
  memberBankNo: string;
  status: WithdrawalKeyValue;
  financialCheck: WithdrawalKeyValue;
  riskCheck: WithdrawalKeyValue;
  lastUpdate: string;
  updatedBy: string;
}

export interface AgencyWithdrawalListResult {
  list: WithdrawalItem[];
  total: number;
  count: number;
  fee: number;
  erctotal: number;
  trctotal: number;
}

/** 代理提款管理：列表與篩選（舊 GET /backend/withdrawal，source=2 代表代理） */

export const getAgencyWithdrawal = (params?: object) =>
  http.request<Result<AgencyWithdrawalListResult>>(
    "get",
    "/backend/withdrawal",
    { params }
  );

/** 代理提款管理：財務進入審核 / 後台代提新增（舊 POST /backend/withdrawal/audit，舊碼 post 的 params 即 body） */

export const postAgencyWithdrawalAudit = (data?: object) =>
  http.request<Result<null>>("post", "/backend/withdrawal/audit", { data });

/** 代理提款管理：快速出款（舊 POST /backend/withdrawal/payout/quick，body 帶 { id }） */

export const postAgencyPayoutQuick = (data?: { id: string }) =>
  http.request<Result<null>>("post", "/backend/withdrawal/payout/quick", {
    data
  });

// ===== 代理 公告/活動 管理 (agency/management) =====
export interface AgencyManagementItem {
  id: number;
  title: string;
  sort: number;
  contents: string;
  imageH5: string;
  imagePc: string;
  startTime: string;
  endTime: string;
  status: number; // 1 上架 / 2 下架
  updatedAt: string;
  lastEditor: string;
}

export interface AgencyManagementListParams {
  periodBeginning: string;
  periodEnd: string;
}

export interface AgencyManagementPayload {
  id?: number;
  title: string;
  sort: number;
  startTime?: string;
  endTime: string;
  imagePc?: string;
  imageH5?: string;
  status: number;
  contents: string;
}

/** 公告列表 */

export const getAgencyAnnouncementList = (params: AgencyManagementListParams) => {
  return http.request<Result<{ list: AgencyManagementItem[]; total: number }>>(
    "get",
    "/backend/agency/announcement/list",
    { params }
  );
};

/** 新增公告 */

export const addAgencyAnnouncement = (data: AgencyManagementPayload) => {
  return http.request<Result<null>>("post", "/backend/agency/announcement/new", { data });
};

/** 編輯公告 */

export const editAgencyAnnouncement = (data: AgencyManagementPayload) => {
  return http.request<Result<null>>("put", "/backend/agency/announcement/edit", { data });
};

/** 活動列表 */

export const getAgencyActivityList = (params: AgencyManagementListParams) => {
  return http.request<Result<{ list: AgencyManagementItem[]; total: number }>>(
    "get",
    "/backend/agency/activity/list",
    { params }
  );
};

/** 新增活動 */

export const addAgencyActivity = (data: AgencyManagementPayload) => {
  return http.request<Result<null>>("post", "/backend/agency/activity/new", { data });
};

/** 編輯活動 */

export const editAgencyActivity = (data: AgencyManagementPayload) => {
  return http.request<Result<null>>("put", "/backend/agency/activity/edit", { data });
};

// ===== agencyGroup（代理分层设定）相关 =====
// 单一分层内容（S~F 共 7 阶）
export interface RankContent {
  minProfit: number;
  activeMemberCount: number;
  commissionPercent: number;
}

// 分层设定列表行

export interface AgencyGroupItem {
  id: number;
  groupName: string;
  /** 1=分层(S~F) 2=不分层(仅 S) */
  type: number;
  rankContent: RankContent[];
}

// 分层设定列表（沿用旧 endpoint /backend/agency/ranksetting/list）

export function getAgencyRankSettingList(params?: object) {
  return http.request<Result<{ list: AgencyGroupItem[]; total: number }>>(
    "get",
    "/backend/agency/ranksetting/list",
    { params }
  );
}

// 分层设定下拉选项（沿用旧 endpoint /backend/agency/ranksetting/all）

export function getAgencyRankSettingOption() {
  return http.request<Result<{ list: any[]; total: number }>>(
    "get",
    "/backend/agency/ranksetting/all"
  );
}

// 新增分层设定（旧码 defHttp.post({url,params}) 的 params 实为 body → 转 { data }）

export function createAgencyRankSetting(data: object) {
  return http.request<Result<{ id: number }>>(
    "post",
    "/backend/agency/ranksetting",
    { data }
  );
}

// 更新分层设定（旧码 defHttp.put({url,params}) 的 params 实为 body → 转 { data }）

export function updateAgencyRankSetting(data: object) {
  return http.request<Result<{ groupID: number }>>(
    "put",
    "/backend/agency/ranksetting",
    { data }
  );
}

// ===== phDailyReport（代理报表）模组用 =====
// endpoint 沿用旧码：/backend/report/agencyph/report、/backend/report/agencyph/export
export const PhDailyReportApi = {
  phDailyReport: "/backend/report/agencyph/report",
  phDailyReportExport: "/backend/report/agencyph/export"
} as const;

export interface PhDailyReportListData {
  list: any[];
  count?: number;
  // 合计行（阵列首笔），含各金额/人数加总
  total?: Record<string, any>[];
  // 上级代理面包屑
  parentAgencyData?: { parentAgencyAccount: string }[];
}

/** 代理报表列表（含合计与上级代理面包屑） */

export function getPhDailyReport(params?: object) {
  return http.request<Result<PhDailyReportListData>>(
    "get",
    PhDailyReportApi.phDailyReport,
    { params }
  );
}

/** 代理报表汇出（实际下载走 @/utils/report exportExcel，此函式备查） */

export function getPhDailyReportExport(params?: object) {
  return http.request<Result<{ list: any[] }>>(
    "get",
    PhDailyReportApi.phDailyReportExport,
    { params }
  );
}

// ===== agency / lockedWallets（代理鎖定錢包）=====
// 沿用舊 endpoint：list = GET /backend/wallet/lock/agency/list；unlock = PUT /backend/wallet/lock/agency/unlock
export interface LockedWalletItem {
  lockID: number;
  agencyID: number;
  agencyAccount: string;
  status: number; // 1 鎖定中 / 2 已解鎖
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface AgencyLockedWalletListParams {
  status?: number;
}

/** 取得代理鎖定錢包列表 */

export const getAgencyLockedWalletList = (params?: AgencyLockedWalletListParams) =>
  http.request<Result<{ list: LockedWalletItem[]; total: number }>>(
    "get",
    "/backend/wallet/lock/agency/list",
    { params }
  );

/** 解鎖代理錢包（舊碼為 PUT，body 帶 lockID） */

export const unlockAgencyWallet = (data: { lockID: number }) =>
  http.request<Result<null>>("put", "/backend/wallet/lock/agency/unlock", { data });

// ===== agency / platformFeeRatio（廠商平台費率設定）=====
// 沿用舊 endpoint：/backend/game/gamegroup/list、/backend/game/gamegroup、
// /backend/game/gameagency/all、/backend/game/gamelist/type、/backend/game/gamegroup/updateplatformfeeratio
export interface GameGroupFeeItem {
  id: number | string;
  name: string;
  displayName: string;
  sort: number;
  gameAgencyName: string;
  gameAgencyID?: number | string;
  walletType: number;
  gameType: { id: number | string; name: string };
  platformFeeRatio: number | string;
  status: number;
}

export interface GameGroupFeeListResult {
  list: GameGroupFeeItem[];
  total: number;
}

/** key/value 下拉選項（代理、遊戲類型共用） */

export interface KeyValueOption {
  key: number | string;
  value: string;
}

/** 取得廠商列表（平台費率頁） */

export const getGameGroupFeeList = (params?: object) => {
  return http.request<Result<GameGroupFeeListResult>>(
    "get",
    "/backend/game/gamegroup/list",
    { params }
  );
};

/** 取得單一廠商詳細（含最新平台費率） */

export const getGameGroupFeeDetail = (params: { id: number | string }) => {
  return http.request<Result<GameGroupFeeItem & { maintainTime?: string }>>(
    "get",
    "/backend/game/gamegroup",
    { params }
  );
};

/** 取得所屬代理下拉選項 */

export const getGameGroupFeeAgencyOptions = () => {
  return http.request<Result<{ list: KeyValueOption[] }>>(
    "get",
    "/backend/game/gameagency/all"
  );
};

/** 取得遊戲類型下拉選項 */

export const getGameGroupFeeTypeOptions = () => {
  return http.request<Result<{ list: KeyValueOption[] }>>(
    "get",
    "/backend/game/gamelist/type"
  );
};

/** 更新廠商平台費率（put，body 帶 gameGroupID + platformFeeRatio） */

export const updateGameGroupPlatformFeeRatio = (data: {
  gameGroupID: number | string;
  platformFeeRatio: number | string;
}) => {
  return http.request<Result<null>>(
    "put",
    "/backend/game/gamegroup/updateplatformfeeratio",
    { data }
  );
};

export interface TeamAgencySegment {
  loginMemberCount: number;
  registerMemberCount: number;
  firstDepositMemberCount: number;
  totalBonus: number;
  totalBonusMemberCount: number;
  betAmount: number;
  winAmount: number;
  betMemberCount: number;
  rechargeAmount: number;
  rechargeMemberCount: number;
  withdrawAmount: number;
  withdrawMemberCount: number;
  netProfit: number | null;
}

export interface TeamAgencyResult {
  /** 7 個時間區段：today/yesterday/thisWeek/lastWeek/thisMonth/lastMonth/custom */
  list: TeamAgencySegment[];
  /** 團隊人數 */
  teamAgencyCount: number;
}

/** 代理團隊報表（沿用舊 endpoint /backend/report/teamAgency，GET） */

export const getTeamAgency = (params?: object) => {
  return http.request<Result<TeamAgencyResult>>(
    "get",
    "/backend/report/teamAgency",
    { params }
  );
};

// 代理操作紀錄列表項
export interface OperationNoteItem {
  /** 操作時間 */
  createdAt: string;
  /** 操作類型 1~8 */
  opType: number;
  /** 操作內容 */
  opContent: string;
  /** 操作管理員帳號 */
  opAdmin: string;
}

export interface OperationNoteListData {
  list: OperationNoteItem[];
  total: number;
}

/** 取得代理操作紀錄（沿用舊 endpoint /backend/agency/operationnote，GET） */

export const getAgencyOperationNote = (params?: {
  adminAccount?: string;
  opType?: number;
  startTime?: string;
  endTime?: string;
}) => {
  return http.request<Result<OperationNoteListData>>(
    "get",
    "/backend/agency/operationnote",
    { params }
  );
};

// ===== 代理錢包人工操作（agency/wallet）沿用舊 endpoint =====
export interface AgencyWalletOperationItem {
  id: number;
  agencyID: number;
  agencyAccount: string;
  /** 異動類型 1系統上分 2系統下分 3會員下分 4會員上分 */
  type: number;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  turnoverLimit: number;
  /** 狀態 1成功 2拒絕 3待審核 4失敗 */
  status: number;
  date: string;
  applyAdminAccount: string;
  reviewDate: string;
  reviewAdminAccount: string;
  refMemberAccount?: string;
  remark: string;
}

/** 代理錢包人工操作 - 列表 */

export const getAgencyWalletOperationList = (params?: object) =>
  http.request<Result<{ list: AgencyWalletOperationItem[]; total: number }>>(
    "get",
    "/backend/agencywallet/manualoperation/list",
    { params }
  );

/** 代理錢包人工操作 - 取得單筆明細（含 isBelong） */

export const getAgencyWalletOperate = (params: { id: number }) =>
  http.request<Result<any>>("get", "/backend/agencywallet/manualoperation", {
    params
  });

/** 代理錢包人工操作 - 新增調整 */

export const addAgencyWalletOperation = (data: {
  agencyID: number;
  amount: number;
  turnoverLimit: number;
  remark: string;
  type: number;
  refMemberAccount?: string;
}) =>
  http.request<Result<null>>("post", "/backend/agencywallet/manualoperation", {
    data
  });

/** 代理錢包人工操作 - 審核通過 */

export const permitAgencyWalletOperation = (data: { id: number }) =>
  http.request<Result<null>>(
    "put",
    "/backend/agencywallet/manualoperation/permit",
    { data }
  );

/** 代理錢包人工操作 - 審核拒絕 */

export const denyAgencyWalletOperation = (data: { id: number }) =>
  http.request<Result<null>>(
    "put",
    "/backend/agencywallet/manualoperation/deny",
    { data }
  );

/** 代理錢包人工操作 - 失敗退回 */

export const failReturnAgencyWalletOperation = (data: { id: number }) =>
  http.request<Result<null>>(
    "put",
    "/backend/agencyWallet/manualOperation/failedReturn",
    { data }
  );

/** 代理錢包人工操作 - 失敗扣回 */

export const failDecreaseAgencyWalletOperation = (data: { id: number }) =>
  http.request<Result<null>>(
    "put",
    "/backend/agencyWallet/manualOperation/failedDecrease",
    { data }
  );

/** 檢查會員是否直屬代理 */

export const checkAgencyWalletBelong = (params: {
  agencyID: number;
  memberAccount: string;
}) =>
  http.request<Result<{ isBelong: number }>>(
    "get",
    "/backend/agencywallet/manualoperation/checkmemberbelongagency",
    { params }
  );

/** 代理列表（新增調整時用來查代理） */

export const getAgencyList = (params?: object) =>
  http.request<Result<{ list: any[]; total: number }>>(
    "get",
    "/backend/agency/list",
    { params }
  );

/** 代理明細（沿用舊 endpoint /backend/agency GET） */

export const getAgencyDetail = (params: { id: number }) =>
  http.request<Result<any>>("get", "/backend/agency", { params });

// ===== 代理申請審核 agencyapplication（沿用舊 endpoint）=====
export interface AgencyApplicationItem {
  id: number;
  businessType: number; // 0 直營 / 1 全反水 / 2 淨利
  memberID: number | string;
  agencyAccount: string;
  name: string;
  phone: string;
  email?: string;
  telegram?: string;
  whatsapp?: string;
  qqAccount?: string;
  wechatAccount?: string;
  createdAt: string;
  reviewTime: string;
  adminAccount?: string;
  adminUserID?: string | number;
  auditStatus: number; // 1 待審核 / 2 通過 / 3 拒絕
  remark?: string;
  promoteDescription?: string;
}

/** 代理申請審核列表（GET /backend/agency/application/list，查詢條件走 params） */

export function getAgencyApplicationList(params?: object) {
  return http.request<Result<{ list: AgencyApplicationItem[]; total: number }>>(
    "get",
    "/backend/agency/application/list",
    { params }
  );
}

/** 代理申請詳情（GET /backend/agency/application?id=xxx） */

export function getAgencyApplicationDetail(params: { id: number | string }) {
  return http.request<Result<AgencyApplicationItem>>(
    "get",
    "/backend/agency/application",
    { params }
  );
}

/** 代理申請審核（通過/拒絕）（PUT /backend/agency/application/review，body 走 data） */

export function putAgencyApplicationReview(data: object) {
  return http.request<Result<{ id: number }>>(
    "put",
    "/backend/agency/application/review",
    { data }
  );
}

/** 代理佣金等級群組選項（GET /backend/agency/ranksetting/all） */

// 代理团队贡献报表
export interface AgencyContributionItem {
  agencyAccount: string;
  parentAgencyAccount: string;
  childAgencyCount: number;
  belongMemberCount: number;
  betMember: number;
  betCount: number;
  betAmount: number;
  winAmount: number;
  returnAmount: number;
  totalWinAmount: number;
  createdAt: string;
}

export interface AgencyContributionReport {
  mainList: AgencyContributionItem;
  childList: AgencyContributionItem[];
}

/** 团队贡献报表（沿用旧 endpoint /backend/agency/team/report） */

export const getAgencyContributionReport = (params?: object) => {
  return http.request<Result<AgencyContributionReport>>(
    "get",
    "/backend/agency/team/report",
    { params }
  );
};

// ===== agency / memberReport（代理會員報表）=====
// 沿用舊 endpoint：/backend/report/agencyMember/list（代理 report.ts ApiList.member）
export const MEMBER_REPORT_API = "/backend/report/agencyMember/list";

// 標籤群組顏色對照（舊 tag/tag.ts GetTagGroup）

const MEMBER_TAG_GROUP_API = "/backend/member/tag/groups";

export interface MemberReportItem {
  memberID?: number;
  memberAccount: string;
  platformType: number | string;
  useSameDeviceId?: number;
  betAmount: number | string;
  totalWinAmount: number | string;
  rechargeAmount: number | string;
  rechargeCount: number | string;
  withdrawAmount: number | string;
  withdrawDepositDiff: number | string;
  transferMember: number | string;
  activeStatus: number | string;
  lastLoginTime: string;
  regTime: string;
  tags?: Array<{
    id: number;
    name: string;
    tagGroupID: number;
    updatedAt: string;
  }>;
}

// 報表回應含分頁與各欄位合計（sumXxx）

export interface MemberReportResp {
  list: MemberReportItem[];
  total: number;
  sumBetAmount?: number;
  sumRechargeAmount?: number;
  sumTotalWinAmount?: number;
  sumTransferMember?: number;
  sumWithdrawAmount?: number;
  sumWithdrawDepositDiff?: number;
  sumRechargeCount?: number;
}

/** 代理會員報表列表 */

export const getMemberReport = (params?: object) => {
  return http.request<Result<MemberReportResp>>("get", MEMBER_REPORT_API, {
    params
  });
};

/** 標籤群組（顏色對照） */

export const getMemberReportTagGroup = (params?: object) => {
  return http.request<Result<{ list: Array<{ id: number; color: string }> }>>(
    "get",
    MEMBER_TAG_GROUP_API,
    { params }
  );
};

// ===== 子代理报表（childAgencyReport）=====
// 沿用舊 endpoint：/backend/report/childagency/list（GET）
// 匯出端點 /backend/report/childagency/export 不走 http.request，由 utils/report.exportExcel 直接組 URL 下載，故此處不需 api 函式。
export interface ChildAgencyReportRow {
  agencyID: number | string;
  agencyAccount: string;
  agencyName: string;
  rechargeAmount: number;
  withdrawAmount: number;
  betAmount: number;
  totalWinAmount: number;
  netProfit: number;
  commissionPercent: string;
  totalCommission: number;
  totalCommissionPaid: number;
  regMemberCount: number;
  firstDepositCount: number;
  platformCharge: number;
  totalBonus: number;
  totalCharge: number;
  activeMemberCount: number;
  lastLoginTime: string;
  isActive: number;
}

export interface ChildAgencyReportResult {
  list: ChildAgencyReportRow[];
  total: number;
  subTotal: Partial<ChildAgencyReportRow>[];
}

/** 取得子代理报表列表（含合計列 subTotal） */

export const getChildAgencyReport = (params?: object) => {
  return http.request<Result<ChildAgencyReportResult>>(
    "get",
    "/backend/report/childagency/list",
    { params }
  );
};

// ===== agency newReg 報表（沿用舊 endpoint） =====
export interface AgencyNewRegRow {
  agencyID: number | string;
  agencyAccount: string;
  regMemberCount: number;
  firstDepositCount: number;
  transferMember: number;
  rechargeAmount: number;
  withdrawAmount: number;
  distContinueDepositCount: number;
  distWithdrawCount: number;
  betAmount: number;
  platformCharge: number;
  totalBonus: number;
  totalCharge: number;
  totalWinAmount: number;
  netProfit: number;
  playerCount: number;
  activeMemberCount: number;
}

export interface AgencyNewRegListResult {
  list: AgencyNewRegRow[];
  total: number;
  /** 合計列（取 [0]） */
  subTotal: Array<Record<string, any>>;
}

export interface AgencyNewRegDetailRow {
  id: number;
  account: string;
  name: string;
  phone: string;
  current_status: boolean;
  deposit_limit: number;
  withdraw_limit: number;
  recharge_count: number;
  recharge_amount: number;
  withdraw_amount: number;
  promotion_times: number;
  status: number;
  use_same_device_id: number;
  created_at: string;
  last_login_at: string;
  register_ip: string;
  register_area: string;
  last_login_ip: string;
  last_login_area: string;
  agency_id: number;
  payment_groups: string;
  bankcard_groups: string;
  tags: any[];
}

export interface AgencyNewRegDetailResult {
  list: AgencyNewRegDetailRow[];
  total: number;
}

/** 代理新註冊報表 - 主列表 */

export function getAgencyNewRegList(params?: object) {
  return http.request<Result<AgencyNewRegListResult>>(
    "get",
    "/backend/report/agencynewregmember/list",
    { params }
  );
}

/** 代理新註冊報表 - 註冊會員明細 */

export function getAgencyNewRegDetail(params?: object) {
  return http.request<Result<AgencyNewRegDetailResult>>(
    "get",
    "/backend/report/agencynewregmember/newreglist",
    { params }
  );
}

/** 代理新註冊報表 - 首儲會員明細 */

export function getAgencyNewRegFirstDeposit(params?: object) {
  return http.request<Result<AgencyNewRegDetailResult>>(
    "get",
    "/backend/report/agencynewregmember/newregfirstdepositlist",
    { params }
  );
}

/** 代理新註冊報表 - 活躍會員明細 */

export function getAgencyNewRegActive(params?: object) {
  return http.request<Result<AgencyNewRegDetailResult>>(
    "get",
    "/backend/report/agencynewregmember/newregactivememberlist",
    { params }
  );
}

// ===== 代理业绩报表 performanceReport（沿用旧 endpoint） =====
// 主报表（单笔汇总）；V1/V2 为游戏厂商分组列表
export interface PerformanceReportData {
  netProfitOption?: Array<{ key: string; value: number }>;
  [key: string]: any;
}

export interface PerformanceGameGroupItem {
  gameGroupName: string;
  betAmount: number | string;
  totalWinAmount: number | string;
}

/** 代理业绩主报表（单笔汇总，产品/代理/会员区块共用） */

export function getPerformanceReport(params?: object) {
  return http.request<Result<PerformanceReportData>>(
    "get",
    "/backend/report/agencyperformance/list",
    { params }
  );
}
/** 代理业绩 — V1 平台游戏厂商分组（页面预设隐藏，保留以备用） */

export function getPerformanceV1Report(params?: object) {
  return http.request<Result<{ list: PerformanceGameGroupItem[]; total: number }>>(
    "get",
    "/backend/report/agencyPerformance/gameGroupV1",
    { params }
  );
}
/** 代理业绩 — V2 平台游戏厂商分组 */

export function getPerformanceV2Report(params?: object) {
  return http.request<Result<{ list: PerformanceGameGroupItem[]; total: number }>>(
    "get",
    "/backend/report/agencyPerformance/gameGroupV2",
    { params }
  );
}

// ===== agencyMain（代理列表）相關，沿用舊 endpoint =====
// 代理列表單筆
export interface AgencyListItem {
  id: number;
  account: string;
  phone: string;
  businessType: number;
  isCredit: number;
  billingCycle: number;
  name: string;
  parentAgencyAccount: string;
  childAgencyCount: number;
  memberCount: number;
  giveOffer: number;
  offerPercent: number;
  rankGroupName: string;
  netProfitOption: Array<{ key: string; value: number }>;
  netProfitBase: number;
  agencyWallet: number;
  agencyReturnProportion: number;
  promotionLinks: Array<{ promotionLink: string }>;
  memberReturnProportion: number;
  activeStatus: number;
  reviewTime: string;
  lastLoginTime: string;
  adminRemark: string;
}

// 代理列表回應（含上層代理麵包屑 parentAgencyData）

export interface AgencyListResult {
  list: AgencyListItem[];
  total: number;
  parentAgencyData?: Record<string, { parentAgencyID: number; parentAgencyAccount: string }>;
}

// 取得代理列表（GET 查詢；舊 endpoint /backend/agency/list）

export function getAgencyRankGroupOptions() {
  return http.request<Result<{ list: Array<{ label: string; value: any }> }>>(
    "get",
    "/backend/agency/ranksetting/all"
  );
}

// ===== 會員換線 memberNode（沿用舊 endpoint /backend/member/node/*） =====
export interface MemberNodeItem {
  memberID: number | string;
  memberAccount: string;
  memberName: string;
  orgAgencyID: number | string;
  orgAgencyAccount: string;
  newAgencyID: number | string;
  newAgencyAccount: string;
  date: string;
  remark: string;
}

/** 查詢會員回傳資料 */

export interface MemberCheckData {
  id: number | string;
  name: string;
  phone: string;
  betAmount: number | string;
  totalAmount: number | string;
  depositAmount: number | string;
  parentAgencyID: number | string;
  parentAgencyName: string;
  parentAgencyAccount: string;
  memberTags: Array<{ id: number | string; name: string; color?: string }>;
}

/** 查詢代理回傳資料 */

export interface AgencyCheckData {
  id: number | string;
  name: string;
  account: string;
}

/** 會員換線列表 */

export const getAgencyNodeList = (params?: object) => {
  return http.request<Result<{ list: MemberNodeItem[]; total: number }>>(
    "get",
    "/backend/member/node/list",
    { params }
  );
};

/** 查詢會員（依帳號） */

export const checkMemberNode = (params: { account: string; platformType?: string | number }) => {
  return http.request<Result<MemberCheckData>>(
    "get",
    "/backend/member/node/checkmember",
    { params }
  );
};

/** 查詢目標代理（依帳號） */

export const checkAgencyNode = (params: { account: string }) => {
  return http.request<Result<AgencyCheckData>>(
    "get",
    "/backend/member/node/checkagency",
    { params }
  );
};

/** 執行會員換線（舊為 defHttp.post，params 即 body → 轉 data） */

export const updateAgencyNode = (data: {
  memberID: number | string;
  toParentAgencyID: number | string;
  remark: string;
}) => {
  return http.request<Result<{ id: number | string }>>(
    "post",
    "/backend/member/node",
    { data }
  );
};

// ===== agencyMain/detail（代理詳情頁）沿用舊 endpoint =====
// 注意：getAgencyDetail / getAgencyList / getAgencyRankSettingOption 已於上方宣告，本區不再重複。

/** 代理分層群組設定（GET /backend/agency/rankgroup） */
export const getAgencyDetailGroup = (params: { id: number }) =>
  http.request<Result<any>>("get", "/backend/agency/rankgroup", { params });

/** 更新代理分層群組（PUT，舊 params 即 body → data） */
export const putAgencyDetailGroup = (data: object) =>
  http.request<Result<{ agencyID?: number }>>("put", "/backend/agency/rankgroup", { data });

/** 更新代理狀態/額度（PUT /backend/agency/changestatus，舊 params 即 body） */
export const putAgencyDetailStatus = (data: object) =>
  http.request<Result<{ id?: number }>>("put", "/backend/agency/changestatus", { data });

/** 依單一欄位更新代理資料（PUT /backend/agency/<key>，舊碼動態組 url，這裡用 /backend/agency 帶 body） */
export const putAgencyDetailByKey = (data: Record<string, any>) => {
  const keys = Object.keys(data).filter(k => k !== "id");
  return http.request<Result<{ id?: number }>>(
    "put",
    `/backend/agency/${keys[0]}`,
    { data }
  );
};

/** 取得預設銀行卡（GET /backend/agency/bankcard/getdefault） */
export const getAgencyDetailDefaultCard = (params: { agencyID: number }) =>
  http.request<Result<any>>("get", "/backend/agency/bankcard/getdefault", { params });

/** 取得預設 USDT（GET /backend/agency/usdt/getdefault） */
export const getAgencyDetailDefaultUsdt = (params: { agencyID: number }) =>
  http.request<Result<any>>("get", "/backend/agency/usdt/getdefault", { params });

/** 取得預設數字人民幣（GET /backend/agency/ecny/getdefault） */
export const getAgencyDetailDefaultEcny = (params: { agencyID: number }) =>
  http.request<Result<any>>("get", "/backend/agency/ecny/getdefault", { params });

/** 取得代理錢包統計（GET /backend/agency/getrecord） */
export const getAgencyDetailRecord = (params: { id: number }) =>
  http.request<Result<Record<string, number>>>("get", "/backend/agency/getrecord", { params });

/** 取得近期錢包異動紀錄（GET /backend/agency/getrecentmoneylog） */
export const getAgencyDetailRecentMoneyLog = (params: { id: number }) =>
  http.request<Result<any>>("get", "/backend/agency/getrecentmoneylog", { params });

/** 取得金額異動類型（GET /backend/money/useType） */
export const getAgencyDetailMoneyUseType = () =>
  http.request<Result<{ list: any[] }>>("get", "/backend/money/useType");

/** 修改後台登入密碼（PUT /backend/agency/changepassword，舊 params 即 body） */
export const editAgencyDetailPassword = (data: { id: number; password: string }) =>
  http.request<Result<{ id?: number }>>("put", "/backend/agency/changepassword", { data });

/** 修改交易密碼（PUT /backend/agency/changetradepin，舊 params 即 body） */
export const editAgencyDetailTransPassword = (data: { id: number; pinNumber: string }) =>
  http.request<Result<{ id?: number }>>("put", "/backend/agency/changetradepin", { data });

/** 認證代理手機（PUT /backend/agency/phone/certified，舊 params 即 body） */
export const verifyAgencyDetailPhone = (data: { id: number; account: string }) =>
  http.request<Result<{ id?: number }>>("put", "/backend/agency/phone/certified", { data });

/** 新增推廣連結（POST /backend/agency/promotionlink，舊 params 即 body） */
export const createAgencyDetailPromotionlink = (data: object) =>
  http.request<Result<{ id?: number }>>("post", "/backend/agency/promotionlink", { data });

/** 更新推廣連結（PUT /backend/agency/promotionlink，舊 params 即 body） */
export const updateAgencyDetailPromotionlink = (data: object) =>
  http.request<Result<{ id?: number }>>("put", "/backend/agency/promotionlink", { data });

/** 刪除推廣連結（DELETE /backend/agency/promotionlink?id=xxx） */
export const deleteAgencyDetailPromotionlink = (id: number | string) =>
  http.request<Result<null>>("delete", "/backend/agency/promotionlink", {
    params: { id }
  });

/** 銀行卡列表（GET /backend/agency/bankcard/list） */
export const getAgencyDetailBankcardList = (params: { agencyID: number }) =>
  http.request<Result<{ list: any[] }>>("get", "/backend/agency/bankcard/list", { params });

/** 新增銀行卡（POST /backend/agency/bankcard，舊 params 即 body） */
export const addAgencyDetailBankcard = (data: {
  agencyID: number;
  cardNo: string;
  bankAccount?: string;
}) => http.request<Result<{ id?: number }>>("post", "/backend/agency/bankcard", { data });

/** 停用銀行卡（PUT /backend/agency/bankcard/disable，舊 params 即 body） */
export const disableAgencyDetailBankcard = (data: { id: number }) =>
  http.request<Result<null>>("put", "/backend/agency/bankcard/disable", { data });

/** 啟用銀行卡（PUT /backend/agency/bankcard/enable，舊 params 即 body） */
export const enableAgencyDetailBankcard = (data: { id: number }) =>
  http.request<Result<null>>("put", "/backend/agency/bankcard/enable", { data });

/** 設為預設銀行卡（PUT /backend/agency/bankcard/setdefault，舊 params 即 body） */
export const setDefaultAgencyDetailBankcard = (data: { id: number }) =>
  http.request<Result<null>>("put", "/backend/agency/bankcard/setdefault", { data });

/** USDT 列表（GET /backend/agency/usdt/list） */
export const getAgencyDetailUsdtList = (params: { agencyID: number }) =>
  http.request<Result<{ list: any[] }>>("get", "/backend/agency/usdt/list", { params });

/** 新增 USDT（POST /backend/agency/usdt，舊 params 即 body） */
export const addAgencyDetailUsdt = (data: { agencyID: number; address: string }) =>
  http.request<Result<{ id?: number }>>("post", "/backend/agency/usdt", { data });

/** 刪除 USDT（DELETE /backend/agency/usdt，舊碼 params+data 帶 id） */
export const deleteAgencyDetailUsdt = (data: { id: number }) =>
  http.request<Result<null>>("delete", "/backend/agency/usdt", {
    params: data,
    data
  });

/** 設為預設 USDT（PUT /backend/agency/usdt/setdefault，舊 params 即 body） */
export const setDefaultAgencyDetailUsdt = (data: { id: number }) =>
  http.request<Result<null>>("put", "/backend/agency/usdt/setdefault", { data });

/** 數字人民幣列表（GET /backend/agency/ecny/list） */
export const getAgencyDetailEcnyList = (params: { agencyID: number }) =>
  http.request<Result<{ list: any[] }>>("get", "/backend/agency/ecny/list", { params });

/** 新增數字人民幣（POST /backend/agency/ecny，舊 params 即 body） */
export const addAgencyDetailEcny = (data: {
  agencyID: number;
  name: string;
  address: string;
}) => http.request<Result<{ id?: number }>>("post", "/backend/agency/ecny", { data });

/** 停用數字人民幣（PUT /backend/agency/ecny/disable，舊 params 即 body） */
export const disableAgencyDetailEcny = (data: { id: number }) =>
  http.request<Result<null>>("put", "/backend/agency/ecny/disable", { data });

/** 後台提款資料列表（GET /backend/info/withdrawal） */
export const getAgencyDetailWithdrawInfoList = (params: {
  userID: number;
  source: number;
}) => http.request<Result<any>>("get", "/backend/info/withdrawal", { params });

/** 新增後台提款資料（POST /backend/info/withdrawal，舊 params 即 body） */
export const addAgencyDetailWithdrawInfo = (data: object) =>
  http.request<Result<{ id?: number }>>("post", "/backend/info/withdrawal", { data });

/** 啟用/停用後台提款資料（DELETE /backend/info/withdrawal，舊碼 params+data） */
export const toggleAgencyDetailWithdrawInfo = (data: {
  id: number;
  source: number;
  status: number;
}) =>
  http.request<Result<null>>("delete", "/backend/info/withdrawal", {
    params: data,
    data
  });

/** 後台提款資料分類下拉（GET /backend/info/withdrawal/dropdown） */
export const getAgencyDetailWithdrawInfoDropdown = () =>
  http.request<Result<{ services: any[] }>>("get", "/backend/info/withdrawal/dropdown");

/** 代理客製平台費率列表（GET /backend/agency/platformFeeRatio/list） */
export const getAgencyDetailPlatformFeeRatioList = (params: { agencyID: number }) =>
  http.request<Result<any>>("get", "/backend/agency/platformFeeRatio/list", { params });

/** 查詢某廠商預設平台費率（GET /backend/agency/platformfeeratio/search） */
export const getAgencyDetailPlatformfeeratioSearch = (params: {
  gameGroupID: number | string;
}) => http.request<Result<any>>("get", "/backend/agency/platformfeeratio/search", { params });

/** 新增代理客製平台費率（POST /backend/agency/platformFeeRatio/，舊 params 即 body） */
export const addAgencyDetailPlatformFeeRatio = (data: object) =>
  http.request<Result<{ id?: number }>>("post", "/backend/agency/platformFeeRatio/", { data });

/** 更新代理客製平台費率（PUT /backend/agency/platformFeeRatio/，舊 params 即 body） */
export const updateAgencyDetailPlatformFeeRatio = (data: {
  id: number;
  platformFeeRatio: number;
}) => http.request<Result<{ id?: number }>>("put", "/backend/agency/platformFeeRatio/", { data });

/** 刪除代理客製平台費率（DELETE /backend/agency/platformFeeRatio/?id=xxx） */
export const deleteAgencyDetailPlatformFeeRatio = (id: number | string) =>
  http.request<Result<null>>("delete", "/backend/agency/platformFeeRatio/", {
    params: { id }
  });

/** 遊戲類型下拉（GET /backend/game/gamelist/type） */
export const getAgencyDetailGameListType = () =>
  http.request<Result<{ list: any[] }>>("get", "/backend/game/gamelist/type");

/** 遊戲廠商下拉（GET /backend/game/dropdown/list） */
export const getAgencyDetailGameDropdown = () =>
  http.request<Result<{ gameGroup: any[] }>>("get", "/backend/game/dropdown/list");

/** 金流組別下拉（GET /backend/pay_group/groups） */
export const getAgencyDetailPayGroups = (params: { type: number; source: number }) =>
  http.request<Result<{ list: any[] }>>("get", "/backend/pay_group/groups", { params });

/** 設定代理金流組別（POST /backend/pay_group/agency，舊 params 即 body） */
export const createAgencyDetailPayGroup = (data: {
  payGroupID: any;
  agencyAccounts: string;
}) => http.request<Result<{ id?: number }>>("post", "/backend/pay_group/agency", { data });
