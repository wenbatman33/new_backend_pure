// 優惠申請清單：搜尋表單欄位
interface SearchFormProps {
  /** ID */
  id: string;
  /** 會員 ID */
  memberID: string;
  /** 會員帳號 */
  memberAccount: string;
  /** 優惠名稱 */
  promotionName: string;
  /** 批次流水號 */
  batchID: string;
  /** 優惠流水號 */
  promotionID: string;
  /** 審核方式 1 自動 2 手動 */
  approveWay: string | number;
  /** 狀態 */
  status: string | number;
  /** 派發時間起 */
  sendAtStart: string;
  /** 派發時間迄 */
  sendAtEnd: string;
  /** 建立時間起 */
  createdAtStart: string;
  /** 建立時間迄 */
  createdAtEnd: string;
  /** 存款單號 */
  refIds: string;
  /** 錢包類型 1 中心錢包 2 紅包 */
  walletType: string | number;
  /** 代理 ID */
  agencyID: string;
  /** 註冊 IP */
  registerIP: string;
  /** 最後登入 IP */
  lastLoginIP: string;
  /** 優惠碼 */
  codes: string;
  /** 內部名稱 */
  internalName: string;
}

// 列表單筆資料
interface PromotionApplyItem {
  ID: number;
  agencyID: number;
  memberID: number;
  memberAccount: string;
  bonus: number;
  status: number;
  createdAt: string;
  sendAt: string;
  promotionName: string;
  internalName: string;
  promotionID: number;
  promotionCondTypes: Record<string, number>;
  promotionCondRange: any[];
  note: string;
  registerIP: string;
  lastLoginIP: string;
  batchID: number;
  batchCycle: string;
  updatedAt: string;
  updatedUser: string;
  sendWay: number;
}

export type { SearchFormProps, PromotionApplyItem };
