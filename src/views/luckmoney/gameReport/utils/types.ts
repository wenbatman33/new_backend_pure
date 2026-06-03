interface OptionItem {
  label: string;
  value: string | number;
}

interface GameReportRow {
  reportDate: string;
  betAmount: number | string;
  kill: number | string;
  winAmount: number | string;
  betPeople: number | string;
  betCount: number | string;
}

interface GameReportTotal {
  betAmount: number | string;
  kill: number | string;
  winAmount: number | string;
  betPeople: number | string;
  betCount: number | string;
  lastUpdatedAt: string;
}

interface SearchFormProps {
  /** 報表類型 d 日 / w 週 / m 月 */
  reportType: string;
  /** 起始日期（字串 YYYY-MM-DD HH:mm:ss） */
  reportDateStart: string;
  /** 結束日期（字串 YYYY-MM-DD HH:mm:ss） */
  reportDateEnd: string;
  /** 遊戲類型 */
  gameType: string;
  /** 遊戲廠商（群組） */
  gameGroup: string;
  /** 代理帳號 */
  agencyAccount: string;
  /** 會員帳號 */
  memberAccount: string;
  /** 遊戲帳號 */
  gameAccount: string;
}

export type {
  OptionItem,
  GameReportRow,
  GameReportTotal,
  SearchFormProps
};
