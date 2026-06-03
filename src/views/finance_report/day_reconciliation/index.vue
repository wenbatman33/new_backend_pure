<script setup lang="ts">
import { ref } from "vue";
import { useDayReconciliation } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "FinanceReportDayReconciliation" });

const formRef = ref();
const {
  searchForm,
  loading,
  columns,
  dataList,
  payChannelOptions,
  balanceDiffOptions,
  balanceChangeOptions,
  summaryMethod,
  onSearch,
  resetForm
} = useDayReconciliation();
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
      <el-form-item :label="$t('finance_report.reportDate')" prop="reportDate">
        <el-date-picker
          v-model="searchForm.reportDate"
          type="date"
          value-format="YYYY-MM-DD"
          format="YYYY/MM/DD"
          :clearable="false"
          class="!w-[160px]"
        />
      </el-form-item>
      <el-form-item :label="$t('finance_report.merchant')" prop="payChannelName">
        <el-input
          v-model="searchForm.payChannelName"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item
        :label="$t('finance_report.merchantNumber')"
        prop="payChannelSn"
      >
        <el-select
          v-model="searchForm.payChannelSn"
          clearable
          filterable
          class="!w-[180px]"
        >
          <el-option
            v-for="item in payChannelOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('finance_report.isThereADifference')"
        prop="balanceDiff"
      >
        <el-select v-model="searchForm.balanceDiff" class="!w-[140px]">
          <el-option
            v-for="item in balanceDiffOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('finance_report.isThereAnyAbnormalMovement')"
        prop="balanceChange"
      >
        <el-select v-model="searchForm.balanceChange" class="!w-[180px]">
          <el-option
            v-for="item in balanceChangeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('finance_report.menuDayReconciliation')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          border
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          show-summary
          :summary-method="summaryMethod"
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
