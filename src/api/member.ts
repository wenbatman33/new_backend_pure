import { http } from "@/utils/http";

/** 後端統一回應格式 */
type Result<T = any> = {
  success: boolean;
  data: T;
};


// ===== member 域：會員明細列表（member/member 模組）=====
// 沿用舊 endpoint：/backend/member/search、/backend/sms/reset_sms_usage、/backend/member/vip/setting/list
export interface MemberItem {
  id: number;
  account: string;
  name: string;
  phone: string;
  email?: string;
  money: number | string;
  isFirstDeposit?: number;
  vipLevel?: number | string;
  current_status?: number;
  deposit_limit?: number;
  withdraw_limit?: number;
  status?: number;
  created_at?: string;
  last_login_at?: string;
  register_ip?: string;
  register_area?: string;
  last_login_ip?: string;
  last_login_area?: string;
  topAgencyID?: number | string;
  agency_id?: number | string;
  recommenderAccount?: string;
  payment_groups?: string;
  bankcard_groups?: string;
  careerDepositAmount?: number | string;
  careerWithdrawAmount?: number | string;
  [key: string]: any;
}

export interface MemberListResult {
  list: MemberItem[];
  total: number;
}

/** 取得會員明細列表（舊 GetMembers，GET /backend/member/search，查詢條件走 params） */

export const getMemberList = (params?: object) => {
  return http.request<Result<MemberListResult>>(
    "get",
    "/backend/member/search",
    { params }
  );
};

/** 重置簡訊次數（舊 resetSMS，POST /backend/sms/reset_sms_usage；舊 defHttp.post 的 params 實為 body → 轉 data） */

export const resetMemberSMS = (data: { id: number }) => {
  return http.request<Result<any>>(
    "post",
    "/backend/sms/reset_sms_usage",
    { data }
  );
};

/** 取得 VIP 設定清單，用於搜尋列 VIP 下拉（舊 getVipSettingList，GET /backend/member/vip/setting/list） */

export const getMemberVipSettingList = () => {
  return http.request<Result<{ list: { level: number }[] }>>(
    "get",
    "/backend/member/vip/setting/list"
  );
};

export const getLuckWalletList = (params?: object) => {
  return http.request<Result<{ list: any[]; total: number }>>(
    "get",
    "/backend/memberluckmoneywallet/list",
    { params }
  );
};

/** 關閉錢包（舊 endpoint：put /backend/luck_money/wallet/close，body 帶 id） */

export const closeLuckWallet = (data: { id: number | string }) => {
  return http.request<Result<null>>(
    "put",
    "/backend/luck_money/wallet/close",
    { data }
  );
};

/** 凍結錢包 */

export const freezeLuckWallet = (data: { id: number | string }) => {
  return http.request<Result<null>>(
    "put",
    "/backend/luck_money/wallet/freeze",
    { data }
  );
};

/** 解凍（恢復）錢包 */

export const unfreezeLuckWallet = (data: { id: number | string }) => {
  return http.request<Result<null>>(
    "put",
    "/backend/luck_money/wallet/unfreeze",
    { data }
  );
};

// ===== 紅利錢包紀錄（luckwalletLog）相關 =====
// 用途類型項目
export interface LuckyWalletUseTypeItem {
  useTypeID: number;
  useTypeName: string;
  useTypeEnName?: string;
  color?: string;
}

// 錢包資訊（搜尋後展開區塊用）

export interface LuckyWalletInfo {
  createdAt?: string;
  status?: number;
  expirationDate?: string;
  orderID?: string;
  source?: string;
  initialMoney?: number | string;
  totalBonus?: number | string;
  withdrawalLimit?: number | string;
  gameAccount?: string;
  gameAccountCreatedAt?: string;
  gameItem?: { gameGroupName?: string }[];
  assignedGameGroup?: string;
  maxWithdrawal?: number | string;
  minWithdrawal?: number | string;
  depositAmount?: number | string;
  memberID?: number | string;
  [key: string]: any;
}

// 錢包紀錄單筆

export interface LuckyWalletLogItem {
  createdAt: string;
  inOutType: number; // 1: in / 2: out
  useType: number;
  beforeMoney: number | string;
  adjustMoney: number | string;
  afterMoney: number | string;
  note: string;
  refId: string;
}

// 取得用途類型下拉（沿用舊 endpoint /backend/money/useType）

export function getLuckyWalletUseType() {
  return http.request<Result<{ list: LuckyWalletUseTypeItem[] }>>(
    "get",
    "/backend/money/useType"
  );
}

// 取得紅利錢包資訊列表（沿用舊 endpoint /backend/memberluckmoneywallet/list）

export function getLuckyWalletList(params: { id: number | string }) {
  return http.request<Result<{ list: LuckyWalletInfo[]; total?: number }>>(
    "get",
    "/backend/memberluckmoneywallet/list",
    { params }
  );
}

// 取得紅利錢包異動紀錄（沿用舊 endpoint /backend/memberluckmoneywallet/log）

export function getLuckyWalletLog(params: Record<string, any>) {
  return http.request<Result<{ list: LuckyWalletLogItem[]; total: number }>>(
    "get",
    "/backend/memberluckmoneywallet/log",
    { params }
  );
}

// ===== member / verifyLog（簡訊/Email 驗證記錄）=====
// 沿用舊 endpoint：/backend/sms/log、/backend/sms/detail、/backend/sms/operate
export function getVerifyLogList(params?: object) {
  return http.request<Result<{ list: any[]; total: number }>>(
    "get",
    "/backend/sms/log",
    { params }
  );
}

/** 驗證信息詳情（依 id） */

export function getVerifyLogDetail(id: number | string) {
  return http.request<
    Result<{ verifyData: string; code: string; context: string }>
  >("get", "/backend/sms/detail", { params: { id } });
}

/** 驗證記錄的操作記錄（依 id） */

export function getVerifyLogOperate(params: { id: number | string }) {
  return http.request<Result<{ list: any[]; total: number }>>(
    "get",
    "/backend/sms/operate",
    { params }
  );
}

export const getMemberLoginLog = (params?: object) => {
  return http.request<Result<{ list: any[]; total: number }>>(
    "get",
    "/backend/member/login/log/search",
    { params }
  );
};

// ===== member 域：上传会员名单（uploadMemberList）=====
// 沿用旧 endpoint /backend/member/by-upload（旧 Vben 用 post + params(=body)，故转 { data }）
export interface UploadMemberItem {
  memberID: number;
  memberAccount: string;
  memberName: string;
  phone: string;
  phoneCert: number;
  vipLevel: string | number;
  loginStatus: number;
  depositStatus: number;
  withdrawalStatus: number;
  topAgencyAccount: string;
  agencyAccount: string;
  recommenderAccount: string;
  totalMoney: number | string;
  firstDepositTime: string;
  firstDepositAmount: number | string;
  totalDepositAmount: number | string;
  totalDepositCount: number | string;
  firstWithdrawalAmount: number | string;
  firstWithdrawalCount: number | string;
  totalReward: number | string;
  totalBetAmount: number | string;
  totalValidBetAmount: number | string;
  totalWinAmount: number | string;
  totalProfitAndLoss: number | string;
  registerAt: string;
  registerLocation: string;
  registerDeviceTypeStr: string;
  lastLoginAt: string;
  lastLoginLocation: string;
  lastLoginDeviceTypeStr: string;
  lastDepositAt: string;
  lastWithdrawalAt: string;
}

/** 上传会员名单：依帐号（可逗号分隔多笔）查询会员清单 */

export const getUploadMemberList = (data: {
  account: string;
  pageSize?: number;
}) =>
  http.request<Result<{ list: UploadMemberItem[]; total: number }>>(
    "post",
    "/backend/member/by-upload",
    { data }
  );

/** 上传会员名单：汇出（沿用旧 export 端点） */

export const exportUploadMemberList = (data: { account: string; all?: number }) =>
  http.request<Result<{ list: UploadMemberItem[]; total: number }>>(
    "post",
    "/backend/member/by-upload/export",
    { data }
  );

// ===== 手動上下分（會員調整申請） adjustment 模組 =====
// 申請列表
export const getAdjustmentList = (params?: object) => {
  return http.request<Result>("get", "/backend/adjustment/list", { params });
};

// 刪除申請單（沿用舊 endpoint，id 走 query）

export const deleteAdjustmentApply = (adjustmentID: number) => {
  return http.request<Result>("delete", "/backend/adjustment/delete", {
    params: { id: adjustmentID }
  });
};

// 審核申請單（沿用舊 endpoint /backend/adjustment/verify，PUT，body 帶 adjustmentID + list）

export const reviewAdjustmentApply = (data: {
  adjustmentID: number;
  list: any[];
}) => {
  return http.request<Result>("put", "/backend/adjustment/verify", { data });
};

// ===== 錢包紀錄（walletLog）=====
export type WalletLogItem = {
  id: number;
  account?: string;
  date: string;
  inOut: number;
  type: number;
  before: number;
  amount: number;
  after: number;
  turnoverMultiple: string;
  turnoverLimit: number;
  note: string;
  refID: string;
};

export type WalletLogListResult = Result<{
  list: WalletLogItem[];
  total: number;
  totalAmount: number;
}>;

/** 收支類型（money/useType）選項 */

export type UseTypeItem = {
  useTypeID: number;
  useTypeName: string;
  color?: string;
};

export type UseTypeListResult = Result<{
  list: UseTypeItem[];
}>;

/** 錢包紀錄列表（沿用舊 endpoint /backend/member/walletlogs/withdrawallist，GET query） */

export const getWalletLogList = (params?: object) => {
  return http.request<WalletLogListResult>(
    "get",
    "/backend/member/walletlogs/withdrawallist",
    { params }
  );
};

/** 收支類型清單（沿用舊 endpoint /backend/money/useType） */

export const getMoneyUseType = () => {
  return http.request<UseTypeListResult>("get", "/backend/money/useType");
};

// ===== member adjustment_list 調整單列表 =====
// 調整單列表單筆型別
export interface MemberAdjustmentItem {
  id: number;
  adjustmentID: number;
  transactionID: string;
  memberID: number;
  memberName: string;
  subject: string;
  reason: number;
  description: string;
  amount: number;
  amountTimes: number;
  adjustmentType: number; // 1 加分 / 2 減分
  status: number; // 1 通過 / 2 拒絕 / 3 / 4
  adjustmentLimit: Array<{ gameTypeName: string; gameGroupName: string }>;
  luckMoneyGameList?: Array<{ gameTypeName: string; gameGroupName: string }>;
  createdAt: string;
  verifyAt: string;
  updateUser: string;
  feDescription: string;
}

/** 取得會員調整單列表（沿用舊 endpoint，舊碼把所有條件併入 query string） */

export const getMemberAdjustmentList = (params?: object) => {
  return http.request<Result<{ list: MemberAdjustmentItem[]; total: number }>>(
    "get",
    "/backend/adjustment/search",
    { params }
  );
};

// 銀行卡查詢 列表項型別（提款帳號搜尋結果）
export interface BankCardItem {
  memberId: number | string;
  memberAccount: string;
  type: number; // 1 銀行卡 / 2 USDT / 3 ecny / 4 手機 / 5 其他
  name: string;
  serviceCode: string;
  address: string;
  bankCode: string;
  area: string;
  branch: string;
  isDefault: number; // 1 是 / 0 否
  status: number; // 1 啟用 / 其他 停用
  createdAt: string;
  updatedAt: string;
}

/** 銀行卡查詢：依提款帳號(bankNo)+類型(type) 查詢綁定資料（沿用舊 endpoint /backend/member/search_bankno） */

export function getBankCardList(params: { bankNo: string; type: number | string }) {
  return http.request<Result<{ list: BankCardItem[]; total: number }>>(
    "get",
    "/backend/member/search_bankno",
    { params }
  );
}

// ===== member 域：锁定钱包（lockedWallets）=====
// 锁定钱包列表项
export interface LockedWalletItem {
  lockID: number;
  memberID: number;
  memberAccount: string;
  lockMoney: number;
  status: number; // 1 锁定中 / 2 已解锁 / 3 已退回
  note: string;
  createdAt: string;
  updatedAt: string;
}

// 取得锁定钱包列表（沿用旧 endpoint /backend/wallet/lock/member/list）

export const getLockedWalletList = (params?: {
  status?: number;
  memberID?: string | number;
  memberAccount?: string;
  createStartTime?: string;
  createEndTime?: string;
}) =>
  http.request<Result<{ list: LockedWalletItem[]; total: number }>>(
    "get",
    "/backend/wallet/lock/member/list",
    { params }
  );

// 解锁会员钱包（旧 put，params 实为 body → 转 data）

export const unlockMemberWallet = (data: { lockID: number; isRepay: boolean }) =>
  http.request<Result<null>>("put", "/backend/wallet/lock/member/unlock", {
    data
  });

// 锁定挂起（旧 endpoint 大小写：/backend/Wallet/Lock/Member/lockPadding）

export const lockPaddingMemberWallet = (data: { lockID: number }) =>
  http.request<Result<null>>("put", "/backend/Wallet/Lock/Member/lockPadding", {
    data
  });

// ===== 會員明細（member/detail）相關 API（沿用舊 endpoint）=====
// 注意：Result<T> 與 http 由 api 檔頭統一定義，勿重複宣告
export type MemberDetailData = Record<string, any>;

/** 取得會員主資料 GET /backend/member/detail?id= */

export const getMemberDetail = (userID: number) =>
  http.request<Result<MemberDetailData>>("get", "/backend/member/detail", {
    params: { id: userID }
  });

/** 取得會員錢包資料 GET /backend/member/detail/money?id=
 *  舊碼另外併入 /backend/member/career 的 totalWin/totalRate；
 *  pure 版於 hook 內僅讀主錢包欄位，career 由 mock 一併回傳於同物件即可，
 *  若後端仍分兩支可在此自行 Promise.all 合併。 */

export const getMemberWalletDetail = (userID: number) =>
  http.request<Result<Record<string, any>>>("get", "/backend/member/detail/money", {
    params: { id: userID }
  });

/** 取得會員戰績 GET /backend/member/career?memberID= */

export const getMemberCareer = (userID: number) =>
  http.request<Result<Record<string, any>>>("get", "/backend/member/career", {
    params: { memberID: userID }
  });

/** 取得會員新幣（樂幣）錢包 GET /backend/member/detail/luckMoney?memberId= */

export const getMemberLuckMoneyDetail = (memberId: number) =>
  http.request<Result<Record<string, any>>>("get", "/backend/member/detail/luckMoney", {
    params: { memberId }
  });

/** 取得會員標籤（含群組）GET /backend/member/tag?id= */

export const getMemberTag = (userID: number) =>
  http.request<Result<{ list: any[]; groups?: any[]; [k: string]: any }>>(
    "get",
    "/backend/member/tag",
    { params: { id: userID } }
  );

/** 取得會員備註 GET /backend/member/comments?id= */

export const getMemberComments = (userID: number) =>
  http.request<Result<{ list: any[]; total?: number }>>(
    "get",
    "/backend/member/comments",
    { params: { id: userID } }
  );

/** 帳號轉會員 ID GET /backend/member/id/account?account= */

export const accountToMemberId = (params: { account: string }) =>
  http.request<Result<{ id: number; account: string }>>(
    "get",
    "/backend/member/id/account",
    { params }
  );

/** 移除提款密碼 DELETE /backend/withdrawal/password/removePassword?memberID= */

export const removeMemberWithdrawalPassword = (id: number) =>
  http.request<Result<null>>(
    "delete",
    "/backend/withdrawal/password/removePassword",
    { params: { memberID: id } }
  );

/** 恢復殭屍帳號 PUT /backend/member/relieveZombie （body 送 account）*/

export const relieveMemberZombieAccount = (data: { account: string }) =>
  http.request<Result<null>>("put", "/backend/member/relieveZombie", { data });

/** 關閉會員 PUT /backend/member/closemember （body 送 account）*/

export const closeMember = (data: { account: string }) =>
  http.request<Result<null>>("put", "/backend/member/closemember", { data });

/** 清除真實姓名 DELETE /backend/member/name?id= */

export const clearMemberRealName = (params: { id: number }) =>
  http.request<Result<null>>("delete", "/backend/member/name", { params });

// ===== member 域：withdrawalInfo 模組（提款資料查詢，沿用舊 endpoint）=====
// 提款資料列表項目
export type WithdrawalInfoItem = {
  userID: number;
  userAccount: string;
  name: string;
  serviceCode: string;
  serviceName: string;
  address: string;
  bankName: string;
  bankCode: string;
  area: string;
  branch: string;
  isDefault: number; // 1 是 / 0 否
  status: number; // 1 啟用 / 0 停用
  createdAt: string;
  updatedAt: string;
};

// 服務代碼下拉選項

export type ServiceOption = {
  serviceCode: string;
  name: string;
};

/** 取得提款資料列表（沿用舊 endpoint /backend/info/withdrawal，GET 帶 query：source/address/serviceCode）*/

export function getMemberWithdrawalInfo(params?: object) {
  return http.request<Result<{ list: WithdrawalInfoItem[]; total: number }>>(
    "get",
    "/backend/info/withdrawal",
    { params }
  );
}

/** 取得提款服務類型下拉（沿用舊 endpoint /backend/info/withdrawal/dropdown）*/

export function getMemberWithdrawalInfoDropdown() {
  return http.request<Result<{ services: ServiceOption[] }>>(
    "get",
    "/backend/info/withdrawal/dropdown"
  );
}

// ===== 會員注冊列表（registList，沿用舊 endpoint /backend/member/register/export） =====
export type RegistItem = {
  memberID: number | string;
  account: string;
  currency: string;
  money: number | string;
  phone: string;
  email: string;
  agencyID: number | string;
  createdAt: string;
  lastLoginAt: string;
};

export type RegistListResult = Result<{
  list: RegistItem[];
  total: number;
}>;

/** 會員注冊列表（依日期區間查詢） */

export const getRegistList = (params?: object) => {
  return http.request<RegistListResult>(
    "get",
    "/backend/member/register/export",
    { params }
  );
};

// ===== member_device_ghost（設備關聯/幽靈設備）=====
export interface MemberDeviceGhostItem {
  deviceID: string;
  lastLoginAccount: string;
  deviceIdLastLoginAt: string;
  list: any[];
}

/** 重複設備（最近可疑設備）列項 */

export interface MemberDeviceRepeatItem {
  deviceID: string;
  totalMemberCount: number;
  lockMemberCount: number;
  multiAccountTag: number;
  relateAgent: number;
  full: boolean;
}

/** 會員狀態切換參數 */

export interface MemberDeviceStatusParams {
  memberIDs: number[];
  status: number; // 1 開啟 / 2 關閉
  comment: string;
}

/** 設備關聯查詢（舊：GetMemberDeviceGhostList，GET /backend/risk/search） */

export const getMemberDeviceGhostList = (params?: object) => {
  return http.request<Result<{ list: MemberDeviceGhostItem[]; total: number }>>(
    "get",
    "/backend/risk/search",
    { params }
  );
};

/** 最近可疑設備/重複設備（舊：GetRepeatList，GET /backend/risk/repeat/list） */

export const getMemberDeviceRepeatList = (params?: object) => {
  return http.request<Result<{ list: MemberDeviceRepeatItem[]; total: number }>>(
    "get",
    "/backend/risk/repeat/list",
    { params }
  );
};

/** 標記全部為多帳號（舊：SetMultiAccount，PUT /backend/risk/multiaccount，body 帶 memberIDs） */

export const setMemberDeviceMultiAccount = (data: { memberIDs: number[] }) => {
  return http.request<Result<{ list: any[] }>>(
    "put",
    "/backend/risk/multiaccount",
    { data }
  );
};

/** 存款功能開關（舊：SetDepositStatus，PUT /backend/member/deposit） */

export const setMemberDepositStatus = (data: MemberDeviceStatusParams) => {
  return http.request<Result<null>>("put", "/backend/member/deposit", { data });
};

/** 提款功能開關（舊：SetWithdrawStatus，PUT /backend/member/withdraw） */

export const setMemberWithdrawStatus = (data: MemberDeviceStatusParams) => {
  return http.request<Result<null>>("put", "/backend/member/withdraw", { data });
};

/** 登入功能開關（舊：SetStatus，PUT /backend/member/status） */

export const setMemberLoginStatus = (data: MemberDeviceStatusParams) => {
  return http.request<Result<null>>("put", "/backend/member/status", { data });
};

// ==== member/online 模組（沿用舊 endpoint /backend/member/online，GET 查詢）====
export interface MemberOnlineItem {
  ID: number | string;
  account: string;
  name: string;
  loginArea: string;
  loginIP: string;
  loginDevice: string;
  loginAt: string;
}

export interface MemberOnlineListResult {
  list: MemberOnlineItem[];
  total: number;
}

/** 在線會員查詢（舊：GetMemberOnline，GET /backend/member/online） */

export const getMemberOnlineList = (params?: {
  id?: string;
  account?: string;
  isFuzzy?: number;
  name?: string;
  loginIP?: string;
  loginDevice?: string;
}) => {
  return http.request<Result<MemberOnlineListResult>>(
    "get",
    "/backend/member/online",
    { params }
  );
};

export interface MemberTagGroupItem {
  id: number;
  name: string;
  color?: string;
}

/** 標籤 */

export interface MemberTagItem {
  id: number;
  name: string;
  tagGroupID?: number;
  color?: string;
  createdAt?: string;
  updatedAt?: string;
  onlyBySystem?: boolean;
  loginForbidden?: boolean;
  loginReason?: boolean;
  withdrawalForbidden?: boolean;
  withdrawReason?: boolean;
  depositForbidden?: boolean;
  riskNotifyAlways?: boolean;
  riskNotifyOnce?: boolean;
  riskCondition?: boolean;
  financialNotifyAlways?: boolean;
  loginNotify?: boolean;
  withdrawalColor?: boolean;
  withdrawalSpecialNoColor?: boolean;
  loginWhiteList?: boolean;
}

interface ListResult<T> {
  list: T[];
  total?: number;
}

/** 取得標籤群組列表 */

export const getMemberTagGroupList = () => {
  return http.request<Result<ListResult<MemberTagGroupItem>>>(
    "get",
    "/backend/member/tag/groups"
  );
};

/** 取得標籤列表（可帶搜尋條件：id / name / isFuzzySearch） */

export const getMemberTagList = (params?: {
  id?: string;
  name?: string;
  isFuzzySearch?: boolean;
}) => {
  return http.request<Result<ListResult<MemberTagItem>>>(
    "get",
    "/backend/member/tag/tags",
    { params }
  );
};

/** 新增標籤群組 */

export const createMemberTagGroup = (data: {
  name: string;
  color?: string;
}) => {
  return http.request<Result<null>>("post", "/backend/member/tag/group", {
    data
  });
};

/** 編輯標籤群組 */

export const updateMemberTagGroup = (data: {
  id: number;
  name: string;
  color?: string;
}) => {
  return http.request<Result<null>>("put", "/backend/member/tag/group", {
    data
  });
};

/** 新增標籤 */

export const createMemberTag = (data: Partial<MemberTagItem>) => {
  return http.request<Result<null>>("post", "/backend/member/tag/tag", {
    data
  });
};

/** 編輯標籤 */

export const updateMemberTag = (data: Partial<MemberTagItem>) => {
  return http.request<Result<null>>("put", "/backend/member/tag/tag", {
    data
  });
};

// lockedLuckWallets 模組專用：紅包錢包鎖定（與一般錢包 lockedWallets 同名函式不同端點，故加 LuckWallet 後綴）
export const getLockedLuckWalletList = (params?: object) =>
  http.request<Result<{ list: any[]; total: number }>>(
    "get",
    "/backend/luck_money/wallet/lock/member/list",
    { params }
  );
export const unlockMemberLuckWallet = (data: { lockID: number; isRepay: boolean }) =>
  http.request<Result<null>>(
    "put",
    "/backend/luck_money/wallet/lock/member/unlock",
    { data }
  );
export const lockPaddingMemberLuckWallet = (data: { lockID: number }) =>
  http.request<Result<null>>(
    "put",
    "/backend/luck_money/wallet/lock/member/lockPadding",
    { data }
  );
