// 聯賽投注記錄 - 列表項型別
interface LeagueBetItem {
  betID: string | number;
  memberID: number;
  memberAccount: string;
  gameGroupName: string;
  sport: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  eventTime: string;
  betType: string;
  betOption: string;
  oddsStyle: string;
  odds: string | number;
  isLive: number;
  betSingleCombo: number;
  betItem: string; // 後端回傳 JSON 字串
  betAmountText: string;
  winAmountText: string;
  betTime: string;
  settlementTime: string;
  // 前端展開明細用
  showDetail?: boolean;
  betItemList?: Record<string, any>[];
}

// 搜尋表單型別
interface SearchFormProps {
  startTime: string;
  endTime: string;
  order: string; // 1 結算時間 / 2 投注時間 / 3 賽事時間
  gameGroupID: number[];
  sport: string[];
  league: string[];
  team: string[];
  teamType: number; // 1 主隊 / 2 客隊
  betType: string[];
  isLive: number | "";
  isComboBet: number | "";
  betLogStatus: number | "";
  minBetAmount: string;
  maxBetAmount: string;
}

export type { LeagueBetItem, SearchFormProps };
