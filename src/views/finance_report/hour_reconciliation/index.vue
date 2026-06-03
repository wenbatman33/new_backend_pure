<script setup lang="ts">
import { ref } from "vue";
import { useHourReconciliation } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "FinanceReportHourReconciliation" });

const formRef = ref();
const {
  searchForm,
  reportDate,
  loading,
  columns,
  shiftTables,
  payChannels,
  shiftOptions,
  balanceDiffOptions,
  balanceChangeOptions,
  buildSummary,
  onSearch,
  resetForm,
  handleNote
} = useHourReconciliation();

// 合計列：依目前欄位順序填值
function summaryMethod(list: any[]) {
  return ({ columns: cols }: any) => {
    const summary = buildSummary(list);
    return cols.map((col: any, idx: number) => {
      if (idx === 0) return summary.payChannelSn;
      const key = col.property;
      return key && key in summary ? (summary as any)[key] : "";
    });
  };
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
      <el-form-item :label="$t('finance_report.reportDate')" prop="reportDate">
        <el-date-picker
          v-model="reportDate"
          type="date"
          value-format="YYYY-MM-DD"
          :clearable="false"
          class="!w-[160px]"
        />
      </el-form-item>
      <el-form-item :label="$t('finance_report.shifts')" prop="shift">
        <el-select v-model="searchForm.shift" class="!w-[120px]">
          <el-option
            v-for="item in shiftOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('finance_report.merchant')" prop="payChannelName">
        <el-input
          v-model="searchForm.payChannelName"
          clearable
          class="!w-[140px]"
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
          class="!w-[160px]"
        >
          <el-option
            v-for="item in payChannels"
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
        <el-select v-model="searchForm.balanceDiff" class="!w-[120px]">
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
        <el-select v-model="searchForm.balanceChange" class="!w-[140px]">
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

    <!-- 各時段表格 -->
    <PureTableBar
      v-for="(table, ti) in shiftTables"
      :key="ti"
      :title="table.title"
      :columns="columns"
      class="mt-2"
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
          :data="table.list"
          :columns="dynamicColumns"
          show-summary
          :summary-method="summaryMethod(table.list)"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        >
          <template #note="{ row }">
            <el-input
              v-model="row.note"
              size="small"
              @blur="handleNote(row)"
            />
          </template>
        </pure-table>
      </template>
    </PureTableBar>

    <el-empty
      v-if="!loading && shiftTables.length === 0"
      :description="$t('finance_report.noData')"
    />
  </div>
</template>

<style scoped lang="scss">
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
