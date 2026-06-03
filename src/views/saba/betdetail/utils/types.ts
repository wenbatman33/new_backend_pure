// 下拉選項型別
interface OptionItem {
  label: string;
  value: string | number;
}

// 搜尋表單欄位
interface SearchForm {
  QueryStartDate: string;
  QueryEndDate: string;
  QueryDateType: number;
  VendorMemberId: string;
  TxId: string;
  ticketStatusIds: (string | number)[];
  liveStatusIds: (string | number)[];
  riskLevelIds: (string | number)[];
  oddsGroupIds: (string | number)[];
  platformIds: (string | number)[];
  productId: string | number;
  BetTypeId: string | number;
  SportId: string | number;
  LeagueId: string | number;
  MatchId: string | number;
}

// 注單明細列
interface BetDetailItem {
  txId: string;
  userName: string;
  actualStake: number;
  transactionTime: string;
  betDetail: {
    betChoice: string;
    betType: string;
    match: string;
    sport: string;
    league: string;
    eventDate: string;
  };
  odds: number;
  oddsType: string;
  stake: number;
  winloss: number;
  status: string;
  platform: string;
  liveInfo: string;
}

// 合計
interface SummaryData {
  stake: number;
  actualStake: number;
  winloss: number;
}

export type { OptionItem, SearchForm, BetDetailItem, SummaryData };
