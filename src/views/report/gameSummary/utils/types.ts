/** 游戏厂商下拉选项 */
interface GameGroupOption {
  label: string;
  value: string | number;
  name?: string;
}

/** 报表查询条件 */
interface SearchFormProps {
  /** 报表日期：开始 */
  start: string;
  /** 报表日期：结束 */
  end: string;
  /** 游戏厂商 ID */
  gameGroupID: string | number;
}

/** 手动补流水表单 */
interface ReCalcFormItemProps {
  /** 补流水厂商 */
  module: string | number;
  /** 开始时间 */
  startTime: string;
  /** 结束时间 */
  endTime: string;
}

interface ReCalcFormProps {
  formInline: ReCalcFormItemProps;
  gameGroupList: GameGroupOption[];
}

/** 厂商流水帐设定表单 */
interface BettingLogFormItemProps {
  id?: number;
  /** 游戏厂商 ID */
  gameGroupID: string | number;
  /** 流水帐设定 */
  timeColumn: string;
  /** 纪录状态 */
  statusFilter: number | "";
}

interface BettingLogFormProps {
  formInline: BettingLogFormItemProps;
  gameGroupList: GameGroupOption[];
}

export type {
  GameGroupOption,
  SearchFormProps,
  ReCalcFormItemProps,
  ReCalcFormProps,
  BettingLogFormItemProps,
  BettingLogFormProps
};
