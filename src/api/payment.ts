import { http } from "@/utils/http";

/** 後端統一回應格式 */
type Result<T = any> = {
  success: boolean;
  data: T;
};


// ===== 線路管理（代收）pay_channel_service =====
export interface ServiceItem {
  type?: number | string;
  id?: number;
  name?: string;
  rate?: number | string;
  groups?: Array<{ key?: any; id?: any; value?: any; type?: number }>;
  amount?: number;
  remain?: number;
  settle?: string;
  weight?: number;
  weighted?: string;
  lowerLimit?: number | string;
  upperLimit?: number | string;
  fee?: number | string;
  perFee?: number | string;
  dayLimit?: number | string;
  status?: number | string;
  note?: string;
  serviceCode?: string;
  payChannelID?: number | string;
  device?: string;
  qrcodeImage?: string;
  displayName?: string;
  method?: number;
  depositAllowChoosePayChannelService?: boolean;
}

export interface ServiceListParams {
  name?: string;
  status?: number | string;
  serviceCode?: string;
  payChannelID?: number | string;
  bankGroupID?: number | string;
  thirdGroupID?: number | string;
  method?: number | string;
  page?: number;
  pageSize?: number;
}

/** 線路列表 */

export const getPayChannelServiceList = (params?: ServiceListParams) =>
  http.request<Result<{ list: ServiceItem[]; total: number }>>(
    "get",
    "/backend/pay_channel_service/",
    { params }
  );

/** 查看/編輯單筆線路 */

export const getPayChannelServiceById = (params: {
  id: number | string;
  type?: number | string;
}) =>
  http.request<Result<ServiceItem>>("get", "/backend/pay_channel_service/edit", {
    params
  });

/** 新增線路 */

export const createPayChannelService = (data: any) =>
  http.request<Result<null>>("post", "/backend/pay_channel_service/create", {
    data
  });

/** 編輯線路（含啟用/停用） */

export const putEditPayChannelService = (data: any) =>
  http.request<Result<null>>("put", "/backend/pay_channel_service/edit", {
    data
  });

/** 線路排序 */

export const putPayChannelServiceSort = (data: {
  id?: number;
  sort?: number;
}) =>
  http.request<Result<null>>("put", "/backend/pay_channel_service/sort", {
    data
  });

/** 取得不包含指定線路的金流群組 */

export const getPayChannelServiceGroupsExclude = (params: {
  id: number | string;
  type: number | string;
}) =>
  http.request<Result<{ groups: Array<{ id?: any; value?: any; type?: number }> }>>(
    "get",
    "/backend/pay_channel_service/groups/exclude",
    { params }
  );

/** 將線路儲存至指定金流群組 */

export const putPayChannelServiceGroups = (data: {
  id: number;
  ids: number[];
}) =>
  http.request<Result<null>>("put", "/backend/pay_channel_service/groups", {
    data
  });

/** 取得共用下拉清單（商戶號/支付方式/結算方式/金流群組） */

export const getPayChannelServiceChannelDropdown = () =>
  http.request<Result<any>>("get", "/backend/pay/pay_channel/dropdown");

// ===== pay_bank_card 銀行卡管理 =====
// endpoint 沿用舊碼字串
export interface PayBankCardItem {
  ID?: number;
  cardNo?: number | string;
  payBankID?: number;
  bankName?: string;
  bankCode?: string;
  accountName?: string;
  type?: number;
  dayUpper?: number;
  dayIn?: number;
  dayOut?: number;
  balance?: number;
  limitLower?: number;
  limitUpper?: number;
  originalAmount?: number;
  broker?: string;
  province?: string;
  city?: string;
  branch?: string;
  status?: string | number;
  note?: string;
  bankAccount?: string;
  oriLoginPw?: string;
  oriUPw?: string;
  oriWithdrawalPw?: string;
  loginPw?: string;
  uPw?: string;
  withdrawalPw?: string;
  identity?: string;
  gender?: string | number;
  verifyDate?: string;
  phone?: number | string;
  updatedAt?: string;
}

/** 銀行卡列表與搜尋 */

export const getPayBankCardList = (params?: object) => {
  return http.request<Result<{ list: PayBankCardItem[]; total: number }>>(
    "get",
    "/backend/pay_bankcard/bankcards",
    { params }
  );
};

/** 取得搜尋/表單下拉清單 */

export const getPayBankCardDropdown = () => {
  return http.request<Result<any>>("get", "/backend/pay_bankcard/dropdown");
};

/** 新增銀行卡（舊碼 post，params 實為 body） */

export const createPayBankCard = (data: object) => {
  return http.request<Result<{ success: boolean }>>(
    "post",
    "/backend/pay_bankcard",
    { data }
  );
};

/** 修改銀行卡（舊碼 put，params 實為 body） */

export const putPayBankCard = (data: object) => {
  return http.request<Result<{ success: boolean }>>(
    "put",
    "/backend/pay_bankcard",
    { data }
  );
};

/** 凍結 */

export const lockPayBankCard = (data: object) => {
  return http.request<Result<{ success: boolean }>>(
    "post",
    "/backend/pay_bankcard/lock",
    { data }
  );
};

/** 解除凍結 */

export const unlockPayBankCard = (data: object) => {
  return http.request<Result<{ success: boolean }>>(
    "post",
    "/backend/pay_bankcard/unlock",
    { data }
  );
};

/** 轉帳 */

export const transferPayBankCard = (data: object) => {
  return http.request<Result<{ success: boolean }>>(
    "post",
    "/backend/pay_bankcard/transfer",
    { data }
  );
};

/** 資金異動 */

export const createPayBankCardTrade = (data: object) => {
  return http.request<Result<{ success: boolean }>>(
    "post",
    "/backend/pay_bankcard/trade",
    { data }
  );
};

// ===== 金流組別（三方）pay_group =====
// 列表單筆資料型別
export interface PayGroupItem {
  ID?: number;
  name?: string;
  nameEn?: string;
  source?: number;
  remark?: string;
  payChannelServiceName?: string;
  payChannelServiceCnt?: number;
  memberCnt?: number;
  depositLower?: number;
  depositUpper?: number;
  updatedUser?: number;
  updatedUserName?: string;
  updatedAt?: string;
}

export interface GetPayGroupsParams {
  /** 類型 [1三方 2銀行卡] */
  type: number | string;
  name?: string;
  source?: number | string;
}

export interface CreatePayGroupParams {
  type: number;
  name: string;
  nameEn: string;
  source: number;
  depositLower: number;
  depositUpper: number;
  remark?: string;
}

export interface PutPayGroupParams {
  ID: number;
  name: string;
  nameEn?: string;
  depositLower: number;
  depositUpper: number;
  remark?: string;
}

export interface PostPayGroupMemberParams {
  payGroupID: number;
  memberAccounts: string;
}

export interface PostPayGroupAgencyParams {
  payGroupID: number;
  agencyAccounts: string;
}

/** 金流組別（三方）：列表 */

export const getPayGroups = (params: GetPayGroupsParams) => {
  return http.request<Result<{ list: PayGroupItem[]; total: number }>>(
    "get",
    "/backend/pay_group/groups",
    { params }
  );
};

/** 金流組別（三方）：新增金流組別 */

export const createPayGroup = (data: CreatePayGroupParams) => {
  return http.request<Result<{ success: boolean }>>(
    "post",
    "/backend/pay_group/group",
    { data }
  );
};

/** 金流組別（三方）：修改金流組別 */

export const putPayGroup = (data: PutPayGroupParams) => {
  return http.request<Result<{ success: boolean }>>(
    "put",
    "/backend/pay_group/group",
    { data }
  );
};

/** 金流組別（三方）：加入會員 */

export const postPayGroupsMember = (data: PostPayGroupMemberParams) => {
  return http.request<Result<{ success: boolean }>>(
    "post",
    "/backend/pay_group/member",
    { data }
  );
};

/** 金流組別（三方）：加入代理 */

export const postPayGroupsAgency = (data: PostPayGroupAgencyParams) => {
  return http.request<Result<{ success: boolean }>>(
    "post",
    "/backend/pay_group/agency",
    { data }
  );
};

// ==== 銀行卡金流組別 pay_bank_group（沿用舊 /backend/pay_group/* endpoint）====
// type: [1 三方 / 2 銀行卡]，本模組固定 type=2
export interface PayBankGroupItem {
  ID: number;
  name: string;
  nameEn: string;
  source: number; // 1 會員 / 2 代理
  remark?: string;
  payChannelServiceName?: string;
  payChannelServiceCnt?: number;
  memberCnt?: number;
  depositLower?: number;
  depositUpper?: number;
  updatedAt?: string;
  updatedUserName?: string;
}

export interface PayBankGroupListParams {
  name?: string;
  source?: number | string;
  type?: number | string;
  page?: number;
  pageSize?: number;
}

/** 銀行卡金流組別：列表（GET /backend/pay_group/groups） */

export const getPayBankGroupList = (params?: PayBankGroupListParams) => {
  return http.request<Result<{ list: PayBankGroupItem[]; total: number }>>(
    "get",
    "/backend/pay_group/groups",
    { params }
  );
};

/** 銀行卡金流組別：新增（POST /backend/pay_group/group，body 帶 type=2） */

export const createPayBankGroup = (data?: object) => {
  return http.request<Result<any>>("post", "/backend/pay_group/group", { data });
};

/** 銀行卡金流組別：修改（PUT /backend/pay_group/group，body 帶 ID） */

export const putPayBankGroup = (data?: object) => {
  return http.request<Result<any>>("put", "/backend/pay_group/group", { data });
};

/** 銀行卡金流組別：加入會員（POST /backend/pay_group/member） */

export const postPayBankGroupMember = (data?: object) => {
  return http.request<Result<any>>("post", "/backend/pay_group/member", { data });
};

/** 銀行卡金流組別：加入代理（POST /backend/pay_group/agency） */

export const postPayBankGroupAgency = (data?: object) => {
  return http.request<Result<any>>("post", "/backend/pay_group/agency", { data });
};

// ===== payment 域：商戶號管理 (pay_channel) =====
export type PayChannelNameItem = {
  id: number;
  name: string;
};

export type PayChannelItem = {
  id: number;
  sn: string;
  name: string;
  status: number; // 1 啟用 / 2 停用
  method?: number;
  supplyAp?: boolean;
  apStatus?: number;
  apLowerLimit?: number;
  apUpperLimit?: number;
  apDayLimit?: number;
  depositLimit?: number | string;
  todayDepositTotal?: number | string;
  todayWithdrawalTotal?: number | string;
  thirdBalance?: string;
  thirdSecondBalance?: string;
  depositRatio?: number;
  note?: string;
};

/** 商戶號管理：商戶號列表查詢 */

export const getPayChannelList = (params?: object) => {
  return http.request<Result<{ list: PayChannelItem[]; total?: number }>>(
    "get",
    "/backend/pay/pay_channel",
    { params }
  );
};

/** 商戶號管理：新增商戶號 */

export const postPayChannel = (data?: object) => {
  return http.request<Result>("post", "/backend/pay/pay_channel", { data });
};

/** 商戶號管理：編輯商戶號 */

export const putPayChannel = (data?: object) => {
  return http.request<Result>("put", "/backend/pay/pay_channel", { data });
};

/** 商戶管理：商戶名列表 */

export const getPayChannelNameList = () => {
  return http.request<Result<{ list: PayChannelNameItem[] }>>(
    "get",
    "/backend/pay/pay_channel_name"
  );
};

/** 商戶管理：新增商戶名 */

export const postPayChannelName = (data?: object) => {
  return http.request<Result>("post", "/backend/pay/pay_channel_name", { data });
};

/** 商戶管理：新增線下 Gcash 線路 */

export const postPayChannelNameOfflineGcash = (data?: object) => {
  return http.request<Result>(
    "post",
    "/backend/pay/pay_channel_name/offline/gcash",
    { data }
  );
};

/** 商戶號管理：充值 */

export const postPayChannelRemainAdd = (data?: object) => {
  return http.request<Result>("post", "/backend/pay/pay_channel/remain/add", {
    data
  });
};

/** 商戶號管理：結算 */

export const postPayChannelRemainSub = (data?: object) => {
  return http.request<Result>("post", "/backend/pay/pay_channel/remain/sub", {
    data
  });
};

/** 商戶號管理：代付狀態變更 */

export const postPayChannelAp = (data?: object) => {
  return http.request<Result>("post", "/backend/pay/pay_channel/ap", { data });
};

// ===== payment / pay_u（USDT U 帐户） 沿用旧 endpoint =====
export interface PayUItem {
  id: number;
  name: string;
  /** 钱包类型：2 ERC / 3 TRC */
  type: number;
  /** 用途类型：0~4 */
  useType: number;
  todayIn: number;
  todayOut: number;
  balance: number;
  address: string;
  originalAmount?: number;
  /** 状态：1 启用 / 2 停用 */
  status: number;
}

/** U 帐户列表 GET /backend/pay/usdt */

export const getPayUList = (params?: {
  name?: string;
  useType?: string | number;
  type?: string | number;
  status?: string | number;
}) =>
  http.request<Result<{ list: PayUItem[]; total: number }>>(
    "get",
    "/backend/pay/usdt",
    { params }
  );

/** 新增 U 帐户 POST /backend/pay/usdt（旧 Vben post params=body → data） */

export const createPayU = (data: {
  name: string;
  type: number;
  useType: number;
  address: string;
  originalAmount?: number;
}) => http.request<Result<null>>("post", "/backend/pay/usdt", { data });

/** 编辑 U 帐户 PUT /backend/pay/usdt（旧 Vben put params=body → data） */

export const editPayU = (data: {
  id?: number;
  name: string;
  type: number;
  useType: number;
  address: string;
  status?: number;
}) => http.request<Result<null>>("put", "/backend/pay/usdt", { data });

/** 商户下发 POST /backend/pay/usdt/money/in */

export const payUMoneyIn = (data: {
  id: number;
  targetID: number;
  amount: number;
  exchangeRate: number;
  exchangeAmount: number;
  fee: number;
}) => http.request<Result<null>>("post", "/backend/pay/usdt/money/in", { data });

/** 充值商户号 POST /backend/pay/usdt/money/out */

export const payUMoneyOut = (data: {
  id: number;
  targetID: number;
  amount: number;
  exchangeRate: number;
  exchangeAmount: number;
  fee: number;
}) => http.request<Result<null>>("post", "/backend/pay/usdt/money/out", { data });

/** 冻结 POST /backend/pay/usdt/money/freeze */

export const payUFreeze = (data: { id: number; amount: number; note: string }) =>
  http.request<Result<null>>("post", "/backend/pay/usdt/money/freeze", { data });

/** 解冻 POST /backend/pay/usdt/money/unfreeze */

export const payUUnFreeze = (data: { id: number; amount: number; note: string }) =>
  http.request<Result<null>>("post", "/backend/pay/usdt/money/unfreeze", { data });

/** U 转帐 POST /backend/pay/usdt/money/transfer */

export const payUTransfer = (data: {
  id: number;
  targetID: number;
  amount: number;
  fee: number;
  thirdID: number | string;
  note?: string;
}) => http.request<Result<null>>("post", "/backend/pay/usdt/money/transfer", { data });

/** 资金异动 POST /backend/pay/usdt/trade */

export const createPayUTrade = (data: {
  id: number | string;
  subjectID: number | string;
  tradeTime: string;
  amount: number;
  fee?: number;
  description: string;
}) => http.request<Result<null>>("post", "/backend/pay/usdt/trade", { data });

/** 商户号搜寻（取得资讯） GET /backend/pay/pay_channel/search */

export const getPayUChannelSearch = (params: { keyword: string }) =>
  http.request<Result<{ id: number; name: string; type: number }>>(
    "get",
    "/backend/pay/pay_channel/search",
    { params }
  );

// ===== payment / finance（顯示項目/充值線路）相關 =====
// 沿用舊 endpoint 字串。Result<T> = { success:boolean; data:T } 由 api 檔頭統一定義，勿重複宣告。
export interface FinanceItem {
  id: number;
  name: string;
  note: string;
  currency: number;
  nums: number;
  status: number;
  maintain: number;
  updatedAt: string;
  updatedUser: string;
  isDefault: boolean;
  filterSetting: number[];
  icon?: string;
  isRecommend?: boolean;
  needRealName?: boolean;
  tooltip?: string;
  hasDoc?: boolean;
  docTitle?: string;
  docURL?: string;
  quickAmount?: string;
}

export interface FinanceListResult {
  list: FinanceItem[];
  total?: number;
  /** 是否允許前台選擇支付通道（舊欄位，沿用） */
  depositAllowChoosePayChannelService?: boolean;
}

export interface FinanceFormData {
  id?: number;
  name?: string;
  note?: string;
  currency?: number;
  nums?: number;
  status?: number;
  maintain?: number;
  filterSetting?: number[];
  icon?: string;
  isRecommend?: boolean;
  needRealName?: boolean;
  tooltip?: string;
  hasDoc?: boolean;
  docTitle?: string;
  docURL?: string;
  quickAmount?: string;
}

/** 顯示項目列表（舊 getFinance，GET /backend/finance） */

export const getFinanceList = (params?: { status?: number; maintain?: number }) =>
  http.request<Result<FinanceListResult>>("get", "/backend/finance", { params });

/** 新增顯示項目（POST /backend/finance/create） */

export const postFinanceCreate = (data?: FinanceFormData) =>
  http.request<Result<{ success: boolean }>>("post", "/backend/finance/create", { data });

/** 儲存顯示項目（PUT /backend/finance/edit）。舊 Vben put 的 params 即 body，轉成 data。 */

export const putFinanceEdit = (data?: FinanceFormData) =>
  http.request<Result<{ success: boolean }>>("put", "/backend/finance/edit", { data });

/** 移除顯示項目（DELETE /backend/finance/finance_delete） */

export const deleteFinance = (data?: { financeID?: number }) =>
  http.request<Result<{ success: boolean }>>("delete", "/backend/finance/finance_delete", { params: data, data });

/** 設為預設（PUT /backend/finance/setdefault） */

export const putFinanceDefault = (data: { id?: number }) =>
  http.request<Result<{ success: boolean }>>("put", "/backend/finance/setdefault", { data });

/** 取得站台充值金額設定（GET /backend/payment/deposit/default/amount/config） */

export const getFinanceAmountConfig = () =>
  http.request<Result<{ amount: string }>>("get", "/backend/payment/deposit/default/amount/config");

/** 更新站台充值金額設定（PUT /backend/payment/deposit/default/amount/config） */

export const putFinanceAmountConfig = (data: { amount: string }) =>
  http.request<Result<{ success: boolean }>>("put", "/backend/payment/deposit/default/amount/config", { data });
