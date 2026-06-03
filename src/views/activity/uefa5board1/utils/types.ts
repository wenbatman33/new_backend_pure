// UEFA5 board1 賽事積分榜列項
interface Uefa5Board1Item {
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

export type { Uefa5Board1Item };
