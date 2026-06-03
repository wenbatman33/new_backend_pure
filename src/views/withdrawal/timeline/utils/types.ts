/** 单笔下注明细 */
interface BetItem {
  game_list_id: number | string;
  gameGroupDisplayName: string;
  gameGroupName: string;
  typeName: string;
  typeSecondName: string;
  betAmount: number | string;
  winAmount: number | string;
  withdrawalTurnover: number | string;
  vipTurnover: number | string;
  eventTurnover: number | string;
}

/** 时间轴右侧明细区块 */
interface TimelineRight {
  startTime: string;
  endTime: string;
  bets: BetItem[];
}

/** 时间轴单笔节点 */
interface TimelineItem {
  useTypeID: number;
  color: string;
  beforeMoney: number | string;
  adjustMoney: number | string;
  afterMoney: number | string;
  turnoverMultiple: number | string;
  turnoverLimit: number | string;
  note: string;
  right: TimelineRight;
}

/** 用途类型对应 */
interface UseTypeItem {
  useTypeID: number;
  useTypeName: string;
  useTypeEnName: string;
}

export type { BetItem, TimelineRight, TimelineItem, UseTypeItem };
