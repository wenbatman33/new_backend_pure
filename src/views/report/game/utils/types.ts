// 遊戲報表查詢條件
interface SearchFormProps {
  /** 報表類型：d 日報 / w 週報 / m 月報 */
  reportType: string;
  /** 報表起始日（字串 YYYY-MM-DD HH:mm:ss） */
  reportDateStart: string;
  /** 報表結束日（字串 YYYY-MM-DD HH:mm:ss） */
  reportDateEnd: string;
  /** 遊戲類型 */
  gameType: number | string;
  /** 遊戲廠商（gameGroup） */
  gameGroup: number | string;
  /** 代理帳號 */
  agencyAccount: string;
  /** 會員帳號 */
  memberAccount: string;
}

// 報表合計列
interface ReportTotal {
  betAmount: string | number;
  kill: string | number;
  winAmount: string | number;
  betPeople: string | number;
  betCount: string | number;
  lastUpdatedAt: string;
}

// 報表單筆資料
interface ReportItem {
  reportDate: string;
  betAmount: string | number;
  kill: string | number;
  winAmount: string | number;
  betPeople: string | number;
  betCount: string | number;
}

export type { SearchFormProps, ReportTotal, ReportItem };
