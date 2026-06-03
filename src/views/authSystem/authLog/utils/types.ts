// 操作日誌子資料項：欄位變更或 VPN IP 變更兩種型態
interface AuthLogSubData {
  /** 變更欄位代碼（對應 authSystem.column_<code>） */
  column?: number;
  /** 變更前值 */
  oldValue?: string | number;
  /** 變更後值 */
  newValue?: string | number;
  /** VPN IP（VPN 類型才有） */
  vpn_ip?: string;
  /** VPN 變更時的操作帳號 */
  admin_user_account?: string;
}

interface AuthLogItem {
  /** 操作者帳號 */
  account: string;
  /** 操作類型代碼（對應 authSystem.action_<code>） */
  action: number;
  /** 操作對象 */
  target: string;
  /** 時間 */
  time: string;
  /** 內容明細 */
  sub_data: AuthLogSubData[];
}

interface AuthLogSearch {
  /** 開始日期 YYYY-MM-DD */
  startDate: string;
  /** 結束日期 YYYY-MM-DD */
  endDate: string;
  /** 操作者帳號 */
  account: string;
}

export type { AuthLogSubData, AuthLogItem, AuthLogSearch };
