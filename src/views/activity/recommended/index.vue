<script setup lang="ts">
import { computed } from "vue";
import { useRecommended, reportTypeOptions } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "ActivityRecommended" });

const {
  loading,
  dataList,
  columns,
  searchForm,
  summaryMethod,
  onReportTypeChange,
  onDateChange,
  onSearch,
  resetForm
} = useRecommended();

// 依報表類型決定日期選擇器型別：日 date / 週 week / 月 month
const datePickerType = computed(() => {
  if (searchForm.reportType === "w") return "week";
  if (searchForm.reportType === "m") return "month";
  return "date";
});
</script>

<template>
  <div class="main">
    <!-- 搜尋區 -->
    <el-form
      :inline="true"
      :model="searchForm"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item :label="$t('activity.type')" prop="reportType">
        <el-select
          v-model="searchForm.reportType"
          class="!w-[120px]"
          @change="onReportTypeChange"
        >
          <el-option
            v-for="item in reportTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('activity.timeInterval')">
        <el-date-picker
          :model-value="searchForm.startDate"
          :type="datePickerType"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
          :clearable="false"
          class="!w-[150px]"
          @update:model-value="onDateChange('startDate', $event)"
        />
        <span class="px-2">～</span>
        <el-date-picker
          :model-value="searchForm.endDate"
          :type="datePickerType"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
          :clearable="false"
          class="!w-[150px]"
          @update:model-value="onDateChange('endDate', $event)"
        />
      </el-form-item>

      <el-form-item :label="$t('activity.recommenderAccount')" prop="account">
        <el-input
          v-model="searchForm.account"
          clearable
          class="!w-[150px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          :icon="Search"
          :loading="loading"
          @click="onSearch"
        >
          {{ $t("activity.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm">
          {{ $t("activity.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('activity.menuRecommended')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          show-summary
          :summary-method="summaryMethod"
          :loading="loading"
          :size="size"
          :data="dataList"
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
