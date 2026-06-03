/** 站台平台項目 */
interface PlatformItem {
  /** 平台代碼，用於判斷呼叫哪支部署 API */
  id: string | number;
  /** 部署名稱（送給後端的 name 參數） */
  name: string;
  /** 顯示名稱 */
  displayName: string;
  /** Tag 顏色 */
  color: string;
}

/** 操作記錄項目 */
interface DeployLogItem {
  id: number;
  /** 時間 */
  time: string;
  /** 操作人 */
  account: string;
  /** 平台 */
  platform: string;
}

export type { PlatformItem, DeployLogItem };
