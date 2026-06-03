// 竞猜会员名单列表项
interface QuizMemberItem {
  id: number;
  memberId: number;
  memberAccount: string;
  createdAt: string;
  awayQuiz: string | number;
  homeQuiz: string | number;
  worldCupScheduleId: number;
  // 由赛程表关联补充的字段
  game?: string;
  eventTime?: string;
  info?: string;
}

// 赛事下拉选项
interface ScheduleOption {
  label: string;
  value: number;
}

export type { QuizMemberItem, ScheduleOption };
