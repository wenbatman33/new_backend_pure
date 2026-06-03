import { http } from "@/utils/http";

/** 後端統一回應格式 */
type Result<T = any> = {
  success: boolean;
  data: T;
};


// ===== saba promotion 活動 =====
export interface PromotionListItem {
  id: number;
  name: string;
  route: string;
  status: number;
  sportId: number;
  start: string;
  end: string;
}

/** 活動列表 */

export const getSabaPromotionList = (params?: object) => {
  return http.request<Result<{ list: PromotionListItem[]; total: number }>>(
    "get",
    "/backend/event/saba_promotion/list",
    { params }
  );
};

/** 建立活動主檔 */

export const postSabaPromotion = (data?: object) => {
  return http.request<Result<{ id: number }>>(
    "post",
    "/backend/event/saba_promotion",
    { data }
  );
};

/** 更新活動主檔 */

export const putSabaPromotion = (data?: object) => {
  return http.request<Result<null>>(
    "put",
    "/backend/event/saba_promotion",
    { data }
  );
};

// ----- saba 後台共用下拉（取體育/產品；舊碼來自 /@/api/game/saba） -----
/** 取得 selector（產品列表等） */

export const postGetSelector = (data?: object) => {
  return http.request<Result<{ productList: Array<{ label: string; value: number }> }>>(
    "post",
    "/game/bo/saba/get_selector",
    { data }
  );
};

/** 取得體育類型列表 */

export const postGetSportList = (data?: object) => {
  return http.request<Result<{ sportList: Array<{ label: string; value: number }> }>>(
    "post",
    "/game/bo/saba/get_sport_list",
    { data }
  );
};

// 取得 SABA 情報網址（沿用舊 endpoint，舊碼為 defHttp.post，params 實為 body → 轉 data）
export function postGetIntelligenceUrl(data: { lang: string; provider: string }) {
  return http.request<Result<{ url: string }>>(
    "post",
    "/game/bo/saba/getsabaintelligenceurl",
    { data }
  );
}

// === 沙巴儀表板（saba/dashboard）相關 endpoint ===
// 註：本模組各面板採 MIGRATION_PLAYBOOK 允許的「元件內直接 http.request」風格呼叫
// （endpoint 由 props 動態傳入，集中於 index.vue），故元件未具名 import 下列函式。
// 仍提供以下對應函式供主程式統一收錄於 src/api/saba.ts（沿用舊 endpoint 字串）。
// Result<T> = { success: boolean; data: T } 由 api 檔頭統一宣告，勿重複。
export interface SabaRankRow {
  Rank?: number;
  SportName?: string;
  SportType?: number;
  LeagueName?: string;
  LeagueId?: number;
  TeamName?: string;
  BetTypeName?: string;
  HomeName?: string;
  AwayName?: string;
  PlayerCount?: number;
  BetCount?: number;
  BetTurnOver?: number;
  BetWinloss?: number;
  Margin?: number;
  BetTurnOverPercentage?: number;
  BetWinlossPercentage?: number;
  [key: string]: any;
}
// 後端外層為 { Data: T[] }（舊 res.content.Data）

export type SabaDataWrap<T> = { Data: T[] };

// 站台每日概況

export const getSabaOverviewbysite = (params?: object) =>
  http.request<Result<SabaDataWrap<SabaRankRow>>>(
    "get",
    "/game/bo/saba/overviewbysite",
    { params }
  );

// 近期投注概況（站台）

export const getSabaRecentlybetoverviewbysite = (params?: object) =>
  http.request<Result<SabaDataWrap<SabaRankRow>>>(
    "get",
    "/game/bo/saba/recentlybetoverviewbysite",
    { params }
  );

// 近期投注排名（站台 bysite）

export const getSabaRecentlybetsportsrankbysite = (params?: object) =>
  http.request<Result<SabaDataWrap<SabaRankRow>>>("get", "/game/bo/saba/recentlybetsportsrankbysite", { params });

export const getSabaRecentlybetleaguerankbysite = (params?: object) =>
  http.request<Result<SabaDataWrap<SabaRankRow>>>("get", "/game/bo/saba/recentlybetleaguerankbysite", { params });

export const getSabaRecentlybetteamrankbysite = (params?: object) =>
  http.request<Result<SabaDataWrap<SabaRankRow>>>("get", "/game/bo/saba/recentlybetteamrankbysite", { params });

// 近期排名（站台 bysite）

export const getSabaRecentlysportsrankbysite = (params?: object) =>
  http.request<Result<SabaDataWrap<SabaRankRow>>>("get", "/game/bo/saba/recentlysportsrankbysite", { params });

export const getSabaRecentlyleaguerankbysite = (params?: object) =>
  http.request<Result<SabaDataWrap<SabaRankRow>>>("get", "/game/bo/saba/recentlyleaguerankbysite", { params });

export const getSabaRecentlyleaguebettyperankbysite = (params?: object) =>
  http.request<Result<SabaDataWrap<SabaRankRow>>>("get", "/game/bo/saba/recentlyleaguebettyperankbysite", { params });

export const getSabaRecentlymatchrankbysite = (params?: object) =>
  http.request<Result<SabaDataWrap<SabaRankRow>>>("get", "/game/bo/saba/recentlymatchrankbysite", { params });

// 近期投注排名（彩池 bypool）

export const getSabaRecentlybetsportsrankbypool = (params?: object) =>
  http.request<Result<SabaDataWrap<SabaRankRow>>>("get", "/game/bo/saba/recentlybetsportsrankbypool", { params });

export const getSabaRecentlybetleaguerankbypool = (params?: object) =>
  http.request<Result<SabaDataWrap<SabaRankRow>>>("get", "/game/bo/saba/recentlybetleaguerankbypool", { params });

export const getSabaRecentlybetteamrankbypool = (params?: object) =>
  http.request<Result<SabaDataWrap<SabaRankRow>>>("get", "/game/bo/saba/recentlybetteamrankbypool", { params });

// 近期排名（彩池 bypool）

export const getSabaRecentlysportsrankbypool = (params?: object) =>
  http.request<Result<SabaDataWrap<SabaRankRow>>>("get", "/game/bo/saba/recentlysportsrankbypool", { params });

export const getSabaRecentlyleaguerankbypool = (params?: object) =>
  http.request<Result<SabaDataWrap<SabaRankRow>>>("get", "/game/bo/saba/recentlyleaguerankbypool", { params });

export const getSabaRecentlyleaguebettyperankbypool = (params?: object) =>
  http.request<Result<SabaDataWrap<SabaRankRow>>>("get", "/game/bo/saba/recentlyleaguebettyperankbypool", { params });

export const getSabaRecentlymatchrankbypool = (params?: object) =>
  http.request<Result<SabaDataWrap<SabaRankRow>>>("get", "/game/bo/saba/recentlymatchrankbypool", { params });

// ===== saba 注單明細相關 endpoint（沿用舊 /game/bo/saba/*）=====
// 注意：舊碼 defHttp.post({url,params,saba:true}) 的 params 實為 body，故一律轉成 { data }
export function postSabaAdvanced(data: any) {
  return http.request<Result<any>>("post", "/game/bo/saba/advanced", { data });
}

export function postGetBetTypeList(data: any) {
  return http.request<Result<any>>("post", "/game/bo/saba/get_bettype_list", {
    data
  });
}

export function postGetLeagueList(data: any) {
  return http.request<Result<any>>("post", "/game/bo/saba/get_league_list", {
    data
  });
}

export function postGetMatchList(data: any) {
  return http.request<Result<any>>("post", "/game/bo/saba/get_match_list", {
    data
  });
}
