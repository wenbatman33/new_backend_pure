interface RiskItem {
  id: number;
  reportDate: string;
  agencyID: number | string;
  memberID: number | string;
  memberAccount: string;
  tagID: string;
  betAmount: number | string;
  deposit: number | string;
  bonus: number | string;
  winAmountBack: number | string;
  winAmount: number | string;
  money: number | string;
  fine: number | string;
  dealwith: string;
  dealwithWay: number | string;
  dealwithDept: number | string;
}

interface SearchFormProps {
  /** 日期區間 [start, end] */
  date: [string, string] | [];
  agencyAccount: string;
  agencyID: string;
}

type OptionType = { label: string; value: number };

export type { RiskItem, SearchFormProps, OptionType };
