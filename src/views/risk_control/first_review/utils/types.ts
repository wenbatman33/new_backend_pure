// 風控-初審名單 型別

/** 標籤 */
interface RiskTag {
  id: number;
  name: string;
  tagGroupID: number;
  updatedAt?: string;
}

/** 初審名單列表項 */
interface CheckItem {
  memberID: number;
  account: string;
  name: string;
  agent: string;
  phone: string;
  registerIp: string;
  ipLocation?: string;
  registerDevice: string;
  phoneLocation: string;
  bankCardLocation: string;
  registerDate: string;
  deviceId?: string;
  tags: RiskTag[];
}

/** IP / 裝置 共用名單項 */
interface IpDeviceItem {
  memberID: number;
  account: string;
  agent: string;
  registerDate: string;
  loginDate: string;
  registerIp: string;
  registerDevice: string;
  loginIp: string;
  loginDevice: string;
}

export type { RiskTag, CheckItem, IpDeviceItem };
