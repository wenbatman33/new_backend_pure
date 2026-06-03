// 推荐人报表 列表項目型別
interface RecommenderItem {
  memberID: number | string;
  account: string;
  recommendedCount: number;
  activeCount: number;
  bindingCount: number;
  newCount: number;
  firstDepositCount: number;
  depositCount: number;
  depositAmount: number;
  withdrawCount: number;
  withdrawAmount: number;
  eventTurnover: number;
  winLoseAmount: number;
  bonus: number;
}

// 报表查询条件
interface RecommenderQuery {
  reportType: string; // d 日报 / w 周报 / m 月报
  startDate: string;
  endDate: string;
  account?: string;
}

export type { RecommenderItem, RecommenderQuery };
