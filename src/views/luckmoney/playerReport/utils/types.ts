// 搜尋表單型別
interface SearchFormProps {
  reportStart: string;
  reportEnd: string;
  agencyID: string;
  promotionID: string;
  promotionFiltType: boolean;
  memberAccount: string;
  gameAccount: string;
  gameGroupIDs: number[];
}

// 玩家報表單筆資料
interface PlayerReportItem {
  agencyID: number | string;
  memberID: number;
  memberAccount: string;
  betCnt: number;
  betAmount: number;
  killNum: number;
  profit: number;
  deposit: number;
  withdraw: number;
  bonus: number;
  depositAmount: number;
  withdrawalAmount: number;
  promotionList: Record<string, { id: number; name: string }>;
}

export type { SearchFormProps, PlayerReportItem };
