<script setup lang="ts">
import { ref } from "vue";
import { usePayChannelDepositWithdraw } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import Download from "~icons/ep/download";

defineOptions({ name: "FinanceReportPayChannelDepositWithdraw" });

const formRef = ref();
const {
  loading,
  columns,
  dataList,
  searchForm,
  reportDateRange,
  completedDateRange,
  pagination,
  lastUpdate,
  payChannelOptions,
  payGroupOptions,
  summaryMethod,
  onSearch,
  resetForm,
  handleExport
} = usePayChannelDepositWithdraw();
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
      <el-form-item :label="$t('finance_report.creationTime')">
        <el-date-picker
          v-model="reportDateRange"
          type="datetimerange"
          value-format="YYYY-MM-DD HH:mm:ss"
          :clearable="false"
          range-separator="～"
          :start-placeholder="$t('finance_report.startDate')"
          :end-placeholder="$t('finance_report.endDate')"
          class="!w-[360px]"
        />
      </el-form-item>
      <el-form-item :label="$t('finance_report.completionTime')">
        <el-date-picker
          v-model="completedDateRange"
          type="datetimerange"
          value-format="YYYY-MM-DD HH:mm:ss"
          :clearable="false"
          range-separator="～"
          :start-placeholder="$t('finance_report.startDate')"
          :end-placeholder="$t('finance_report.endDate')"
          class="!w-[360px]"
        />
      </el-form-item>
      <el-form-item :label="$t('finance_report.merchantNumber')">
        <el-select
          v-model="searchForm.payChannelIDList"
          multiple
          filterable
          collapse-tags
          collapse-tags-tooltip
          clearable
          :placeholder="$t('finance_report.payChannelIDPlaceholder')"
          class="!w-[320px]"
        >
          <el-option
            v-for="item in payChannelOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('finance_report.userGroup')">
        <el-select
          v-model="searchForm.payGroupIdList"
          multiple
          filterable
          collapse-tags
          collapse-tags-tooltip
          clearable
          :placeholder="$t('finance_report.pleaseSelectUserGroup')"
          class="!w-[320px]"
        >
          <el-option
            v-for="item in payGroupOptions"
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
        <el-button :icon="Refresh" @click="resetForm">
          {{ $t("finance_report.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('finance_report.menuPayChannelDepositWithdraw')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <span v-if="lastUpdate" class="mr-4 text-sm text-gray-500">
          {{ $t("finance_report.lastUpdate") }}：{{ lastUpdate }}
        </span>
        <el-button
          v-if="hasAuth('__btn_daily_merchant_dnw_export')"
          type="primary"
          :icon="Download"
          @click="handleExport"
        >
          {{ $t("finance_report.exportExcel") }}
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
          :pagination="pagination"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @page-size-change="onSearch"
          @page-current-change="onSearch"
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
