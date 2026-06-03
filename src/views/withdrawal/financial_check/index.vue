<script setup lang="ts">
import { useFinancialCheck } from "./utils/hook";
import { transformI18n as $t } from "@/plugins/i18n";
import { hasAuth } from "@/router/utils";

defineOptions({ name: "WithdrawalFinancialCheck" });

const {
  memberInfo,
  withdrawalData,
  memberInfoWithGroup,
  useTypeListOption,
  promotionMemberWithdraw,
  adjustmentApply,
  tags,
  moneyLogSearch,
  stakeTotal,
  walletLogList,
  stakeDetailList,
  withdrawalList,
  walletLogLoading,
  stakeLoading,
  showRejectButton,
  showSubmitRiskButton,
  showPassButton,
  stakeDetailColumns,
  walletLogColumns,
  withdrawalListColumns,
  adjustmentLimit,
  openActionDialog,
  openTurnoverDialog,
  openHistoryDialog,
  openLogDialog,
  openTimeline,
  onSearchWalletLog,
  moneyLogSearchTypeSelectAll,
  moneyLogSearchTypeClean
} = useFinancialCheck();

const toNum = (v: any) => {
  try {
    return Number(v || 0).toLocaleString();
  } catch {
    return v;
  }
};

function openPromotion(id: number | string) {
  window.open("/promotion/list?ID=" + id);
}
</script>

<template>
  <div class="main flex gap-3 items-stretch">
    <!-- 主要內容 -->
    <el-card class="flex-1" shadow="never">
      <div class="grid grid-cols-3 gap-3">
        <div class="col-span-2">
          <!-- 標題 / 動作列 -->
          <div class="flex items-center gap-2 flex-wrap mb-3">
            <span
              v-if="memberInfo.hasSuccessDeposit === false"
              class="had-deposit"
            >
              {{ $t("withdrawal.noSuccessDeposit") }}
            </span>
            <el-button type="primary" plain @click="openHistoryDialog">
              {{ $t("withdrawal.pastWithdrawAcc") }}
            </el-button>
            <el-button
              v-if="showRejectButton"
              type="primary"
              @click="openActionDialog('reject')"
            >
              {{ $t("withdrawal.reject") }}
            </el-button>
            <el-button
              v-if="showSubmitRiskButton"
              type="primary"
              @click="openActionDialog('submitRisk')"
            >
              {{ $t("withdrawal.passRiskReviw") }}
            </el-button>
            <el-button
              v-if="showPassButton"
              type="primary"
              @click="openActionDialog('pass')"
            >
              {{ $t("withdrawal.pass") }}
            </el-button>
          </div>

          <!-- 審核紀錄 -->
          <div v-if="withdrawalData.status?.key !== 1" class="check-log">
            <a href="#" class="float-right" @click.prevent="openLogDialog">
              {{ $t("withdrawal.viewAll") }}
            </a>
            <template
              v-for="(li, index) in withdrawalData.checkNote || []"
              :key="index"
            >
              <p v-if="index < 2">{{ li }}</p>
            </template>
          </div>

          <!-- 提款描述 -->
          <el-descriptions :column="2" border class="mt-3">
            <el-descriptions-item :label="$t('withdrawal.withdrawNumber')">
              {{ withdrawalData.id }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('withdrawal.withdrawApplyTime')">
              {{ withdrawalData.createdAt }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('withdrawal.withdrawalAmount')">
              {{ toNum(withdrawalData.amount) }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('withdrawal.status')">
              {{ withdrawalData.status?.value }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('withdrawal.memberAccount')">
              <a
                :href="`/memberDetail/detail/${withdrawalData.member?.key}`"
                target="_blank"
                >{{ withdrawalData.member?.value }}</a
              >
              ({{ withdrawalData.member?.key }})
            </el-descriptions-item>
            <el-descriptions-item :label="$t('withdrawal.accName')">
              {{ withdrawalData.withdrawalName }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('withdrawal.bankAccount')">
              {{ withdrawalData.bankcard }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('withdrawal.bankName')">
              {{ withdrawalData.bankName || withdrawalData.bankCode }}
            </el-descriptions-item>
          </el-descriptions>

          <!-- 會員描述 -->
          <el-descriptions :column="3" border class="mt-3">
            <el-descriptions-item :label="$t('withdrawal.bankGroup')">
              {{ memberInfoWithGroup.bankGroup?.value }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('withdrawal.payGroup')">
              {{ memberInfoWithGroup.thirdGroup?.value }}
            </el-descriptions-item>
            <el-descriptions-item label="VIP">
              VIP{{ memberInfo.vip }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('withdrawal.todayDeposit')">
              {{ toNum(memberInfo.todayDepositAmount) }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('withdrawal.todayDepositDiff')">
              {{ toNum(memberInfo.spread) }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('withdrawal.walletTotal')">
              {{ toNum(memberInfo.money) }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('withdrawal.freezeAmount')">
              {{ toNum(memberInfo.lockMoney) }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('withdrawal.todayWithdrawal')">
              {{ toNum(memberInfo.todayWithdrawalAmount) }}
            </el-descriptions-item>
          </el-descriptions>

          <!-- 流水彙總 -->
          <div class="flex gap-6 py-4 items-center flex-wrap">
            <span>{{ $t("withdrawal.turnoverNeedLabel") }}: {{ memberInfo.needTurnover ?? "-" }}</span>
            <span>{{ $t("withdrawal.turnoverLabel") }}: {{ memberInfo.betAmount ?? "-" }}</span>
            <span class="flex items-center gap-2">
              {{ $t("withdrawal.turnoverDiffLabel") }}:
              <span :class="{ 'bold-red': Number(memberInfo.diffWithdrawLimitation) < 0 }">
                {{ memberInfo.diffWithdrawLimitation ?? "-" }}
              </span>
              <el-button
                v-if="withdrawalData.status?.key === 1 && hasAuth('__btn_withdrawal_turnover_List')"
                size="small"
                type="primary"
                @click="openTurnoverDialog"
              >
                {{ $t("withdrawal.turnoverListTitle") }}
              </el-button>
            </span>
          </div>

          <!-- 三個資訊卡 -->
          <div class="grid grid-cols-3 gap-3">
            <el-card class="bg-promote" shadow="never" body-class="!p-3">
              <p class="font-medium">{{ $t("withdrawal.depositBonusClaim") }}</p>
              <div class="info-scroll">
                <template v-if="promotionMemberWithdraw.length">
                  <div v-for="li in promotionMemberWithdraw" :key="li.promotionID" class="mb-2">
                    <a
                      href="#"
                      class="text-red-500 block truncate"
                      @click.prevent="openPromotion(li.promotionID)"
                      >{{ li.promotionName }}</a
                    >
                    <p class="text-blue-500 text-xs">{{ adjustmentLimit(li.adjustmentLimit) }}</p>
                  </div>
                </template>
                <span v-else>{{ $t("withdrawal.none") }}</span>
              </div>
            </el-card>

            <el-card class="bg-adjustment" shadow="never" body-class="!p-3">
              <p class="font-medium">{{ $t("withdrawal.adjustmentApply") }}</p>
              <div class="info-scroll">
                <template v-if="adjustmentApply.length">
                  <div v-for="li in adjustmentApply" :key="li.adjustmentID" class="mb-2">
                    <p class="text-red-500 truncate">{{ li.adjustmentID }},{{ li.subject }}</p>
                    <p class="text-blue-500 text-xs">{{ adjustmentLimit(li.adjustmentLimit) }}</p>
                  </div>
                </template>
                <span v-else>{{ $t("withdrawal.none") }}</span>
              </div>
            </el-card>

            <el-card class="bg-tag" shadow="never" body-class="!p-3">
              <p class="font-medium">{{ $t("withdrawal.withdrawalReviewTab") }}</p>
              <div class="info-scroll">
                <template v-if="tags.length">
                  <el-tag v-for="li in tags" :key="li.name" type="danger" class="mr-1 mb-1">
                    {{ li.name }}
                  </el-tag>
                </template>
                <span v-else>{{ $t("withdrawal.none") }}</span>
              </div>
            </el-card>
          </div>
        </div>

        <!-- 流水明細表 -->
        <div>
          <p class="font-medium mb-2">{{ $t("withdrawal.stakeDetail") }}</p>
          <pure-table
            row-key="name"
            default-expand-all
            border
            :loading="stakeLoading"
            :data="stakeDetailList"
            :columns="stakeDetailColumns"
            :max-height="510"
          />
          <div class="text-sm mt-1">
            {{ $t("withdrawal.total") }}: {{ $t("withdrawal.stake") }}={{ stakeTotal.betAmount }} /
            {{ $t("withdrawal.winAmount") }}={{ stakeTotal.winAmount }}
          </div>
        </div>
      </div>

      <!-- 錢包紀錄 -->
      <div class="mt-4">
        <div class="flex items-center gap-2 flex-wrap mb-2">
          <span class="table-title">{{ $t("withdrawal.moneyLog") }}</span>
          <el-date-picker
            v-model="moneyLogSearch.start"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            :clearable="false"
          />
          <span>～</span>
          <el-date-picker
            v-model="moneyLogSearch.end"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            :clearable="false"
          />
          <el-checkbox v-model="moneyLogSearch.hiddenGameMoney">
            {{ $t("withdrawal.hiddenGameMoney") }}
          </el-checkbox>
          <el-checkbox v-model="moneyLogSearch.timestamp">
            {{ $t("withdrawal.transactionTime") }}
          </el-checkbox>
          <el-button type="primary" @click="onSearchWalletLog">
            {{ $t("withdrawal.search") }}
          </el-button>
          <el-button type="success" @click="openTimeline">
            {{ $t("withdrawal.timelineTitle") }}
          </el-button>
        </div>
        <div class="flex items-center gap-2 mb-2">
          <span>{{ $t("withdrawal.project") }}</span>
          <el-select
            v-model="moneyLogSearch.type"
            multiple
            collapse-tags
            class="flex-1"
          >
            <el-option
              v-for="item in useTypeListOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-button link type="danger" @click="moneyLogSearchTypeSelectAll">
            {{ $t("withdrawal.selectAll") }}
          </el-button>
          <el-button link type="danger" @click="moneyLogSearchTypeClean">
            {{ $t("withdrawal.clean") }}
          </el-button>
        </div>
        <pure-table
          border
          :loading="walletLogLoading"
          :data="walletLogList"
          :columns="walletLogColumns"
          :max-height="500"
        />
      </div>
    </el-card>

    <!-- 側邊待審列表 -->
    <el-card style="width: 460px" shadow="never">
      <p class="font-medium mb-2">{{ $t("withdrawal.pendingWithdrawalTitle") }}</p>
      <pure-table
        border
        :data="withdrawalList"
        :columns="withdrawalListColumns"
        :max-height="700"
      />
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.had-deposit {
  color: #f00;
  border: 1px solid #f00;
  padding: 2px 5px;
}
.bold-red {
  font-weight: bold;
  color: #f00;
}
.check-log {
  background: #eee;
  padding: 0.5rem 2rem;
  margin-bottom: 0.5rem;
  p {
    margin: 0.3rem 0;
    color: #000;
  }
}
.table-title {
  font-size: 16px;
  font-weight: 500;
}
.info-scroll {
  height: 160px;
  overflow-y: auto;
}
.bg-promote {
  background-color: #f0f0f0;
}
.bg-adjustment {
  background-color: #ffdbdb;
}
.bg-tag {
  background-color: #e0f3fd;
}
</style>
