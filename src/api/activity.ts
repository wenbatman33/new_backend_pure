import { http } from "@/utils/http";

/** 後端統一回應格式 */
type Result<T = any> = {
  success: boolean;
  data: T;
};


// ===== 世界杯竞猜会员名单（activity/quizList 使用，沿用旧 worldcup endpoint）=====
// 竞猜会员名单项
export interface QuizMemberItem {
  id: number;
  memberId: number;
  memberAccount: string;
  createdAt: string;
  awayQuiz: string | number;
  homeQuiz: string | number;
  worldCupScheduleId: number;
}

// 取竞猜会员参与名单（旧：getQuizMemberList -> GET /backend/world_cup/quiz/member）

export const getQuizMemberList = (params?: object) => {
  return http.request<Result<{ list: QuizMemberItem[]; total: number }>>(
    "get",
    "/backend/world_cup/quiz/member",
    { params }
  );
};

// 取队伍清单（旧：getTeam -> GET /backend/world_cup/team）

export const getWorldCupTeam = (params?: object) => {
  return http.request<Result<{ list: any[]; total: number }>>(
    "get",
    "/backend/world_cup/team",
    { params }
  );
};

// 取赛程清单（旧：getScheduleList -> GET /backend/world_cup/schedule/list）

export const getWorldCupScheduleList = (params?: object) => {
  return http.request<Result<{ list: any[]; total: number }>>(
    "get",
    "/backend/world_cup/schedule/list",
    { params }
  );
};

// ===== activity 域：recommended 模組（推荐活动 - 被推荐人报表）=====
// enum 沿用舊 endpoint 字串；若同域已有 ApiList，請把成員合併進去勿重複宣告。
enum ActivityApiList {
  recommended = "/backend/event/inviter2023/recommended"
}

// 被推荐人列表行

export interface RecommendedItem {
  account: string;
  memberID: number;
  isCardBinding: boolean;
  cardBindingDate: string;
  firstDepositAmount: number | string;
  firstDepositDate: string;
  depositAmount: number | string;
  withdrawAmount: number | string;
  eventTurnover: number | string;
  winLoseAmount: number | string;
  registerDate: string;
  lastLoginAt: string;
}

// 報表查詢參數

export interface RecommendedParams {
  recommenderID: number;
  reportType: string; // d 日 / w 週 / m 月
  startDate: string;
  endDate: string;
  account?: string;
}

// 取得被推荐人报表（含 summary 合計）

export const getRecommended = (params: RecommendedParams) => {
  return http.request<
    Result<{
      list: RecommendedItem[];
      total: number;
      summary: {
        firstDepositAmount: number | string;
        depositAmount: number | string;
        withdrawAmount: number | string;
        eventTurnover: number | string;
        winLoseAmount: number | string;
      };
    }>
  >("get", ActivityApiList.recommended, { params });
};

// ===== event0054 推薦人活動報表 =====
export interface Event0054RecommenderItem {
  memberID: number | string;
  account: string;
  friendTotal: number;
  friend: number;
  depositPeople: number;
  depositAmount: number | string;
  betPeople: number;
  eventTurnover: number | string;
  withdrawPeople: number;
  eventBonus: number | string;
}

export interface Event0054RecommenderParams {
  recommenderAccount?: string;
  startDate?: string;
  endDate?: string;
}

/** 取得 event0054 推薦人活動報表（沿用舊 endpoint GET /backend/event/event0054/recommender） */

export const getEvent0054Recommender = (params?: Event0054RecommenderParams) => {
  return http.request<Result<{ list: Event0054RecommenderItem[]; total: number }>>(
    "get",
    "/backend/event/event0054/recommender",
    { params }
  );
};

export interface MatchScheduleItem {
  id: number;
  eventTime: string;
  league: number | string;
  matchType?: number;
  matchGroup?: number;
  awayTeam?: number | string;
  homeTeam?: number | string;
  awayTeamName?: string;
  homeTeamName?: string;
  awayScore?: number | string;
  homeScore?: number | string;
  redPacket: number;
  redPacketStartTime?: string;
  redPacketEndTime?: string;
  remark?: string;
  updatedUser?: string;
  updatedAt?: string;
  eventId?: string;
}

interface ListData<T> {
  list: T[];
  total: number;
}

/** 赛程列表 */

export const getMatchScheduleList = (params?: object) =>
  http.request<Result<ListData<MatchScheduleItem>>>(
    "get",
    "/backend/match/schedule/list",
    { params }
  );

/** 赛程明细（依 id） */

export const getMatchScheduleById = (id: number | string) =>
  http.request<Result<MatchScheduleItem>>("get", "/backend/match/schedule", {
    params: { id }
  });

/** 新增赛程 */

export const createMatchSchedule = (data: object) =>
  http.request<Result<null>>("post", "/backend/match/schedule", { data });

/** 编辑赛程 */

export const editMatchSchedule = (data: object) =>
  http.request<Result<null>>("put", "/backend/match/schedule", { data });

/** 删除赛程（依 id） */

export const deleteMatchScheduleById = (id: number | string) =>
  http.request<Result<null>>(
    "delete",
    `/backend/match/schedule?id=${id}`
  );

/** 联赛清单（赛程用） */

export const getMatchLeagueScheduleList = (params?: object) =>
  http.request<Result<{ list: Array<{ league: number; name: string; isActive: number }> }>>(
    "get",
    "/backend/league_schedule/list",
    { params }
  );

/** 队伍清单（依联赛，沿用 world_cup/team） */

export const getMatchTeamList = (params?: object) =>
  http.request<Result<{ list: Array<{ id: number; team: string }> }>>(
    "get",
    "/backend/world_cup/team",
    { params }
  );

// ===== UEFA 5 大聯賽看板 board2（uefa5board2） =====
// 沿用舊 endpoint：GET/POST /backend/match/uefa5/board2、GET /backend/league_schedule/list
export type Uefa5Board2Item = {
  worldCupTeamId: number;
  league: number;
  team: string;
  rank: number;
  matchTimes: number;
  over: number;
  draw: number;
  under: number;
  overPercent: number;
  drawPercent: number;
  underPercent: number;
  updatedUser: string;
  updatedAt: string;
};

export type Uefa5Board2ListResult = Result<{
  list: Uefa5Board2Item[];
  total: number;
}>;

/** 取得 UEFA5 board2 球隊列表 */

export const getUefa5Board2List = (params?: object) => {
  return http.request<Uefa5Board2ListResult>(
    "get",
    "/backend/match/uefa5/board2",
    { params }
  );
};

/** 批次儲存 UEFA5 board2 球隊資料（舊 Vben post 的 params 實為 body → 轉 data） */

export const updateUefa5Board2 = (data?: object) => {
  return http.request<Result>("post", "/backend/match/uefa5/board2", { data });
};

/** 聯賽賽程清單（供聯賽下拉，沿用舊 getLeagueScheduleList） */

export const getLeagueScheduleList = (params?: object) => {
  return http.request<
    Result<{
      list: { league: number; name: string; isActive: number }[];
    }>
  >("get", "/backend/league_schedule/list", { params });
};

export interface ReferListItem {
  /** 被推薦會員 ID */
  memberID: number;
  /** 被推薦會員帳號 */
  memberAccount: string;
  /** 推薦人會員 ID */
  recommenderID: number;
  /** 推薦人帳號 */
  recommenderAccount: string;
  /** 推薦碼 */
  recommendCode: string;
  /** 建立時間 */
  createdTime: string;
}

/** 推薦名單查詢參數 */

export interface ReferListParams {
  memberAccount?: string;
  recommenderAccount?: string;
  startTime?: string;
  endTime?: string;
}

/** 推薦名單列表（活動 - 推薦名單，沿用舊 endpoint /backend/recommend/list） */

export const getReferList = (params?: ReferListParams) => {
  return http.request<Result<{ list: ReferListItem[]; total: number }>>(
    "get",
    "/backend/recommend/list",
    { params }
  );
};

// ===== 世界盃 worldcup（沿用舊 endpoint /backend/world_cup/*）=====
export interface WorldcupTeamItem {
  id: number;
  team: string;
}

export interface WorldcupScheduleItem {
  id: number;
  eventTime: string;
  matchType: number; // 1 小组赛 / 2 淘汰赛
  matchGroup: number;
  awayTeam: number | string;
  homeTeam: number | string;
  awayScore: number | string;
  homeScore: number | string;
  awayResult: number | string;
  homeResult: number | string;
  awayDiffer: number | string;
  homeDiffer: number | string;
  awayPoint: number | string;
  homePoint: number | string;
  status: number; // 1 未开始 / 2 进行中 / 3 完赛 / 4 取消
  isRed: number; // 1 Y / 2 N
  eventId: string;
  updatedUser: string;
  updatedAt: string;
}

/** 世界盃-隊伍列表 */

export const getWorldcupTeam = (params?: object) => {
  return http.request<Result<{ list: WorldcupTeamItem[]; total: number }>>(
    "get",
    "/backend/world_cup/team",
    { params }
  );
};

/** 世界盃-賽程列表 */

export const getWorldcupScheduleList = (params?: object) => {
  return http.request<Result<{ list: WorldcupScheduleItem[]; total: number }>>(
    "get",
    "/backend/world_cup/schedule/list",
    { params }
  );
};

/** 世界盃-賽程明細（依 id） */

export const getWorldcupScheduleById = (id: number) => {
  return http.request<Result<WorldcupScheduleItem>>(
    "get",
    "/backend/world_cup/schedule",
    { params: { id } }
  );
};

/** 世界盃-新增賽程（舊 post params 即 body → data） */

export const createWorldcupSchedule = (data: object) => {
  return http.request<Result<null>>("post", "/backend/world_cup/schedule", {
    data
  });
};

/** 世界盃-編輯賽程（舊 put params 即 body → data） */

export const editWorldcupSchedule = (data: object) => {
  return http.request<Result<null>>("put", "/backend/world_cup/schedule", {
    data
  });
};

/** 世界盃-刪除賽程（舊碼 url 帶 ?id=，改用 params） */

export const deleteWorldcupScheduleById = (id: number) => {
  return http.request<Result<null>>("delete", "/backend/world_cup/schedule", {
    params: { id }
  });
};

// ==== 竞猜（quiz）相關，沿用舊 endpoint /backend/match/quiz/* ====
export interface QuizListItem {
  id: number;
  eventTime: string;
  homeTeamName: string;
  awayTeamName: string;
  league: number;
  status: number;
  startTime: string;
  endTime: string;
  quizMember: number;
  updatedUser: string;
  updatedAt: string;
}

/** 竞猜列表 */

export const getQuizList = (params?: object) => {
  return http.request<Result<{ list: QuizListItem[]; total: number }>>(
    "get",
    "/backend/match/quiz/list",
    { params }
  );
};

/** 切換竞猜顯示/隱藏狀態（body: { id, status }） */

export const editQuizStatus = (data: { id: number; status: number }) => {
  return http.request<Result<null>>("put", "/backend/match/quiz/status", {
    data
  });
};

/** 新增竞猜（body: { matchScheduleID, startTime, endTime, status }） */

export const createQuiz = (data: object) => {
  return http.request<Result<null>>("post", "/backend/match/quiz/create", {
    data
  });
};

/** 編輯竞猜（body: { id, startTime, endTime, status }） */

export const editQuiz = (data: object) => {
  return http.request<Result<null>>("put", "/backend/match/quiz/edit", {
    data
  });
};

export interface LeagueScheduleItem {
  id: number;
  name: string;
  league: number;
  startTime: string;
  endTime: string;
  eventTime?: string;
  isActive: number;
}

/** 取得聯賽賽程列表 */

export function postLeagueSchedule(data: {
  name: string;
  league: number | null;
  isActive: number;
  startTime: string;
  endTime: string;
}) {
  return http.request<Result<null>>("post", "/backend/league_schedule", { data });
}

/** 更新聯賽賽程（舊 Vben put 的 params 實為 body） */

export function putLeagueSchedule(data: {
  id?: number;
  name: string;
  league: number | null;
  isActive: number;
  startTime: string;
  endTime: string;
}) {
  return http.request<Result<null>>("put", "/backend/league_schedule", { data });
}

// ===== 戰情文章 matchNews 模組（沿用舊 /backend/match/news 與相關 endpoint） =====
// 注意：舊 Vben post/put 的 params 實為 body，已轉為 { data }；get/delete 用 { params }。
const MATCH_NEWS = "/backend/match/news";

/** 戰情文章列表 */

export const getMatchNewsList = (params: any) =>
  http.request<Result<{ list: any[]; total: number }>>("get", `${MATCH_NEWS}/list`, { params });

/** 依 id 取單筆戰情文章 */

export const getMatchNewsById = (id: number) =>
  http.request<Result<any>>("get", MATCH_NEWS, { params: { id } });

/** 新增戰情文章 */

export const createMatchNews = (data: any) =>
  http.request<Result<any>>("post", MATCH_NEWS, { data });

/** 編輯戰情文章 */

export const editMatchNews = (data: any) =>
  http.request<Result<any>>("put", MATCH_NEWS, { data });

/** 刪除戰情文章（舊碼以 query string 帶 id） */

export const deleteMatchNewsById = (id: number) =>
  http.request<Result<any>>("delete", `${MATCH_NEWS}?id=${id}`);

/** 切換顯示/隱藏狀態 */

export const editMatchNewsStatusById = (id: number) =>
  http.request<Result<any>>("put", `${MATCH_NEWS}/status`, { data: { id } });

/** 球隊清單（世界盃 team，編輯時 awayId/homeId 轉名稱用） */

// ===== activity / streaming（賽事直播串流，沿用舊 worldcup live endpoint）=====
export interface StreamingLiveItem {
  id: number;
  eventTime: string;
  matchType: number;
  matchGroup: number;
  awayTeam: number | string;
  homeTeam: number | string;
  isLiveLabel: number; // 1 是 / 2 否
  isLive: number; // 1 是 / 2 否
  link: string[];
  updatedUser: string;
  updatedAt: string;
  worldCupScheduleId?: number;
  game?: string;
  info?: string;
}

/** 直播列表 */

export const getStreamingLiveList = (params?: object) =>
  http.request<Result<{ list: StreamingLiveItem[]; total: number }>>(
    "get",
    "/backend/world_cup/live/list",
    { params }
  );

/** 單筆直播詳情（依 worldCupScheduleId） */

export const getStreamingLiveById = (id: number) =>
  http.request<Result<StreamingLiveItem>>("get", "/backend/world_cup/live", {
    params: { worldCupScheduleId: id }
  });

/** 編輯直播（body：worldCupScheduleId / isLive / isLiveLabel / link[]） */

export const editStreamingLive = (data: object) =>
  http.request<Result<null>>("put", "/backend/world_cup/live", { data });

/** 刪除直播（query 帶 worldCupScheduleId） */

export const deleteStreamingLiveById = (id: number) =>
  http.request<Result<null>>("delete", "/backend/world_cup/live", {
    params: { worldCupScheduleId: id }
  });

/** 球隊清單（用於拼湊賽事名稱） */

export const getStreamingTeam = (params: object = {}) =>
  http.request<Result<{ list: { id: number; team: string }[]; total: number }>>(
    "get",
    "/backend/world_cup/team",
    { params }
  );

// 推荐人报表（活动 inviter2023）
// 沿用旧 endpoint：GET /backend/event/inviter2023/recommender
export interface RecommenderReportItem {
  memberID: number | string;
  account: string;
  recommendedCount: number;
  activeCount: number;
  bindingCount: number;
  newCount: number;
  firstDepositCount: number;
  depositCount: number;
  depositAmount: number;
  withdrawCount: number;
  withdrawAmount: number;
  eventTurnover: number;
  winLoseAmount: number;
  bonus: number;
}

export interface RecommenderReportData {
  list: RecommenderReportItem[];
  total: number;
  summary: Partial<RecommenderReportItem>;
}

/** 推荐人报表（日/周/月 + 推荐人帐号 区间查询） */

export const getRecommenderReport = (params: {
  reportType: string;
  startDate: string;
  endDate: string;
  account?: string;
}) => {
  return http.request<Result<RecommenderReportData>>(
    "get",
    "/backend/event/inviter2023/recommender",
    { params }
  );
};

// ===== 新聞（activity/news）=====
export type NewsItem = {
  id: number;
  title: string;
  category: number; // 1 新聞 / 2 紅單推薦
  status: number | boolean; // 0 隱藏 / 1 顯示（後端以布林回傳/接收）
  startTime: string; // 上架時間
  endTime: string; // 下架時間
  hot: boolean;
  top: boolean;
  betSetting: boolean;
  eventId: number | string;
  image: string;
  context: string; // HTML 內文
  updatedAt: string;
  updatedUser: string;
};

export type NewsListResult = Result<{
  list: NewsItem[];
  total: number;
}>;

/** 新聞列表 */

export const getNewsList = (params?: object) => {
  return http.request<NewsListResult>("get", "/backend/news/list", { params });
};

/** 新聞詳情 */

export const getNewsDetail = (id: number | string) => {
  return http.request<Result<NewsItem>>("get", "/backend/news/detail", {
    params: { id }
  });
};

/** 新增新聞（舊 defHttp.post({url, params}) 的 params 實為 body → 轉 data） */

export const postNews = (data?: object) => {
  return http.request<Result>("post", "/backend/news", { data });
};

/** 編輯新聞（舊 defHttp.put({url, params}) 的 params 實為 body → 轉 data） */

export const putNews = (data?: object) => {
  return http.request<Result>("put", "/backend/news", { data });
};

/** 刪除新聞（舊碼 url 帶 ?id=，改用 params 由攔截器組 query） */

export const deleteNews = (id: number | string) => {
  return http.request<Result>("delete", "/backend/news", { params: { id } });
};

// ===== event0054 推薦活動：被推薦會員列表 =====
// 沿用舊 endpoint：/backend/event/event0054/recommended
export type Event0054RecommendedItem = {
  memberID: number;
  account: string;
  depositAmount: number | string;
  eventTurnover: number | string;
  withdrawAmount: number | string;
  registerAt: string;
  lastLoginAt: string;
};

export type Event0054RecommendedResult = Result<{
  list: Event0054RecommendedItem[];
  total: number;
}>;

/** 取得 event0054 被推薦會員列表（GET 查詢條件走 params） */

export function getEvent0054Recommended(params?: object) {
  return http.request<Event0054RecommendedResult>(
    "get",
    "/backend/event/event0054/recommended",
    { params }
  );
}

// ===== UEFA5 board1 賽事積分榜（沿用舊 endpoint）=====
export interface Uefa5Board1Item {
  worldCupTeamId: number;
  year: number | string;
  league: number;
  matchType: number;
  matchGroup: number;
  team: string;
  rank: number;
  matchTimes: number;
  win: number;
  tie: number;
  lose: number;
  difference: number;
  winPercent: number;
  score: number;
  drawPercent?: number;
  updatedUser?: string;
  updatedAt?: string;
}

export interface Uefa5LeagueScheduleItem {
  league: number;
  name: string;
  isActive: number;
  eventTime?: string;
}

/** 取得 UEFA5 board1 積分榜列表 GET /backend/match/uefa5/board1 */

export const getUefa5Board1List = (params?: object) =>
  http.request<Result<{ list: Uefa5Board1Item[]; total: number }>>(
    "get",
    "/backend/match/uefa5/board1",
    { params }
  );

/** 批次更新 UEFA5 board1 積分榜 POST /backend/match/uefa5/board1（舊 Vben post 的 params 即 body） */

export const updateUefa5Board1 = (data: { league: number; list: Uefa5Board1Item[] }) =>
  http.request<Result<null>>("post", "/backend/match/uefa5/board1", { data });

/** 取得聯賽 schedule 下拉 GET /backend/league_schedule/list */

export const getUefa5LeagueScheduleList = (params?: object) =>
  http.request<Result<{ list: Uefa5LeagueScheduleItem[]; total: number }>>(
    "get",
    "/backend/league_schedule/list",
    { params }
  );

// ====== 世界杯竞猜 quiz_world_cup（沿用舊 worldcup endpoint）======
export interface WorldCupQuizItem {
  id: number;
  worldCupScheduleId: number;
  status: number; // 1 显示 / 2 隐藏
  startTime: string;
  endTime: string;
  worldCupQuizMemberCnt: number;
  updatedUser: string;
  updatedAt: string;
  // 由赛程对照动态补上
  game?: string;
  eventTime?: string;
  info?: string;
}

/** 竞猜列表 GET /backend/world_cup/quiz/list */

export const getWorldCupQuizList = (params?: object) => {
  return http.request<Result<{ list: WorldCupQuizItem[]; total: number }>>(
    "get",
    "/backend/world_cup/quiz/list",
    { params }
  );
};

/** 单笔竞猜 GET /backend/world_cup/quiz?id= */

export const getWorldCupQuizById = (id: number) => {
  return http.request<Result<WorldCupQuizItem>>("get", "/backend/world_cup/quiz", {
    params: { id }
  });
};

/** 编辑竞猜（开始/结束时间）PUT /backend/world_cup/quiz */

export const editWorldCupQuiz = (data: object) => {
  return http.request<Result<any>>("put", "/backend/world_cup/quiz", { data });
};

/** 切换显示/隐藏 PUT /backend/world_cup/quiz/status */

export const editWorldCupQuizStatus = (data: object) => {
  return http.request<Result<any>>("put", "/backend/world_cup/quiz/status", {
    data
  });
};

/** 队伍清单 GET /backend/world_cup/team */

// event0054 階層報表（被推薦人三階流水/人數/派發獎勵）。沿用舊 endpoint /backend/event/event0054/hierarchy
// 注意：同域 event0054 系列共用此 endpoint 前綴，函式名稱以模組化命名避免碰撞。
export interface Event0054HierarchyItem {
  memberID: number | string;
  account: string;
  people1: number;
  eventTurnover1: number;
  eventBonus1: number;
  people2: number;
  eventTurnover2: number;
  eventBonus2: number;
  people3: number;
  eventTurnover3: number;
  eventBonus3: number;
}

/** event0054 階層報表查詢（支援 recommenderAccount 搜尋與 orderBy 1~6 / order ascend|descend 排序） */

export const getEvent0054Hierarchy = (params?: object) => {
  return http.request<Result<{ list: Event0054HierarchyItem[]; total: number }>>(
    "get",
    "/backend/event/event0054/hierarchy",
    { params }
  );
};
