import { http } from "@/utils/http";

/** 後端統一回應格式 */
type Result<T = any> = {
  success: boolean;
  data: T;
};


// ===== 優惠上架列表 launched_list（沿用舊 endpoint）=====
// 列表單筆（多語名稱攤平前的原始結構）
export interface LaunchedListItem {
  ID: number;
  name: string | string[];
  languageText?: Array<{ language: string; name: string }>;
  type: string;
  summary?: string;
  content?: string;
  device: string;
  orderNo: number;
  top: number;
  display: number;
  startTime: string;
  endTime: string;
  imageWeb: string;
  imageH5: string;
  updatedUser: string;
  updatedAt: string;
  promotions: Array<string | { id: number; name: string }>;
}

export interface GetLaunchedListParams {
  id?: string | number;
  name?: string;
  type?: number;
  display?: number;
  device?: number;
  startTime?: string;
  endTime?: string;
  orderBy?: number;
  order?: number;
  page?: number;
  pageSize?: number;
}

// 單筆詳情

export interface LaunchedDetail {
  ID: number;
  name: string;
  summary?: string;
  type: string; // 逗號分隔
  content: string;
  device: string; // 逗號分隔
  orderNo: number;
  top: number;
  display: number;
  startTime: string;
  endTime: string;
  imageWeb: string;
  imageH5: string;
  updatedUser: string;
  updatedAt: string;
  promotions: Array<string | { id: number; name: string }>;
}

export interface UpdateLaunchedParams {
  ID?: number;
  name: string;
  summary?: string;
  type: number[];
  content?: string;
  device: number[];
  orderNo?: number;
  top?: number;
  display?: number;
  startTime: string;
  endTime?: string;
  imageWeb?: string;
  imageH5?: string;
  promotions: number[];
}

// 取得優惠上架列表

export const getLaunchedList = (params?: GetLaunchedListParams) => {
  return http.request<Result<{ list: LaunchedListItem[]; total: number }>>(
    "get",
    "/backend/ai/promotion/launched/list",
    { params }
  );
};

// 取得單筆優惠上架

export const getLaunched = (params: { ID: string | number }) => {
  return http.request<Result<LaunchedDetail>>(
    "get",
    "/backend/ai/promotion/launched",
    { params }
  );
};

// 更新優惠上架（舊 Vben put 的 params 為 body，轉成 data）

export const updateLaunched = (data: UpdateLaunchedParams) => {
  return http.request<Result<{ success: boolean }>>(
    "put",
    "/backend/ai/promotion/launched",
    { data }
  );
};

// 新增優惠上架（舊 Vben post 的 params 為 body，轉成 data）

export const createLaunched = (data: UpdateLaunchedParams) => {
  return http.request<Result<{ success: boolean }>>(
    "post",
    "/backend/ai/promotion/launched",
    { data }
  );
};

// 關聯優惠下拉來源（沿用舊 getPromotionList）

export const getPromotionList = (params?: { pageSize?: number; page?: number }) => {
  return http.request<Result<{ list: Array<{ ID: number; name: string }>; total: number }>>(
    "get",
    "/backend/ai/promotion/list",
    { params }
  );
};

// ===== 優惠列表（aiPromotion/list）相關，沿用舊 endpoint =====
export interface PromotionItem {
  ID: number;
  name: string;
  internalName: string;
  promotionCondTypes: number[];
  status: number;
  startTime: string;
  endTime: string;
  updatedAt: string;
  freedom: number;
  code: string;
  online: number;
  updatedUser: string;
}

export interface GetPromotionListParams {
  ID?: string | number;
  name?: string;
  internalName?: string;
  status?: number | string;
  online?: number | string;
  startTime?: string;
  endTime?: string;
  walletType?: number | string;
  eventCode?: string;
  freedom?: number | string;
  orderBy?: number;
  orderByMode?: number;
  page?: number;
  pageSize?: number;
}

export interface PromotionListResult {
  list: PromotionItem[];
  total: number;
}

/** 取得優惠列表 GET /backend/ai/promotion/list */

export const promotionStatus = (data: { ID: number }) => {
  return http.request<Result<null>>(
    "post",
    "/backend/ai/promotion/status",
    { data }
  );
};
