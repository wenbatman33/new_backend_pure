import { http } from "@/utils/http";

/** 後端統一回應格式 */
type Result<T = any> = {
  success: boolean;
  data: T;
};


// 優惠申請清單單筆資料
export interface PromotionApplyItem {
  ID: number;
  agencyID: number;
  memberID: number;
  memberAccount: string;
  bonus: number;
  status: number;
  createdAt: string;
  sendAt: string;
  promotionName: string;
  internalName: string;
  promotionID: number;
  promotionCondTypes: Record<string, number>;
  promotionCondRange: any[];
  note: string;
  registerIP: string;
  lastLoginIP: string;
  batchID: number;
  batchCycle: string;
  updatedAt: string;
  updatedUser: string;
  sendWay: number;
}

export interface PromotionMemberListData {
  list: PromotionApplyItem[];
  total: number;
  totalAmount?: number;
  count?: number;
}

/** 優惠：申請清單（沿用舊 endpoint /backend/promotion/member/list） */

export const getPromotionMemberList = (params?: any) =>
  http.request<Result<PromotionMemberListData>>(
    "get",
    "/backend/promotion/member/list",
    { params }
  );

/** 優惠：下拉選單（沿用舊 endpoint /backend/promotion/dropdown） */

export const getPromotionDropdown = () =>
  http.request<Result<any>>("get", "/backend/promotion/dropdown");

/** 優惠：取消申請（舊 defHttp.post params 視為 body -> {data}） */

export const cancelApply = (data: { ID?: number }) =>
  http.request<Result<null>>("post", "/backend/promotion/member/cancel", {
    data
  });

/** 優惠：重新申請 */

export const reApply = (data: { ID?: number }) =>
  http.request<Result<null>>("post", "/backend/promotion/member/reapply", {
    data
  });

/** 優惠：批次派發審核（手動派發 3 / 拒絕派發 7） */

export const approveMember = (data: { ID: number; status: number }) =>
  http.request<Result<null>>("post", "/backend/promotion/member/approve", {
    data
  });

/** 優惠：操作日誌（GET 帶 query -> {params}） */

export const getOperateLog = (params: { ID: number }) =>
  http.request<Result<any>>("get", "/backend/promotion/member/log", {
    params
  });

// === 域 promotion / 模組 competitionList（沿用舊 endpoint /backend/league*）===
// Result<T> 由 api 檔頭統一定義，勿重複宣告；http from "@/utils/http"
export const getCompetitionList = (params?: object) =>
  http.request<Result>("get", "/backend/league/list", { params });

/** 新增聯賽（舊 post body 用 params，這裡轉 data） */

export const addCompetitionLeague = (data?: object) =>
  http.request<Result>("post", "/backend/league", { data });

/** 編輯聯賽（舊 put body 用 params，這裡轉 data） */

export const editCompetitionLeague = (data?: object) =>
  http.request<Result>("put", "/backend/league", { data });

/** 刪除聯賽 */

export const deleteCompetitionLeague = (ID: number) =>
  http.request<Result>("delete", `/backend/league?ID=${ID}`);

/** 取得聯賽關鍵字列表 */

export const getCompetitionKeyword = (params?: object) =>
  http.request<Result>("get", "/backend/league/list/keyword", { params });

/** 新增聯賽關鍵字 */

export const addCompetitionKeyword = (data?: object) =>
  http.request<Result>("post", "/backend/league/list/keyword", { data });

/** 刪除聯賽關鍵字 */

export const deleteCompetitionKeyword = (ID: number) =>
  http.request<Result>("delete", `/backend/league/list/keyword?ID=${ID}`);

/** 取得聯賽下拉選單 */

export const getLeagueDropdownList = () =>
  http.request<Result>("get", "/backend/league/dropdown");

export interface LaunchedListItem {
  ID: number;
  orderNo: number;
  type: string;
  name: string[];
  languageText?: { language: string; name: string }[];
  device: string;
  top: number;
  display: number;
  promotions: { id: number; name: string }[];
  imageWeb: string;
  imageH5: string;
  startTime: string;
  endTime: string;
  updatedAt: string;
  updatedUser: string;
}

/** 優惠上架列表查詢參數 */

export interface GetLaunchedListParams {
  id?: string | number;
  name?: string;
  display?: number | string;
  device?: number | string;
  activity?: number | string;
  startTime?: string;
  endTime?: string;
  orderBy?: number;
  order?: number;
  page?: number;
  pageSize?: number;
}

/** 新增/編輯優惠上架參數 */

export interface LaunchedFormParams {
  ID?: number;
  name: string;
  summary?: string;
  type: number[];
  device: number[];
  content?: string;
  orderNo?: number;
  top?: number;
  display?: number;
  startTime: string;
  endTime?: string;
  imageWeb?: string;
  imageH5?: string;
  promotions: number[];
}

/** 優惠：優惠上架列表（沿用舊 endpoint /backend/promotion/launched/list） */

export const getLaunchedList = (params?: GetLaunchedListParams) => {
  return http.request<Result<{ list: LaunchedListItem[]; total: number }>>(
    "get",
    "/backend/promotion/launched/list",
    { params }
  );
};

/** 優惠：取得單一上架優惠（/backend/promotion/launched） */

export const getLaunched = (params: { ID: string | number }) => {
  return http.request<Result<any>>("get", "/backend/promotion/launched", {
    params
  });
};

/** 優惠：新增優惠上架（舊 post body 走 data） */

export const createLaunched = (data: LaunchedFormParams) => {
  return http.request<Result<{ success: boolean }>>(
    "post",
    "/backend/promotion/launched",
    { data }
  );
};

/** 優惠：編輯優惠上架（舊 put body 走 data） */

export const updateLaunched = (data: LaunchedFormParams) => {
  return http.request<Result<{ success: boolean }>>(
    "put",
    "/backend/promotion/launched",
    { data }
  );
};

/** 優惠：下拉選單（/backend/promotion/dropdown） */

export const getPromotionList = (params?: { pageSize?: number; page?: number }) => {
  return http.request<Result<{ list: { ID: number; name: string }[]; total: number }>>(
    "get",
    "/backend/promotion/list",
    { params }
  );
};

// ===== promotion/batch（批次派發）相關 =====
// 批次派發列表 row
export interface PromotionBatchItem {
  ID: number;
  batchID: number;
  promotionID: number;
  promotionName: string;
  internalName: string;
  batchCycle: string;
  sendWay: number; // 1 自動 / 2 手動
  totalAmount: number;
  memberNumber: number;
  memberFailNumber: number;
  sendAt: string;
  updatedUser: string;
}

/** 優惠:批次派發列表（沿用舊 endpoint /backend/promotion/member，GET → params） */

export function getPromotionBatchList(params?: object) {
  return http.request<Result<{ list: PromotionBatchItem[]; total: number }>>(
    "get",
    "/backend/promotion/member",
    { params }
  );
}

/** 優惠:批次派發審核列表（沿用舊 endpoint /backend/promotion/member/approve，GET → params） */

export function getPromotionApproveList(params: {
  promotionID: number;
  batchID: number;
  memberAccount?: string;
  page?: number;
  pageSize?: number;
}) {
  return http.request<Result<{ list: any[]; total: number }>>(
    "get",
    "/backend/promotion/member/approve",
    { params }
  );
}

/** 優惠:批次派發審核（沿用舊 endpoint /backend/promotion/member/approve，POST → data。status 3 通過 / 7 拒絕） */

export function approvePromotionMember(data: { ID: number; status: number }) {
  return http.request<Result<null>>(
    "post",
    "/backend/promotion/member/approve",
    { data }
  );
}

// ===== promotion 域：list 模組（沿用舊 endpoint） =====
// 下拉選單項目（後端回傳 { "1": "文字" } 形式，key/value 動態）
export interface DropdownItem {
  [key: string]: string;
}

// 優惠列表單筆

export interface PromotionItem {
  ID: number;
  name: string;
  internalName?: string;
  promotionCondTypes?: number[];
  status: number; // 1 啟用 2 停用
  startTime: string;
  endTime: string;
  updatedAt: string;
  freedom: number; // 1 後台機制 2 獨立機制 3 指定存款
  code: string;
  online: number; // 1 線上 2 線下
  updatedUser: string;
  walletType?: number;
  [key: string]: any;
}

export interface PromotionDropdownData {
  status?: DropdownItem[];
  promotionCondType?: DropdownItem[];
  activity?: DropdownItem[];
  cycleType?: DropdownItem[];
  way?: DropdownItem[];
  approveCycle?: DropdownItem[];
  device?: DropdownItem[];
  [key: string]: any;
}

/** 優惠列表 GET /backend/promotion/list */

export const promotionStatus = (data: { ID: number }) => {
  return http.request<Result<null>>("put", "/backend/promotion/status", {
    data
  });
};

/** 刪除優惠 DELETE /backend/promotion（舊碼同時帶 params 與 data） */

export const deletePromotion = (data: { ID: number }) => {
  return http.request<Result<null>>("delete", "/backend/promotion", {
    params: data,
    data
  });
};

// ===== 排行榜（winnerRank）相關 endpoint，沿用舊 /backend/event/rank/* =====
// 排行榜列表項目
export interface RankListItem {
  id: number;
  eventCode: string;
  name: string;
  startTime: string;
  endTime: string;
  status: number; // 1 啟用 / 2 停用
  updatedAt: string;
  updatedUser: string;
  // 設定表單回填用（後端列表會一併回傳）
  cycleType?: number;
  finalEndTime?: string;
  rankAmount?: number;
  type?: number;
  gameItem?: any[];
  tag?: number[];
  displayStartTime?: string;
  displayEndTime?: string;
  bonusShow?: number;
  typeShow?: number;
  imgUrl?: string;
  announcement?: string;
}

// 排行榜會員項目

export interface RankMember {
  order?: number;
  memberAccount: string;
  eventBetAmount: string | number;
}

/** 取得排行榜列表 */

export const getRankList = (params?: object) => {
  return http.request<Result<{ list: RankListItem[]; total: number }>>(
    "get",
    "/backend/event/rank/list",
    { params }
  );
};

/** 新增排行榜 */

export const createRank = (data?: object) => {
  return http.request<Result<null>>("post", "/backend/event/rank", { data });
};

/** 修改排行榜（設定） */

export const editRank = (data?: object) => {
  return http.request<Result<null>>("put", "/backend/event/rank", { data });
};

/** 取得排行榜會員名次清單 */

export const getRankMemberList = (params?: object) => {
  return http.request<Result<{ list: RankMember[] }>>(
    "get",
    "/backend/event/rank/memberlist",
    { params }
  );
};

/** 編輯排行榜會員名次清單 */

export const editRankMember = (data?: object) => {
  return http.request<Result<null>>("put", "/backend/event/rank/memberlist", {
    data
  });
};

/** 取得排行榜操作記錄 */

export const getRankOperateLog = (params?: object) => {
  return http.request<Result<{ list: any[] }>>(
    "get",
    "/backend/event/rank/log",
    { params }
  );
};

export interface PromotionTypeItem {
  id: number;
  promotionTypeID: number;
  locale: string;
  typeName: string;
  sort: number;
  updatedAt?: string;
  updatedUser?: string;
}

/** 取得优惠分类列表 */

export const getPromotionTypeList = () => {
  return http.request<Result<{ list: PromotionTypeItem[]; total: number }>>(
    "get",
    "/backend/promotion/type/list"
  );
};

/** 新增优惠分类 */

export const postPromotionTypeCreate = (data?: object) => {
  return http.request<Result<null>>(
    "post",
    "/backend/promotion/type/create",
    { data }
  );
};

/** 编辑优惠分类 */

export const putPromotionTypeEdit = (data?: object) => {
  return http.request<Result<null>>(
    "put",
    "/backend/promotion/type/edit",
    { data }
  );
};

/** 删除优惠分类 */

export const deletePromotionTypeDelete = (id: number) => {
  return http.request<Result<null>>(
    "delete",
    "/backend/promotion/type/delete",
    { params: { id } }
  );
};

// ==== 小遊戲(優惠上架) smallGame 模組 ====
// 沿用舊 endpoint：
//   GET  /backend/promotion/launched/list   優惠上架列表
//   GET  /backend/promotion/launched/bonus/list  小遊戲圖片列表(本模組另回傳 typeMap 上架類型對照)
//   GET  /backend/promotion/launched        取得單一上架優惠
//   PUT  /backend/promotion/launched        編輯優惠上架(亦用於切換顯示/隱藏)
//   GET  /backend/promotion/log/list         操作紀錄
export interface SmallGameItem {
  ID: number;
  internalName?: string;
  display: number; // 1 顯示 2 隱藏
  type: string; // 逗號分隔的上架類型 key
  imageSmallGame?: string;
  updatedAt?: string;
  updatedUser?: string;
  languageText?: Array<{
    language: string;
    name: string;
    imageWeb?: string;
    imageH5?: string;
  }>;
  promotions?: Array<{
    ID: number;
    id?: number;
    name: string;
    internalName?: string;
    status: number; // 1 上架 2 下架
  }>;
  timeInterval?: Array<{ startTime?: string; endTime?: string }>;
}

/** 小遊戲：優惠上架列表 */

export const getSmallGameLaunchedList = (params?: object) =>
  http.request<Result<{ list: SmallGameItem[]; total: number }>>(
    "get",
    "/backend/promotion/launched/list",
    { params }
  );

/** 小遊戲：圖片連結列表(含上架類型對照 typeMap) */

export const getSmallGameImageList = () =>
  http.request<
    Result<{ list: Array<{ id: number; url: string }>; typeMap?: Record<string, string> }>
  >("get", "/backend/promotion/launched/bonus/list");

/** 小遊戲：取得單一上架優惠 */

export const getSmallGameLaunched = (params?: { ID: number }) =>
  http.request<Result<any>>("get", "/backend/promotion/launched", { params });

/** 小遊戲：編輯優惠上架(亦用於切換顯示/隱藏) */

export const updateSmallGameLaunched = (data?: object) =>
  http.request<Result<null>>("put", "/backend/promotion/launched", { data });

/** 小遊戲：取得操作紀錄 */

export const getSmallGamePromotionLog = (params?: {
  ID?: number;
  promotionLaunchedID?: number;
}) =>
  http.request<Result<{ list: any[] }>>("get", "/backend/promotion/log/list", { params });

// ===== promotion / eventList（賽事列表）相關 =====
// 沿用舊 endpoint：/backend/promotion/gameevent/*
export interface PromotionEventIdItem {
  id: number;
  game_display_name: string;
  game_event_id: string;
}

/** 賽事列表單筆 */

export interface PromotionEventItem {
  id: number;
  promoEventID: string;
  promoGameID: string;
  note: string;
  eventStartTime: string;
  eventEndTime: string;
  eventID: PromotionEventIdItem[];
  score: number;
  status: number;
  updatedAt: string;
  updatedUser: string;
}

/** 取得賽事列表 */

export const getPromotionEventList = (params?: object) => {
  return http.request<Result<{ list: PromotionEventItem[]; total: number }>>(
    "get",
    "/backend/promotion/gameevent/list",
    { params }
  );
};

/** 新增賽事（舊 Vben post params 實為 body → data） */

export const addPromotionEvent = (data: object) => {
  return http.request<Result<any>>(
    "post",
    "/backend/promotion/gameevent/createevent",
    { data }
  );
};

/** 編輯賽事（舊 Vben put params 實為 body → data） */

export const editPromotionEvent = (data: object) => {
  return http.request<Result<any>>(
    "put",
    "/backend/promotion/gameevent/editevent",
    { data }
  );
};

/** 刪除賽事（舊碼以 query ?id= 傳遞） */

export const deletePromotionEvent = (id: number) => {
  return http.request<Result<any>>(
    "delete",
    "/backend/promotion/gameevent/deleteevent",
    { params: { id } }
  );
};

/** 編輯總積分 */

export const editPromotionEventScore = (data: object) => {
  return http.request<Result<any>>(
    "put",
    "/backend/promotion/gameevent/editscore",
    { data }
  );
};

/** 取得賽事盤口列表（管理賽事 ID 用） */

export const getPromotionSportsList = (params?: object) => {
  return http.request<Result<{ list: any[]; total: number }>>(
    "get",
    "/backend/promotion/gameevent/sportlist",
    { params }
  );
};

/** 加入賽事 ID（回傳 data.id） */

export const addPromotionEventID = (data: object) => {
  return http.request<Result<{ id: number }>>(
    "post",
    "/backend/promotion/gameevent/createeventid",
    { data }
  );
};

/** 刪除賽事 ID（舊碼以 query ?id= 傳遞） */

export const deletePromotionEventID = (id: number) => {
  return http.request<Result<any>>(
    "delete",
    "/backend/promotion/gameevent/deleteeventid",
    { params: { id } }
  );
};

// ===== 抢红包(进球抢红包)模組 promotion/lottery =====
// 沿用旧 endpoint：/backend/red_packet/list、/backend/red_packet、/backend/red_packet/status、/backend/red_packet/log、/file/file/upload
// 注意：勿重复宣告 Result/http，以下型别仅示意，合并时请用 api 档头统一的 Result<T>
export interface LotteryItem {
  id: number;
  name: string;
  eventTime: string;
  status: number; // 1 进行中 / 2 待启用 / 3 已结束 / 4 即将启用
  time: number;
  people: number;
  sendTime: string;
  updatedUser: string;
}

export type LotteryListResult = Result<{ list: LotteryItem[]; total: number }>;

/** 抢红包列表 */

export const getLotteryList = (params?: object) => {
  return http.request<LotteryListResult>("get", "/backend/red_packet/list", { params });
};

/** 抢红包明细(旧 getByID) */

export const getLotteryById = (id: number) => {
  return http.request<Result>("get", "/backend/red_packet", { params: { id } });
};

/** 新增抢红包(旧 create，POST body) */

export const createLottery = (data: object) => {
  return http.request<Result>("post", "/backend/red_packet", { data });
};

/** 编辑抢红包(旧 update，PUT body) */

export const updateLottery = (data: object) => {
  return http.request<Result>("put", "/backend/red_packet", { data });
};

/** 删除抢红包(旧 deleteByID) */

export const deleteLotteryById = (id: number) => {
  return http.request<Result>("delete", "/backend/red_packet", { params: { id } });
};

/** 变更抢红包状态(旧 updateStatusByID，PUT body) */

export const updateLotteryStatus = (data: { id: number; status: number }) => {
  return http.request<Result>("put", "/backend/red_packet/status", { data });
};

/** 抢红包操作记录(旧 getOperateLog) */

export const getLotteryLog = (params: { id: number }) => {
  return http.request<LotteryListResult>("get", "/backend/red_packet/log", { params });
};

/** 上传广播图(旧 fileUpload，FormData) */

export const uploadLotteryFile = (data: FormData) => {
  return http.request<Result<{ url: string }>>("post", "/file/file/upload", { data });
};
