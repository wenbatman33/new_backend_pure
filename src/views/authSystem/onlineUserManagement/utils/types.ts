interface OnlineUserItem {
  /** 後端用來踢人的管理者 ID */
  adminID: number;
  /** 帳號 */
  account: string;
  /** 是否在線（此頁皆為在線清單） */
  online: number;
  /** 帳號狀態：1 啟用 / 0 停用 */
  status: number;
  /** 角色（群組）名稱 */
  roleName: string;
  /** 部門名稱 */
  deptName: string;
  /** 最後登入時間 */
  lastLoginAt: string;
}

export type { OnlineUserItem };
