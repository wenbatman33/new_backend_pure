// 提款时间设定表单结构
export interface WithdrawalTimeData {
  withdrawalTimeEnable: boolean;
  withdrawalTimeMondayStart: string;
  withdrawalTimeMondayEnd: string;
  withdrawalTimeTuesdayStart: string;
  withdrawalTimeTuesdayEnd: string;
  withdrawalTimeWednesdayStart: string;
  withdrawalTimeWednesdayEnd: string;
  withdrawalTimeThursdayStart: string;
  withdrawalTimeThursdayEnd: string;
  withdrawalTimeFridayStart: string;
  withdrawalTimeFridayEnd: string;
  withdrawalTimeSaturdayStart: string;
  withdrawalTimeSaturdayEnd: string;
  withdrawalTimeSundayStart: string;
  withdrawalTimeSundayEnd: string;
}

// 每个星期的设定列描述
export interface DayConfig {
  // i18n key（systemManage 命名空间下）
  titleKey: string;
  // 对应 WithdrawalTimeData 的起始字段名
  startField: keyof WithdrawalTimeData;
  // 对应 WithdrawalTimeData 的结束字段名
  endField: keyof WithdrawalTimeData;
}
