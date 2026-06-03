interface QuizItem {
  id: number;
  eventTime: string;
  homeTeamName: string;
  awayTeamName: string;
  info?: string;
  league: number;
  status: number;
  startTime: string;
  endTime: string;
  quizMember: number;
  updatedUser: string;
  updatedAt: string;
}

/** 編輯/新增竞猜表單欄位 */
interface FormItemProps {
  /** 賽程 ID（新增時用） */
  id?: number;
  /** 竞猜紀錄 ID（編輯時用） */
  quizId?: number;
  /** 賽事資訊（唯讀顯示） */
  info: string;
  /** 联赛名稱（唯讀顯示） */
  leagueName: string;
  /** 賽事時間 */
  eventTime: string;
  /** 竞猜开始时间 */
  startTime: string;
  /** 竞猜结束时间 */
  endTime: string;
  /** 是否显示：1 显示 / 0 隐藏 */
  status: number;
}

interface FormProps {
  formInline: FormItemProps;
  /** 模式：create / edit */
  mode: "create" | "edit";
}

export type { QuizItem, FormItemProps, FormProps };
