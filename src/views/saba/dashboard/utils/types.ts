// 沙巴儀表板共用型別

// 排名/概況資料列（後端回傳的欄位大寫）
export interface RankRow {
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

// 下拉選項
export interface OptionItem {
  label: string;
  value: number | string;
  sport_type?: number;
  league_id?: number;
  is_live?: number;
}

// 搜尋查詢參數
export interface QueryParams {
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  sort_by?: number;
  language?: string;
  sport_type?: string;
  league_id?: string;
  team_id?: string;
  [key: string]: any;
}
