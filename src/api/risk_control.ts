import { http } from "@/utils/http";

/** 後端統一回應格式 */
type Result<T = any> = {
  success: boolean;
  data: T;
};


// 风控机器人配置型别
export interface BotConfig {
  productMembersLTEnable?: boolean;
  productMembersLTMembers?: number;
  productMembersLTTimes?: number;
  productMembersBetweenEnable?: boolean;
  productMembersBetweenGTEMembers?: number;
  productMembersBetweenLTMembers?: number;
  productMembersBetweenTimes?: number;
  productMembersBTEEnable?: boolean;
  productMembersBTEMembers?: number;
  productMembersBTETimes?: number;
  registerCountWeek1Enable?: boolean;
  registerCountWeek1Times?: number;
  registerCountWeek2Enable?: boolean;
  registerCountWeek2Times?: number;
  promotionReceivedCountWeek1Enable?: boolean;
  promotionReceivedCountWeek1Times?: number;
  promotionReceivedCountWeek2Enable?: boolean;
  promotionReceivedCountWeek2Times?: number;
  withdrawalTagRiskConditionEnable?: boolean;
  withdrawalRiskConditionFee?: number;
  withdrawalRiskConditionDepositRatio?: number;
  withdrawalTooHighEnable?: boolean;
  withdrawalTooHighMultiple?: number;
  withdrawalTooHighMultipleWithdrawalAmount?: number;
  withdrawalCountEnable?: boolean;
  withdrawalCount?: number;
  withdrawalCountFee?: number;
  withdrawalCountTotalDepositRatio?: number;
  profitAndLossEnable?: boolean;
  profitAndLossDays?: number;
  withdrawalAmountEnable?: boolean;
  withdrawalAmount?: number;
  withdrawalNoDepositEnable?: boolean;
  withdrawalNoDepositDays?: string;
  withdrawalWinEnable?: boolean;
  withdrawalWinDays?: string;
  withdrawalWinAmount?: string;
  withdrawalGameTypeEnable?: boolean;
  withdrawalGameType?: string;
  memberProfitEnable?: boolean;
  memberProfitAmount?: number;
  gameTransferMonitorEnable?: boolean;
  gameTransferMonitorAmount?: number;
  // 兼容 playerPortraitMonitoring 對 BotConfig 的彈性欄位存取
  [key: string]: any;
}

/** 取得风控机器人配置 */

export const getBotConfig = () => {
  return http.request<Result<BotConfig>>("get", "/backend/bot/config");
};

/** 储存风控机器人配置（舊 Vben defHttp.put({params}) 慣例＝送 body，故用 data） */
export const setBotConfig = (data: BotConfig) => {
  return http.request<Result<BotConfig>>("put", "/backend/bot/config", {
    data
  });
};

export interface TagListResult {
  list: Array<{ id: number; name: string; color?: string; groupID?: number }>;
  total?: number;
}

export interface TagGroupListResult {
  list: Array<{ id: number; name: string }>;
  total?: number;
}

/** 取得機器人/玩家畫像完整設定 */

export const getTagList = (params?: { id?: string; name?: string; isFuzzySearch?: boolean }) => {
  return http.request<Result<TagListResult>>("get", "/backend/member/tag/tags", { params });
};

/** 取得標籤群組清單 */

export const getTagGroupList = () => {
  return http.request<Result<TagGroupListResult>>("get", "/backend/member/tag/groups");
};

// ===== 風控代理標籤系統（risk_agency_tag_system） =====
export type AgencyTagItem = {
  agencyTagGroupId: number;
  agencyId: string;
  /** 後端以逗號分隔字串回傳 */
  tagId: string;
  remark?: string;
};

export type AgencyTagListResult = Result<{
  list: AgencyTagItem[];
  total: number;
}>;

export type TagOption = {
  id: number;
  name: string;
  color?: string;
  tagGroupID?: number;
};

/** 取得代理標籤群組列表（沿用舊 /backend/agency/tag/tags） */

export const getAgencyTags = (params?: object) => {
  return http.request<AgencyTagListResult>("get", "/backend/agency/tag/tags", {
    params
  });
};

/** 新增代理標籤群組（body: { agencyID, tagID, remark }） */

export const addAgencyTagGroup = (data?: object) => {
  return http.request<Result>("post", "/backend/agency/tag/group", { data });
};

/** 編輯代理標籤群組（body: { groupID, agencyID, tagID, remark }） */

export const putAgencyTagGroup = (data?: object) => {
  return http.request<Result>("put", "/backend/agency/tag/group", { data });
};

/** 刪除代理標籤群組（沿用舊 query groupID 寫法） */

export const delAgencyTagGroup = (groupID: number | string) => {
  return http.request<Result>("delete", "/backend/agency/tag/group", {
    params: { groupID }
  });
};

/** 取得會員標籤群組（供標籤選擇，沿用舊 /backend/member/tag/groups） */

export const getMemberTagGroup = () => {
  return http.request<Result<{ list: TagOption[]; total?: number }>>(
    "get",
    "/backend/member/tag/groups"
  );
};

/** 取得會員標籤（供標籤選擇，沿用舊 /backend/member/tag/tags） */

export const getMemberTag = (params?: object) => {
  return http.request<Result<{ list: TagOption[]; total?: number }>>(
    "get",
    "/backend/member/tag/tags",
    { params }
  );
};

// ===== risk_control 域：初審名單(first_review) 相關 =====
// 沿用舊 endpoint：/backend/risk/member/list、/backend/risk/member/check、/backend/risk/ip/list、/backend/risk/device/list
export interface RiskTag {
  id: number;
  name: string;
  tagGroupID: number;
  updatedAt?: string;
}

export interface RiskCheckItem {
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

export interface RiskIpDeviceItem {
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

export type CheckListResult = Result<{ list: RiskCheckItem[]; total: number }>;

export type IpDeviceListResult = Result<{
  list: RiskIpDeviceItem[];
  total: number;
}>;

/** 取得初審名單（舊碼把 params 串成 querystring，這裡改走 http params） */

export const GetCheckList = (params?: object) => {
  return http.request<CheckListResult>("get", "/backend/risk/member/list", {
    params
  });
};

/** 審核（確認）會員，body: { memberIDs: number[] } */

export const SetCheck = (data?: object) => {
  return http.request<Result<null>>("put", "/backend/risk/member/check", {
    data
  });
};

/** 依 IP 取得使用過此 IP 的會員名單，params: { ip } */

export const GetIPList = (params?: object) => {
  return http.request<IpDeviceListResult>("get", "/backend/risk/ip/list", {
    params
  });
};

/** 依裝置取得使用過此裝置的會員名單，params: { device } */

export const GetDeviceList = (params?: object) => {
  return http.request<IpDeviceListResult>("get", "/backend/risk/device/list", {
    params
  });
};

export interface BlackListItem {
  id: string | number;
  ip: string;
  reason: string;
  createdAt: string;
  createUserAccount: string;
}

/** 取得 IP 黑名單列表（ip 精準 / ipPart 模糊；舊 endpoint 沿用） */

export function getBlackList(params?: {
  ip?: string;
  ipPart?: string;
}): Promise<Result<{ list: BlackListItem[]; total: number }>> {
  return http.request("get", "/backend/member/ip/blacklist", { params });
}

/** 新增 IP 黑名單 */

export function addBlackList(data: {
  ip: string;
  reason: string;
}): Promise<Result<null>> {
  return http.request("post", "/backend/member/ip/blacklist", { data });
}

/** 編輯 IP 黑名單原因 */

export function updateBlackList(data: {
  id: string | number;
  reason: string;
}): Promise<Result<null>> {
  return http.request("put", "/backend/member/ip/reason", { data });
}

/** 刪除 IP 黑名單（依 ip，沿用舊以 query 帶 ip 的寫法） */

export function deleteBlackList(ip: string): Promise<Result<null>> {
  return http.request("delete", "/backend/member/ip/blacklist", {
    params: { ip }
  });
}

export interface DeviceBlackItem {
  id: number;
  deviceID: string;
  reason: string;
  createdAt: string;
  createUserAccount: string;
}

/** 取得裝置黑名單列表（deviceID 精準 / deviceIDPart 模糊） */

export function getDeviceBlackList(params?: {
  deviceID?: string;
  deviceIDPart?: string;
}) {
  return http.request<Result<{ list: DeviceBlackItem[]; total: number }>>(
    "get",
    "/backend/member/deviceid/blacklist",
    { params }
  );
}

/** 新增裝置黑名單 */

export function addDeviceBlackList(data: { deviceID: string; reason: string }) {
  return http.request<Result<null>>(
    "post",
    "/backend/member/deviceid/blacklist",
    { data }
  );
}

/** 編輯裝置黑名單原因 */

export function updateDeviceBlackList(data: { id: string; reason: string }) {
  return http.request<Result<null>>(
    "put",
    "/backend/member/deviceid/reason",
    { data }
  );
}

/** 刪除裝置黑名單（以 deviceID 為鍵，沿用舊 query 傳法） */

export function deleteDeviceBlackList(deviceID: string) {
  return http.request<Result<null>>(
    "delete",
    `/backend/member/deviceid/blacklist?deviceID=${deviceID}`
  );
}

export type LoginKickoutConfig = {
  /** 當前線上人數 */
  online_count: number;
  same_ip_enable: boolean;
  same_ip_limit: number;
  same_device_enable: boolean;
  same_device_limit: number;
};

/** 取得多帳號登入監控設定（含當前線上人數） */

export function getLoginKickoutConfig() {
  return http.request<Result<LoginKickoutConfig>>(
    "get",
    "/backend/member/login_kickout/config"
  );
}

/** 更新多帳號登入監控設定 */

export function putLoginKickoutConfig(
  data: Partial<Omit<LoginKickoutConfig, "online_count">>
) {
  return http.request<Result<LoginKickoutConfig>>(
    "put",
    "/backend/member/login_kickout/config",
    { data }
  );
}
