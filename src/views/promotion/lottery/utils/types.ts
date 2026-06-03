// 抢红包(进球抢红包)模組型別

/** 奖励项目 */
interface BonusItem {
  amount: number | string;
  percent: number | string;
}

/** 检查条件(verifyData)项目 */
interface VerifyDataItem {
  verifyType: number; // 1 存款金额 / 2 有效流水 / 3 投注指定关键字联赛
  verifyAmount: number;
  leagueID?: string;
}

/** 列表列 */
interface LotteryItem {
  id: number;
  name: string;
  eventTime: string;
  status: number; // 1 进行中 / 2 待启用 / 3 已结束 / 4 即将启用
  time: number; // 抢红包时长(分钟)
  people: number; // 发送人数
  sendTime: string; // 启用时间
  updatedUser: string; // 最后执行人
}

/** 表单资料(新增/编辑/查看共用) */
interface FormItemProps {
  id?: number;
  name: string;
  eventTime: string;
  time: number | string; // 抢红包时长
  amountMax: number | string; // 派发总金额上限
  peopleMax: number | string; // 派发总人数上限
  verifyType: number[]; // 检查条件勾选项
  verifyAmount: string; // 存款金额
  verifyAmount2: string; // 有效流水
  leagueID: string[]; // 投注指定关键字联赛
  withdrawLimit: number | string; // 流水倍数
  bonusList: BonusItem[]; // 奖励列表
  matchScheduleTimesEnabled: boolean; // 是否启用单场赛事限制
  matchScheduleTimes: number | string; // 抢红包次数上限
  matchScheduleId: number | string; // 指定赛程ID
  websocketDeeplinkLink: string; // 抢红包演出方式 1/2
  websocketTitle: string; // 广播内容
  websocketImaage: string; // 广播图(沿用旧拼字)
  mode: string; // create / update / read
}

interface FormProps {
  formInline: FormItemProps;
}

export type {
  BonusItem,
  VerifyDataItem,
  LotteryItem,
  FormItemProps,
  FormProps
};
