// 會員注冊列表單筆資料
interface RegistItem {
  /** 會員 ID */
  memberID: number | string;
  /** 會員帳號 */
  account: string;
  /** 幣別 */
  currency: string;
  /** 餘額 */
  money: number | string;
  /** 手機 */
  phone: string;
  /** 信箱 */
  email: string;
  /** 上層代理 ID */
  agencyID: number | string;
  /** 注冊時間 */
  createdAt: string;
  /** 最後登入時間 */
  lastLoginAt: string;
}

// 搜尋表單
interface SearchFormProps {
  /** 起始日期 YYYY-MM-DD */
  start: string;
  /** 結束日期 YYYY-MM-DD */
  end: string;
}

export type { RegistItem, SearchFormProps };
