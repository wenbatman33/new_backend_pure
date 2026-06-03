// 提款報表查詢參數
interface WithdrawSearchForm {
  /** 報表類型：1 日報 / 2 週報 / 3 月報 */
  dateType: number;
  /** 報表日期：開始（YYYY-MM-DD） */
  reportDateStart: string;
  /** 報表日期：結束（YYYY-MM-DD） */
  reportDateEnd: string;
  /** 報表項目：1 人數報表 / 2 金額區間報表 */
  reportType: number;
}

// 人數提款報表單列
interface WithdrawPeopleReportItem {
  reportDate?: string;
  uniquePeople?: number;
  firstPeople?: number;
  withdrawNum?: number;
  amount?: number;
  avgAmount?: number;
  fee?: number;
  actualAmount?: number;
  activePeople?: number;
  withdrawRate?: number | string;
  updatedAt?: string;
}

// 人數提款報表回傳
interface GetWithdrawPeopleReportResultModel {
  list?: WithdrawPeopleReportItem[];
  count?: number;
  totalWithdrawNum?: number;
  totalAmount?: number;
  totalFee?: number;
  totalActualAmount?: number;
  updatedAt?: string;
}

// 金額區間提款報表單列
interface WithdrawAmountRangeReportItem {
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

// 金額區間提款報表回傳
interface GetWithdrawAmountRangeReportResultModel {
  list?: WithdrawAmountRangeReportItem[];
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
  WithdrawSearchForm,
  WithdrawPeopleReportItem,
  GetWithdrawPeopleReportResultModel,
  WithdrawAmountRangeReportItem,
  GetWithdrawAmountRangeReportResultModel
};
