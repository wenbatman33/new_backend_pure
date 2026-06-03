// 聯賽選項（篩選器用）
interface LeagueOption {
  leagueID: number;
  leagueName: string;
}

// 報表列表每列的單一聯賽資料
interface ReportLeagueCell {
  leagueID: number;
  betPeople: number;
  betAmount: number;
  betAmountText?: string;
  totalBetAmount?: number;
  totalBetAmountText?: string;
  winAmount: number;
  winAmountText?: string;
}

// 報表列表每列
interface ReportRow {
  date: string;
  list: ReportLeagueCell[];
  // 動態展開後會加入 betPeople_{leagueID} / betAmount_{leagueID} / winAmount_{leagueID}
  [key: string]: any;
}

// 報表總計每聯賽
interface ReportTotalCell {
  leagueID: number;
  totalBetPeople: number;
  totalBetAmount: number;
  totalBetAmountText?: string;
  totalTotalBetAmount?: number;
  totalTotalBetAmountText?: string;
  totalWinAmount: number;
  totalWinAmountText?: string;
}

// 詳情列表每列（會員層級）
interface DetailRow {
  memberAccount: string;
  betCount: number;
  betAmount: number;
  winAmount: number;
}

// 詳情總計
interface DetailTotal {
  totalBetCount: number;
  totalBetAmount: number;
  totalWinAmount: number;
}

// 搜尋表單
interface SearchFormProps {
  date: [string, string] | [];
  leagueID: number[];
}

export type {
  LeagueOption,
  ReportLeagueCell,
  ReportRow,
  ReportTotalCell,
  DetailRow,
  DetailTotal,
  SearchFormProps
};
