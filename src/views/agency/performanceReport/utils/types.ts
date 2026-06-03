// 代理績效報表查詢條件
interface SearchFormProps {
  agencyID: string;
  agencyAccount: string;
  reportDateStart: string;
  reportDateEnd: string;
}

// 績效彙總資料（單筆，跨三個區塊欄位共用）
interface PerformanceRow {
  [key: string]: any;
}

// 遊戲分組績效（列表）
interface GameGroupRow {
  gameGroupName?: string;
  betAmount?: number | string;
  totalWinAmount?: number | string;
  [key: string]: any;
}

export type { SearchFormProps, PerformanceRow, GameGroupRow };
