import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 风控机器人配置（设定页，单一物件）
const botConfig = {
  // 产品投注人数监测
  productMembersLTEnable: true,
  productMembersLTMembers: 50,
  productMembersLTTimes: 3,
  productMembersBetweenEnable: false,
  productMembersBetweenGTEMembers: 50,
  productMembersBetweenLTMembers: 100,
  productMembersBetweenTimes: 2,
  productMembersBTEEnable: true,
  productMembersBTEMembers: 100,
  productMembersBTETimes: 5,
  // 注册人数监测
  registerCountWeek1Enable: true,
  registerCountWeek1Times: 2,
  registerCountWeek2Enable: false,
  registerCountWeek2Times: 3,
  // 总优惠人数监测
  promotionReceivedCountWeek1Enable: true,
  promotionReceivedCountWeek1Times: 2,
  promotionReceivedCountWeek2Enable: false,
  promotionReceivedCountWeek2Times: 4,
  // 提款机器人指定条件
  withdrawalTagRiskConditionEnable: true,
  withdrawalRiskConditionFee: 0.06,
  withdrawalRiskConditionDepositRatio: 0.8,
  withdrawalTooHighEnable: true,
  withdrawalTooHighMultiple: 3,
  withdrawalTooHighMultipleWithdrawalAmount: 5000,
  withdrawalCountEnable: false,
  withdrawalCount: 1,
  withdrawalCountFee: 0.06,
  withdrawalCountTotalDepositRatio: 0.8,
  profitAndLossEnable: true,
  profitAndLossDays: 7,
  withdrawalAmountEnable: true,
  withdrawalAmount: 100000,
  withdrawalNoDepositEnable: false,
  withdrawalNoDepositDays: "30",
  withdrawalWinEnable: true,
  withdrawalWinDays: "1",
  withdrawalWinAmount: "50000",
  withdrawalGameTypeEnable: true,
  withdrawalGameType: "1,2",
  // 平台盈利设置
  memberProfitEnable: true,
  memberProfitAmount: 200000,
  // 转移异常监测
  gameTransferMonitorEnable: false,
  gameTransferMonitorAmount: 100000
};

export default defineFakeRoute([
  {
    url: "/backend/bot/config",
    method: "get",
    response: () => ({ success: true, data: botConfig })
  },
  {
    url: "/backend/bot/config",
    method: "put",
    response: ({ body }) => {
      Object.assign(botConfig, body ?? {});
      return { success: true, data: botConfig };
    }
  }
]);
