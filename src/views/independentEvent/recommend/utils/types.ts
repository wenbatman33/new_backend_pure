/** 推荐有礼活动设定页型别 */

/** 活动一奖金阶层 */
export interface Event1BonusItem {
  /** 推荐人数 */
  people: number | string;
  /** 奖金 */
  bonus: number | string;
}

/** 反水设定项（依游戏类型） */
export interface RebateItem {
  gameType: string | number;
  rebate: number | string;
}

/** 设定页设定资料 */
export interface RecommendConfig {
  /** 活动是否开启 */
  isRun: boolean;
  /** 活动二上限 */
  event2UpperLimit: number;
  /** 活动一奖金清单 */
  event1BonusList: Event1BonusItem[];
  /** 活动二反水（阶层一） */
  event2Rebate1: RebateItem[];
  /** 活动二反水（阶层二） */
  event2Rebate2: RebateItem[];
  /** 活动二反水（阶层三） */
  event2Rebate3: RebateItem[];
  /** 活动一是否显示 */
  event1IsShow: boolean;
  /** 活动二是否显示 */
  event2IsShow: boolean;
}

/** 游戏类型选项 */
export interface GameTypeOption {
  label: string;
  value: string | number;
}

/** 设定区表单 */
export interface ConfigFormProps {
  isRun: boolean;
  event2UpperLimit: number;
  event1IsShow: boolean;
  event2IsShow: boolean;
}
