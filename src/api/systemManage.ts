import { http } from "@/utils/http";

/** 後端統一回應格式 */
type Result<T = any> = {
  success: boolean;
  data: T;
};


export interface CloudIpLibraryItem {
  id: number;
  ipRange: string;
  name: string;
  category: string;
  source: string;
  remark: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

/** 雲端 IP 庫查詢清單 */

export const getCloudIpLibraryList = (params?: object) => {
  return http.request<Result<{ list: CloudIpLibraryItem[]; total: number }>>(
    "get",
    "/backend/cloudiplibrary/list",
    { params }
  );
};

/** 雲端 IP 庫新增 */

export const createCloudIpLibrary = (data?: object) => {
  return http.request<Result<null>>(
    "post",
    "/backend/cloudiplibrary/create",
    { data }
  );
};

/** 雲端 IP 庫修改 */

export const updateCloudIpLibrary = (data?: object) => {
  return http.request<Result<null>>(
    "put",
    "/backend/cloudiplibrary/update",
    { data }
  );
};

/** 雲端 IP 庫刪除 */

export const deleteCloudIpLibrary = (data?: object) => {
  return http.request<Result<null>>(
    "delete",
    "/backend/cloudiplibrary/delete",
    { data }
  );
};

/** 雲端 IP 庫指定 IP 段重掃會員標籤 */

export const rescanCloudIpLibrary = (data?: object) => {
  return http.request<Result<{ taggedCount: number }>>(
    "post",
    "/backend/cloudiplibrary/rescan",
    { data }
  );
};

/** 雲端 IP 庫全部 IP 段重掃會員標籤（支援 category 篩選） */

export const rescanAllCloudIpLibrary = (data?: object) => {
  return http.request<Result<{ taggedCount: number }>>(
    "post",
    "/backend/cloudiplibrary/rescanall",
    { data }
  );
};

/** 雲端 IP 庫_從官方來源自動同步 IP 清單 */

export const syncFromSources = () => {
  return http.request<Result<{ results: any[] }>>(
    "post",
    "/backend/cloudiplibrary/syncfromsources"
  );
};

// ===== systemSwitch 站台/存款/提款設定 =====
// 系統設定總物件
export function getSystemConfig() {
  return http.request<Result<any>>("get", "/backend/member/system/config");
}

export function updateSystemConfig(data: any) {
  // 舊 Vben put 的 params 實為 body，轉成 data
  return http.request<Result<null>>("put", "/backend/member/system/config", { data });
}
// 自動更新遊戲開關

export function getAutoupdatelggame() {
  return http.request<Result<{ autoStatus: number }>>("get", "/backend/config/autoupdatelggame");
}

export function updateAutoupdatelggame(data: { autoStatus: number }) {
  return http.request<Result<null>>("put", "/backend/config/autoupdatelggame", { data });
}
// 操作紀錄（系統設定）

export function getSystemOperationLog(params: { startTime: string; endTime: string }) {
  return http.request<Result<{ list: any[]; total: number }>>(
    "get",
    "/backend/admin/operation/logs",
    { params }
  );
}

// ===== systemManage 域：deploy 模組（手動站台部署 + 操作記錄）=====
// 沿用舊 endpoint 字串；Result<T> 由 api 檔頭統一定義，勿重複宣告。
export type DeployLogItem = {
  id: number;
  time: string;
  account: string;
  platform: string;
};

export type DeployLogListResult = Result<{
  list: DeployLogItem[];
  total: number;
}>;

/** 部署操作記錄列表 */

export const getDeployLogs = (params?: object) => {
  return http.request<DeployLogListResult>("get", "/backend/deploylogs/logs", {
    params
  });
};

/** 手動部署（v2 站台，body 帶 name） */

export const deploy = (data: { name: string }) => {
  return http.request<Result>("post", "/backend/jenkins/deploy", { data });
};

/** 包網前台部署（舊伺服器，body 帶 name） */

export const deployVD = (data: { name: string }) => {
  return http.request<Result>("post", "/backend/jenkins/deployvd", { data });
};

/** 包網後端部署（新伺服器 VD88 luck18v2） */

export const deployVD88Luck18V2 = () => {
  return http.request<Result>("post", "/backend/jenkins/deployvd88luck18v2");
};

/** 包網代理前台部署（新伺服器 VD88） */

export const deployVD88Agency = () => {
  return http.request<Result>("post", "/backend/jenkins/deployvd88agency");
};

/** 包網前台 Nuxt 部署（舊伺服器，body 帶 name） */

export const deployVDNuxt = (data: { name: string }) => {
  return http.request<Result>("post", "/backend/jenkins/deployvdnuxt", { data });
};

/** 包網前台 Nuxt 部署（新伺服器 VD88） */

export const deployVD88Nuxt = () => {
  return http.request<Result>("post", "/backend/jenkins/deployvd88nuxt");
};

/** 包網後端部署（舊伺服器 luck18v2，body 帶 name） */

export const deployVDLuck18v2 = (data: { name: string }) => {
  return http.request<Result>("post", "/backend/jenkins/deployvdluck18v2", {
    data
  });
};

/** 91 前台 Nuxt 部署 */

export const deployTRNuxt = () => {
  return http.request<Result>("post", "/backend/jenkins/deploytrnuxt");
};

/** 包網後台部署（舊伺服器，body 帶 name） */

export const postJenkinsDeployvdbo = (data: { name: string }) => {
  return http.request<Result>("post", "/backend/jenkins/deployvdbo", { data });
};

/** 包網後台部署（新伺服器 VD88，91 後台共用） */

export const postJenkinsDeployvd88bo = () => {
  return http.request<Result>("post", "/backend/jenkins/deployvd88bo");
};

// ===== 簡訊供應商 smsVendor（沿用舊 endpoint /backend/sms/vendor）=====
// 列表回傳結構（此頁無分頁，後端一次回傳全部）
export interface SmsVendorListResult {
  list: Array<{
    id: number;
    status: number; // 1 啟用 / 2 停用
    displayName: string;
    quota: number;
    credit: number;
    successRate: number | string;
    backendUrl: string;
    username?: string;
    password?: string;
    key?: string;
    secret?: string;
    apiUrl?: string;
    template?: string;
    param?: string;
    apiParam?: Record<string, string>;
  }>;
  total: number;
}

/** 取得簡訊供應商列表 */

export function getSmsVendorList() {
  return http.request<Result<SmsVendorListResult>>(
    "get",
    "/backend/sms/vendor"
  );
}

/** 啟用/停用簡訊供應商（舊碼為 put 帶 body { id }，啟用該供應商） */

export function updateSmsVendorStatus(id: number) {
  return http.request<Result<null>>("put", "/backend/sms/vendor", {
    data: { id }
  });
}

/** 編輯簡訊供應商設定（舊碼 put /backend/sms/vendor/edit，body 為整份表單） */

export function updateSmsVendorData(data: any) {
  return http.request<Result<null>>("put", "/backend/sms/vendor/edit", {
    data
  });
}

// ===== domainManage（域名管理）相關，沿用舊 endpoint =====
enum DomainApi {
  domainList = "/backend/domain/list",
  domainGroup = "/backend/domain/group",
  domain = "/backend/domain/domain",
  manualUpdate = "/backend/domain/json",
  quickReplace = "/backend/domain/quick_replacement"
}

/** 取得域名樹狀清單（群組含 children 子域名），依 sort 升冪排序 */

export function getDomainList(params: { service: number }) {
  return http
    .request<Result<{ list: any[]; total: number }>>("get", DomainApi.domainList, {
      params
    })
    .then(res => {
      if (res?.data?.list) {
        res.data.list = [...res.data.list].sort((a, b) =>
          a.sort > b.sort ? 1 : -1
        );
      }
      return res;
    });
}

/** 新增域名群組 */

export function createDomainGroup(data: any) {
  return http.request<Result<any>>("post", DomainApi.domainGroup, { data });
}

/** 編輯域名群組（status=2 代表軟刪除） */

export function updateDomainGroup(data: any) {
  return http.request<Result<any>>("put", DomainApi.domainGroup, { data });
}

/** 新增域名 */

export function createDomain(data: any) {
  return http.request<Result<any>>("post", DomainApi.domain, { data });
}

/** 編輯域名 */

export function updateDomain(data: any) {
  return http.request<Result<any>>("put", DomainApi.domain, { data });
}

/** 刪除域名（依 id） */

export function deleteDomain(id: number) {
  return http.request<Result<any>>("delete", `${DomainApi.domain}?id=${id}`);
}

/** 手動更新 domain json */

export function manualUpdateDomainJson(data: { service: number }) {
  return http.request<Result<any>>("post", DomainApi.manualUpdate, { data });
}

/** 快速置換 - 搜尋預覽（GET query） */

export function searchReplaceDomain(params: any) {
  return http.request<Result<{ list: any[]; total: number }>>(
    "get",
    DomainApi.quickReplace,
    { params }
  );
}

/** 快速置換 - 確認執行（PUT body） */

export function replaceDomainConfirm(data: any) {
  return http.request<Result<any>>("put", DomainApi.quickReplace, { data });
}

// ===== systemManage / configTmpKey（前台动态设定 / layout 设定页）=====
// 沿用旧 endpoint：GET/PUT /backend/config/layout、POST /backend/config/deploylayout
export type ConfigLayoutResult = {
  dynamicConfigs: Record<string, any>;
};

/** 取得前台动态设定（layout） */

export const getConfigLayout = () => {
  return http.request<Result<ConfigLayoutResult>>(
    "get",
    "/backend/config/layout"
  );
};

/** 更新前台动态设定（layout）；body 带 { dynamicConfigs } */

export const putConfigLayout = (data: { dynamicConfigs: Record<string, any> }) => {
  return http.request<Result<null>>("put", "/backend/config/layout", { data });
};

/** 发布前台动态设定（layout） */

export const postConfigDeployLayout = () => {
  return http.request<Result<null>>("post", "/backend/config/deploylayout");
};

// ===== TG 机器人通知设定 (tgRobotNotifySetting) =====
// 沿用旧 endpoint /backend/config/telegramBot
type TgRobotBotConfig = {
  open: boolean;
  chatId: string;
  manual: string;
};

/** 读取 TG 机器人通知设定 */

export const getConfigTelegramBot = () => {
  return http.request<Result<TgRobotBotConfig>>(
    "get",
    "/backend/config/telegramBot"
  );
};

/** 更新 TG 机器人通知设定（旧 Vben put 的 params 实为 body，转 data） */

export const putConfigTelegramBot = (data: {
  open: boolean;
  chatId: string;
}) => {
  return http.request<Result<TgRobotBotConfig>>(
    "put",
    "/backend/config/telegramBot",
    { data }
  );
};

// ===== systemManage / withdrawalTime（提款时间设定）=====
// 提款时间设定结构（单一物件，非列表）
export interface WithdrawalTimeData {
  withdrawalTimeEnable: boolean;
  withdrawalTimeMondayStart: string;
  withdrawalTimeMondayEnd: string;
  withdrawalTimeTuesdayStart: string;
  withdrawalTimeTuesdayEnd: string;
  withdrawalTimeWednesdayStart: string;
  withdrawalTimeWednesdayEnd: string;
  withdrawalTimeThursdayStart: string;
  withdrawalTimeThursdayEnd: string;
  withdrawalTimeFridayStart: string;
  withdrawalTimeFridayEnd: string;
  withdrawalTimeSaturdayStart: string;
  withdrawalTimeSaturdayEnd: string;
  withdrawalTimeSundayStart: string;
  withdrawalTimeSundayEnd: string;
}

/** 取得提款时间设定 */

export function getWithdrawalTime() {
  return http.request<Result<WithdrawalTimeData>>(
    "get",
    "/backend/withdrawalTime"
  );
}

/** 更新提款时间设定（旧 Vben put 的 params 实为 body，故转 data） */

export function putWithdrawalTime(data: WithdrawalTimeData) {
  return http.request<Result<WithdrawalTimeData>>(
    "put",
    "/backend/withdrawalTime",
    { data }
  );
}

// ===== systemManage / verifyBankcard 銀行卡/手機驗證廠商設定 =====
// 沿用舊 endpoint：
//   GET  /backend/member/bankcard/check        取得銀行卡二元素 + 歸屬地廠商列表
//   POST /backend/member/bankcard/check        啟用銀行卡廠商（切換 status）
//   GET  /backend/phone/check                  取得手機二元素廠商列表
//   PUT  /backend/phone/check                  更新手機二元素廠商設定
//   POST /backend/phone/check/switch           啟用手機二元素廠商（切換 status）
//   POST /backend/member/bankcard/verify       更新銀行卡廠商驗證設定
export const getBankcardCheck = () => {
  return http.request<Result<{ checkNameList: any[]; getBelongList: any[] }>>(
    "get",
    "/backend/member/bankcard/check"
  );
};

/** 啟用銀行卡廠商（切換 status，body 帶 type/id） */

export const updateBankcardCheck = (data: { type?: number; id: number }) => {
  return http.request<Result<null>>("post", "/backend/member/bankcard/check", {
    data
  });
};

/** 取得手機二元素廠商列表 */

export const getPhoneCheck = () => {
  return http.request<Result<{ list: any[] }>>("get", "/backend/phone/check");
};

/** 更新手機二元素廠商設定（body 為表單資料） */

export const updatePhoneCheck = (data: Record<string, any>) => {
  return http.request<Result<null>>("put", "/backend/phone/check", { data });
};

/** 啟用手機二元素廠商（切換 status，body 帶 type/id） */

export const updatePhoneCheckSwitch = (data: { type?: number; id: number }) => {
  return http.request<Result<null>>("post", "/backend/phone/check/switch", {
    data
  });
};

/** 更新銀行卡廠商驗證設定（body 為表單資料） */

export const postBankcardVerify = (data: Record<string, any>) => {
  return http.request<Result<null>>("post", "/backend/member/bankcard/verify", {
    data
  });
};

// ===== 圖片尺寸限制設定 PICSizeMgt =====
export interface PicSizeContentItem {
  column: string;
  size: number;
}

export interface PicSizeItem {
  id: number;
  type: number; // 1 廣告 / 2 站內頁
  name: string;
  content: PicSizeContentItem[];
  updatedAt: string;
  updatedUser: string;
}

export interface PicSizeListData {
  list: PicSizeItem[];
  total: number;
}

/** 圖片尺寸限制列表 */

export const getPicsizeList = (params?: { type?: number }) => {
  return http.request<Result<PicSizeListData>>("get", "/backend/picsize/list", {
    params
  });
};

/** 新增圖片尺寸限制（body: type / categoryID / content[]） */

export const postPicsize = (data: {
  type: number;
  categoryID: number | string;
  content: PicSizeContentItem[];
}) => {
  return http.request<Result<null>>("post", "/backend/picsize", { data });
};

/** 編輯圖片尺寸限制（body: id / content[]） */

export const putPicsize = (data: {
  id: number | string;
  content: PicSizeContentItem[];
}) => {
  return http.request<Result<null>>("put", "/backend/picsize", { data });
};

/** 刪除圖片尺寸限制（query: id） */

export const deletePicsize = (id: number | string) => {
  return http.request<Result<null>>("delete", "/backend/picsize", {
    params: { id }
  });
};

/** 表單下拉：廣告類別（type=1 時用） */

export const getBannerCategory = () => {
  return http.request<Result<{ list: Array<{ id: number; name: string }> }>>(
    "get",
    "/backend/site/banner/category"
  );
};

/** 表單下拉：站內頁（紅包/樂透）類別（type=2 時用） */

export const getLotteryList = () => {
  return http.request<Result<{ list: Array<{ id: number; name: string }> }>>(
    "get",
    "/backend/red_packet/list"
  );
};

export interface ActionVerifyLineItem {
  id: number;
  /** 1 啟用 / 2 關閉 */
  status: number;
  name: string;
  pcAppID?: string;
  pcAppSecret?: string;
  h5AppID?: string;
  h5AppSecret?: string;
  captchaUrl?: string;
  boUrl?: string;
  secretID?: string;
  secretKey?: string;
  /** 前端用：切換中 loading 旗標 */
  pendingStatus?: boolean;
}

/** 行為驗證廠商列表 */

export const getActionVerifyLineList = () => {
  return http.request<Result<{ list: ActionVerifyLineItem[]; total: number }>>(
    "get",
    "/backend/actionverifyline/list"
  );
};

/** 取得單一廠商明細 */

export const getActionVerifyLine = (params: { id: number }) => {
  return http.request<Result<ActionVerifyLineItem>>(
    "get",
    "/backend/actionVerifyLine",
    { params }
  );
};

/** 編輯廠商設定（舊 Vben put 的 params 實為 body，轉為 data） */

export const putActionVerifyLine = (data: Partial<ActionVerifyLineItem>) => {
  return http.request<Result<null>>("put", "/backend/actionVerifyLine", {
    data
  });
};

/** 關閉指定廠商線路 */

export const putActionVerifyLineTurnOff = (data: { id: number }) => {
  return http.request<Result<null>>(
    "put",
    "/backend/actionVerifyLine/turnOff",
    { data }
  );
};

/** 啟用指定廠商線路 */

export const putActionVerifyLineTurnOn = (data: { id: number }) => {
  return http.request<Result<null>>("put", "/backend/actionVerifyLine/turnOn", {
    data
  });
};

// ===== 系统管理 / 邮件廠商（systemManage email）=====
// 旧 endpoint：GET /backend/email/vendor、PUT /backend/email/vendor/edit、PUT /backend/email/vendor
export interface EmailVendorItem {
  id: number;
  name: string;
  domain: string;
  key: string;
  from: string;
  subject: string;
  templet: string;
  /** 1 表示已启用 */
  status?: number;
}

/** 取得邮件廠商列表（旧后端直接回传 list，无分页） */

export const getEmailVendor = (params?: object) => {
  return http.request<Result<{ list: EmailVendorItem[]; total?: number }>>(
    "get",
    "/backend/email/vendor",
    { params }
  );
};

/** 编辑邮件廠商（旧 Vben put 的 params 实为 body，转为 data） */

export const putEmailVendor = (data: Partial<EmailVendorItem>) => {
  return http.request<Result<null>>("put", "/backend/email/vendor/edit", {
    data
  });
};

/** 启用邮件廠商（旧 Vben put 的 params 实为 body，转为 data） */

export const enableEmailVendor = (data: { id: number }) => {
  return http.request<Result<null>>("put", "/backend/email/vendor", { data });
};

export function getLoginPCConfig() {
  return http.request<Result>("get", "/backend/member/setting/config");
}

/** 取得 H5/PWA 登入/註冊設定 */

export function getLoginH5Config() {
  return http.request<Result>("get", "/backend/member/setting/h5config");
}

/** 更新 PC 登入/註冊設定（舊 defHttp.put params 實為 body → data） */

export function updateLoginPCConfig(data: any) {
  return http.request<Result>("put", "/backend/member/setting/config", { data });
}

/** 更新 H5/PWA 登入/註冊設定 */

export function updateLoginH5Config(data: any) {
  return http.request<Result>("put", "/backend/member/setting/h5config", { data });
}

/** 取得登入開關操作紀錄 */

export function getOperationLog(params: { startTime: string; endTime: string }) {
  return http.request<Result>("get", "/backend/admin/operation/logs", { params });
}
