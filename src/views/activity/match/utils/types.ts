interface FormItemProps {
  id?: number;
  /** 赛事时间 */
  eventTime: string;
  /** 联赛 */
  league: number | string;
  /** 客队 */
  awayTeam: number | string;
  awayScore?: string | number;
  awayResult?: string;
  /** 主队 */
  homeTeam: number | string;
  homeScore?: string | number;
  homeResult?: string;
  /** 赛事进度 */
  matchType?: number;
  /** 分组 */
  matchGroup?: number;
  /** 抢红包活动：1 是 / 0 否 */
  redPacket: number;
  /** 抢红包开始时间 */
  redPacketStartTime?: string;
  /** 抢红包结束时间 */
  redPacketEndTime?: string;
  eventId?: string;
  /** 备注 */
  remark?: string;
}

interface FormProps {
  formInline: FormItemProps;
  /** 队伍下拉（依联赛取得） */
  teamOptions: Array<{ label: string; value: string | number }>;
  /** 联赛下拉 */
  leagueOptions: Array<{ label: string; value: string | number }>;
  /** 联赛切换时重新取队伍 */
  onLeagueChange?: (league: number | string) => void;
}

export type { FormItemProps, FormProps };
