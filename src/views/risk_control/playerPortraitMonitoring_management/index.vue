<script setup lang="ts">
import { usePlayerPortraitMonitoring } from "./utils/hook";
import { transformI18n as $t } from "@/plugins/i18n";

defineOptions({ name: "RiskControlPlayerPortraitMonitoringManagement" });

const {
  isPermission,
  botConfig,
  loading,
  status,
  tagOptionsAll,
  addIPSetting,
  removeIPSetting,
  addTagScoreItem,
  removeTagScoreItem,
  handleSave
} = usePlayerPortraitMonitoring();

// 區塊大標題 = 玩家畫像監測 - 子標題
const ppm = () => $t("risk_control.playerPortraitMonitoring");
</script>

<template>
  <div class="main" v-loading="loading">
    <el-card shadow="never">
      <!-- 關聯帳號 -->
      <p class="section-title">
        {{ ppm() }} - {{ $t("risk_control.relatedAccounts") }}
      </p>
      <div class="bot-section">
        <div class="bot-row">
          <el-switch v-model="botConfig.portraitDeviceEnable" disabled />
          <span class="bot-text">
            {{ $t("risk_control.deviceAssociationDetection") }}：
            <el-input
              v-model="botConfig.portraitDeviceMonths"
              :disabled="isPermission"
              class="bot-input"
            />
            {{ $t("risk_control.months") }}
          </span>
        </div>
        <div class="bot-row">
          <el-switch v-model="botConfig.portraitIPEnable" disabled />
          <span class="bot-text">
            {{ $t("risk_control.ipAssociationDetection") }}：
            <el-input
              v-model="botConfig.portraitIPMonths"
              :disabled="isPermission"
              class="bot-input"
            />
            {{ $t("risk_control.months") }}
          </span>
        </div>
      </div>

      <!-- 登入監控 -->
      <p class="section-title">
        {{ ppm() }} - {{ $t("risk_control.loginMonitoring") }}
      </p>
      <div class="bot-section">
        <div class="bot-row">
          <el-switch
            v-model="botConfig.onlineLoginTimeEnable"
            :disabled="isPermission"
          />
          <span class="bot-text">
            {{ $t("risk_control.singleLoginOnlineTime") }} ≥
            <el-input
              v-model="botConfig.onlineLoginTime"
              :disabled="isPermission"
              class="bot-input"
            />
            {{ $t("risk_control.hours") }}，{{
              $t("risk_control.judgedAsAbnormalLogin")
            }}
          </span>
        </div>
        <div class="bot-row">
          <el-switch
            v-model="botConfig.onlineLoginRangeEnable"
            :disabled="isPermission"
          />
          <span class="bot-text">
            <el-input
              v-model="botConfig.onlineLoginRange"
              :disabled="isPermission"
              class="bot-input"
            />
            {{ $t("risk_control.minutes") }}{{
              $t("risk_control.withinContinuousLogin")
            }} ≥
            <el-input
              v-model="botConfig.onlineLoginRangeCount"
              :disabled="isPermission"
              class="bot-input"
            />
            {{ $t("risk_control.times") }}（{{
              $t("risk_control.regardlessOfSuccessOrFailure")
            }}），{{ $t("risk_control.judgedAsAbnormalLogin") }}
          </span>
        </div>
        <div class="bot-row">
          <el-switch
            v-model="botConfig.onlineDayTimeEnable"
            :disabled="isPermission"
          />
          <span class="bot-text">
            {{ $t("risk_control.dailyTotalOnlineTime") }} ≥
            <el-input
              v-model="botConfig.onlineDayTime"
              :disabled="isPermission"
              class="bot-input"
            />
            {{ $t("risk_control.hours") }}，{{
              $t("risk_control.judgedAsAbnormalLogin")
            }}
          </span>
        </div>
        <div class="bot-row">
          <el-switch
            v-model="botConfig.loginRiskIPChinaExceptEnable"
            :disabled="isPermission"
          />
          <span class="bot-text">
            {{ $t("risk_control.riskArea") }}：{{
              $t("risk_control.nonChinaIP")
            }}，{{ $t("risk_control.judgedAsAbnormalLogin") }}
          </span>
        </div>
        <div class="bot-row">
          <el-switch
            v-model="botConfig.loginRiskIPSettingEnable"
            :disabled="isPermission"
          />
          <div class="bot-text">
            <p class="mb-3">
              {{ $t("risk_control.riskArea") }}：{{
                $t("risk_control.manualIPAreaSetting")
              }}，{{ $t("risk_control.judgedAsAbnormalLogin") }}
            </p>
            <div
              v-for="(item, index) in botConfig.loginRiskIPSetting"
              :key="index"
              class="flex items-center mb-2 gap-2"
            >
              <span>{{ $t("risk_control.area") }}</span>
              <el-input
                v-model="item.area"
                :disabled="isPermission"
                class="!w-[120px]"
              />
              <span>{{ $t("risk_control.note") }}</span>
              <el-input
                v-model="item.note"
                :disabled="isPermission"
                class="!w-[160px]"
              />
              <el-button
                v-if="!isPermission"
                circle
                size="small"
                @click="addIPSetting"
                >+</el-button
              >
              <el-button
                v-if="!isPermission && botConfig.loginRiskIPSetting.length > 1"
                circle
                size="small"
                @click="removeIPSetting(index)"
                >-</el-button
              >
            </div>
          </div>
        </div>
      </div>

      <!-- 對沖監測 -->
      <p class="section-title">
        {{ ppm() }} - {{ $t("risk_control.collisionMonitoring") }}
      </p>
      <div class="bot-section">
        <div class="bot-row">
          <el-switch
            v-model="botConfig.hedgingLiveContextAEnabled"
            :disabled="isPermission"
          />
          <span class="bot-text">{{
            $t("risk_control.hedgingLiveContextAEnabled")
          }}</span>
        </div>
        <div class="bot-row">
          <el-switch
            v-model="botConfig.hedgingLiveContextBEnabled"
            :disabled="isPermission"
          />
          <span class="bot-text">{{
            $t("risk_control.hedgingLiveContextBEnabled")
          }}</span>
        </div>
        <div class="bot-row">
          <el-switch
            v-model="botConfig.hedgingSportContextBEnabled"
            :disabled="isPermission"
          />
          <span class="bot-text">{{
            $t("risk_control.hedgingSportContextBEnabled")
          }}</span>
        </div>
        <div class="bot-row">
          <div class="bot-text">
            <div>{{ $t("risk_control.excludeHedgingLiveCondition") }}：</div>
            <div class="mt-3">
              <el-input
                v-model="botConfig.hedgingLiveMinBetAmount"
                :disabled="isPermission"
                class="bot-input"
              />
              {{ $t("risk_control.hedgingLiveMinBetAmount") }}
            </div>
            <div class="mt-3">{{ $t("risk_control.hedgingLiveRatio") }}</div>
            <div class="flex mt-3 items-center gap-2">
              <span>{{ $t("risk_control.hedgingLivePassMemberTags") }}</span>
              <!-- TODO: 舊版用 AddTagSelect（未移植），改以 el-select 多選 -->
              <el-select
                v-model="botConfig.hedgingLivePassMemberTags"
                multiple
                clearable
                :disabled="isPermission"
                class="!w-[260px]"
              >
                <el-option
                  v-for="tag in tagOptionsAll"
                  :key="tag.id"
                  :label="tag.name"
                  :value="tag.id"
                />
              </el-select>
            </div>
            <div class="mt-3">
              {{ $t("risk_control.hedgingLiveCoefficientPerfect") }}
              <el-input
                v-model="botConfig.hedgingLiveCoefficientPerfect"
                :disabled="isPermission"
                class="bot-input"
              />
            </div>
            <div class="mt-3">
              {{ $t("risk_control.hedgingLiveCoefficientPartial") }}
              <el-input
                v-model="botConfig.hedgingLiveCoefficientPartial"
                :disabled="isPermission"
                class="bot-input"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 投注行為 -->
      <p class="section-title">
        {{ ppm() }} - {{ $t("risk_control.bettingBehaviorMonitoring") }}
      </p>
      <div class="bot-section">
        <!-- 角球聚焦 -->
        <div class="bot-row">
          <el-switch
            v-model="botConfig.monitorSportCornersEnable"
            :disabled="isPermission"
          />
          <span class="bot-text">
            {{ $t("risk_control.sportCornerFocus") }}：
            <el-input v-model="botConfig.monitorSportCornersDay" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.days") }}
            {{ $t("risk_control.sportCornerFocusRatioReached") }}
            <el-input v-model="botConfig.monitorSportCornersPercent" :disabled="isPermission" class="bot-input" />
            %{{ $t("risk_control.sportCornerFocusAddTag") }}
            <el-input v-model="botConfig.monitorSportCornersPercentRemove" :disabled="isPermission" class="bot-input" />
            %{{ $t("risk_control.sportCornerFocusRemoveTag") }}
          </span>
        </div>
        <!-- 波膽聚焦 -->
        <div class="bot-row">
          <el-switch v-model="botConfig.monitorSportCorrectScoreEnable" :disabled="isPermission" />
          <span class="bot-text">
            {{ $t("risk_control.sportCorrectScoreFocus") }}：
            <el-input v-model="botConfig.monitorSportCorrectScoreDay" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportCorrectScoreFocusRatioReached") }}
            <el-input v-model="botConfig.monitorSportCorrectScorePercent" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportCorrectScoreFocusAddTag") }}
            <el-input v-model="botConfig.monitorSportCorrectScorePercentRemove" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportCorrectScoreFocusRemoveTag") }}
          </span>
        </div>
        <!-- 串關玩家 -->
        <div class="bot-row">
          <el-switch v-model="botConfig.monitorSportComboEnable" :disabled="isPermission" />
          <span class="bot-text">
            {{ $t("risk_control.sportComboPlayer") }}：
            <el-input v-model="botConfig.monitorSportComboDay" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportComboPlayerBetRatio") }}
            <el-input v-model="botConfig.monitorSportComboPercent" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportComboPlayerAddTag") }}
            <el-input v-model="botConfig.monitorSportComboTotalBetAmount" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportComboPlayerTotalAmount") }}
            <el-input v-model="botConfig.monitorSportComboTotalBet" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportComboPlayerRemoveTag") }}
            <el-input v-model="botConfig.monitorSportComboPercentRemove" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportComboPlayerRemoveTagEnd") }}
          </span>
        </div>
        <!-- 滾球偏好 -->
        <div class="bot-row">
          <el-switch v-model="botConfig.monitorSportInPlayEnable" :disabled="isPermission" />
          <span class="bot-text">
            {{ $t("risk_control.sportInPlayFocus") }}：
            <el-input v-model="botConfig.monitorSportInPlayDay" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportInPlayFocusDesc1") }}
            <el-input v-model="botConfig.monitorSportInPlayPercent" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportInPlayFocusDesc2") }}
            <el-input v-model="botConfig.monitorSportInPlayTotalBetAmount" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportInPlayFocusDesc3") }}
            <el-input v-model="botConfig.monitorSportInPlayTotalBet" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportInPlayFocusDesc4") }}
            <el-input v-model="botConfig.monitorSportInPlayPercentRermove" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportInPlayFocusDesc5") }}
          </span>
        </div>
        <!-- 賽前偏好 -->
        <div class="bot-row">
          <el-switch v-model="botConfig.monitorSportEarlyEnable" :disabled="isPermission" />
          <span class="bot-text">
            {{ $t("risk_control.sportEarlyFocus") }}：
            <el-input v-model="botConfig.monitorSportEarlyDay" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportEarlyFocusDesc1") }}
            <el-input v-model="botConfig.monitorSportEarlyPercent" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportEarlyFocusDesc2") }}
            <el-input v-model="botConfig.monitorSportEarlyTotalBetAmount" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportEarlyFocusDesc3") }}
            <el-input v-model="botConfig.monitorSportEarlyTotalBet" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportEarlyFocusDesc4") }}
            <el-input v-model="botConfig.monitorSportEarlyPercentRemove" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportEarlyFocusDesc5") }}
          </span>
        </div>
        <!-- 賽前＋滾球混合 -->
        <div class="bot-row">
          <el-switch v-model="botConfig.monitorSportMixEnable" :disabled="isPermission" />
          <span class="bot-text">
            {{ $t("risk_control.sportMixFocus") }}：
            <el-input v-model="botConfig.monitorSportMixDay" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportMixFocusDesc1") }}
            <el-input v-model="botConfig.monitorSportMixEarlyPercent" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportMixFocusDesc2") }}
            <el-input v-model="botConfig.monitorSportMixInPlayPercent" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportMixFocusDesc3") }}
            <el-input v-model="botConfig.monitorSportMixBothLowPercent" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportMixFocusDesc4") }}
            <el-input v-model="botConfig.monitorSportMixTotalBetAmount" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportMixFocusDesc5") }}
            <el-input v-model="botConfig.monitorSportMixTotalBet" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportMixFocusDesc6") }}
            {{ $t("risk_control.sportMixFocusDesc7") }}
            <el-input v-model="botConfig.monitorSportMixAnyoneHigherPercentRemove" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportMixFocusDesc8") }}
            <el-input v-model="botConfig.monitorSportMixBothHigherPercentRemove" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportMixFocusDesc9") }}
          </span>
        </div>
        <!-- 非足籃球玩家 -->
        <div class="bot-row">
          <el-switch v-model="botConfig.monitorSportNonSoccerBasketballEnable" :disabled="isPermission" />
          <span class="bot-text">
            {{ $t("risk_control.sportNonSoccerBasketballFocus") }}：
            <el-input v-model="botConfig.monitorSportNonSoccerBasketballDay" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportNonSoccerBasketballFocusDesc1") }}
            <el-input v-model="botConfig.monitorSportNonSoccerBasketballPercent" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportNonSoccerBasketballFocusDesc2") }}
            <el-input v-model="botConfig.monitorSportNonSoccerBasketballPercentRemove" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportNonSoccerBasketballFocusDesc3") }}
          </span>
        </div>
        <!-- 籃球單節玩法聚焦 -->
        <div class="bot-row">
          <el-switch v-model="botConfig.monitorSportBasketballQuarterEnable" :disabled="isPermission" />
          <span class="bot-text">
            {{ $t("risk_control.sportBasketballQuarterFocus") }}：
            <el-input v-model="botConfig.monitorSportBasketballQuarterDay" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportBasketballQuarterFocusDesc1") }}
            <el-input v-model="botConfig.monitorSportBasketballQuarterPercent" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportBasketballQuarterFocusDesc2") }}
            <el-input v-model="botConfig.monitorSportBasketballQuarterTotalBetAmount" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportBasketballQuarterFocusDesc3") }}
            <el-input v-model="botConfig.monitorSportBasketballQuarterTotalBet" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportBasketballQuarterFocusDesc4") }}
            <el-input v-model="botConfig.monitorSportBasketballQuarterPercentRemove" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportBasketballQuarterFocusDesc5") }}
          </span>
        </div>
        <!-- 低賠率玩法 -->
        <div class="bot-row">
          <el-switch v-model="botConfig.monitorSportLowOddsEnable" :disabled="isPermission" />
          <span class="bot-text">
            {{ $t("risk_control.sportLowOddsFocus") }}：
            <el-input v-model="botConfig.monitorSportLowOddsDay" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportLowOddsFocusDesc1") }}
            <el-input v-model="botConfig.monitorSportLowOddsTotalBet" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportLowOddsFocusDesc2") }}
            <el-input v-model="botConfig.monitorSportLowOddsTotalBetAmount" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportLowOddsFocusDesc3") }}
            <el-input v-model="botConfig.monitorSportLowOddsWAOAdd" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportLowOddsFocusDesc4") }}
            <el-input v-model="botConfig.monitorSportLowOddsWAORemove" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportLowOddsFocusDesc5") }}
          </span>
        </div>
        <!-- 高賠率玩法 -->
        <div class="bot-row">
          <el-switch v-model="botConfig.monitorSportHighOddsEnable" :disabled="isPermission" />
          <span class="bot-text">
            {{ $t("risk_control.sportHighOddsFocus") }}：
            <el-input v-model="botConfig.monitorSportHighOddsDay" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportHighOddsFocusDesc1") }}
            <el-input v-model="botConfig.monitorSportHighOddsTotalBet" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportHighOddsFocusDesc2") }}
            <el-input v-model="botConfig.monitorSportHighOddsTotalBetAmount" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportHighOddsFocusDesc3") }}
            <el-input v-model="botConfig.monitorSportHighOddsWAOAdd" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportHighOddsFocusDesc4") }}
            <el-input v-model="botConfig.monitorSportHighOddsWAORemove" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportHighOddsFocusDesc5") }}
          </span>
        </div>
      </div>

      <!-- 風控相關 -->
      <p class="section-title">
        {{ ppm() }} - {{ $t("risk_control.riskControlRelated") }}
      </p>
      <div class="bot-section">
        <!-- 非整數注單玩家 -->
        <div class="bot-row">
          <el-switch v-model="botConfig.monitorSportNonIntBetEnable" :disabled="isPermission" />
          <span class="bot-text">
            {{ $t("risk_control.sportNonIntBetPlayer") }}：
            <el-input v-model="botConfig.monitorSportNonIntBetDay" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportNonIntBetDesc1") }}
            <el-input v-model="botConfig.monitorSportNonIntBetPercent" :disabled="isPermission" class="bot-input" />
            %。
          </span>
        </div>
        <!-- 同場分筆 -->
        <div class="bot-row">
          <el-switch v-model="botConfig.monitorSportSameBetItemEnable" :disabled="isPermission" />
          <span class="bot-text">
            {{ $t("risk_control.sportSameBetItemPlayer") }}：
            <el-input v-model="botConfig.monitorSportSameBetItemDay" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportSameBetItemDesc1") }}
            <el-input v-model="botConfig.monitorSportSameBetItemCount" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportSameBetItemDesc2") }}
            <el-input v-model="botConfig.monitorSportSameBetItemPercent" :disabled="isPermission" class="bot-input" />
            ％。
          </span>
        </div>
        <!-- 同場補水 -->
        <div class="bot-row">
          <el-switch v-model="botConfig.monitorSportSameBetItemReplenishEnable" :disabled="isPermission" />
          <span class="bot-text">
            {{ $t("risk_control.sportSameBetItemReplenishPlayer") }}：
            <el-input v-model="botConfig.monitorSportSameBetItemReplenishDay" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportSameBetItemReplenishDesc1") }}
            <el-input v-model="botConfig.monitorSportSameBetItemReplenishCount" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportSameBetItemReplenishDesc2") }}
            <el-input v-model="botConfig.monitorSportSameBetItemReplenishMultiple" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportSameBetItemReplenishDesc3") }}
            {{ $t("risk_control.sportSameBetItemReplenishDesc4") }}
            <el-input v-model="botConfig.monitorSportSameBetItemReplenishMinAmount" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportSameBetItemReplenishDesc5") }}
            <el-input v-model="botConfig.monitorSportSameBetItemReplenishPercent" :disabled="isPermission" class="bot-input" />
            ％。
          </span>
        </div>
        <!-- 高拒單玩家 -->
        <div class="bot-row">
          <el-switch v-model="botConfig.monitorSportBetRejectEnable" :disabled="isPermission" />
          <span class="bot-text">
            {{ $t("risk_control.sportBetRejectPlayer") }}：
            <el-input v-model="botConfig.monitorSportBetRejectDay" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportBetRejectDesc1") }}
            <el-input v-model="botConfig.monitorSportBetRejectPercent" :disabled="isPermission" class="bot-input" />
            ％。
          </span>
        </div>
        <!-- 系統群投套利(疑似) -->
        <div class="bot-row">
          <el-switch v-model="botConfig.monitorSportGroupBetSuspectedEnable" :disabled="isPermission" />
          <span class="bot-text">
            {{ $t("risk_control.sportGroupBetSuspectedPlayer") }}：
            <el-input v-model="botConfig.monitorSportGroupBetSuspectedDay" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportGroupBetSuspectedDesc1") }}
            <el-input v-model="botConfig.monitorSportGroupBetSuspectedPeople" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportGroupBetSuspectedDesc2") }}
            <el-input v-model="botConfig.monitorSportGroupBetSuspectedMinute" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportGroupBetSuspectedDesc3") }}
            <el-input v-model="botConfig.monitorSportGroupBetSuspectedOtherMatch" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportGroupBetSuspectedDesc4") }}
          </span>
        </div>
        <!-- 系統群投套利 -->
        <div class="bot-row">
          <el-switch v-model="botConfig.monitorSportGroupBetEnable" :disabled="isPermission" />
          <span class="bot-text">
            {{ $t("risk_control.sportGroupBetPlayer") }}：
            <el-input v-model="botConfig.monitorSportGroupBetDay" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportGroupBetDesc1") }}
            <el-input v-model="botConfig.monitorSportGroupBetPeople" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportGroupBetDesc2") }}
            <el-input v-model="botConfig.monitorSportGroupBetMinute" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportGroupBetDesc3") }}
            <el-input v-model="botConfig.monitorSportGroupBetOtherMatch" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.sportGroupBetDesc4") }}
          </span>
        </div>
        <!-- 假日型玩家 -->
        <div class="bot-row">
          <el-switch v-model="botConfig.monitorWeekdaysBetEnable" :disabled="isPermission" />
          <span class="bot-text">
            {{ $t("risk_control.weekdaysBetPlayer") }}：
            <el-input v-model="botConfig.monitorWeekdaysBetDay" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.weekdaysBetDesc1") }}
            <el-input v-model="botConfig.monitorWeekdaysBetPercent" :disabled="isPermission" class="bot-input" />
            ％。
          </span>
        </div>
        <!-- 平日型玩家 -->
        <div class="bot-row">
          <el-switch v-model="botConfig.monitorHolidayBetEnable" :disabled="isPermission" />
          <span class="bot-text">
            {{ $t("risk_control.holidayBetPlayer") }}：
            <el-input v-model="botConfig.monitorHolidayBetDay" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.holidayBetDesc1") }}
            <el-input v-model="botConfig.monitorHolidayBetPercent" :disabled="isPermission" class="bot-input" />
            ％。
          </span>
        </div>
        <!-- 桌面端玩家 -->
        <div class="bot-row">
          <el-switch v-model="botConfig.monitorPcUserEnable" :disabled="isPermission" />
          <span class="bot-text">
            {{ $t("risk_control.pcUserPlayer") }}：
            <el-input v-model="botConfig.monitorPcUserDay" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.pcUserDesc1") }}
            <el-input v-model="botConfig.monitorPcUserPercent" :disabled="isPermission" class="bot-input" />
            ％。
          </span>
        </div>
        <!-- 手機端玩家 -->
        <div class="bot-row">
          <el-switch v-model="botConfig.monitorH5UserEnable" :disabled="isPermission" />
          <span class="bot-text">
            {{ $t("risk_control.h5UserPlayer") }}：
            <el-input v-model="botConfig.monitorH5UserDay" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.h5UserDesc1") }}
            <el-input v-model="botConfig.monitorH5UserPercent" :disabled="isPermission" class="bot-input" />
            ％。
          </span>
        </div>
        <!-- 近期連續盈利 -->
        <div class="bot-row">
          <el-switch v-model="botConfig.monitorProfitEnable" :disabled="isPermission" />
          <span class="bot-text">
            {{ $t("risk_control.monitorProfitPlayer") }}：
            <el-input v-model="botConfig.monitorProfitDay" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.monitorProfitDesc1") }}
            <el-input v-model="botConfig.monitorNetProfitDay" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.monitorProfitDesc2") }}
            <el-input v-model="botConfig.monitorProfitKill" :disabled="isPermission" class="bot-input" />
            ％。
          </span>
        </div>
      </div>

      <!-- 團體&工作室 -->
      <p class="section-title">
        {{ ppm() }} - {{ $t("risk_control.groupStudio") }}
      </p>
      <div class="bot-section">
        <div class="bot-row">
          <el-switch v-model="botConfig.tagScoreEnable" :disabled="isPermission" />
          <span class="bot-text">
            Tag {{ $t("risk_control.scoreDetection") }}，{{
              $t("risk_control.reach")
            }}
            <el-input v-model="botConfig.tagScoreThreshold" :disabled="isPermission" class="bot-input" />
            {{ $t("risk_control.scoreUnit") }}{{ $t("risk_control.autoAddGroupStudioTag") }}
          </span>
        </div>
        <div class="bot-row">
          <div class="bot-text">
            <p class="mb-3">Tag {{ $t("risk_control.scoreMapping") }}:</p>
            <div
              v-for="(item, index) in botConfig.tagScoreItems"
              :key="index"
              class="flex items-center mb-3 gap-2"
            >
              <span>{{ $t("risk_control.tagWord") }}:</span>
              <!-- TODO: 舊版用 AddTagSelect（未移植），改以 el-select 單選 -->
              <el-select
                v-model="item.tagID"
                clearable
                :disabled="isPermission"
                class="!w-[200px]"
              >
                <el-option
                  v-for="tag in tagOptionsAll"
                  :key="tag.id"
                  :label="tag.name"
                  :value="tag.id"
                />
              </el-select>
              <span>,</span>
              <el-input v-model="item.score" :disabled="isPermission" class="bot-input" />
              <span>{{ $t("risk_control.scoreUnit") }}</span>
              <el-button v-if="!isPermission" circle size="small" @click="addTagScoreItem">+</el-button>
              <el-button
                v-if="!isPermission && botConfig.tagScoreItems && botConfig.tagScoreItems.length > 1"
                circle
                size="small"
                @click="removeTagScoreItem(index)"
                >-</el-button
              >
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6">
        <el-button
          type="primary"
          :disabled="isPermission"
          :loading="status"
          @click="handleSave"
        >
          {{ $t("risk_control.save") }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.section-title {
  margin: 24px 0 16px;
  font-size: 20px;
  font-weight: 600;
}

.bot-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 24px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color);
}

.bot-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.bot-text {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  line-height: 2;
}

.bot-input {
  width: 90px;
  margin: 0 4px;
}
</style>
