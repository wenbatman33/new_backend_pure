import { http } from "@/utils/http";

/** 後端統一回應格式 */
type Result<T = any> = {
  success: boolean;
  data: T;
};


// ===== 遊戲代理商 gameAgency 模組（沿用舊 endpoint） =====
export interface GameAgencyItem {
  id: number;
  name: string;
  gameGroups: string[];
  gameLists: string[];
  imageH5: string;
  imagePc: string;
  status: number;
  gameTypeID?: number;
}

export interface GameAgencyListParams {
  name?: string;
  gameTypeID?: number | string;
  status?: number | string;
}

/** 取得遊戲代理商列表 */

export const getGameAgencyList = (params?: GameAgencyListParams) => {
  return http.request<Result<{ list: GameAgencyItem[]; total: number }>>(
    "get",
    "/backend/game/gameagency/list",
    { params }
  );
};

/** 修改遊戲代理商（狀態 / 圖檔） */

export const putGameAgency = (data: {
  id: number | string;
  status: number;
  imageH5: string;
  imagePc: string;
}) => {
  return http.request<Result<any>>("put", "/backend/game/gameagency", { data });
};

/** 取得遊戲類型（代理商搜尋下拉用） */

export const getGameListType = () => {
  return http.request<Result<{ list: { key: number | string; value: string }[] }>>(
    "get",
    "/backend/game/gamelist/type"
  );
};

/** 上傳遊戲圖檔，回傳 { url } */

export const fileUploadGame = (data: FormData) => {
  return http.request<Result<{ url: string }>>(
    "post",
    "/file/file/upload/game",
    { data }
  );
};

// ===== 紅包遊戲列表 lmGameList（沿用舊 endpoint）=====
export interface LmGameListItem {
  id: number;
  sort: number;
  gameGroupID: number;
  gameGroupDisplayName: string;
  name: string;
  displayName: string;
  gameTypeID: number;
  gameTypeName: string;
  status: number;
  trialPlay?: number;
  isSpecial?: number;
  isSlot?: number;
  isNewGame?: number;
  isHotGame?: number;
  isReturn?: number;
  bettingCode?: string;
  gameCodePc?: string;
  gameCodeH5?: string;
}

// 下拉選項通用結構（遊戲類型 / 廠商）

export interface LmGameOptionItem {
  value: any;
  key: number;
  name?: string;
  displayName?: string;
}

export interface LmGameListResult {
  list: LmGameListItem[];
  total: number;
}

export interface LmGameListParams {
  gameTypeID?: number;
  gameGroupID?: number | string;
  name?: string;
  displayName?: string;
  status?: number;
  page?: number;
  pageSize?: number;
}

/** 取得紅包遊戲列表 */

export const getLmGameList = (params?: LmGameListParams) => {
  return http.request<Result<LmGameListResult>>(
    "get",
    "/backend/game/gamelist/luckmoney/list",
    { params }
  );
};

/** 取得紅包遊戲類型下拉 */

export const getLmGameTypeList = () => {
  return http.request<Result<{ list: LmGameOptionItem[] }>>(
    "get",
    "/backend/game/gamelist/luckmoney/type"
  );
};

/** 取得紅包遊戲廠商下拉 */

export const getLmGameGroupOption = () => {
  return http.request<Result<{ list: LmGameOptionItem[] }>>(
    "get",
    "/backend/game/luckmoney/gamegroup/all"
  );
};

/** 取得單筆紅包遊戲 */

export const getLmGame = (params: { id: number }) => {
  return http.request<Result<LmGameListItem>>(
    "get",
    "/backend/game/gamelist/luckmoney",
    { params }
  );
};

/** 建立紅包遊戲（舊 Vben post 的 params 實為 body，改 data） */

export const createLmGame = (data: Record<string, any>) => {
  return http.request<Result<{ id?: number }>>(
    "post",
    "/backend/game/gamelist/luckmoney",
    { data }
  );
};

/** 修改紅包遊戲（舊 Vben put 的 params 實為 body，改 data） */

export const putLmGame = (data: Record<string, any>) => {
  return http.request<Result<null>>(
    "put",
    "/backend/game/gamelist/luckmoney",
    { data }
  );
};

/** 批次修改紅包遊戲狀態 */

export const putLmGameBatchUpdate = (data: Record<string, any>) => {
  return http.request<Result<null>>(
    "put",
    "/backend/game/gamelist/luckmoney/batchUpdate",
    { data }
  );
};

// ===== games 域：首頁推薦遊戲 recommendHome 模組 =====
// 沿用舊 endpoint，函式名具描述性避免跨模組碰撞
export interface RecommendHomeItem {
  id: string | number;
  recommendedSort: number;
  gameTypeID: number;
  isTag: number;
  gameGroupID: number;
  gameGroupDisplayName: string;
  gameID: number;
  displayName: string;
  showStatus: number;
}

export interface RecommendHomeTable {
  gameTypeID: number;
  isTag: number;
  list: RecommendHomeItem[];
}

/** 取得首頁推薦遊戲列表（多張表格，每組 gameTypeID + isTag 一張） */

export const getRecommendHomeList = () => {
  return http.request<Result<{ list: RecommendHomeTable[] }>>(
    "get",
    "/backend/game/homepage"
  );
};

/** 編輯首頁推薦遊戲（PUT body） */

export const editRecommendHome = (data: {
  id: string | number;
  recommendedSort: number;
  gameGroupID: string | number;
  gameID: string | number;
  showStatus: number | string;
}) => {
  return http.request<Result<any>>("put", "/backend/game/homepage", { data });
};

/** 取得遊戲類型清單（key/value） */

export const getRecommendHomeGameType = () => {
  return http.request<Result<{ list: Array<{ key: number; value: string }> }>>(
    "get",
    "/backend/game/gamelist/type"
  );
};

/** 取得遊戲廠商清單（依 gameTypeID 過濾） */

export const getRecommendHomeGameGroups = (params: {
  gameTypeID: string | number;
}) => {
  return http.request<Result<{ list: Array<{ id: number; displayName: string }>; total: number }>>(
    "get",
    "/backend/game/gamegroup/list",
    { params }
  );
};

/** 取得遊戲清單（依 gameGroupID 過濾，沿用舊 page/pageSize 預設） */

export const getRecommendHomeGameList = (params: {
  gameGroupID: string | number;
  page?: number;
  pageSize?: number;
}) => {
  if (!params.page) params.page = 1;
  if (!params.pageSize) params.pageSize = 9999;
  return http.request<Result<{ list: Array<{ id: number; displayName: string }>; total: number }>>(
    "get",
    "/backend/game/gamelist/list",
    { params }
  );
};

// ===== 游戏联赛 logo 列表（games/leagueList） =====
export interface GameLeagueItem {
  id: number;
  leagueID: number;
  leagueName: string;
  sportName: string;
  /** 联赛 logo 相对路径 */
  leagueLogo: string;
  updatedAt: string;
  updateUser: string;
}

/** 取得联赛列表（沿用旧 endpoint，GET） */

export const getGameLeagueList = (params?: object) => {
  return http.request<Result<{ list: GameLeagueItem[]; total: number }>>(
    "get",
    "/backend/game/game_group_league_list",
    { params }
  );
};

/** 编辑联赛 logo（沿用旧 endpoint，PUT；旧 Vben 的 params 实为 body，故用 data） */

export const editGameLeague = (data: { id: number; logoImage: string }) => {
  return http.request<Result>("put", "/backend/game/game_group_league_list", {
    data
  });
};

/** 共用图片上传（沿用旧 /file/file/upload，回传 { url }） */

export const uploadLeagueLogo = (data: FormData) => {
  return http.request<Result<{ url: string }>>("post", "/file/file/upload", {
    data
  });
};

// ===== 乐享游戏注单 lmGameLog =====
export interface LmGameLogItem {
  memberID: number;
  memberAccount: string;
  gameAccount: string;
  gameListName: string;
  gameListID: number;
  betID: string;
  totalBetAmount: number;
  backendBetAmount: number;
  eventTurnover: number;
  returnBetAmount: number;
  winAmount: number;
  settlementAmount: number;
  betTimeLocal: string;
  settlementTimeLocal: string;
  betTime: string;
  settlementTime: string;
  betLogStatus: number;
  odds: number;
  oddsType: number;
  response: string;
  betItem: string;
}

export interface LmGameLogTotal {
  count?: number;
  totalBetAmount?: number;
  backendBetAmount?: number;
  eventTurnover?: number;
  returnBetAmount?: number;
  winAmount?: number;
  settlementAmount?: number;
  [key: string]: number | undefined;
}

export interface LmGameGroupItem {
  ID: number;
  name: string;
}

/** 乐享游戏注单列表（沿用旧 endpoint，旧码以 query string 串接，统一改 params 由 http 序列化） */

export const getLmGameLogList = (params?: object) => {
  return http.request<Result<{ list: LmGameLogItem[]; total: LmGameLogTotal }>>(
    "get",
    "/backend/bettinglog/luckmoney/record",
    { params }
  );
};

/** 乐享游戏群组清单 */

export const getLmGameLogGroups = () => {
  return http.request<Result<{ list: LmGameGroupItem[] }>>(
    "get",
    "/backend/bettinglog/luckmoney/group/list"
  );
};

/** 乐享游戏清单（依群组 id；目前页面未直接使用，保留沿用旧 endpoint） */

export const getLmGameLogGames = (params: { id: number }) => {
  return http.request<Result<{ list: LmGameGroupItem[] }>>(
    "get",
    "/backend/bettinglog/luckmoney/game/list",
    { params }
  );
};

// ===== 聯賽投注記錄 leagueBetRecord =====
// 列表（沿用舊 endpoint /backend/bettinglog/league/bet/list）
// 注意：回傳 data.total 為合計物件 { totalBetAmountText, totalWinAmountText }
export function getLeagueBetList(params: any) {
  return http.request<Result<any>>(
    "get",
    "/backend/bettinglog/league/bet/list",
    { params }
  );
}

// 運動種類（game group）下拉，回傳 data.gameGroup: {id,name}[]

export function getLeagueDropdownSport() {
  return http.request<Result<any>>(
    "get",
    "/backend/game/dropdown/list/sport"
  );
}

// betting log 相關下拉（sport/league/team/betType），回傳 data.{sport,league,team,betType}: string[]

export function getLeagueDropdownBettingLog(params: any) {
  return http.request<Result<any>>(
    "get",
    "/backend/game/dropdown/list/bettingLog",
    { params }
  );
}

export interface GameTag {
  id: number;
  name: string;
}

export interface GameListItem {
  id: number;
  sort: number;
  gameGroupID: number;
  gameGroupName: string;
  gameGroupDisplayName: string;
  gameTypeID: number;
  gameTypeName: string;
  name: string;
  displayName: string;
  bettingCode?: string;
  gameCodePc?: string;
  gameCodeH5?: string;
  status: number;
  trialPlay: number;
  isReturn: number;
  isSlot: number;
  isHotGame: number;
  isNewGame: number;
  recommendedSort: number;
  imageH5?: string;
  imagePc?: string;
  screenShotH5?: string;
  screenShotPc?: string;
  recommendedImageH5?: string;
  gameTags?: GameTag[];
}

/** 遊戲列表（沿用舊 endpoint，預設帶 page/pageSize） */

export const getGameList = (params?: object) => {
  const query = { page: 1, pageSize: 9999, ...params };
  return http.request<Result<{ list: GameListItem[]; total: number }>>(
    "get",
    "/backend/game/gamelist/list",
    { params: query }
  );
};

/** 取得單筆遊戲 */

export const getGame = (params: { id: number | string }) => {
  return http.request<Result<GameListItem>>("get", "/backend/game/gamelist", {
    params
  });
};

/** 新增遊戲 */

export const createGame = (data: object) => {
  return http.request<Result<{ id?: number }>>(
    "post",
    "/backend/game/gamelist",
    { data }
  );
};

/** 修改遊戲 */

export const putGame = (data: object) => {
  return http.request<Result<null>>("put", "/backend/game/gamelist", { data });
};

/** 遊戲類型選項 */

export const getGameGroupOption = () => {
  return http.request<
    Result<{
      list: Array<{
        key: number;
        name: string;
        displayName: string;
        gameTypeID: number;
      }>;
    }>
  >("get", "/backend/game/gamegroup/all");
};

/** 遊戲標籤列表 */

export const getGameTagList = (params: object) => {
  return http.request<Result<{ list: GameTag[]; total: number }>>(
    "get",
    "/backend/game/tag/list",
    { params }
  );
};

/** 批次修改遊戲狀態 */

export const putGameBatchUpdate = (data: object) => {
  return http.request<Result<null>>(
    "put",
    "/backend/game/gamelist/batchupdate",
    { data }
  );
};

/** 遊戲圖片上傳 */

export const getGameLog = (params: object) => {
  return http.request<Result<{ list: any[]; total: number }>>(
    "get",
    "/backend/game/log",
    { params }
  );
};

// ===== games 域：体育集结页（recommendSportLobby）相關 =====
export interface RecommendSportItem {
  id: number | string;
  recommendedSort: number | string;
  gameGroupID: number | string;
  gameGroupDisplayName: string;
  gameID: number | string;
  displayName: string;
  showStatus: number | string;
}

/** 取得体育游戏推荐列表 */

export const getRecommendSportList = (params?: object) => {
  return http.request<Result<{ list: RecommendSportItem[]; total: number }>>(
    "get",
    "/backend/game/recommendsport",
    { params }
  );
};

/** 新增体育游戏推荐 */

export const createRecommendSport = (data: object) => {
  return http.request<Result<null>>("post", "/backend/game/recommendsport", {
    data
  });
};

/** 編輯体育游戏推荐 */

export const editRecommendSport = (data: object) => {
  return http.request<Result<null>>("put", "/backend/game/recommendsport", {
    data
  });
};

/** 刪除体育游戏推荐 */

export const deleteRecommendSport = (id: number | string) => {
  return http.request<Result<null>>(
    "delete",
    `/backend/game/recommendsport?id=${id}`
  );
};

/** 取得厂商（遊戲群組）下拉清單，供体育推荐表單使用 */

export const getRecommendSportGameGroups = (params?: object) => {
  return http.request<Result<{ list: any[]; total: number }>>(
    "get",
    "/backend/game/gamegroup/list",
    { params }
  );
};

/** 取得指定厂商底下游戏清單，供体育推荐表單連動使用 */

export const getRecommendSportGameList = (params: object) => {
  return http.request<Result<{ list: any[]; total: number }>>(
    "get",
    "/backend/game/gamelist/list",
    { params }
  );
};

// ===== games / gameLog 投注紀錄 =====
// 投注紀錄列表（沿用舊 endpoint /backend/bettinglog/record；舊碼以 query string 串參數，這裡用 params）
export function getGameLogList(params: any) {
  return http.request<Result<any>>("get", "/backend/bettinglog/record", {
    params,
    // 列表查詢量大，沿用舊碼 30 秒逾時
    timeout: 30 * 1000
  } as any);
}

// 廠商下拉

export function getGameLogGroupList(params?: any) {
  return http.request<Result<any>>("get", "/backend/bettinglog/group/list", {
    params
  });
}

// 遊戲下拉

export function getGameLogGameList(params?: any) {
  return http.request<Result<any>>("get", "/backend/bettinglog/game/list", {
    params
  });
}

// 廠商結果頁明細連結 params: { gameGroup, betId }

export function getGameLogDetailLink(params: any) {
  return http.request<Result<any>>("get", "/game/bo/result/detaillink", {
    params
  });
}

// ===== 紅包遊戲代理商（lmGameAgency）=====
export interface LuckmoneyGameAgencyItem {
  id: number;
  name: string;
  /** 旗下廠商 */
  gameGroups: string[];
  /** 代理遊戲類型 */
  gameLists: string[];
  /** 狀態：1 開啟 / 2 關閉 / 3 維護中 / 4 隱藏 */
  status: number;
}

/** 遊戲類型下拉項目 */

export interface GameListTypeItem {
  key: number | string;
  value: string;
}

/** 取得紅包遊戲代理商列表 */

export const getLuckmoneyGameAgencyList = (params?: object) => {
  return http.request<Result<{ list: LuckmoneyGameAgencyItem[]; total: number }>>(
    "get",
    "/backend/game/luckmoney/gameagency/list",
    { params }
  );
};

/** 修改紅包遊戲代理商（沿用舊 Vben put body 慣例 → data） */

export const putLuckmoneyGameAgency = (data?: object) => {
  return http.request<Result<null>>(
    "put",
    "/backend/game/luckmoney/gameagency",
    { data }
  );
};

/** 取得遊戲類型下拉 */

// ===== games 域：gameType 模組 =====
// 沿用舊 endpoint：GET/PUT /backend/game/game_type；上傳 /file/file/upload
export interface GameTypeItem {
  id: number | string;
  name: string;
  second_name: string;
  sort: number | string;
  refund: number | string;
  is_recommended: number;
  is_tag_recommended: number;
  is_show: number;
  dynamic: number;
  display: string;
  icon: string;
  icon_color: string;
  icon_color2: string;
}

/** 遊戲類型列表（無分頁參數，後端一次回全部） */

export const getGameTypeList = () => {
  return http.request<Result<{ list: GameTypeItem[]; total: number }>>(
    "get",
    "/backend/game/game_type"
  );
};

/** 編輯遊戲類型（put 整筆，欄位名沿用舊前端送出格式） */

export const putGameType = (data: {
  id: number | string;
  display: string;
  name: string;
  secondName: string;
  sort: number | string;
  refund: number | string;
  isRecommended: number;
  isTagRecommended: number;
  isShow: number;
  dynamic: number;
  icon: string;
  iconColor: string;
  iconColor2: string;
}) => {
  return http.request<Result<any>>("put", "/backend/game/game_type", { data });
};

/** 遊戲類型圖檔上傳（FormData：type=game, file） */

export const fileUploadGameType = (data: FormData) => {
  return http.request<Result<{ url: string }>>(
    "post",
    "/file/file/upload",
    { data }
  );
};

// ====== games 域：gameGroup 模組（沿用舊 endpoint）======
// 注意：Result<T> 與 http 由 api 檔頭統一提供，勿重複宣告
export type GameGroupOptionItem = { key: number | string; value: string };

export interface GameGroupItem {
  id: number;
  name: string;
  displayName: string;
  sort: number;
  gameAgencyName: string;
  walletType: number;
  gameType: { id: number | string; name: string };
  openWayPc: number;
  openWayH5: number;
  platformFeeRatio: number | string;
  bettingFrom?: number;
  imageH5: string;
  imagePc: string;
  logoImage: string;
  logoImage2: string;
  imgRecommend1: string;
  status: number;
  ishow: number;
}

interface GameGroupsListRes {
  list: GameGroupItem[];
  total: number;
}

interface OptionListRes {
  list: GameGroupOptionItem[];
}

/** 取得遊戲廠商 list（舊：getGameGroups） */

export const getGameGroups = (params?: object) =>
  http.request<Result<GameGroupsListRes>>(
    "get",
    "/backend/game/gamegroup/list",
    { params }
  );

/** 取得單筆遊戲廠商細節（舊：getGameGroup） */

export const getGameGroup = (params: { id: number | string }) =>
  http.request<Result<any>>("get", "/backend/game/gamegroup", { params });

/** 修改遊戲廠商（舊：putGameGroup，Vben put params 為 body → 改 data） */

export const putGameGroup = (data?: object) =>
  http.request<Result<any>>("put", "/backend/game/gamegroup", { data });

/** 取得遊戲代理商選單（舊：getGameAgencyOption） */

export const getGameAgencyOption = () =>
  http.request<Result<OptionListRes>>("get", "/backend/game/gameagency/all");

/** 取得遊戲類型選單（舊：getGameListType，原在 api/game/gamelist.ts） */

export const getConfigSportEventRecommendGroupId = () =>
  http.request<Result<any>>(
    "get",
    "/backend/config/sporteventrecommendgroupid"
  );

/** 修改賽事推薦設定（舊：putConfigSportEventRecommendGroupId，put params → data） */

export const putConfigSportEventRecommendGroupId = (data?: object) =>
  http.request<Result<any>>(
    "put",
    "/backend/config/sporteventrecommendgroupid",
    { data }
  );

/** 取得廠商操作紀錄（舊：getGameLog，type=1，原在 api/systemManage） */

export const getGameGroupLog = (params: { type: number; ID: number | string }) =>
  http.request<Result<{ list: any[]; total: number }>>("get", "/backend/game/log", {
    params
  });

/** 上傳廠商圖片（舊：fileUploadGameGroup，post params 為 body → data） */

export const fileUploadGameGroup = (data: FormData) =>
  http.request<Result<{ url: string }>>("post", "/file/file/upload/gamegroup", {
    data
  });

// ===== games tag 模組 =====
// 遊戲類型下拉項
export interface GameTagTypeItem {
  key: string | number;
  value: string;
}

// Tag 列表項

export interface GameTagItem {
  id: number | string;
  name: string;
  sort?: number;
  isLeftShow?: boolean;
  tagImg?: string;
  tagIcon?: string;
}

/** 取得遊戲類型下拉（沿用舊 endpoint /backend/game/gamelist/type） */

export const getGameTagTypeList = () => {
  return http.request<Result<{ list: GameTagTypeItem[]; total?: number }>>(
    "get",
    "/backend/game/gamelist/type"
  );
};

/** 取得 Tag 列表 */

export const createGameTag = (data?: object) => {
  return http.request<Result<null>>("post", "/backend/game/tag/create", {
    data
  });
};

/** 修改 Tag（舊 Vben put 的 params 實為 body，轉成 data） */

export const updateGameTag = (data?: object) => {
  return http.request<Result<null>>("put", "/backend/game/tag/update", {
    data
  });
};

/** 刪除 Tag（舊端點以 query string ?id= 傳入） */

export const deleteGameTag = (id: number | string) => {
  return http.request<Result<null>>("delete", "/backend/game/tag/delete", {
    params: { id }
  });
};

// ===== 幸運金遊戲廠商（lmGameGroup）相關 =====
export interface LmGameGroupRow {
  id: number;
  name: string;
  displayName: string;
  sort: number;
  gameAgencyID?: number;
  gameAgencyName: string;
  walletType: number;
  gameType: { id: number; name: string };
  openWayPc: number;
  openWayH5: number;
  platformFeeRatio: string | number;
  status: number;
  maintainTime?: string;
  gameListID?: string;
  gameListIDTurnover?: number;
}

/** 取得幸運金遊戲廠商列表（沿用舊 endpoint /backend/game/luckmoney/gamegroup/list） */

export const getLuckmoneyGameGroups = (params?: object) => {
  return http.request<Result<{ list: LmGameGroupRow[]; total: number }>>(
    "get",
    "/backend/game/luckmoney/gamegroup/list",
    { params }
  );
};

/** 取得幸運金遊戲代理商選單（/backend/game/luckmoney/gameagency/all） */

export const getLuckmoneyGameAgencyOption = () => {
  return http.request<Result<{ list: Array<{ key: any; value: string }> }>>(
    "get",
    "/backend/game/luckmoney/gameagency/all"
  );
};

/** 修改幸運金遊戲廠商（舊為 defHttp.put({url,params})，params 實為 body → 轉 {data}） */

export const putLuckmoneyGameGroup = (data?: object) => {
  return http.request<Result<null>>("put", "/backend/game/luckmoney/gamegroup", {
    data
  });
};

/** 取得遊戲類型清單（/backend/game/gamelist/type） */

export const getLuckmoneyGameList = (params: Record<string, any>) => {
  if (!params.page) params.page = 1;
  if (!params.pageSize) params.pageSize = 9999;
  return http.request<Result<{ list: Array<{ id: number; name: string }>; total: number }>>(
    "get",
    "/backend/game/gamelist/list",
    { params }
  );
};

/** 取得幸運金操作紀錄（舊 getLuckMoneyLog，/backend/game/luckmoney/log） */

export const getLuckMoneyLog = (params: { type: number; ID: number }) => {
  return http.request<Result<{ list: Array<{ updatedAt: string; updatedUser: string; action: string; content: string }> }>>(
    "get",
    "/backend/game/luckmoney/log",
    { params }
  );
};
