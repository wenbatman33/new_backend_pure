<script setup lang="ts">
import { computed } from "vue";
import { useMemberReport, reportTypeOptions } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import Download from "~icons/ep/download";

defineOptions({ name: "ReportMember" });

const {
  loading,
  dataList,
  columns,
  title,
  searchForm,
  summaryMethod,
  onReportTypeChange,
  onDateChange,
  onSearch,
  resetForm,
  handleExport
} = useMemberReport();

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
      <el-form-item :label="$t('report.type')" prop="reportType">
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

      <el-form-item :label="$t('report.timeInterval')">
        <el-date-picker
          :model-value="searchForm.reportDateStart"
          :type="datePickerType"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD HH:mm:ss"
          :clearable="false"
          class="!w-[150px]"
          @update:model-value="onDateChange('reportDateStart', $event)"
        />
        <span class="px-2">～</span>
        <el-date-picker
          :model-value="searchForm.reportDateEnd"
          :type="datePickerType"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD HH:mm:ss"
          :clearable="false"
          class="!w-[150px]"
          @update:model-value="onDateChange('reportDateEnd', $event)"
        />
      </el-form-item>

      <el-form-item :label="$t('report.agencyAccount')" prop="agencyAccount">
        <el-input
          v-model="searchForm.agencyAccount"
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
          {{ $t("report.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm">
          {{ $t("report.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar :title="title" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_report_member_export')"
          type="primary"
          :icon="Download"
          @click="handleExport"
        >
          {{ $t("report.exportExcel") }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          border
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
