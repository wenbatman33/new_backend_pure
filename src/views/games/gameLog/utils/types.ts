// 投注紀錄查詢條件
interface GameLogSearch {
  /** 會員帳號 */
  memberAccount: string;
  /** 遊戲廠商 ID */
  gameGroupID: number | string;
  /** 遊戲 ID */
  gameListID: number | string;
  /** 遊戲注單號 */
  betId: string;
  /** 注單狀態 */
  betLogStatus: number | string;
  /** 關鍵字 */
  keyword: string;
  /** 時間類型：settlementTime 結算時間 / betTime 投注時間 */
  timeType: string;
}

// 單筆投注紀錄列表項（後端回傳的關鍵欄位）
interface GameLogItem {
  betID: string;
  memberID: number;
  memberAccount: string;
  gameGroup: string;
  gameGroupID: number;
  gameListName: string;
  gameTypeID: number;
  oddsStyle: string;
  odds: number | string;
  betSingleCombo: number | string;
  totalBetAmount: number | string;
  backendBetAmount: number | string;
  eventTurnover: number | string;
  returnBetAmount: number | string;
  winAmount: number | string;
  settlementAmount: number | string;
  betTimeLocal: string;
  settlementTimeLocal: string;
  betTime: string;
  settlementTime: string;
  betLogStatus: number;
  response: string;
  resultUrl: string;
  showDetailLinkButton: number;
  /** 已解析的投注明細陣列 */
  betItem: any[];
  /** 串關明細 */
  betSingleComboIntro?: any[];
  eventDateTime?: string;
  eventID?: string;
  /** 前端展開狀態 */
  showDetail?: boolean;
}

// 詳情明細連結回傳
interface DetailLinkResult {
  resultLink: string;
}

export type { GameLogSearch, GameLogItem, DetailLinkResult };
