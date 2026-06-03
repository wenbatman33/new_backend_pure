interface SearchFormProps {
  /** 會員帳號 */
  memberAccount: string;
  /** 會員 ID */
  memberID: string;
  /** 遊戲群組 ID */
  gameGroupID: number | "";
  /** 遊戲投注編號 */
  betId: string;
  /** 遊戲帳號 */
  gameAccount: string;
  /** 結算時間（起） */
  settlementTimeStart: string;
  /** 結算時間（迄） */
  settlementTimeEnd: string;
  /** 投注時間（起） */
  bettleTimeStart: string;
  /** 投注時間（迄） */
  bettleTimeEnd: string;
  /** 排序欄位（後端代碼） */
  field?: number | "";
  /** 排序方式（後端代碼）：1 升冪 / 2 降冪 */
  orderParam?: number | "";
}

interface GameGroupOption {
  label: string;
  value: number;
}

export type { SearchFormProps, GameGroupOption };
