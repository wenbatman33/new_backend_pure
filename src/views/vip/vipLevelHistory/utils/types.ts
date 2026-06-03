interface VipLevelHistoryItem {
  /** 會員 ID */
  memberID: number;
  /** 會員帳號 */
  memberAccount: string;
  /** 異動類型：1 升等 / 2 降等 / 3 維持 / 4 手動升等 / 5 手動降等 */
  type: number;
  /** 原 VIP 等級 */
  oldLevel: number | string;
  /** 新 VIP 等級 */
  newLevel: number | string;
  /** 異動時間 */
  createdAt: string;
  /** 操作人 */
  editorName: string;
}

export type { VipLevelHistoryItem };
