// 下拉選項
interface OptionItem {
  label: string;
  value: string;
}

// 被推荐人列表行
interface RecommendedRow {
  account: string;
  memberID: number;
  isCardBinding: boolean;
  cardBindingDate: string;
  firstDepositAmount: number | string;
  firstDepositDate: string;
  depositAmount: number | string;
  withdrawAmount: number | string;
  eventTurnover: number | string;
  winLoseAmount: number | string;
  registerDate: string;
  lastLoginAt: string;
}

// 合計列資料
interface RecommendedSummary {
  firstDepositAmount: number | string;
  depositAmount: number | string;
  withdrawAmount: number | string;
  eventTurnover: number | string;
  winLoseAmount: number | string;
}

export type { OptionItem, RecommendedRow, RecommendedSummary };
