// 存款報表查詢參數
interface DepositSearchForm {
  /** 報表類型：1 日報 / 2 週報 / 3 月報 */
  dateType: number;
  /** 報表日期：開始（YYYY-MM-DD） */
  reportDateStart: string;
  /** 報表日期：結束（YYYY-MM-DD） */
  reportDateEnd: string;
  /** 支付方式 */
  serviceCode: string;
  /** 報表項目：1 人數報表 / 2 金額區間報表 */
  reportType: number;
}

// 人數存款報表單列
interface DepositPeopleReportItem {
  reportDate?: string;
  serviceCode?: string;
  uniquePeople?: number;
  firstPeople?: number;
  depositNum?: number;
  amount?: number;
  avgAmount?: number;
  fee?: number;
  actualAmount?: number;
  memberAmount?: number;
  agencyAmount?: number;
  depositRate?: number | string;
  updatedAt?: string;
}

// 人數存款報表回傳
interface GetDepositPeopleReportResultModel {
  list?: DepositPeopleReportItem[];
  count?: number;
  totalDepositNum?: number;
  totalAmount?: number;
  totalFee?: number;
  totalActualAmount?: number;
  totalMemberAmount?: number;
  totalAgencyAmount?: number;
  updatedAt?: string;
}

// 金額區間存款報表單列
interface DepositAmountRangeReportItem {
  reportDate?: string;
  serviceCode?: string;
  amount100?: number;
  amount500?: number;
  amount1000?: number;
  amount2000?: number;
  amount6000?: number;
  amount10000?: number;
  amount20000?: number;
  amountMore20000?: number;
  updatedAt?: string;
}

// 金額區間存款報表回傳
interface GetDepositAmountRangeReportResultModel {
  list?: DepositAmountRangeReportItem[];
  count?: number;
  totalAmount100?: number;
  totalAmount500?: number;
  totalAmount1000?: number;
  totalAmount2000?: number;
  totalAmount6000?: number;
  totalAmount10000?: number;
  totalAmount20000?: number;
  totalAmountMore20000?: number;
  updatedAt?: string;
}

export type {
  DepositSearchForm,
  DepositPeopleReportItem,
  GetDepositPeopleReportResultModel,
  DepositAmountRangeReportItem,
  GetDepositAmountRangeReportResultModel
};
