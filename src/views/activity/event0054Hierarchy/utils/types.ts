interface HierarchyItem {
  /** 會員 ID（用於連結會員明細） */
  memberID: number | string;
  /** 被推薦人帳號 */
  account: string;
  /** 第一階人數 */
  people1: number;
  /** 第一階會員流水 */
  eventTurnover1: number;
  /** 第一階流水派發獎勵 */
  eventBonus1: number;
  /** 第二階人數 */
  people2: number;
  /** 第二階會員流水 */
  eventTurnover2: number;
  /** 第二階流水派發獎勵 */
  eventBonus2: number;
  /** 第三階人數 */
  people3: number;
  /** 第三階會員流水 */
  eventTurnover3: number;
  /** 第三階流水派發獎勵 */
  eventBonus3: number;
}

export type { HierarchyItem };
