// 聯賽輸贏報表查詢條件
interface SearchFormProps {
  /** 開始時間 */
  startTime: string;
  /** 結束時間 */
  endTime: string;
  /** 時間類型：1 結算時間 / 2 投注時間 */
  order: string;
  /** 遊戲群組 ID（多選） */
  gameGroupID: string[];
  /** 運動項目（多選） */
  sport: string[];
  /** 聯賽（多選） */
  league: string[];
  /** 球隊（多選） */
  team: string[];
  /** 主客場類型：1 主隊 / 2 客隊 */
  teamType: number;
  /** 投注類型（多選） */
  betType: string[];
  /** 注單狀態 */
  betLogStatus: number | string;
}

// 報表列資料（樹狀）
interface LeagueWinRow {
  title?: string;
  gameGroupName?: string;
  gameGroupID?: string;
  level?: number;
  sport?: string;
  league?: string;
  numberOfBetsText?: string;
  totalBetAmountText?: string;
  totalWinAmount?: number;
  totalWinAmountText?: string;
  children?: LeagueWinRow[];
}

export type { SearchFormProps, LeagueWinRow };
