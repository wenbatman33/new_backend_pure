<script setup lang="ts">
import { ref } from "vue";
import { useDepositReport } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import Download from "~icons/ep/download";

defineOptions({ name: "ReportDeposit" });

const formRef = ref();
const {
  searchForm,
  loading,
  dataList,
  columns,
  title,
  dateTypeOptions,
  reportTypeOptions,
  serviceOptions,
  getSummaries,
  onSearch,
  resetForm,
  handleExport
} = useDepositReport();

// pure-table 的 summary-method（el-table 會傳入 { columns, data }）
function summaryMethod() {
  return getSummaries();
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
      <el-form-item :label="$t('report.type')" prop="dateType">
        <el-select v-model="searchForm.dateType" class="!w-[120px]">
          <el-option
            v-for="item in dateTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('report.timeInterval')" prop="reportDateStart">
        <el-date-picker
          v-model="searchForm.reportDateStart"
          :type="
            searchForm.dateType === 2
              ? 'week'
              : searchForm.dateType === 3
                ? 'month'
                : 'date'
          "
          value-format="YYYY-MM-DD"
          format="YYYY/MM/DD"
          :clearable="false"
          class="!w-[150px]"
        />
        <span class="px-2">～</span>
        <el-date-picker
          v-model="searchForm.reportDateEnd"
          :type="
            searchForm.dateType === 2
              ? 'week'
              : searchForm.dateType === 3
                ? 'month'
                : 'date'
          "
          value-format="YYYY-MM-DD"
          format="YYYY/MM/DD"
          :clearable="false"
          class="!w-[150px]"
        />
      </el-form-item>
      <el-form-item :label="$t('report.paymentMethod')" prop="serviceCode">
        <el-select v-model="searchForm.serviceCode" class="!w-[140px]">
          <el-option
            v-for="item in serviceOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('report.project')" prop="reportType">
        <el-select v-model="searchForm.reportType" class="!w-[140px]">
          <el-option
            v-for="item in reportTypeOptions"
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
          v-if="hasAuth('__btn_report_deposit_export')"
          type="primary"
          :icon="Download"
          @click="handleExport"
        >
          {{ $t("report.exportExcel") }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
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
