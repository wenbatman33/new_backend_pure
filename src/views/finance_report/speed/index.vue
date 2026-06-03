<script setup lang="ts">
import { h, ref, nextTick } from "vue";
import { useSpeed } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";
import DepositChart from "./DepositChart.vue";
import WithdrawalChart from "./WithdrawalChart.vue";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "FinanceReportSpeed" });

const formRef = ref();
const {
  searchForm,
  loading,
  columns,
  depositList,
  withdrawalList,
  depositTotalSpeed,
  withdrawalTotalSpeed,
  chartResult,
  onSearch,
  resetForm
} = useSpeed();

// 開啟存款圖表
function openDepositChart() {
  if (!chartResult.value) return;
  const chartRef = ref();
  addDialog({
    title: $t("finance_report.depositSpeed"),
    width: "1500px",
    draggable: true,
    hideFooter: true,
    contentRenderer: () =>
      h(DepositChart, { ref: chartRef, result: chartResult.value }),
    open: () => nextTick(() => chartRef.value?.render())
  });
}

// 開啟提款圖表
function openWithdrawalChart() {
  if (!chartResult.value) return;
  const chartRef = ref();
  addDialog({
    title: $t("finance_report.withdrawalSpeed"),
    width: "1500px",
    draggable: true,
    hideFooter: true,
    contentRenderer: () =>
      h(WithdrawalChart, { ref: chartRef, result: chartResult.value }),
    open: () => nextTick(() => chartRef.value?.render())
  });
}
</script>

<template>
  <div class="main">
    <!-- 搜尋區 -->
    <el-form
      ref="formRef"
      :inline="true"
      :model="searchForm"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item :label="$t('finance_report.reportDate')" prop="date">
        <el-date-picker
          v-model="searchForm.date"
          type="date"
          value-format="YYYY-MM-DD"
          :placeholder="$t('finance_report.pleaseEnterReportDate')"
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="Search"
          :loading="loading"
          @click="onSearch"
        >
          {{ $t("finance_report.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("finance_report.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 存款速度表格 -->
    <PureTableBar :title="$t('finance_report.depositSpeed')" :columns="columns">
      <template #buttons>
        <span class="mr-2">
          {{ $t("finance_report.averageCompletionSpeed") }}:
          {{ commaDecimalFormat(depositTotalSpeed) }}
        </span>
        <el-button type="primary" @click="openDepositChart">
          {{ $t("finance_report.viewChart") }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          :loading="loading"
          :size="size"
          :data="depositList"
          :columns="dynamicColumns"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        />
      </template>
    </PureTableBar>

    <!-- 提款速度表格 -->
    <PureTableBar
      :title="$t('finance_report.withdrawalSpeed')"
      :columns="columns"
      class="mt-4"
    >
      <template #buttons>
        <span class="mr-2">
          {{ $t("finance_report.averageCompletionSpeed") }}:
          {{ commaDecimalFormat(withdrawalTotalSpeed) }}
        </span>
        <el-button type="primary" @click="openWithdrawalChart">
          {{ $t("finance_report.viewChart") }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          :loading="loading"
          :size="size"
          :data="withdrawalList"
          :columns="dynamicColumns"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        />
      </template>
    </PureTableBar>
  </div>
</template>

<style scoped lang="scss">
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
