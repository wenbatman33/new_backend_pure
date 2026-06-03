<script setup lang="ts">
import { useFinancialCheckAgency } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";
import Search from "~icons/ep/search";

defineOptions({ name: "FinancialCheckAgency" });

const {
  loading,
  walletLogLoading,
  title,
  memberInfo,
  withdrawalData,
  moneyLogSearch,
  showActionButtons,
  withdrawalDescItems,
  memberDescItems,
  walletLogColumns,
  walletLogList,
  withdrawalListColumns,
  withdrawalList,
  loadWalletLog,
  openActionDialog
} = useFinancialCheckAgency();
</script>

<template>
  <div class="main fca-layout" v-loading="loading">
    <!-- 左側：審核主體 -->
    <el-card class="fca-main" shadow="never">
      <!-- 標題列 + 操作按鈕 -->
      <div class="fca-header">
        <div class="fca-title">
          <span>{{ $t("withdrawal.fcaWithdrawReview") }}</span>
          <span> / </span>
          <span>{{ title }}</span>
          <span
            v-if="memberInfo.hasSuccessDeposit === false"
            class="fca-had-deposit"
          >
            {{ $t("withdrawal.fcaNoSuccessDeposit") }}
          </span>
        </div>
        <div class="fca-actions">
          <el-button
            v-if="showActionButtons && hasAuth('__btn_withdrawal_reject')"
            type="primary"
            @click="openActionDialog(true)"
          >
            {{ $t("withdrawal.fcaReject") }}
          </el-button>
          <el-button
            v-if="showActionButtons && hasAuth('__btn_withdrawal_pass')"
            type="primary"
            @click="openActionDialog(false)"
          >
            {{ $t("withdrawal.fcaPass") }}
          </el-button>
        </div>
      </div>

      <!-- 提款描述 -->
      <el-descriptions :column="2" border class="mt-4">
        <el-descriptions-item
          v-for="(item, idx) in withdrawalDescItems"
          :key="idx"
          :label="item.label"
        >
          <a
            v-if="item.link"
            :href="item.link"
            target="_blank"
            style="color: var(--el-color-primary)"
          >
            {{ item.value }}
          </a>
          <span v-else>{{ item.value }}</span>
        </el-descriptions-item>
      </el-descriptions>

      <!-- 流水差 -->
      <div class="mt-4">
        <span>{{ $t("withdrawal.fcaTurnoverDiff") }} : </span>
        <span class="ml-2 mr-2">{{ memberInfo.turnover }}</span>
        <span v-if="memberInfo.turnoverStatus" style="color: #01a39d">✔</span>
        <span v-else-if="memberInfo.turnoverStatus === false" style="color: red"
          >✘</span
        >
        <el-tooltip placement="right">
          <template #content>
            {{ $t("withdrawal.fcaAgencyTip1") }}<br />
            {{ $t("withdrawal.fcaAgencyTip2") }}<br />
            {{ $t("withdrawal.fcaAgencyTip3") }}<br />
            {{ $t("withdrawal.fcaAgencyTip4") }}
          </template>
          <span class="ml-2" style="cursor: help">ⓘ</span>
        </el-tooltip>
      </div>

      <!-- 會員資訊描述 -->
      <el-descriptions :column="3" border class="mt-4">
        <el-descriptions-item
          v-for="(item, idx) in memberDescItems"
          :key="idx"
          :label="item.label"
        >
          <span>{{ item.value }}</span>
          <span
            v-if="item.ok"
            class="ml-1"
            style="color: #01a39d"
          >✔</span>
        </el-descriptions-item>
      </el-descriptions>

      <!-- 錢包異動記錄 -->
      <PureTableBar
        :title="$t('withdrawal.fcaMoneyLog')"
        :columns="walletLogColumns"
        class="mt-4"
        @refresh="loadWalletLog"
      >
        <template #buttons>
          <el-date-picker
            v-model="moneyLogSearch.start"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            :clearable="false"
            class="!w-[200px]"
          />
          <span class="px-2">～</span>
          <el-date-picker
            v-model="moneyLogSearch.end"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            :clearable="false"
            class="!w-[200px]"
          />
          <el-button
            type="primary"
            :icon="Search"
            class="ml-2"
            @click="loadWalletLog"
          >
            {{ $t("withdrawal.fcaSearch") }}
          </el-button>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            align-whole="center"
            showOverflowTooltip
            table-layout="auto"
            :loading="walletLogLoading"
            :size="size"
            :data="walletLogList"
            :columns="dynamicColumns"
            :header-cell-style="{
              background: 'var(--el-fill-color-light)',
              color: 'var(--el-text-color-primary)'
            }"
          />
        </template>
      </PureTableBar>
    </el-card>

    <!-- 右側：代理提款單列表 -->
    <el-card class="fca-side" shadow="never">
      <div class="fca-side-title">{{ $t("withdrawal.fcaWithdrawList") }}</div>
      <pure-table
        align-whole="center"
        showOverflowTooltip
        table-layout="auto"
        :data="withdrawalList"
        :columns="withdrawalListColumns"
        :header-cell-style="{
          background: 'var(--el-fill-color-light)',
          color: 'var(--el-text-color-primary)'
        }"
      />
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.fca-layout {
  display: grid;
  grid-template-columns: 1fr 460px;
  gap: 12px;
  align-items: start;
}

.fca-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.fca-title {
  font-weight: 500;
}

.fca-actions {
  display: flex;
  gap: 8px;
}

.fca-had-deposit {
  display: inline-block;
  padding: 2px 5px;
  margin-left: 15px;
  color: #f00;
  vertical-align: middle;
  border: 1px solid #f00;
}

.fca-side-title {
  margin-bottom: 12px;
  font-weight: 500;
}
</style>
