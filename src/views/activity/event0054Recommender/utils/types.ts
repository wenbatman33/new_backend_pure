interface RecommenderItem {
  /** 會員 ID（用於連結會員明細） */
  memberID: number | string;
  /** 推薦人帳號 */
  account: string;
  /** 推薦好友總數 */
  friendTotal: number;
  /** 好友 */
  friend: number;
  /** 存款人數 */
  depositPeople: number;
  /** 存款金額 */
  depositAmount: number;
  /** 投注人數 */
  betPeople: number;
  /** 活動投注額 */
  eventTurnover: number;
  /** 提款人數 */
  withdrawPeople: number;
  /** 活動紅利 */
  eventBonus: number;
}

export type { RecommenderItem };
