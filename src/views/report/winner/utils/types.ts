// 輸贏報表（report/winner）型別

interface WinnerSearchForm {
  /** 報表起始時間 YYYY-MM-DD HH:mm:ss */
  reportStart: string;
  /** 報表結束時間 YYYY-MM-DD HH:mm:ss */
  reportEnd: string;
  /** 頂級代理 ID */
  topAgencyID: string;
  /** 代理 ID */
  agencyID: string;
  /** 會員帳號 */
  memberAccount: string;
  /** 遊戲廠商（多選 group id） */
  gameGroupIDs: number[];
}

interface WinnerItem {
  topAgencyID: number;
  agencyID: number;
  memberID: number;
  memberAccount: string;
  betCnt: number;
  betAmount: number;
  eventBetAmount: number;
  killNum: number;
  profit: number;
  deposit: number;
  depositCount: number;
  withdraw: number;
  withdrawCount: number;
  bonus: number;
}

export type { WinnerSearchForm, WinnerItem };
