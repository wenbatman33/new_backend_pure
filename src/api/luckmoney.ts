import { http } from "@/utils/http";

/** 後端統一回應格式 */
type Result<T = any> = {
  success: boolean;
  data: T;
};


// 新增到 src/api/luckmoney.ts（沿用舊 endpoint；Result<T> 由 api 檔頭統一定義，勿重複宣告）
export const getOperationReport = (params?: object) =>
  http.request<Result>("get", "/backend/report/operation/lm", { params });

export const getSettlementPeopleList = (params?: object) =>
  http.request<Result>(
    "get",
    "/backend/report/operation/lmsettlementpeoplelist",
    { params }
  );

// ===== 新币玩家报表 playerReport =====
// 玩家報表單筆資料型別
export interface PlayerReportRow {
  agencyID: number | string;
  memberID: number;
  memberAccount: string;
  betCnt: number;
  betAmount: number;
  killNum: number;
  profit: number;
  deposit: number;
  withdraw: number;
  bonus: number;
  depositAmount: number;
  withdrawalAmount: number;
  promotionList: Record<string, { id: number; name: string }>;
}

// 取得新币玩家报表（沿用舊 endpoint /backend/report/winner/lm）

export const getReportWinner = (params?: object) => {
  return http.request<Result<{ list: PlayerReportRow[]; total: number }>>(
    "get",
    "/backend/report/winner/lm",
    { params }
  );
};

// 取得游戏厂商分组（沿用舊 endpoint /backend/bettinglog/luckmoney/group/list）

export const lmGetGroups = () => {
  return http.request<Result<{ list: { ID: number; name: string }[] }>>(
    "get",
    "/backend/bettinglog/luckmoney/group/list"
  );
};

// ===== luckmoney gameReport（彩金遊戲報表）相關 =====
export type GameReportRow = {
  reportDate: string;
  betAmount: number | string;
  kill: number | string;
  winAmount: number | string;
  betPeople: number | string;
  betCount: number | string;
};

export type GameReportTotal = {
  betAmount: number | string;
  kill: number | string;
  winAmount: number | string;
  betPeople: number | string;
  betCount: number | string;
  lastUpdatedAt: string;
};

export type GameReportListResult = Result<{
  list: GameReportRow[];
  total: GameReportTotal;
}>;

/** 彩金遊戲報表列表（沿用舊 endpoint /backend/report/game/lm） */

export const getGameReport = (params?: object) => {
  return http.request<GameReportListResult>("get", "/backend/report/game/lm", {
    params
  });
};

/** 遊戲類型清單（沿用舊 endpoint /backend/game/gamelist/type，回 { list:[{key,value}] }） */

export const getOriginGameListType = () => {
  return http.request<Result<{ list: Array<{ key: string; value: string }> }>>(
    "get",
    "/backend/game/gamelist/type"
  );
};

/** 依遊戲類型取得遊戲廠商（群組）清單（沿用舊 endpoint /backend/game/luckmoney/gamegroup/list，回 { list:[{id,displayName}] }） */

export const getGameGroupsList = (params?: object) => {
  return http.request<
    Result<{ list: Array<{ id: string; displayName: string }> }>
  >("get", "/backend/game/luckmoney/gamegroup/list", { params });
};

// ===== 新币游戏类型与厂商报表 lmGameGroup（沿用旧 endpoint）=====
// 注意：Result<T> = { success: boolean; data: T } 由 api 档头统一定义，勿重复宣告；http 亦勿重复 import
export interface LmGameGroupReportItem {
  gameTypeData: {
    gameGroupID?: string | number;
    gameTypeName?: string;
    gameGroupName?: string;
    betAmount?: number | string;
    kill?: number | string;
    totalWinAmount?: number | string;
    betPeople?: number | string;
    betCount?: number | string;
    eventBetAmount?: number | string;
  };
  data: Array<Record<string, any>>;
}

export interface LmGameGroupTotalItem {
  lastUpdatedAt?: string;
  betAmount?: number | string;
  kill?: number | string;
  totalWinAmount?: number | string;
  betPeople?: number | string;
  betCount?: number | string;
  eventBetAmount?: number | string;
}

export interface LmGameGroupReportParams {
  reportDateStart: string;
  reportDateEnd: string;
  memberAccount?: string;
  gameAccount?: string;
}

/** 新币游戏类型与厂商报表列表 */

export const getLmReport = (params: LmGameGroupReportParams) => {
  return http.request<Result<{ list: LmGameGroupReportItem[]; total?: number }>>(
    "get",
    "/backend/report/gamegroup/list/lm",
    { params }
  );
};

/** 新币游戏类型与厂商报表合计 */

export const getLmReportTotal = (params: LmGameGroupReportParams) => {
  return http.request<Result<{ list: LmGameGroupTotalItem[] }>>(
    "get",
    "/backend/report/gamegroup/total/lm",
    { params }
  );
};
