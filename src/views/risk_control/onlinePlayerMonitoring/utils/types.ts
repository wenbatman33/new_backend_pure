// 多帳號登入監控設定
interface KickoutConfig {
  /** 當前線上人數 */
  online_count: number;
  /** 同 IP 開關 */
  same_ip_enable: boolean;
  /** 同 IP 上限人數 */
  same_ip_limit: number;
  /** 同裝置開關 */
  same_device_enable: boolean;
  /** 同裝置上限人數 */
  same_device_limit: number;
}

export type { KickoutConfig };
