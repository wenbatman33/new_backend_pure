// 遊戲選項（廠商/遊戲群組）
interface GameItem {
  gameTypeID: number | string;
  gameGroupID: number | string;
}

// 加碼獎勵設定
interface BonusItem {
  amount: number | string;
  num: number | string;
}

interface FormItemProps {
  id?: number | string;
  /** 活動名稱 */
  name: string;
  /** 推廣碼 */
  promotionCode: string;
  /** 開始日期 */
  startDate: string;
  /** 結束日期 */
  endDate: string;
  /** 開始時間（時） */
  startTime: string;
  /** 場次間隔（分鐘） */
  roundTime: number | string;
  /** 場次總數 */
  roundTotal: number | string;
  /** 活動流水倍數 */
  eventTurnover: number | string;
  /** 適用遊戲 */
  game: GameItem[];
  /** 提款上限 */
  withdrawLimit: number | string;
  /** 單會員上限 */
  memberMax: number | string;
  /** 加碼獎勵清單 */
  bonus: BonusItem[];
  /** 保底人數 */
  bonusLessNum: number | string;
  /** 保底金額 */
  bonusLessAmount: number | string;
  /** 模式：create / edit / review */
  mode?: string;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps, GameItem, BonusItem };
