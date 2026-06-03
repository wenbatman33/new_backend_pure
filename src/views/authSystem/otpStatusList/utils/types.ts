// OTP 狀態列表項目
interface OtpStatusItem {
  /** 功能 ID */
  fnID: number;
  /** 功能名稱（CN） */
  fnName: string;
  /** 功能顯示名稱（EN） */
  displayFnName: string;
  /** 功能 key */
  fnKey: string;
  /** 更新時間 */
  updatedAt: string;
  /** OTP 狀態：1 啟用 / 2 停用 */
  otpStatus: number;
}

export type { OtpStatusItem };
