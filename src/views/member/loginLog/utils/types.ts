interface LoginLogItem {
  id: number;
  memberID: number;
  account: string;
  name: string;
  registeredAt: string;
  /** 登入型別：1 註冊 / 2 登入 */
  loginType: number;
  loginArea: string;
  loginIP: string;
  loginDeviceID: string;
  loginDeviceType: string;
  appVersion: string;
  loginUserAgent: string;
  createdAt: string;
  /** 是否成功：1 成功 / 0 失敗 */
  success: number;
  /** 失敗原因代碼 */
  failReason: number;
}

interface SearchFormProps {
  account: string;
  /** 精準比對：1 完全比對 / 2 模糊比對 */
  exactlyMatching: number;
  loginIP: string;
  loginDeviceID: string;
  loginStartTime: string;
  loginEndTime: string;
  registerStartTime: string;
  registerEndTime: string;
  /** 1 註冊 / 2 登入 */
  loginType: number | "";
}

export type { LoginLogItem, SearchFormProps };
