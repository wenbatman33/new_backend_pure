import { http } from "@/utils/http";

/** 後端統一回應格式 */
type Result<T = any> = {
  success: boolean;
  data: T;
};


// ===== operator websocket（廣播）模組 =====
// endpoint 沿用舊碼：/backend/websocket/list（GET）、/backend/websocket（GET 取單筆 / POST 新增 / PUT 編輯 / DELETE 刪除）
export interface BroadcastItem {
  id: number;
  title: string;
  memberType: number; // 0 全站 / 1 指定
  memberAccounts: string[];
  deeplinkType: number;
  deeplinkLink: string;
  displayType: number; // 1 彈窗 / 2 toast / 3 站內信 / 4 圖片
  startType: number; // 1 立即 / 2 預約
  startTime: string;
  sendTime: string;
  time: number; // 持續時間（分）
  imageWeb: string;
  imageH5: string;
  updatedAt: string;
  updatedUser: string;
}

/** 廣播列表 */

export const getBroadcastList = (params?: object) =>
  http.request<Result<{ list: BroadcastItem[]; total: number }>>(
    "get",
    "/backend/websocket/list",
    { params }
  );

/** 取得單筆廣播 */

export const getBroadcastByID = (id: number) =>
  http.request<Result<BroadcastItem>>("get", "/backend/websocket", {
    params: { id }
  });

/** 新增廣播（舊 Vben post 的 params 實為 body，轉 data） */

export const addBroadcast = (data: object) =>
  http.request<Result<null>>("post", "/backend/websocket", { data });

/** 編輯廣播（舊 Vben put 的 params 實為 body，轉 data） */

export const editBroadcast = (data: object) =>
  http.request<Result<null>>("put", "/backend/websocket", { data });

/** 刪除廣播（舊碼用 query string id） */

export const deleteBroadcast = (id: number) =>
  http.request<Result<null>>("delete", "/backend/websocket", {
    params: { id }
  });

// ===== operator / siteFunction（網站功能設定，沿用舊 endpoint /backend/config/page）=====
// 網站功能設定資料結構（後端 1=開 2=關）
export interface SiteFunctionSettings {
  phone_edit?: number;
  modify_password_mode?: number;
  email_show?: number;
  email_verfiy?: number;
  email_get_password?: number;
  luckmoney_active?: number;
  chatroom_entrance?: number;
  lobbyxinliQuickBetWidget?: number;
  lobbySabaQuickBetWidget?: number;
  sabaWidgetID?: string;
  eventLeague?: number;
  eventLeagueID?: string;
  websocketMatchSchedule?: {
    status?: number;
    league?: number[];
    preEventTime?: number;
  };
  home_lottery?: number;
  home_lottery_title?: string;
  home_lottery_link?: string;
  welfare?: number;
  specific_1?: number;
  specific_title?: string;
  specific_link?: string;
  // 舊版相容欄位
  preMatchBroadcast?: number;
  preMatchBroadcastLeagueID?: string | number[];
  preMatchBroadcastBeforeMinutes?: number;
}

/** 取得網站功能設定 */

export const getSiteFunctionSettings = () => {
  return http.request<Result<SiteFunctionSettings>>("get", "/backend/config/page");
};

/** 更新網站功能設定（舊 Vben put 的 params 實為 body，故用 data） */

export const putSiteFunctionSettings = (data: object) => {
  return http.request<Result<null>>("put", "/backend/config/page", { data });
};

// ===== operator / pagelist（站台頁面管理）=====
// 沿用舊 endpoint：/backend/page/* 與 /file/file/upload
export type PageListItem = {
  id: number;
  name: string;
  code: string;
  status: number;
  content: string;
  updatedAt: string;
  updatedUser: string;
};

export type PageListResult = Result<{
  list: PageListItem[];
  total: number;
}>;

/** 站台頁面列表 */

export const getPageList = (params?: object) => {
  return http.request<PageListResult>("get", "/backend/page/list", { params });
};

/** 站台頁面新增（舊 defHttp.post params 為 body） */

export const createPage = (data?: object) => {
  return http.request<Result>("post", "/backend/page/create", { data });
};

/** 站台頁面編輯（舊 defHttp.put params 為 body） */

export const editPage = (data?: object) => {
  return http.request<Result>("put", "/backend/page/edit", { data });
};

/** 站台頁面刪除（舊碼以 query ?id= 傳遞） */

export const deletePage = (id: number) => {
  return http.request<Result>("delete", "/backend/page/delete", {
    params: { id }
  });
};

/** 頁面內容列表 */

export const getPageContentList = (params?: object) => {
  return http.request<Result<{ list: any[]; total?: number }>>(
    "get",
    "/backend/page/visible",
    { params }
  );
};

/** 頁面內容新增 */

export const postPageContent = (data?: object) => {
  return http.request<Result>("post", "/backend/page/create_content", { data });
};

/** 頁面內容編輯 */

export const putPageContent = (data?: object) => {
  return http.request<Result>("put", "/backend/page/edit_content", { data });
};

/** 頁面內容刪除（舊碼以 query ?id= 傳遞） */

export const deletePageContent = (id: number) => {
  return http.request<Result>("delete", "/backend/page/delete_content", {
    params: { id }
  });
};

/** 頁面內容圖片上傳（FormData，回 { url }） */

export const uploadPageImg = (data: FormData) => {
  return http.request<Result<{ url: string }>>("post", "/file/file/upload", {
    data
  });
};

// ===== operator / burialPointSettings（埋点设置 + 域名设置）=====
export type EventTrackingItem = {
  id: number;
  name: string;
  url: string[];
  eventType: number;
  eventCode: string;
  /** 是否支持事件：1 是 / 2 否 */
  event: number;
  updatedAt: string;
};

export type EventTrackingListResult = Result<{
  list: EventTrackingItem[];
  total: number;
}>;

/** 埋点可选网址清单 */

export type EventTrackingUrlListResult = Result<{
  eventTrackingUrlList: string[];
}>;

/** 域名设置项 */

export type DomainSettingItem = {
  id: number;
  displayName: string;
  domain: string;
  note: string;
  groupID?: number;
  name?: string;
};

export type DomainSettingResult = Result<{
  id: number;
  name: string;
  displayName: string;
  children: DomainSettingItem[];
}>;

/** 埋点列表 */

export const getEventTracking = (params?: object) => {
  return http.request<EventTrackingListResult>(
    "get",
    "/backend/event_tracking",
    { params }
  );
};

/** 新增埋点 */

export const postEventTracking = (data?: object) => {
  return http.request<Result>("post", "/backend/event_tracking", { data });
};

/** 编辑埋点 */

export const putEventTracking = (data?: object) => {
  return http.request<Result>("put", "/backend/event_tracking", { data });
};

/** 删除埋点 */

export const deleteEventTracking = (id: number) => {
  return http.request<Result>("delete", "/backend/event_tracking", {
    params: { id }
  });
};

/** 埋点可选网址清单 */

export const getDomainGetEventTrackingUrlList = () => {
  return http.request<EventTrackingUrlListResult>(
    "get",
    "/backend/domain/get_event_tracking_url_list"
  );
};

/** 域名设置列表（data.children） */

export const getDomainSetting = (params?: object) => {
  return http.request<DomainSettingResult>("get", "/backend/domain/siteUrl", {
    params
  });
};

/** 新增域名 */

export const postDomain = (data?: object) => {
  return http.request<Result>("post", "/backend/domain/domain", { data });
};

/** 编辑域名 */

export const putDomain = (data?: object) => {
  return http.request<Result>("put", "/backend/domain/domain", { data });
};

/** 删除域名 */

export const delDomain = (params: { id: number }) => {
  return http.request<Result>("delete", "/backend/domain/domain", { params });
};

// ====== 導覽管理 navManagement（沿用舊 endpoint /backend/navigation*）======
export interface NavigationItem {
  id: number;
  sort: number;
  lobbyType: number; // 1 遊戲分類 / 2 啟動遊戲 / 3 前往指定頁面
  name?: { language: string; name: string }[];
  status: number | boolean;
  dynamic?: number | boolean;
  icon?: string;
  iconColor?: string;
  iconColor2?: string;
  content: string | number;
  note?: string;
  updatedAt?: string;
  updatedUser?: string;
}

/** 導覽列表 */

export const getNavigationList = (params?: object) =>
  http.request<Result<{ list: NavigationItem[]; total: number }>>(
    "get",
    "/backend/navigation/list",
    { params }
  );

/** 新增導覽（舊 Vben post 的 params 實為 body） */

export const postNavigation = (data: object) =>
  http.request<Result<null>>("post", "/backend/navigation", { data });

/** 編輯導覽（舊 Vben put 的 params 實為 body） */

export const putNavigation = (data: object) =>
  http.request<Result<null>>("put", "/backend/navigation", { data });

/** 刪除導覽（舊碼以 query string 帶 id） */

export const deleteNavigation = (id: number | string) =>
  http.request<Result<null>>("delete", "/backend/navigation", {
    params: { id }
  });

/** 更新排序 */

export const putNavigationSort = (data: { id: number; sort: number }) =>
  http.request<Result<null>>("put", "/backend/navigation/sort", { data });

/** 更新顯示狀態 */

export const putNavigationStatus = (data: { id: number; status: boolean }) =>
  http.request<Result<null>>("put", "/backend/navigation/status", { data });

/** 遊戲/廠商下拉（content 名稱對應、lobbyType=2 用） */

export const getGameDropdownList = () =>
  http.request<
    Result<{
      gameGroup: { id: number; displayName: string; status: number }[];
      gameList: {
        id: number;
        displayName: string;
        gameGroup: number;
        status: number;
      }[];
    }>
  >("get", "/backend/game/dropdown/list");

// ===== operator / socialsetting 社群設定 =====
// 社群設定資料項（member / agent 共用）
export interface SocialItem {
  order: string | number;
  iconUrl: string;
  name: string;
  subtitle?: string;
  openWay: number; // 1 另開 / 2 內嵌 / 3 Livechat / 4 tawk.to
  link: string;
  license: string;
  group: string;
  show: number; // 1 顯示 / 2 隱藏
}

export interface SocialConfig {
  member: SocialItem[];
  agent: SocialItem[];
}

/** 後台取得前台 Social 基本設定 */

export const getSocialConfig = () => {
  return http.request<Result<SocialConfig>>("get", "/backend/config/social");
};

/** 後台更新 Social（整包送回；舊 Vben put 的 params 實為 body，改 data） */

export const putSocialConfig = (data: SocialConfig) => {
  return http.request<Result<null>>("put", "/backend/config/social", { data });
};

/** 後台發佈 Social 基本設定到前台 */

export const publishSocial = () => {
  return http.request<Result<null>>("post", "/backend/config/deploysocial");
};

// ===== 廣告分類 bannerCat（沿用舊 endpoint /backend/site/banner/category）=====
export interface BannerCategoryItem {
  id: number;
  /** 分類名稱 */
  name: string;
  /** 分類說明 */
  description: string;
  /** 是否隱藏 */
  hidden: boolean;
  /** 最後執行人 ID */
  editor: number;
  /** 執行人名稱 */
  editorName: string;
  createdAt: string;
  updatedAt: string;
}

/** 廣告分類列表查詢參數 */

export interface GetBannerCategoryParams {
  sort?: string;
  dir?: string;
  page?: number;
  pageSize?: number;
}

/** 廣告分類列表回應 data（後端用 count 當總筆數） */

export interface BannerCategoryListResult {
  list: BannerCategoryItem[];
  count: number;
  total?: number;
}

/** 廣告分類新增 body */

export interface PostBannerCategoryParams {
  name: string;
  description?: string;
  hidden?: boolean;
}

/** 廣告分類編輯 body */

export interface PutBannerCategoryParams {
  id?: number;
  name: string;
  description?: string;
  hidden?: boolean;
}

/** 廣告分類：列表 */

export const getBannerCategory = (params?: GetBannerCategoryParams) => {
  return http.request<Result<BannerCategoryListResult>>(
    "get",
    "/backend/site/banner/category",
    { params }
  );
};

/** 廣告分類：新增（舊 Vben post params 實為 body，轉成 data） */

export const postBannerCategory = (data?: PostBannerCategoryParams) => {
  return http.request<Result<{ success: boolean }>>(
    "post",
    "/backend/site/banner/category",
    { data }
  );
};

/** 廣告分類：編輯（含顯示/隱藏切換，舊 Vben put params 實為 body，轉成 data） */

export const putBannerCategory = (data?: PutBannerCategoryParams) => {
  return http.request<Result<{ success: boolean }>>(
    "put",
    "/backend/site/banner/category",
    { data }
  );
};

export interface InboxSettingItem {
  id: number;
  title: string;
  titlePh?: string;
  content: string;
  contentPh?: string;
  startTime: string;
  endTime: string;
  updatedAt: string;
  updatedUser: string;
  deletedAt?: string | null;
}

export interface InboxSettingListResult {
  list: InboxSettingItem[];
  total: number;
}

/** 站內信設定列表 */

export const getInboxSetting = (params?: object) => {
  return http.request<Result<InboxSettingListResult>>(
    "get",
    "/backend/site/letter/setting/list",
    { params }
  );
};

/** 新增站內信設定（舊 Vben post 的 params 實為 body，轉為 data） */

export const addInboxSetting = (data?: object) => {
  return http.request<Result<any>>("post", "/backend/site/letter/setting", {
    data
  });
};

/** 編輯站內信設定（舊 Vben put 的 params 實為 body，轉為 data） */

export const editInboxSetting = (data?: object) => {
  return http.request<Result<any>>("put", "/backend/site/letter/setting", {
    data
  });
};

/** 回收站內信（舊 Vben put 的 params 實為 body，轉為 data） */

export const cancelLetter = (data: { letterSettingId: number }) => {
  return http.request<Result<any>>(
    "put",
    "/backend/site/letter/member/cancel",
    { data }
  );
};

export type JackpotSetting = {
  min: string;
  max: string;
  cycle: string;
  min_cycle: string;
  max_cycle: string;
};

/** 取得假 Jackpot 設定 */

export function getJackpotSettings() {
  return http.request<Result<JackpotSetting>>(
    "get",
    "/backend/config/jackpot"
  );
}

/** 更新假 Jackpot 設定（舊 Vben put params 即 body，轉為 data） */

export function putJackpotSettings(data: Partial<JackpotSetting>) {
  return http.request<Result<JackpotSetting>>(
    "put",
    "/backend/config/jackpot",
    { data }
  );
}

// ===== 地區限制頁面設定（regionRestrictedPageManagement，沿用舊 endpoint） =====
export interface RegionRestrictionConfig {
  title: string;
  logo: string;
  url: string;
  buttonContent: string;
  content: string;
}

/** 讀取地區限制頁面設定 */

export const getRegionRestrictionConfig = () => {
  return http.request<Result<RegionRestrictionConfig>>(
    "get",
    "/backend/config/regional_restriction"
  );
};

/** 儲存地區限制頁面設定 */

export const putRegionRestrictionConfig = (data?: object) => {
  return http.request<Result>("put", "/backend/config/regional_restriction", {
    data
  });
};

/** 更新發布地區限制頁面設定 */

export const deployRegionRestrictionConfig = () => {
  return http.request<Result>(
    "post",
    "/backend/config/deploy_regional_restriction"
  );
};

/** 地區限制頁面 Logo 上傳（沿用共用 /file/file/upload） */

export const uploadRegionRestrictionLogo = (data: FormData) => {
  return http.request<Result<{ url: string }>>("post", "/file/file/upload", {
    data
  });
};

// ===== 站內信（站內信管理 inboxList）相關 endpoint，沿用舊 /backend/site/letter/* =====
// 站內信列表項目
export interface InboxListItem {
  letterSettingId: number;
  type: number; // 1 系統 / 2 人工
  title: string;
  titlePh?: string;
  content: string;
  contentPh?: string;
  memberCount: number;
  status: number; // 1 待發送 / 3 已發送 / 4 失敗 / 5 已回收
  sendAt: string;
  updatedAt: string;
  updatedUser: string;
}

export interface InboxListResult {
  list: InboxListItem[];
  total: number;
}

export interface LetterMemberResult {
  list: Array<{ memberAccount: string; sendAt: string; status: string | number }>;
  total?: number;
}

// 站內信列表（GET，查詢條件走 params）

export const getInboxList = (params?: object) => {
  return http.request<Result<InboxListResult>>("get", "/backend/site/letter/list", { params });
};

// 收件名單（GET）

export const getLetterMember = (params: { letterSettingId: number; memberAccount?: string }) => {
  return http.request<Result<LetterMemberResult>>("get", "/backend/site/letter/member", { params });
};

// 新增站內信（POST，舊 Vben post params 實為 body → 轉 data）

export const addLetter = (data?: object) => {
  return http.request<Result<null>>("post", "/backend/site/letter/member", { data });
};

// 編輯站內信（PUT，body → data）

export const editLetter = (data?: object) => {
  return http.request<Result<null>>("put", "/backend/site/letter/member", { data });
};

// 回收站內信（PUT，body → data）

// ===== operator / webprofile 網站基本設定 =====
export interface WebProfileData {
  nuxtPublicName: string;
  nuxtPublicTitle: string;
  nuxtPublicDescription: string;
  nuxtPublicKeywords: string;
}

/** 取得網站基本設定 */

export const getWebprofile = () => {
  return http.request<Result<WebProfileData>>(
    "get",
    "/backend/config/webprofile"
  );
};

/** 暫存（更新）網站基本設定（舊 Vben put 的 params 實為 body，轉成 data） */

export const putWebprofile = (data: Partial<WebProfileData>) => {
  return http.request<Result<WebProfileData>>(
    "put",
    "/backend/config/webprofile",
    { data }
  );
};

/** 發佈網站基本設定（舊 Vben post 的 params 實為 body，轉成 data） */

export const publishWebprofile = (data: { name: string }) => {
  return http.request<Result<null>>(
    "post",
    "/backend/config/deploywebprofile",
    { data }
  );
};

// ===== operator / logoSetting =====
// LOGO 設定資料結構
export interface LogoData {
  logoWithTextHorizontal?: string;
  logoWithPureBlack?: string;
  logoWithLoadingText?: string;
  logoWithBackground?: string;
  logoWithTextVertical?: string;
}

// 後台取得網站 LOGO（沿用舊 endpoint /backend/config/logo）

export const getLogo = () => {
  return http.request<Result<LogoData>>("get", "/backend/config/logo");
};

// 後台暫存 LOGO（舊 put body）

export const putLogo = (data: LogoData) => {
  return http.request<Result<null>>("put", "/backend/config/logo", { data });
};

// 後台更新發佈 LOGO

export const publishLogo = () => {
  return http.request<Result<null>>("post", "/backend/config/deploylogo");
};

// 上傳 LOGO 圖檔（FormData，沿用舊 endpoint /file/file/upload；命名加 Logo 前綴避免跨模組碰撞）

export const fileLogoUpload = (data: FormData) => {
  return http.request<Result<{ url: string }>>("post", "/file/file/upload", {
    data
  });
};

// ===== operator / jpush（推播廣播 jpush） =====
// 沿用舊 endpoint：/backend/notification/jpush/*
export const getJpushList = (params?: object) =>
  http.request<Result<{ list: any[]; total: number }>>(
    "get",
    "/backend/notification/jpush/list",
    { params }
  );

export const getJpushDetail = (id: number) =>
  http.request<Result<any>>("get", "/backend/notification/jpush/detail", {
    params: { id }
  });

// 立即發送

export const addJpushSend = (data: object) =>
  http.request<Result<any>>("post", "/backend/notification/jpush/send", { data });

// 預約發送（建立排程）

export const addJpushSchedule = (data: object) =>
  http.request<Result<any>>("post", "/backend/notification/jpush/schedule/send", {
    data
  });

// 編輯排程（PUT，舊碼 defHttp.put 的 params 為 body，轉為 data）

export const editJpushSchedule = (data: object) =>
  http.request<Result<any>>("put", "/backend/notification/jpush/schedule/edit", {
    data
  });

// 刪除排程

export const deleteJpushSchedule = (id: number) =>
  http.request<Result<any>>("delete", "/backend/notification/jpush/schedule/delete", {
    params: { id }
  });

// ===== 公告 announcement =====
export type AnnouncementMultiple = {
  language: string;
  title: string;
  context: string;
};

export type AnnouncementItem = {
  id: number;
  sort: number;
  hidden: boolean;
  top: boolean;
  start: string;
  createdAt: string;
  updatedAt: string;
  editor: number;
  editorName: string;
  announcementMultiple: AnnouncementMultiple[];
  // 攤平用（前端從 announcementMultiple 提取）
  title?: string;
  content?: string;
  showLanguage?: string;
};

export type AnnouncementListResult = Result<{
  list: AnnouncementItem[];
  count: number;
}>;

/** 公告：列表 */

export const getAnnouncementList = (params?: object) => {
  return http.request<AnnouncementListResult>(
    "get",
    "/backend/site/announcement",
    { params }
  );
};

/** 公告：新增（舊 Vben post 的 params 實為 body，這裡轉成 data） */

export const createAnnouncement = (data?: object) => {
  return http.request<Result>("post", "/backend/site/announcement", { data });
};

/** 公告：修改（舊 Vben put 的 params 實為 body，這裡轉成 data） */

export const putAnnouncement = (data?: object) => {
  return http.request<Result>("put", "/backend/site/announcement", { data });
};

/** 公告：刪除 */

export const deleteAnnouncement = (id: number) => {
  return http.request<Result>("delete", "/backend/site/announcement", {
    params: { id }
  });
};

// ===== operator / recommendList（沿用舊 endpoint /backend/promotion/gameevent/*）=====
export interface RecommendListItem {
  id: number;
  sportsName: string;
  leagueName: string;
  eventID: string;
  eventTime: string;
  homeTeam: string;
  awayTeam: string;
  recommendItem: number[];
  hasStreaming: number;
  isLive: number;
  recommendStartTime: string;
  recommendEndTime: string;
  updatedAt: string;
  updatedUser: string;
}

export interface RecommendListResult {
  list: RecommendListItem[];
  total: number;
}

/** 取得推薦賽事列表 */

export function getRecommendList(params?: any) {
  return http.request<Result<RecommendListResult>>(
    "get",
    "/backend/promotion/gameevent/recommendlist",
    { params }
  );
}

/** 編輯推薦上架時間（舊 Vben put 的 params 為 body，這裡轉成 data） */

export function editRecommendTime(data: {
  id: number;
  recommend_start_time: string;
  recommend_end_time: string;
  recommend_item: number[];
}) {
  return http.request<Result<null>>(
    "put",
    "/backend/promotion/gameevent/editrecommendtime",
    { data }
  );
}

// ===== operator / banner（廣告）=====
// 沿用舊 endpoint：/backend/site/banner、/backend/site/banner/dropdown
// 上架平台下拉（device）舊碼來自 promotion dropdown，遷移後改由 operator 提供獨立端點
export type BannerListItem = {
  id: number;
  sort: number;
  bannerCategoryID: number;
  title: string;
  description: string;
  language: string;
  hidden: boolean;
  statusStr: string;
  recommendType: number[] | string[];
  imageWeb: string;
  imageH5: string;
  logo: string;
  device: string[];
  start: string;
  end: string;
  context: string;
  note: string;
  editor: number;
  editorName: string;
  createdAt: string;
  updatedAt: string;
};

export const getBanner = (params?: object) => {
  return http.request<Result<{ list: BannerListItem[]; total: number }>>(
    "get",
    "/backend/site/banner",
    { params }
  );
};

/** 廣告：新增 */

export const createBanner = (data?: object) => {
  return http.request<Result>("post", "/backend/site/banner", { data });
};

/** 廣告：編輯 */

export const putBanner = (data?: object) => {
  return http.request<Result>("put", "/backend/site/banner", { data });
};

/** 廣告：刪除 */

export const deleteBanner = (id: number) => {
  return http.request<Result>("delete", "/backend/site/banner", {
    params: { id },
    data: { id }
  });
};

/** 廣告分類：下拉選單 */

export const getBannerCategoryDropdown = () => {
  return http.request<Result<{ list: BannerCategoryItem[] }>>(
    "get",
    "/backend/site/banner/dropdown"
  );
};

/** 上架平台（device）下拉選單 */

export const getBannerDeviceDropdown = () => {
  return http.request<Result<{ device: Record<string, string>[] }>>(
    "get",
    "/backend/site/banner/device/dropdown"
  );
};

export interface BannerUrlItem {
  ID: number;
  name: string;
  /** 關鍵字標籤陣列 */
  keyword: string[];
  /** 推薦類型排序值陣列 */
  recommendTypeSort: number[];
  /** 狀態：1 啟用 / 2 停用 */
  status: number;
  updatedAt: string;
  editor: string;
}

/** 網址群組：列表 */

export const getBannerUrlList = (params?: {
  keyword?: string;
  name?: string;
  status?: number | string;
}) => {
  return http.request<Result<{ list: BannerUrlItem[]; total: number }>>(
    "get",
    "/backend/site/banner/url/list",
    { params }
  );
};

/** 網址群組：單筆查詢 */

export const getBannerUrlByID = (id: number | string) => {
  return http.request<Result<BannerUrlItem>>(
    "get",
    "/backend/site/banner/url",
    { params: { id } }
  );
};

/** 網址群組：新增（舊 Vben post 的 params 實為 body，轉為 data） */

export const createBannerUrl = (data?: object) => {
  return http.request<Result<null>>("post", "/backend/site/banner/url", {
    data
  });
};

/** 網址群組：編輯（舊 Vben put 的 params 實為 body，轉為 data） */

export const putBannerUrl = (data?: object) => {
  return http.request<Result<null>>("put", "/backend/site/banner/url", {
    data
  });
};

/** 網址群組：刪除（後端走 query string ?id=xxx） */

export const deleteBannerUrl = (id: number | string) => {
  return http.request<Result<null>>("delete", "/backend/site/banner/url", {
    params: { id }
  });
};
