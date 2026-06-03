// 被推薦會員列表單筆資料
interface RecommendedItem {
  /** 會員 ID */
  memberID: number;
  /** 會員帳號 */
  account: string;
  /** 總存款 */
  depositAmount: number | string;
  /** 活動有效投注額 */
  eventTurnover: number | string;
  /** 總提款 */
  withdrawAmount: number | string;
  /** 註冊時間 */
  registerAt: string;
  /** 最後上線時間 */
  lastLoginAt: string;
}

// 查詢條件
interface SearchForm {
  /** 推薦人帳號（必填） */
  recommenderAccount: string;
  /** 起始日期 YYYY-MM-DD */
  startDate: string;
  /** 結束日期 YYYY-MM-DD */
  endDate: string;
}

export type { RecommendedItem, SearchForm };
