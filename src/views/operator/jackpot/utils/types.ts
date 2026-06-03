/** 假 Jackpot 設定表單欄位 */
interface JackpotSettingProps {
  /** Jackpot 初始值區間 - 下限 */
  min: string;
  /** Jackpot 初始值區間 - 上限 */
  max: string;
  /** 每次跳動頻率（秒） */
  cycle: string;
  /** 每次跳動金額區間 - 下限 */
  min_cycle: string;
  /** 每次跳動金額區間 - 上限 */
  max_cycle: string;
}

export type { JackpotSettingProps };
