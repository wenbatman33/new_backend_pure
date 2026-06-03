// 鎖定錢包列表項
interface LockedWalletItem {
  /** 鎖定 ID */
  lockID: number;
  /** 會員 ID */
  memberID: number;
  /** 會員帳號 */
  memberAccount: string;
  /** 鎖定金額 */
  lockMoney: number;
  /** 狀態：1 鎖定 / 2 已解鎖 / 3 已還款 */
  status: number;
  /** 標記 / 備註 */
  note: string;
  /** 建立時間 */
  createdAt: string;
  /** 更新時間 */
  updatedAt: string;
}

export type { LockedWalletItem };
