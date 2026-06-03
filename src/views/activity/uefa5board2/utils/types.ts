interface Uefa5Board2Row {
  /** 球隊 ID（主鍵） */
  worldCupTeamId: number;
  /** 聯賽代碼 */
  league: number;
  /** 球隊名稱 */
  team: string;
  /** 排名 */
  rank: number;
  /** 賽（場次） */
  matchTimes: number;
  /** 大球 */
  over: number;
  /** 走 */
  draw: number;
  /** 小球 */
  under: number;
  /** 大球％ */
  overPercent: number;
  /** 走％ */
  drawPercent: number;
  /** 小球％ */
  underPercent: number;
  /** 最後執行人 */
  updatedUser: string;
  /** 最後更新時間 */
  updatedAt: string;
}

/** 聯賽下拉選項 */
interface LeagueOption {
  label: string;
  value: number | string;
}

export type { Uefa5Board2Row, LeagueOption };
