// 鎖定錢包列表項目
interface LockedWalletItem {
  lockID: number;
  agencyID: number;
  agencyAccount: string;
  /** 狀態：1 鎖定中 / 2 已解鎖 */
  status: number;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export type { LockedWalletItem };
