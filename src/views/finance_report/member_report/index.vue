<script setup lang="ts">
import { ref } from "vue";
import { useMemberReport } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import RefreshRight from "~icons/ep/refresh-right";
import Download from "~icons/ep/download";

defineOptions({ name: "FinanceReportMemberReport" });

const formRef = ref();
const {
  loading,
  columns,
  dataList,
  searchForm,
  dateRange,
  pagination,
  updatedAt,
  currencyOptions,
  showNumOptions,
  payGroupOptions,
  bankcardGroupOptions,
  onSearch,
  resetForm,
  handleManualUpdate,
  handleExport
} = useMemberReport();
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
      <el-form-item :label="$t('finance_report.depositDate')">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          value-format="YYYY-MM-DD"
          :clearable="false"
          range-separator="～"
          :start-placeholder="$t('finance_report.startDate')"
          :end-placeholder="$t('finance_report.endDate')"
          class="!w-[260px]"
        />
      </el-form-item>
      <el-form-item :label="$t('finance_report.currency')" prop="currency">
        <el-select v-model="searchForm.currency" class="!w-[140px]">
          <el-option
            v-for="item in currencyOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('finance_report.quantity')" prop="showNum">
        <el-select v-model="searchForm.showNum" class="!w-[140px]">
          <el-option
            v-for="item in showNumOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('finance_report.paymentGroups')"
        prop="paymentGroup"
      >
        <el-select v-model="searchForm.paymentGroup" class="!w-[160px]">
          <el-option
            v-for="item in payGroupOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('finance_report.bankcardGroups')"
        prop="bankcardGroup"
      >
        <el-select v-model="searchForm.bankcardGroup" class="!w-[160px]">
          <el-option
            v-for="item in bankcardGroupOptions"
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
      :title="$t('finance_report.menuMemberReport')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <span v-if="updatedAt" class="mr-4 text-sm text-gray-500">
          {{ $t("finance_report.lastUpdate") }}：{{ updatedAt }}
        </span>
        <el-button
          type="primary"
          :icon="RefreshRight"
          @click="handleManualUpdate"
        >
          {{ $t("finance_report.manualUpdate") }}
        </el-button>
        <el-button
          v-if="hasAuth('__btn_member_deposit_report_export')"
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
