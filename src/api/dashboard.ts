import { http } from "@/utils/http";

/** 後端統一回應格式 */
type Result<T = any> = {
  success: boolean;
  data: T;
};


// 儀表板分析頁資料型別
export interface AnalysisDataResult {
  growCardList: {
    icon: string;
    titleKey: string;
    value: number;
    total: number;
    color: string;
    actionKey: string;
  }[];
  visitTrend: { xAxis: string[]; series1: number[]; series2: number[] };
  visitBar: { xAxis: string[]; data: number[] };
  radar: {
    indicator: { textKey: string; max: number }[];
    visit: number[];
    buy: number[];
  };
  visitSource: { name: string; value: number }[];
  salesPie: { name: string; value: number }[];
}

/**
 * 取得儀表板分析頁圖表資料
 * 註：舊 Vben 模組為純靜態圖表頁（資料寫死於各元件，無真實後端 endpoint），
 * 遷移時改為走合成 endpoint，由 mock 提供資料。若後端日後提供真實 API 再替換 url。
 */

export const getAnalysisData = () => {
  return http.request<Result<AnalysisDataResult>>(
    "get",
    "/backend/dashboard/analysis"
  );
};

// 整站即時報表（每小時）— 沿用舊 endpoint /backend/report/hour
export function getHourReport(params?: { reportDate: string }) {
  return http.request<Result<HourReport>>("get", "/backend/report/hour", {
    params
  });
}

// === 工作台 dashboard/workbench ===
// 工作台聚合資料型別（各區塊：頂部統計 / 快捷導航 / 項目 / 最新動態 / 銷售雷達）
export interface WorkbenchData {
  stats: { todo: string; project: number; team: number };
  navItems: { title: string; icon: string; color: string }[];
  groupItems: {
    title: string;
    icon: string;
    color: string;
    desc: string;
    date: string;
    group: string;
  }[];
  dynamicInfoItems: {
    avatar: string;
    name: string;
    date: string;
    desc: string;
  }[];
  saleRadar: {
    indicator: { text: string; max: number }[];
    series: { name: string; color: string; value: number[] }[];
  };
}

/** 取得工作台聚合資料（原 Vben 工作台為靜態頁，無真實後端 endpoint，採新增聚合 endpoint，資料由 mock 提供） */

export const getWorkbenchData = () => {
  return http.request<Result<WorkbenchData>>(
    "get",
    "/backend/dashboard/workbench"
  );
};

// ===== 站台水位 quota（沿用舊 endpoint /backend/site/quota）=====
// 站台水位資訊
export interface QuotaInfo {
  websiteName: string;
  verify: boolean;
  percent: number;
  siteQuotaMoney: number;
  quota: number;
  winAmount: number;
  settlementDate: string;
  configWinAmount: number;
  list: Array<{ date: string; winAmount: number }>;
}

// 1. 站台水位資訊

export const getQuota = () =>
  http.request<Result<QuotaInfo>>("get", "/backend/site/quota");

// 2. 水位用量百分比

export const getQuotaPercent = () =>
  http.request<Result<{ percent: number }>>(
    "get",
    "/backend/site/quota/percent"
  );

// 3. 入金明細查詢

export const getQuotaLog = () =>
  http.request<Result<{ list: any[]; total: number }>>(
    "get",
    "/backend/site/quota/log"
  );

// 4. 新增入金明細（舊 defHttp.post params 實為 body → 轉 data）

export const createQuotaLog = (data: {
  useType: number | "";
  createdAt: string;
  adjustMoney: number | "";
  note: string;
}) => http.request<Result<null>>("post", "/backend/site/quota/log", { data });

// 5. 結算（body：date）

export const settlement = (data: { date: string }) =>
  http.request<Result<null>>("post", "/backend/site/quota/settlement", {
    data
  });

// 6. 更新水位開關設定（舊 defHttp.put params 為 body → 轉 data）

export const updateConfig = (data: { verify: boolean }) =>
  http.request<Result<null>>("put", "/backend/site/quota/config", { data });

// 7. 更新站台名稱（舊碼 createConfigName(name) 包成 { name } body）

export const updateConfigName = (name: string) =>
  http.request<Result<null>>("post", "/backend/site/quota/config/name", {
    data: { name }
  });

// 8. 額度異動日報（GET query：startTime/endTime）

export const getQuotaAdjustList = (params: {
  startTime: string;
  endTime: string;
}) =>
  http.request<Result<{ list: any[]; total: number }>>(
    "get",
    "/backend/site/quota/adjust/list",
    { params }
  );

// 9. 月額度統計報表查詢（GET query：startTime/endTime）

export const getQuotaReportMonth = (params: {
  startTime: string;
  endTime: string;
}) =>
  http.request<Result<{ list: any[]; total: number }>>(
    "get",
    "/backend/site/quota/report/month",
    { params }
  );

// 10. 月額度統計報表重新產生（POST 無 body）

export const postQuotaReportMonth = () =>
  http.request<Result<null>>("post", "/backend/site/quota/report/month");
