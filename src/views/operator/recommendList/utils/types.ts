interface RecommendListItem {
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

/** 推薦上架時間設定表單 */
interface FormItemProps {
  /** 賽事 ID */
  id: number;
  /** 主隊 */
  homeTeam: string;
  /** 客隊 */
  awayTeam: string;
  /** 比賽時間（唯讀顯示） */
  eventTime: string;
  /** 上架開始時間 */
  recommendStartTime: string;
  /** 上架結束時間 */
  recommendEndTime: string;
  /** 推薦項目（多選）：1 賽前投注 / 2 直播賽事 */
  recommendItem: number[];
}

interface FormProps {
  formInline: FormItemProps;
}

export type { RecommendListItem, FormItemProps, FormProps };
