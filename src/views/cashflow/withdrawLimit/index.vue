<script setup lang="ts">
import { useWithdrawLimit } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { transformI18n as $t } from "@/plugins/i18n";

defineOptions({ name: "CashflowWithdrawLimit" });

const {
  loading,
  limitData,
  channelList,
  depositRateList,
  withdrawalRateList,
  channelColumns,
  depositRateColumns,
  withdrawalRateColumns,
  handleChannelSubmit,
  handleUsdtSubmit,
  openDescDialog
} = useWithdrawLimit();
</script>

<template>
  <div class="main" v-loading="loading">
    <!-- 存提款設定 -->
    <el-card shadow="never" class="mb-3">
      <el-divider content-position="left">
        <span class="section-title">
          {{ $t("cashflow.withdrawalDepositSettings") }}
        </span>
      </el-divider>

      <div class="setting-row">
        <span class="setting-label">{{ $t("cashflow.depositProcessLimit") }}：</span>
        <el-input
          v-model="limitData.depositProcessLimit"
          class="!w-[200px]"
        />
        <span class="ml-3 text-gray-400">
          （{{ $t("cashflow.depositProcessLimitTip", { count: 5 }) }}）
        </span>
      </div>

      <div class="setting-row">
        <span class="setting-label">{{ $t("cashflow.depositTimeoutMinutes") }}：</span>
        <el-input
          v-model="limitData.depositTimeoutMinutes"
          class="!w-[200px]"
        />
        <span class="ml-3 text-gray-400">{{ $t("cashflow.minuteUnit") }}</span>
      </div>

      <div class="setting-row">
        <span class="setting-label">{{ $t("cashflow.depositRemarkShow") }}：</span>
        <el-switch
          v-model="limitData.depositRemarkShow"
          active-text="ON"
          inactive-text="OFF"
        />
      </div>

      <div class="setting-row">
        <span class="setting-label">{{ $t("cashflow.autoPayoutEnable") }}：</span>
        <el-switch
          v-model="limitData.autoPayoutEnable"
          active-text="ON"
          inactive-text="OFF"
        />
      </div>

      <div class="setting-row">
        <span class="setting-label">{{ $t("cashflow.autoPayoutDayTotalAmount") }}：</span>
        <el-input
          v-model="limitData.autoPayoutDayTotalAmount"
          class="!w-[200px]"
        />
      </div>

      <div class="setting-row">
        <span class="setting-label">{{ $t("cashflow.autoPayoutAmountMax") }}：</span>
        <el-input v-model="limitData.autoPayoutAmountMax" class="!w-[200px]" />
      </div>

      <div class="setting-row">
        <span class="setting-label">{{ $t("cashflow.skipPayingThird") }}：</span>
        <el-switch
          v-model="limitData.skipPayingThird"
          active-text="ON"
          inactive-text="OFF"
        />
      </div>

      <div class="setting-row">
        <span class="setting-label">{{ $t("cashflow.defaultWithdrawTimesLimit") }}：</span>
        <el-input
          v-model="limitData.defaultWithdrawTimesLimit"
          class="!w-[200px]"
        />
      </div>

      <div class="setting-row">
        <span class="setting-label">{{ $t("cashflow.defaultWithdrawAmountLimit") }}：</span>
        <el-input
          v-model="limitData.defaultWithdrawAmountLimit"
          class="!w-[200px]"
        />
      </div>

      <div class="setting-row">
        <span class="setting-label">
          {{ $t("cashflow.defaultSingleWithdrawAmountLimit") }}：
        </span>
        <el-input
          v-model="limitData.defaultSingleWithdrawAmountLimit"
          class="!w-[200px]"
        />
      </div>
    </el-card>

    <!-- USDT 存款匯率設定 -->
    <PureTableBar
      :title="$t('cashflow.usdtDepositExchangeRateSetting')"
      :columns="depositRateColumns"
    >
      <template #buttons>
        <el-button type="primary" @click="handleUsdtSubmit">
          {{ $t("cashflow.saveSetting") }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          table-layout="auto"
          :size="size"
          :data="depositRateList"
          :columns="dynamicColumns"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        />
      </template>
    </PureTableBar>

    <!-- USDT 提款匯率設定 -->
    <PureTableBar
      :title="$t('cashflow.usdtWithdrawalExchangeRateSettings')"
      :columns="withdrawalRateColumns"
      class="mt-3"
    >
      <template #buttons>
        <el-button type="primary" @click="handleUsdtSubmit">
          {{ $t("cashflow.saveSetting") }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          table-layout="auto"
          :size="size"
          :data="withdrawalRateList"
          :columns="dynamicColumns"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        />
      </template>
    </PureTableBar>

    <!-- 提現渠道開關管理 -->
    <PureTableBar
      :title="$t('cashflow.withdrawalChannelSwitchManagement')"
      :columns="channelColumns"
      class="mt-3"
    >
      <template #buttons>
        <el-button type="primary" @click="handleChannelSubmit">
          {{ $t("cashflow.saveSetting") }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          table-layout="auto"
          :size="size"
          :data="channelList"
          :columns="dynamicColumns"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        >
          <template #descOperation="{ row }">
            <el-button link type="primary" :size="size" @click="openDescDialog(row)">
              {{ $t("cashflow.edit") }}
            </el-button>
          </template>
          <template #available="{ row }">
            <el-switch
              v-model="row.available"
              active-text="ON"
              inactive-text="OFF"
            />
          </template>
          <template #maintain="{ row }">
            <el-switch
              v-model="row.maintain"
              active-text="ON"
              inactive-text="OFF"
            />
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<style scoped lang="scss">
.section-title {
  font-size: 16px;
  font-weight: 800;
}

.setting-row {
  display: flex;
  align-items: center;
  margin: 12px;
}

.setting-label {
  display: inline-block;
  width: 220px;
}
</style>
