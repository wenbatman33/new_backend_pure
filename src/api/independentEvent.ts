import { http } from "@/utils/http";

/** 後端統一回應格式 */
type Result<T = any> = {
  success: boolean;
  data: T;
};


// ===== 任務中心 missionCenter（沿用舊 /@/api/missionCenter/task.ts 的 endpoint）=====
export interface TaskItem {
  id: number;
  name: string;
  internalName: string;
  status: number; // 1 啟用 / 0 停用
  type: number; // 1 每日 / 2 每週 / 3 自訂
  week?: number;
  activeReset?: boolean;
  receiveDay?: number;
  startTime: string;
  endTime: string;
  updatedAt: string;
  updatedUser: string;
}

export interface TaskListResult {
  list: TaskItem[];
  total: number;
}

/** 任務列表 GET /backend/task/list */

export const GetTaskList = (params?: object) =>
  http.request<Result<TaskListResult>>("get", "/backend/task/list", { params });

/** 任務明細 GET /backend/task/detail */

export const GetTaskDetail = (params: { id: number | string }) =>
  http.request<Result<any>>("get", "/backend/task/detail", { params });

/** 新增任務 POST /backend/task/（舊 defHttp.post params 實為 body，轉 data） */

export const CreateTask = (data: object) =>
  http.request<Result<any>>("post", "/backend/task/", { data });

/** 編輯任務 PUT /backend/task/（含啟停切換；舊 params 實為 body，轉 data） */

export const EditTask = (data: object) =>
  http.request<Result<any>>("put", "/backend/task/", { data });

// 推荐有礼活动（event0054）设定页型别
export type RecommendRebateItem = {
  gameType: string | number;
  rebate: number;
};

export type RecommendConfigData = {
  isRun: boolean;
  event2UpperLimit: number;
  event1BonusList: { people: number; bonus: number }[];
  event2Rebate1: RecommendRebateItem[];
  event2Rebate2: RecommendRebateItem[];
  event2Rebate3: RecommendRebateItem[];
  event1IsShow: boolean;
  event2IsShow: boolean;
};

export type GameTypeItem = {
  id: number;
  name: string;
};

/** 取得推荐有礼活动设定 */

export const getRecommendConfig = () => {
  return http.request<Result<RecommendConfigData>>(
    "get",
    "/backend/event/event0054/config"
  );
};

/** 储存设定区（开关 + 上限） */

export const postRecommendSetevent = (data?: object) => {
  return http.request<Result>("post", "/backend/event/event0054/setevent", {
    data
  });
};

/** 储存活动一奖金清单 */

export const postRecommendSetevent1 = (data?: object) => {
  return http.request<Result>("post", "/backend/event/event0054/setevent1", {
    data
  });
};

/** 储存活动二反水矩阵 */

export const postRecommendSetevent2 = (data?: object) => {
  return http.request<Result>("post", "/backend/event/event0054/setevent2", {
    data
  });
};

/** 取得游戏类型清单（活动二反水矩阵栏位来源） */

export const getGameType = (params?: object) => {
  return http.request<Result<{ list: GameTypeItem[] }>>(
    "get",
    "/backend/game/game_type",
    { params }
  );
};

// ===== 彩蛋活動（復活節彩蛋）相關 =====
// 沿用舊 endpoint，base = /backend/event/easter/egg
export interface EggItem {
  id: number;
  name: string;
  promotionCode?: string;
  startDate: string;
  endDate: string;
  startTime: string;
  roundTime: number;
  status: number; // 1 進行中 / 2 已結束
  updatedAt: string;
  updatedUser: string;
}

// 列表

export const getEggList = (params?: object) =>
  http.request<Result<{ list: EggItem[]; total: number }>>(
    "get",
    "/backend/event/easter/egg/list",
    { params }
  );

// 單筆詳情（舊碼用 ?id= query）

export const getEggByID = (id: number | string) =>
  http.request<Result<any>>("get", "/backend/event/easter/egg", {
    params: { id }
  });

// 新增（舊 Vben post 的 params 實為 body → 轉 data）

export const createEgg = (data: object) =>
  http.request<Result<null>>("post", "/backend/event/easter/egg", { data });

// 修改（舊 Vben put 的 params 實為 body → 轉 data）

export const updateEgg = (data: object) =>
  http.request<Result<null>>("put", "/backend/event/easter/egg", { data });

// 停用（更新狀態，舊碼 put body { id }）

export const updateEggStatusByID = (id: number | string) =>
  http.request<Result<null>>("put", "/backend/event/easter/egg/status", {
    data: { id }
  });

// 異動紀錄

export const getEggLog = (params: { id: number | string } & object) =>
  http.request<Result<{ list: any[]; total?: number }>>(
    "get",
    "/backend/event/easter/egg/log",
    { params }
  );

// 依遊戲類型分類的遊戲群組（cascader 選項；舊碼 from /@/api/game/gamegroup）
// endpoint 屬 game 域，這裡沿用同一字串以供本模組使用

export const getGameGroupByGameType = (params?: object) =>
  http.request<Result<{ list: any[] }>>(
    "get",
    "/backend/game/gamegroup/getgamegroupcategorizedbygametype",
    { params }
  );

// === independentEvent / signIn 沿用舊 endpoint（/backend/promotion/group*） ===
export interface PromotionGroupItem {
  id: number;
  code: string;
  name: string;
  internalName: string;
  status: number; // 1 啟用 / 2 停用
  startTime: string;
  endTime: string;
  updatedAt: string;
  updatedUser: string;
}

export interface PromotionGroupListResult {
  list: PromotionGroupItem[];
  total: number;
}

/** 簽到活動（優惠群組）列表 */

export function getPromotionGroupList(params?: any) {
  return http.request<Result<PromotionGroupListResult>>(
    "get",
    "/backend/promotion/group/list",
    { params }
  );
}

/** 簽到活動明細（依 code） */

export function getPromotionGroup(code: string | number) {
  return http.request<Result<PromotionGroupItem>>(
    "get",
    "/backend/promotion/group",
    { params: { code } }
  );
}

/** 新增簽到活動 */

export function createPromotionGroup(data: any) {
  return http.request<Result<null>>("post", "/backend/promotion/group", {
    data
  });
}

/** 編輯簽到活動（舊 Vben put 的 params 即 body，故轉成 data） */

export function updatePromotionGroup(data: any) {
  return http.request<Result<null>>("put", "/backend/promotion/group", {
    data
  });
}

/** 批次更新簽到活動狀態 */

export function updatePromotionGroupStatus(data: any) {
  return http.request<Result<null>>("put", "/backend/promotion/group/status", {
    data
  });
}
