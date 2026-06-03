// 锁定钱包列表项
interface LockedWalletItem {
  /** 锁定ID */
  lockID: number;
  /** 会员ID */
  memberID: number;
  /** 会员账号 */
  memberAccount: string;
  /** 锁定金额 */
  lockMoney: number;
  /** 状态：1 锁定中 / 2 已解锁 / 3 已退回 */
  status: number;
  /** 标记备注 */
  note: string;
  /** 建立时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
}

export type { LockedWalletItem };
