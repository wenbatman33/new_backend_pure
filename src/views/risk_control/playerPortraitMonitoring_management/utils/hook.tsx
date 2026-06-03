import { ref, onMounted } from "vue";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import { hasAuth } from "@/router/utils";
import {
  getBotConfig,
  setBotConfig,
  getTagList,
  getTagGroupList
} from "@/api/risk_control";
import type { PortraitConfig, TagScoreItem } from "./types";

// 解析數字（容許字串、% 號）
function parseTagScoreNumber(value: any, defaultValue: any = 0) {
  if (value === null || typeof value === "undefined" || value === "") {
    return defaultValue;
  }
  if (typeof value === "string") {
    value = value.replace("%", "");
  }
  const numberValue = Number(value);
  return Number.isNaN(numberValue) ? defaultValue : numberValue;
}

function normalizeTagScoreItems(items: any): TagScoreItem[] {
  if (typeof items === "string") {
    try {
      items = JSON.parse(items);
    } catch {
      items = [];
    }
  }
  if (!Array.isArray(items)) return [];
  return items.map(item => ({
    tagID: parseTagScoreNumber(item.tagID, undefined) || undefined,
    score: parseTagScoreNumber(item.score)
  }));
}

// 從完整設定抽取玩家畫像監控相關欄位（與舊版 extractPortraitConfig 一致）
function extractPortraitConfig(fullConfig: any): PortraitConfig {
  const f = fullConfig || {};
  return {
    portraitDeviceEnable: f.portraitDeviceEnable,
    portraitDeviceMonths: f.portraitDeviceMonths,
    portraitIPEnable: f.portraitIPEnable,
    portraitIPMonths: f.portraitIPMonths,
    onlineLoginTimeEnable: f.onlineLoginTimeEnable,
    onlineLoginTime: f.onlineLoginTime,
    onlineLoginRangeEnable: f.onlineLoginRangeEnable,
    onlineLoginRange: f.onlineLoginRange,
    onlineLoginRangeCount: f.onlineLoginRangeCount,
    onlineDayTimeEnable: f.onlineDayTimeEnable,
    onlineDayTime: f.onlineDayTime,
    loginRiskIPChinaExceptEnable: f.loginRiskIPChinaExceptEnable,
    loginRiskIPSettingEnable: f.loginRiskIPSettingEnable,
    loginRiskIPSetting: f.loginRiskIPSetting,
    monitorSportCornersEnable: f.monitorSportCornersEnable,
    monitorSportCornersDay: f.monitorSportCornersDay,
    monitorSportCornersPercent: f.monitorSportCornersPercent,
    monitorSportCornersPercentRemove: f.monitorSportCornersPercentRemove,
    monitorSportCorrectScoreEnable: f.monitorSportCorrectScoreEnable,
    monitorSportCorrectScoreDay: f.monitorSportCorrectScoreDay,
    monitorSportCorrectScorePercent: f.monitorSportCorrectScorePercent,
    monitorSportCorrectScorePercentRemove: f.monitorSportCorrectScorePercentRemove,
    monitorSportComboEnable: f.monitorSportComboEnable,
    monitorSportComboDay: f.monitorSportComboDay,
    monitorSportComboPercent: f.monitorSportComboPercent,
    monitorSportComboTotalBet: f.monitorSportComboTotalBet,
    monitorSportComboTotalBetAmount: f.monitorSportComboTotalBetAmount,
    monitorSportComboPercentRemove: f.monitorSportComboPercentRemove,
    monitorSportInPlayEnable: f.monitorSportInPlayEnable,
    monitorSportInPlayDay: f.monitorSportInPlayDay,
    monitorSportInPlayPercent: f.monitorSportInPlayPercent,
    monitorSportInPlayPercentRermove: f.monitorSportInPlayPercentRermove,
    monitorSportInPlayTotalBet: f.monitorSportInPlayTotalBet,
    monitorSportInPlayTotalBetAmount: f.monitorSportInPlayTotalBetAmount,
    monitorSportEarlyEnable: f.monitorSportEarlyEnable,
    monitorSportEarlyDay: f.monitorSportEarlyDay,
    monitorSportEarlyPercent: f.monitorSportEarlyPercent,
    monitorSportEarlyPercentRemove: f.monitorSportEarlyPercentRemove,
    monitorSportEarlyTotalBet: f.monitorSportEarlyTotalBet,
    monitorSportEarlyTotalBetAmount: f.monitorSportEarlyTotalBetAmount,
    monitorSportMixEnable: f.monitorSportMixEnable,
    monitorSportMixDay: f.monitorSportMixDay,
    monitorSportMixInPlayPercent: f.monitorSportMixInPlayPercent,
    monitorSportMixEarlyPercent: f.monitorSportMixEarlyPercent,
    monitorSportMixBothLowPercent: f.monitorSportMixBothLowPercent,
    monitorSportMixTotalBet: f.monitorSportMixTotalBet,
    monitorSportMixTotalBetAmount: f.monitorSportMixTotalBetAmount,
    monitorSportMixAnyoneHigherPercentRemove: f.monitorSportMixAnyoneHigherPercentRemove,
    monitorSportMixBothHigherPercentRemove: f.monitorSportMixBothHigherPercentRemove,
    monitorSportNonSoccerBasketballEnable: f.monitorSportNonSoccerBasketballEnable,
    monitorSportNonSoccerBasketballDay: f.monitorSportNonSoccerBasketballDay,
    monitorSportNonSoccerBasketballPercent: f.monitorSportNonSoccerBasketballPercent,
    monitorSportNonSoccerBasketballPercentRemove:
      f.monitorSportNonSoccerBasketballPercentRemove,
    monitorSportBasketballQuarterEnable: f.monitorSportBasketballQuarterEnable,
    monitorSportBasketballQuarterDay: f.monitorSportBasketballQuarterDay,
    monitorSportBasketballQuarterPercent: f.monitorSportBasketballQuarterPercent,
    monitorSportBasketballQuarterPercentRemove:
      f.monitorSportBasketballQuarterPercentRemove,
    monitorSportBasketballQuarterTotalBet: f.monitorSportBasketballQuarterTotalBet,
    monitorSportBasketballQuarterTotalBetAmount:
      f.monitorSportBasketballQuarterTotalBetAmount,
    monitorSportLowOddsEnable: f.monitorSportLowOddsEnable,
    monitorSportLowOddsDay: f.monitorSportLowOddsDay,
    monitorSportLowOddsWAOAdd: f.monitorSportLowOddsWAOAdd,
    monitorSportLowOddsWAORemove: f.monitorSportLowOddsWAORemove,
    monitorSportLowOddsTotalBet: f.monitorSportLowOddsTotalBet,
    monitorSportLowOddsTotalBetAmount: f.monitorSportLowOddsTotalBetAmount,
    monitorSportHighOddsEnable: f.monitorSportHighOddsEnable,
    monitorSportHighOddsDay: f.monitorSportHighOddsDay,
    monitorSportHighOddsWAOAdd: f.monitorSportHighOddsWAOAdd,
    monitorSportHighOddsWAORemove: f.monitorSportHighOddsWAORemove,
    monitorSportHighOddsTotalBet: f.monitorSportHighOddsTotalBet,
    monitorSportHighOddsTotalBetAmount: f.monitorSportHighOddsTotalBetAmount,
    monitorSportGroupBetSuspectedEnable: f.monitorSportGroupBetSuspectedEnable ?? true,
    monitorSportGroupBetSuspectedDay: f.monitorSportGroupBetSuspectedDay ?? 7,
    monitorSportGroupBetSuspectedPeople: f.monitorSportGroupBetSuspectedPeople ?? 3,
    monitorSportGroupBetSuspectedMinute: f.monitorSportGroupBetSuspectedMinute ?? 30,
    monitorSportGroupBetSuspectedOtherMatch:
      f.monitorSportGroupBetSuspectedOtherMatch ?? 3,
    monitorSportGroupBetEnable: f.monitorSportGroupBetEnable ?? true,
    monitorSportGroupBetDay: f.monitorSportGroupBetDay ?? 7,
    monitorSportGroupBetPeople: f.monitorSportGroupBetPeople ?? 1,
    monitorSportGroupBetMinute: f.monitorSportGroupBetMinute ?? 30,
    monitorSportGroupBetOtherMatch: f.monitorSportGroupBetOtherMatch ?? 3,
    monitorProfitEnable: f.monitorProfitEnable ?? true,
    monitorProfitDay: f.monitorProfitDay ?? 14,
    monitorNetProfitDay: f.monitorNetProfitDay ?? 10,
    monitorProfitKill: f.monitorProfitKill ?? 8,
    monitorSportNonIntBetEnable: f.monitorSportNonIntBetEnable,
    monitorSportNonIntBetDay: f.monitorSportNonIntBetDay,
    monitorSportNonIntBetPercent: f.monitorSportNonIntBetPercent,
    monitorSportSameBetItemEnable: f.monitorSportSameBetItemEnable,
    monitorSportSameBetItemDay: f.monitorSportSameBetItemDay,
    monitorSportSameBetItemCount: f.monitorSportSameBetItemCount,
    monitorSportSameBetItemPercent: f.monitorSportSameBetItemPercent,
    monitorSportSameBetItemReplenishEnable: f.monitorSportSameBetItemReplenishEnable,
    monitorSportSameBetItemReplenishDay: f.monitorSportSameBetItemReplenishDay,
    monitorSportSameBetItemReplenishCount: f.monitorSportSameBetItemReplenishCount,
    monitorSportSameBetItemReplenishMultiple: f.monitorSportSameBetItemReplenishMultiple,
    monitorSportSameBetItemReplenishMinAmount:
      f.monitorSportSameBetItemReplenishMinAmount,
    monitorSportSameBetItemReplenishPercent: f.monitorSportSameBetItemReplenishPercent,
    monitorSportBetRejectEnable: f.monitorSportBetRejectEnable ?? true,
    monitorSportBetRejectDay: f.monitorSportBetRejectDay ?? 7,
    monitorSportBetRejectPercent: f.monitorSportBetRejectPercent ?? 25,
    monitorWeekdaysBetEnable: f.monitorWeekdaysBetEnable ?? true,
    monitorWeekdaysBetDay: f.monitorWeekdaysBetDay ?? 30,
    monitorWeekdaysBetPercent: f.monitorWeekdaysBetPercent ?? 70,
    monitorHolidayBetEnable: f.monitorHolidayBetEnable ?? true,
    monitorHolidayBetDay: f.monitorHolidayBetDay ?? 30,
    monitorHolidayBetPercent: f.monitorHolidayBetPercent ?? 70,
    monitorPcUserEnable: f.monitorPcUserEnable ?? true,
    monitorPcUserDay: f.monitorPcUserDay ?? 30,
    monitorPcUserPercent: f.monitorPcUserPercent ?? 70,
    monitorH5UserEnable: f.monitorH5UserEnable ?? true,
    monitorH5UserDay: f.monitorH5UserDay ?? 30,
    monitorH5UserPercent: f.monitorH5UserPercent ?? 70,
    hedgingLiveContextAEnabled: f.hedgingLiveContextAEnabled,
    hedgingLiveContextBEnabled: f.hedgingLiveContextBEnabled,
    hedgingLiveCoefficientPerfect: f.hedgingLiveCoefficientPerfect,
    hedgingLiveCoefficientPartial: f.hedgingLiveCoefficientPartial,
    hedgingLiveMinBetAmount: f.hedgingLiveMinBetAmount,
    hedgingLivePassMemberTags: f.hedgingLivePassMemberTags,
    hedgingSportContextBEnabled: f.hedgingSportContextBEnabled,
    tagScoreEnable: f.tagScoreEnable ?? false,
    tagScoreThreshold: f.tagScoreThreshold ?? 50,
    tagScoreItems: normalizeTagScoreItems(f.tagScoreItems)
  };
}

export function usePlayerPortraitMonitoring() {
  // 是否唯讀（無編輯權限時禁用所有輸入）
  const isPermission = !hasAuth("__btn_edit_risk_bot");

  const botConfig = ref<PortraitConfig>({});
  const loading = ref(true);
  const status = ref(false);

  // TAG 選項（標籤多選用）
  const tagGroupOptions = ref<any[]>([]);
  const tagOptionsAll = ref<any[]>([]);

  // ---- IP 地區設定 ----
  function addIPSetting() {
    if (!botConfig.value.loginRiskIPSetting) botConfig.value.loginRiskIPSetting = [];
    botConfig.value.loginRiskIPSetting.push({ area: "", note: "" });
  }
  function removeIPSetting(index: number) {
    const arr = botConfig.value.loginRiskIPSetting;
    if (arr && arr.length > 1) arr.splice(index, 1);
  }

  // ---- Tag 分數對照 ----
  function addTagScoreItem() {
    if (!botConfig.value.tagScoreItems) botConfig.value.tagScoreItems = [];
    botConfig.value.tagScoreItems.push({ tagID: undefined, score: 0 });
  }
  function removeTagScoreItem(index: number) {
    const arr = botConfig.value.tagScoreItems;
    if (arr && arr.length > 1) arr.splice(index, 1);
  }
  function ensureTagScoreItems() {
    if (
      !botConfig.value.tagScoreItems ||
      botConfig.value.tagScoreItems.length === 0
    ) {
      botConfig.value.tagScoreItems = [{ tagID: undefined, score: 0 }];
    }
  }

  async function loadConfig() {
    loading.value = true;
    try {
      const { data } = await getBotConfig();
      botConfig.value = extractPortraitConfig(data);
      // hedgingLivePassMemberTags 後端為逗號字串，前端轉陣列
      const tags = botConfig.value.hedgingLivePassMemberTags;
      botConfig.value.hedgingLivePassMemberTags =
        typeof tags === "string" && tags ? tags.split(",") : [];
      if (
        !botConfig.value.loginRiskIPSetting ||
        botConfig.value.loginRiskIPSetting.length === 0
      ) {
        botConfig.value.loginRiskIPSetting = [{ area: "", note: "" }];
      }
      ensureTagScoreItems();
    } finally {
      loading.value = false;
    }
  }

  async function handleSave() {
    if (isPermission) return;
    status.value = true;
    try {
      // 取得最新完整設定，避免覆蓋其他設定
      const { data: latestFull } = await getBotConfig();
      const payload: any = { ...latestFull, ...botConfig.value };
      if (Array.isArray(payload.hedgingLivePassMemberTags)) {
        payload.hedgingLivePassMemberTags =
          payload.hedgingLivePassMemberTags.join(",");
      }
      payload.tagScoreItems = normalizeTagScoreItems(payload.tagScoreItems).filter(
        item => item.tagID
      );
      payload.tagScoreThreshold = Number(payload.tagScoreThreshold) || 50;
      const { success } = await setBotConfig(payload);
      // 重新載入
      await loadConfig();
      if (success) {
        message($t("risk_control.updateSuccess"), { type: "success" });
      }
    } finally {
      status.value = false;
    }
  }

  onMounted(async () => {
    // TODO: 舊版用 AddTagSelect 元件（未移植），此處改以 el-select + tagOptionsAll 簡化
    try {
      const [{ data: groups }, { data: tags }] = await Promise.all([
        getTagGroupList(),
        getTagList()
      ]);
      tagGroupOptions.value = groups?.list ?? [];
      tagOptionsAll.value = tags?.list ?? [];
    } catch {
      tagGroupOptions.value = [];
      tagOptionsAll.value = [];
    }
    await loadConfig();
  });

  return {
    isPermission,
    botConfig,
    loading,
    status,
    tagGroupOptions,
    tagOptionsAll,
    addIPSetting,
    removeIPSetting,
    addTagScoreItem,
    removeTagScoreItem,
    handleSave
  };
}
