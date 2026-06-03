import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 玩家畫像監控設定（單物件）mock，欄位名與 hook extractPortraitConfig 一致
const botConfig: Record<string, any> = {
  // 關聯帳號
  portraitDeviceEnable: true,
  portraitDeviceMonths: 3,
  portraitIPEnable: true,
  portraitIPMonths: 3,
  // 登入監控
  onlineLoginTimeEnable: true,
  onlineLoginTime: 6,
  onlineLoginRangeEnable: true,
  onlineLoginRange: 10,
  onlineLoginRangeCount: 5,
  onlineDayTimeEnable: false,
  onlineDayTime: 12,
  loginRiskIPChinaExceptEnable: false,
  loginRiskIPSettingEnable: true,
  loginRiskIPSetting: [
    { area: "海南", note: "高风险地区" },
    { area: "澳门", note: "博彩地区" }
  ],
  // 對沖監測
  hedgingLiveContextAEnabled: true,
  hedgingLiveContextBEnabled: false,
  hedgingSportContextBEnabled: false,
  hedgingLiveMinBetAmount: 100,
  hedgingLivePassMemberTags: "1,2",
  hedgingLiveCoefficientPerfect: 0.95,
  hedgingLiveCoefficientPartial: 0.8,
  // 投注行為
  monitorSportCornersEnable: true,
  monitorSportCornersDay: 7,
  monitorSportCornersPercent: 60,
  monitorSportCornersPercentRemove: 40,
  monitorSportCorrectScoreEnable: true,
  monitorSportCorrectScoreDay: 7,
  monitorSportCorrectScorePercent: 50,
  monitorSportCorrectScorePercentRemove: 30,
  monitorSportComboEnable: false,
  monitorSportComboDay: 7,
  monitorSportComboPercent: 50,
  monitorSportComboTotalBet: 100,
  monitorSportComboTotalBetAmount: 50000,
  monitorSportComboPercentRemove: 30,
  monitorSportInPlayEnable: true,
  monitorSportInPlayDay: 7,
  monitorSportInPlayPercent: 60,
  monitorSportInPlayPercentRermove: 40,
  monitorSportInPlayTotalBet: 100,
  monitorSportInPlayTotalBetAmount: 50000,
  monitorSportEarlyEnable: true,
  monitorSportEarlyDay: 7,
  monitorSportEarlyPercent: 60,
  monitorSportEarlyPercentRemove: 40,
  monitorSportEarlyTotalBet: 100,
  monitorSportEarlyTotalBetAmount: 50000,
  monitorSportMixEnable: false,
  monitorSportMixDay: 7,
  monitorSportMixInPlayPercent: 40,
  monitorSportMixEarlyPercent: 40,
  monitorSportMixBothLowPercent: 30,
  monitorSportMixTotalBet: 100,
  monitorSportMixTotalBetAmount: 50000,
  monitorSportMixAnyoneHigherPercentRemove: 60,
  monitorSportMixBothHigherPercentRemove: 50,
  monitorSportNonSoccerBasketballEnable: true,
  monitorSportNonSoccerBasketballDay: 7,
  monitorSportNonSoccerBasketballPercent: 50,
  monitorSportNonSoccerBasketballPercentRemove: 30,
  monitorSportBasketballQuarterEnable: false,
  monitorSportBasketballQuarterDay: 7,
  monitorSportBasketballQuarterPercent: 50,
  monitorSportBasketballQuarterPercentRemove: 30,
  monitorSportBasketballQuarterTotalBet: 100,
  monitorSportBasketballQuarterTotalBetAmount: 50000,
  monitorSportLowOddsEnable: true,
  monitorSportLowOddsDay: 7,
  monitorSportLowOddsWAOAdd: 1.5,
  monitorSportLowOddsWAORemove: 2,
  monitorSportLowOddsTotalBet: 100,
  monitorSportLowOddsTotalBetAmount: 50000,
  monitorSportHighOddsEnable: true,
  monitorSportHighOddsDay: 7,
  monitorSportHighOddsWAOAdd: 3,
  monitorSportHighOddsWAORemove: 2.5,
  monitorSportHighOddsTotalBet: 100,
  monitorSportHighOddsTotalBetAmount: 50000,
  // 風控相關
  monitorSportNonIntBetEnable: true,
  monitorSportNonIntBetDay: 7,
  monitorSportNonIntBetPercent: 50,
  monitorSportSameBetItemEnable: false,
  monitorSportSameBetItemDay: 7,
  monitorSportSameBetItemCount: 3,
  monitorSportSameBetItemPercent: 50,
  monitorSportSameBetItemReplenishEnable: false,
  monitorSportSameBetItemReplenishDay: 7,
  monitorSportSameBetItemReplenishCount: 3,
  monitorSportSameBetItemReplenishMultiple: 2,
  monitorSportSameBetItemReplenishMinAmount: 100,
  monitorSportSameBetItemReplenishPercent: 50,
  monitorSportBetRejectEnable: true,
  monitorSportBetRejectDay: 7,
  monitorSportBetRejectPercent: 25,
  monitorSportGroupBetSuspectedEnable: true,
  monitorSportGroupBetSuspectedDay: 7,
  monitorSportGroupBetSuspectedPeople: 3,
  monitorSportGroupBetSuspectedMinute: 30,
  monitorSportGroupBetSuspectedOtherMatch: 3,
  monitorSportGroupBetEnable: true,
  monitorSportGroupBetDay: 7,
  monitorSportGroupBetPeople: 1,
  monitorSportGroupBetMinute: 30,
  monitorSportGroupBetOtherMatch: 3,
  monitorWeekdaysBetEnable: true,
  monitorWeekdaysBetDay: 30,
  monitorWeekdaysBetPercent: 70,
  monitorHolidayBetEnable: true,
  monitorHolidayBetDay: 30,
  monitorHolidayBetPercent: 70,
  monitorPcUserEnable: true,
  monitorPcUserDay: 30,
  monitorPcUserPercent: 70,
  monitorH5UserEnable: true,
  monitorH5UserDay: 30,
  monitorH5UserPercent: 70,
  monitorProfitEnable: true,
  monitorProfitDay: 14,
  monitorNetProfitDay: 10,
  monitorProfitKill: 8,
  // 團體&工作室
  tagScoreEnable: true,
  tagScoreThreshold: 50,
  tagScoreItems: [
    { tagID: 1, score: 20 },
    { tagID: 2, score: 30 }
  ]
};

const tagList = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  name: `标签${i + 1}`,
  color: "#409eff",
  groupID: (i % 3) + 1
}));

const tagGroupList = Array.from({ length: 3 }).map((_, i) => ({
  id: i + 1,
  name: `标签组${i + 1}`
}));

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
      Object.assign(botConfig, body || {});
      return { success: true, data: botConfig };
    }
  },
  {
    url: "/backend/member/tag/tags",
    method: "get",
    response: () => ({ success: true, data: { list: tagList, total: tagList.length } })
  },
  {
    url: "/backend/member/tag/groups",
    method: "get",
    response: () => ({
      success: true,
      data: { list: tagGroupList, total: tagGroupList.length }
    })
  }
]);
