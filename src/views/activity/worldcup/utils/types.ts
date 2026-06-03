interface FormItemProps {
  id?: number;
  /** 賽事時間 */
  eventTime: string;
  /** 進球搶紅包活動：1 開 / 2 關 */
  isRed: number;
  /** 狀態：1 未開始 / 2 進行中 / 3 完賽 / 4 取消 */
  status: number;
  /** 客隊 */
  awayTeam: number | string;
  awayScore: string | number;
  awayResult: string | number;
  awayDiffer: string | number;
  awayPoint: string | number;
  /** 主隊 */
  homeTeam: number | string;
  homeScore: string | number;
  homeResult: string | number;
  homeDiffer: string | number;
  homePoint: string | number;
  /** 賽事進程：1 小組賽 / 2 淘汰賽 */
  matchType: number;
  /** 分組 */
  matchGroup: number;
  /** eventId */
  eventId: string;
}

interface FormProps {
  formInline: FormItemProps;
  /** 隊伍下拉選項 */
  teamData: Array<{ label: string; value: number | string }>;
}

export type { FormItemProps, FormProps };
