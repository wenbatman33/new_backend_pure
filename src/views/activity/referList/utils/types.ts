/** 推薦名單列表項目 */
interface ReferListItem {
  /** 被推薦會員 ID */
  memberID: number;
  /** 被推薦會員帳號 */
  memberAccount: string;
  /** 推薦人會員 ID */
  recommenderID: number;
  /** 推薦人帳號 */
  recommenderAccount: string;
  /** 推薦碼 */
  recommendCode: string;
  /** 建立時間 */
  createdTime: string;
}

export type { ReferListItem };
