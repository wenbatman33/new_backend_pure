// 登入開關設定表單（PC / H5 共用同一份扁平結構）
interface LoginSwitchForm {
  /** 註冊驗證類型 */
  registerVerify: number;
  /** 登入驗證類型 */
  loginVerify: number;
  /** 二階段簡訊驗證 */
  loginSms: boolean;
  /** 白名單 IP 偵測 */
  ipTwoPhaseEnable: boolean;
  /** 白名單 IP 群組數 */
  ipTwoPhaseWhiteListLimit: number;
  /** 白名單裝置偵測 */
  deviceIDTwoPhaseEnable: boolean;
  /** 白名單裝置群組數 */
  deviceIDTwoPhaseWhiteListLimit: number;
  /** 連續錯誤鎖定次數 */
  loginErrorLimit: string | number;
  /** 鎖定時間 */
  loginLockTime: string | number;
  /** 客服鎖定次數 */
  loginLockLimit: string | number;
  /** 簡訊發送間隔 */
  loginSmsInterval: string | number;
  /** 發送次數 */
  loginSmsLimit: string | number;
  /** 連續錯誤間隔時間 */
  loginSmsGapTime: string | number;
  /** 簡訊有效時間 */
  smsTimeLimit: string | number;
  /** 強制更新密碼設定 */
  forceUpdatePassword: number;
  /** 註冊頁欄位 */
  phoneShow: boolean;
  phoneRequired: boolean;
  nameShow: boolean;
  nameRequired: boolean;
  emailShow: boolean;
  emailRequired: boolean;
  reconfirm: boolean;
}

// 操作紀錄查詢條件
interface OperationLogSearch {
  startTime: string;
  endTime: string;
}

// 操作紀錄子項
interface OperationLogSubData {
  column: string;
  oldValue: string;
  newValue: string;
}

// 操作紀錄列
interface OperationLogItem {
  createdAt: string;
  account: string;
  action: string;
  subData: OperationLogSubData[];
}

export type {
  LoginSwitchForm,
  OperationLogSearch,
  OperationLogSubData,
  OperationLogItem
};
