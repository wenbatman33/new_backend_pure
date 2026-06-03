/** 风控机器人配置 */
interface BotConfig {
  // 产品投注人数监测
  productMembersLTEnable?: boolean;
  productMembersLTMembers?: number;
  productMembersLTTimes?: number;
  productMembersBetweenEnable?: boolean;
  productMembersBetweenGTEMembers?: number;
  productMembersBetweenLTMembers?: number;
  productMembersBetweenTimes?: number;
  productMembersBTEEnable?: boolean;
  productMembersBTEMembers?: number;
  productMembersBTETimes?: number;
  // 注册人数监测
  registerCountWeek1Enable?: boolean;
  registerCountWeek1Times?: number;
  registerCountWeek2Enable?: boolean;
  registerCountWeek2Times?: number;
  // 总优惠人数监测
  promotionReceivedCountWeek1Enable?: boolean;
  promotionReceivedCountWeek1Times?: number;
  promotionReceivedCountWeek2Enable?: boolean;
  promotionReceivedCountWeek2Times?: number;
  // 提款机器人指定条件
  withdrawalTagRiskConditionEnable?: boolean;
  withdrawalRiskConditionFee?: number;
  withdrawalRiskConditionDepositRatio?: number;
  withdrawalTooHighEnable?: boolean;
  withdrawalTooHighMultiple?: number;
  withdrawalTooHighMultipleWithdrawalAmount?: number;
  withdrawalCountEnable?: boolean;
  withdrawalCount?: number;
  withdrawalCountFee?: number;
  withdrawalCountTotalDepositRatio?: number;
  profitAndLossEnable?: boolean;
  profitAndLossDays?: number;
  withdrawalAmountEnable?: boolean;
  withdrawalAmount?: number;
  withdrawalNoDepositEnable?: boolean;
  withdrawalNoDepositDays?: string;
  withdrawalWinEnable?: boolean;
  withdrawalWinDays?: string;
  withdrawalWinAmount?: string;
  withdrawalGameTypeEnable?: boolean;
  withdrawalGameType?: string;
  // 平台盈利设置
  memberProfitEnable?: boolean;
  memberProfitAmount?: number;
  // 转移异常监测
  gameTransferMonitorEnable?: boolean;
  gameTransferMonitorAmount?: number;
}

export type { BotConfig };
