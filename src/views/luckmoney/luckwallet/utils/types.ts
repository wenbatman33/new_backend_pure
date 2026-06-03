/** 营运报表（新利币钱包）单列资料 */
interface OperationReportItem {
  reportDate: string;
  betAmount: string | number;
  winAmount: string | number;
  killNum: string | number;
  totalBonus: string | number;
  promotion: string | number;
  manual: string | number;
  recharge: string | number;
  settlement: string | number;
  settlementPeople: number;
  promotionPeople: string | number;
  betPeople: string | number;
  money: string | number;
  /** 转出清单查询用日期 */
  qSettlementPeopleDate?: string;
}

/** 搜寻条件 */
interface SearchFormProps {
  reportType: "d" | "w" | "m";
  reportDateStart: string;
  reportDateEnd: string;
  agencyAccount: string;
  queryMemberMoney: boolean;
}

export type { OperationReportItem, SearchFormProps };
