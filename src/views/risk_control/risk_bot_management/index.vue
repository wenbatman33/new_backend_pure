<script setup lang="ts">
import { useRiskBotManagement } from "./utils/hook";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

defineOptions({ name: "RiskControlRiskBotManagement" });

const { botConfig, platform, loading, saving, handleSave } =
  useRiskBotManagement();

// 是否唯讀（无编辑权限时停用所有输入）
const isReadonly = !hasAuth("__btn_edit_risk_bot");
</script>

<template>
  <div class="main">
    <el-card v-loading="loading" shadow="never">
      <!-- 产品投注人数监测 -->
      <p class="section-title">
        {{ $t("risk_control.productHeadCountMonitoring") }}
      </p>
      <div class="bot-section">
        <div class="bot-row">
          <el-switch
            v-model="botConfig.productMembersLTEnable"
            :disabled="isReadonly"
          />
          <span class="bot-text">
            {{ $t("risk_control.noRepeatBetsLastWeek") }} &lt;
            <el-input
              v-model="botConfig.productMembersLTMembers"
              :disabled="isReadonly"
              class="bot-input"
            />
            ，{{ $t("risk_control.accumulationDoesNotRepeatThisWeek") }}，{{
              $t("risk_control.growingUp")
            }}
            <el-input
              v-model="botConfig.productMembersLTTimes"
              :disabled="isReadonly"
              class="bot-input"
            />
            {{ $t("risk_control.multiple") }}。
          </span>
        </div>

        <div class="bot-row">
          <el-switch
            v-model="botConfig.productMembersBetweenEnable"
            :disabled="isReadonly"
          />
          <span class="bot-text">
            {{ $t("risk_control.noRepeatBetsLastWeek") }} &geq;
            <el-input
              v-model="botConfig.productMembersBetweenGTEMembers"
              :disabled="isReadonly"
              class="bot-input"
            />
            and &lt;
            <el-input
              v-model="botConfig.productMembersBetweenLTMembers"
              :disabled="isReadonly"
              class="bot-input"
            />
            ，{{ $t("risk_control.accumulationDoesNotRepeatThisWeek") }}，{{
              $t("risk_control.growingUp")
            }}
            <el-input
              v-model="botConfig.productMembersBetweenTimes"
              :disabled="isReadonly"
              class="bot-input"
            />
            {{ $t("risk_control.multiple") }}。
          </span>
        </div>

        <div class="bot-row">
          <el-switch
            v-model="botConfig.productMembersBTEEnable"
            :disabled="isReadonly"
          />
          <span class="bot-text">
            {{ $t("risk_control.noRepeatBetsLastWeek") }} &geq;
            <el-input
              v-model="botConfig.productMembersBTEMembers"
              :disabled="isReadonly"
              class="bot-input"
            />
            ，{{ $t("risk_control.accumulationDoesNotRepeatThisWeek") }}，{{
              $t("risk_control.growingUp")
            }}
            <el-input
              v-model="botConfig.productMembersBTETimes"
              :disabled="isReadonly"
              class="bot-input"
            />
            {{ $t("risk_control.multiple") }}。
          </span>
        </div>
      </div>

      <!-- 注册人数监测 -->
      <p class="section-title">
        {{ $t("risk_control.registrationNumberMonitoring") }}
      </p>
      <div class="bot-section">
        <div class="bot-row">
          <el-switch
            v-model="botConfig.registerCountWeek1Enable"
            :disabled="isReadonly"
          />
          <span class="bot-text">
            {{ $t("risk_control.accumulatedRegistrationsThisWeek") }}，{{
              $t("risk_control.growingUp")
            }}
            <el-input
              v-model="botConfig.registerCountWeek1Times"
              :disabled="isReadonly"
              class="bot-input"
            />
            {{ $t("risk_control.multiple") }}。
          </span>
        </div>
        <div class="bot-row">
          <el-switch
            v-model="botConfig.registerCountWeek2Enable"
            :disabled="isReadonly"
          />
          <span class="bot-text">
            {{ $t("risk_control.accumulatedRegistrationsThisWeek") }}，{{
              $t("risk_control.growingUp")
            }}
            <el-input
              v-model="botConfig.registerCountWeek2Times"
              :disabled="isReadonly"
              class="bot-input"
            />
            {{ $t("risk_control.multiple") }}。
          </span>
        </div>
      </div>

      <!-- 总优惠人数监测 -->
      <p class="section-title">
        {{ $t("risk_control.monitoringOfTotalNumberOfDiscounts") }}
      </p>
      <div class="bot-section">
        <div class="bot-row">
          <el-switch
            v-model="botConfig.promotionReceivedCountWeek1Enable"
            :disabled="isReadonly"
          />
          <span class="bot-text">
            {{ $t("risk_control.getDealsThisWeek") }}，{{
              $t("risk_control.growingUp")
            }}
            <el-input
              v-model="botConfig.promotionReceivedCountWeek1Times"
              :disabled="isReadonly"
              class="bot-input"
            />
            {{ $t("risk_control.multiple") }}。
          </span>
        </div>
        <div class="bot-row">
          <el-switch
            v-model="botConfig.promotionReceivedCountWeek2Enable"
            :disabled="isReadonly"
          />
          <span class="bot-text">
            {{ $t("risk_control.getDealsThisWeek") }}，{{
              $t("risk_control.growingUp")
            }}
            <el-input
              v-model="botConfig.promotionReceivedCountWeek2Times"
              :disabled="isReadonly"
              class="bot-input"
            />
            {{ $t("risk_control.multiple") }}。
          </span>
        </div>
      </div>

      <!-- 提款机器人指定条件 -->
      <p class="section-title">
        {{ $t("risk_control.withdrawalRobotSpecifiedConditions") }}
      </p>
      <div class="bot-section">
        <div class="bot-row">
          <el-switch
            v-model="botConfig.withdrawalTagRiskConditionEnable"
            :disabled="isReadonly"
          />
          <span class="bot-text">
            {{ $t("risk_control.tagTriggersBotCondition") }}：{{
              $t("risk_control.totalWithdrawalsLast30Days")
            }}
            + {{ $t("risk_control.amountOfThisWithdrawal") }} +
            {{ $t("risk_control.totalCareerTurnover") }} *
            <el-input
              v-model="botConfig.withdrawalRiskConditionFee"
              :disabled="isReadonly"
              class="bot-input"
            />
            ({{ $t("risk_control.platformFee") }}) +
            {{ $t("risk_control.totalDepositAmount") }} *
            <el-input
              v-model="botConfig.withdrawalRiskConditionDepositRatio"
              :disabled="isReadonly"
              class="bot-input"
            />
            &gt; {{ $t("risk_control.totalDepositsLast30Days") }}
          </span>
        </div>

        <div class="bot-row">
          <el-switch
            v-model="botConfig.withdrawalTooHighEnable"
            :disabled="isReadonly"
          />
          <span class="bot-text">
            {{ $t("risk_control.withdrawalDepositRatioTooHigh") }}：{{
              $t("risk_control.withdrawalAmount")
            }}
            &gt; {{ $t("risk_control.theLastWithdrawalWasSuccessful") }}
            <el-input
              v-model="botConfig.withdrawalTooHighMultiple"
              :disabled="isReadonly"
              class="bot-input"
            />
            {{ $t("risk_control.multiple") }}，{{
              $t("risk_control.andTheWithdrawalAmount")
            }}
            &geq;
            <el-input
              v-model="botConfig.withdrawalTooHighMultipleWithdrawalAmount"
              :disabled="isReadonly"
              class="bot-input"
            />
          </span>
        </div>

        <div class="bot-row">
          <el-switch
            v-model="botConfig.withdrawalCountEnable"
            :disabled="isReadonly"
          />
          <span class="bot-text">
            {{ $t("risk_control.newlyRegisteredProfitableUsers") }}：{{
              $t("risk_control.userSuccessfulWithdrawalRecordsLast30Days")
            }}
            &leq;
            <el-input
              v-model="botConfig.withdrawalCount"
              :disabled="isReadonly"
              class="bot-input"
            />
            {{ $t("risk_control.records") }}，{{
              $t("risk_control.andTotalWithdrawalsLast30Days")
            }}
            + {{ $t("risk_control.amountOfThisWithdrawal") }} +
            {{ $t("risk_control.totalCareerTurnover") }} *
            <el-input
              v-model="botConfig.withdrawalCountFee"
              :disabled="isReadonly"
              class="bot-input"
            />
            ({{ $t("risk_control.platformFee") }}) +
            {{ $t("risk_control.totalDepositAmount") }} *
            <el-input
              v-model="botConfig.withdrawalCountTotalDepositRatio"
              :disabled="isReadonly"
              class="bot-input"
            />
            ({{ $t("risk_control.platformFee") }}) &geq;
            {{ $t("risk_control.totalDepositsLast30Days") }}
          </span>
        </div>

        <div class="bot-row">
          <el-switch
            v-model="botConfig.profitAndLossEnable"
            :disabled="isReadonly"
          />
          <span class="bot-text">
            {{ $t("risk_control.profitAndLossEnable") }}
            <el-input
              v-model="botConfig.profitAndLossDays"
              :disabled="isReadonly"
              class="bot-input"
            />
            {{ $t("risk_control.profitAndLossDays") }}
          </span>
        </div>

        <div class="bot-row">
          <el-switch
            v-model="botConfig.withdrawalAmountEnable"
            :disabled="isReadonly"
          />
          <span class="bot-text">
            {{ $t("risk_control.singleHighWithdrawalPlayer") }}；{{
              $t("risk_control.singleWithdrawalAmount")
            }}
            &geq;
            <el-input
              v-model="botConfig.withdrawalAmount"
              :disabled="isReadonly"
              class="bot-input"
            />
          </span>
        </div>

        <div class="bot-row">
          <el-switch
            v-model="botConfig.withdrawalNoDepositEnable"
            :disabled="isReadonly"
          />
          <span class="bot-text">
            {{ $t("risk_control.accumulatedUponWithdrawal") }}
            <el-input
              v-model="botConfig.withdrawalNoDepositDays"
              :disabled="isReadonly"
              class="bot-input"
            />
            {{ $t("risk_control.usersWithNoDepositRecordWithinDays") }}，{{
              $t("risk_control.triggerRiskControlNotification")
            }}
          </span>
        </div>

        <div class="bot-row">
          <el-switch
            v-model="botConfig.withdrawalWinEnable"
            :disabled="isReadonly"
          />
          <span class="bot-text">
            {{ $t("risk_control.withdrawalTimeIsApproaching") }}
            <el-input
              v-model="botConfig.withdrawalWinDays"
              :disabled="isReadonly"
              class="bot-input"
            />
            {{ $t("risk_control.winningOrLosingGamesWithinADay") }} &gt;
            <el-input
              v-model="botConfig.withdrawalWinAmount"
              :disabled="isReadonly"
              class="bot-input"
            />
            {{ $t("risk_control.user") }}，{{
              $t("risk_control.triggerRiskControlNotification")
            }}
          </span>
        </div>

        <div class="bot-row">
          <el-switch
            v-model="botConfig.withdrawalGameTypeEnable"
            :disabled="isReadonly"
          />
          <div class="bot-text">
            <p>
              {{ $t("risk_control.usersBettingOnHighStakesGames") }}：{{
                $t("risk_control.turnoverAfterLastDeposit")
              }}，{{ $t("risk_control.platformSettings") }}
            </p>
            <el-checkbox-group v-model="platform" :disabled="isReadonly">
              <el-checkbox value="1">{{
                $t("risk_control.sportRefund")
              }}</el-checkbox>
              <el-checkbox value="2">{{
                $t("risk_control.personRefund")
              }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>

      <!-- 平台盈利设置 -->
      <p class="section-title">
        {{ $t("risk_control.platformProfitSettings") }}
      </p>
      <div class="bot-section">
        <div class="bot-row">
          <el-switch
            v-model="botConfig.memberProfitEnable"
            :disabled="isReadonly"
          />
          <span class="bot-text">
            {{ $t("risk_control.gameProfit") }} &geq;
            <el-input
              v-model="botConfig.memberProfitAmount"
              :disabled="isReadonly"
              class="bot-input"
            />
          </span>
        </div>
      </div>

      <!-- 转移异常监测 -->
      <p class="section-title">
        {{ $t("risk_control.transferAbnormalMonitoring") }}
      </p>
      <div class="bot-section">
        <div class="bot-row">
          <el-switch
            v-model="botConfig.gameTransferMonitorEnable"
            :disabled="isReadonly"
          />
          <span class="bot-text">
            {{ $t("risk_control.totalOutgoingAmountTotalIncomingAmount") }}
            <el-input
              v-model="botConfig.gameTransferMonitorAmount"
              :disabled="isReadonly"
              class="bot-input"
            />
            {{ $t("risk_control.transferAbnormalMonitoringNote") }}
          </span>
        </div>
      </div>

      <div class="flex justify-end mt-8">
        <el-button
          type="primary"
          :disabled="isReadonly"
          :loading="saving"
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
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 600;
}

.bot-section {
  padding-bottom: 24px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--el-border-color);
}

.bot-row {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 16px;
}

.bot-text {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  line-height: 32px;
}

.bot-input {
  display: inline-block;
  width: 90px;
}
</style>
