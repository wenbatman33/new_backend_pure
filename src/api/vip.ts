import { http } from "@/utils/http";

/** 後端統一回應格式 */
type Result<T = any> = {
  success: boolean;
  data: T;
};

export type VipBlackItem = {
  id: number;
  memberID: number;
  memberAccount: string;
  type: number;
  reason: string;
  createdAt: string;
  editorName: string;
};

export type VipBlackListResult = Result<{
  list: VipBlackItem[];
  total: number;
}>;

/** 黑名單列表 */
export const getVipBlackList = (params?: object) => {
  return http.request<VipBlackListResult>("get", "/backend/vip/black/list", {
    params
  });
};

/** 新增黑名單 */
export const postVipBlack = (data?: object) => {
  return http.request<Result>("post", "/backend/vip/black/add", { data });
};

/** 移除黑名單 */
export const deleteVipBlack = (id: number) => {
  return http.request<Result>("delete", "/backend/vip/black/delete", {
    params: { id }
  });
};

/* ──────────────────────────────────────────────────────────────
 * 以下為 vip 域第一批 fan-out 合併之 api（vipList / vipLevel /
 * vipLevelHistory / vipReturn / vipReturnGameGroup /
 * vipManualReplenishmentWater）。getConfigure 三模組共用同一 endpoint，
 * 已併為一份；ConfigureResult 加上 returnList? 與 index signature 以同時
 * 滿足 vipLevel(levelList)、vipReturn(returnList)、vipReturnGameGroup。
 * ────────────────────────────────────────────────────────────── */

// ===== VIP 等級表單列 =====
export type VipLevelRow = {
  level: number;
  vipImage: string;
  name: string;
  upgradeBetAmount: number | string;
  upgradeRechargeAmount: number | string;
  keepBetAmount: number | string;
  keepRechargeAmount: number | string;
  upgradeGift: number | string;
  upgradeGiftMultiple: number | string;
  dailyGift: number | string;
  dailyGiftRechargeMultiple: number | string;
  dailyGiftBetMultiple: number | string;
  dailyGiftMultiple: number | string;
  weeklyGift: number | string;
  weeklyGiftRechargeMultiple: number | string;
  weeklyGiftBetMultiple: number | string;
  weeklyGiftMultiple: number | string;
  monthlyGift: number | string;
  monthlyGiftRechargeMultiple: number | string;
  monthlyGiftBetMultiple: number | string;
  monthlyGiftMultiple: number | string;
  birthdayGift: number | string;
  birthdayGiftMultiple: number | string;
  withdrawAmountLimit: number | string;
  withdrawTimesLimit: number | string;
  singleWithdrawAmountLimit: number | string;
};

// ===== VIP 機制設定（含等級表 levelList、返水 returnList） =====
export type ConfigureResult = {
  vipStatus: boolean;
  isSpeedLevelUp: boolean;
  isUpgradeGift: boolean;
  isWeeklyGift: boolean;
  isMonthlyGift: boolean;
  isDailyGift: boolean;
  isBdGift: boolean;
  vipWeek: number;
  vipMonth: number;
  giftDeadline: number;
  isBindCard: boolean;
  isShowRefund: boolean;
  customizedService: number;
  isKeep: boolean;
  vipKeep: number;
  vipKeepAging: number;
  vipDowngrade: number;
  bdGiftDeadline: number;
  levelList: VipLevelRow[];
  // 返水設定（vipReturn 用），欄位視後端啟用的遊戲類別而定
  returnList?: Array<{ level: number | string; [key: string]: number | string }>;
  [key: string]: any;
};

/** 取得 VIP 設定與等級/返水列表（三模組共用） */
export const getConfigure = () => {
  return http.request<Result<ConfigureResult>>("get", "/backend/vip/configure");
};

/** 儲存 VIP 機制設定 */
export const postConfigure = (data?: object) => {
  return http.request<Result>("post", "/backend/vip/configure", { data });
};

/** 整張等級表批次編輯儲存 */
export const putConfigureLevelEdit = (data?: object) => {
  return http.request<Result>("put", "/backend/vip/configure/level/edit", {
    data
  });
};

/** 初始化建立 N 級 VIP */
export const postConfigureLevelInit = (level: number | string) => {
  return http.request<Result>("post", "/backend/vip/configure/level/init", {
    data: { level }
  });
};

/** 新增單一等級 */
export const postConfigureLevelAdd = (data?: object) => {
  return http.request<Result>("post", "/backend/vip/configure/level/add", {
    data
  });
};

/** 編輯 VIP 返水設定（批次儲存） */
export const putConfigureReturnEdit = (data?: object) => {
  return http.request<Result>("put", "/backend/vip/configure/return/edit", {
    data
  });
};

// ===== VIP 等級異動紀錄 =====
export type VipLevelHistoryItem = {
  memberID: number;
  memberAccount: string;
  type: number;
  oldLevel: number | string;
  newLevel: number | string;
  createdAt: string;
  editorName: string;
};

export type VipLevelHistoryListResult = Result<{
  list: VipLevelHistoryItem[];
  total: number;
}>;

/** VIP 等級異動紀錄列表 */
export const getVipKeepList = (params?: object) => {
  return http.request<VipLevelHistoryListResult>(
    "get",
    "/backend/vip/keep/list",
    { params }
  );
};

// ===== VIP 禮金 / 反水試算 =====
/** VIP 禮金/反水發放查詢列表 */
export const getVipGiftList = (params?: object) => {
  return http.request<Result<any>>("get", "/backend/vip/gift/search", {
    params
  });
};

/** 新增生日禮金 */
export const addVipBirthGift = (data?: object) => {
  return http.request<Result>("post", "/backend/vip/gift/birthday", { data });
};

/** 反水試算（預估反水預覽） */
export const getVipRefundTrial = (params?: object) => {
  return http.request<Result<any>>("get", "/backend/vip/refund/trial", {
    params
  });
};

// ===== VIP 遊戲群組返水 =====
/** 取得各遊戲群組反水設定列表 */
export const getVipGameGroupReturn = (params?: object) => {
  return http.request<
    Result<{
      list: {
        gameGroupID: string | number;
        returnList: { level: string; refund: number | string }[];
      }[];
    }>
  >("get", "/backend/vip/gamegroup/return", { params });
};

/** 編輯（批次儲存）遊戲群組反水設定 */
export const putVipGameGroupReturnEdit = (data?: object) => {
  return http.request<Result>("put", "/backend/vip/gamegroup/return/edit", {
    data
  });
};

// ===== 共用圖片上傳（沿用舊 /file/file/upload，回傳 { url }） =====
export const uploadFile = (data: FormData) => {
  return http.request<Result<{ url: string }>>("post", "/file/file/upload", {
    data
  });
};

// ===== VIP 手動補水（CN） =====
/** 補額外流水（步驟一） */
export const getUpdateBetAmount = (params?: object) => {
  return http.request<Result>(
    "get",
    "/backend/vipjob/manual/cn/updatebetamount",
    { params }
  );
};

/** 補水（步驟二） */
export const getRefund = (params?: object) => {
  return http.request<Result>("get", "/backend/vipjob/manual/cn/refund", {
    params
  });
};

/** 補水審核列表（步驟三）。舊碼預設帶 pageSize=99999 一次撈完 */
export const getRefundReviewList = (param?: object | null) => {
  const params = { pageSize: 99999, ...(param ?? {}) };
  return http.request<Result<{ list: any[]; total?: number }>>(
    "get",
    "/backend/vip/cn/manual/refund/review/list",
    { params }
  );
};

/** 補水審核：拒絕。IDs 為空陣列代表全部 */
export const postRefundReviewReject = (data?: object) => {
  return http.request<Result>(
    "post",
    "/backend/vip/cn/manual/refund/review/reject",
    { data }
  );
};

/** 補水審核：通過。IDs 為空陣列代表全部 */
export const postRefundReviewPass = (data?: object) => {
  return http.request<Result>(
    "post",
    "/backend/vip/cn/manual/refund/review/pass",
    { data }
  );
};
