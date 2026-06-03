<script setup lang="ts">
import { ref } from "vue";
import { useChildAgencyReport } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import Download from "~icons/ep/download";

defineOptions({ name: "AgencyChildAgencyReport" });

const formRef = ref();
const {
  searchForm,
  dateRange,
  memberTypeOptions,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  onDateRangeChange,
  resetForm,
  onSortChange,
  onSizeChange,
  onCurrentChange,
  handleExport,
  getSummaries
} = useChildAgencyReport();
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
      <el-form-item :label="$t('agency.childAgencyReportAgencyID')" prop="agencyID">
        <el-input
          v-model="searchForm.agencyID"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item
        :label="$t('agency.childAgencyReportAgencyAccount')"
        prop="agencyAccount"
      >
        <el-input
          v-model="searchForm.agencyAccount"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('agency.childAgencyReportMemberType')" prop="memberType">
        <el-select
          v-model="searchForm.memberType"
          clearable
          class="!w-[160px]"
        >
          <el-option
            v-for="item in memberTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('agency.childAgencyReportDateRange')" prop="reportDate">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          value-format="YYYY-MM-DD"
          range-separator="～"
          :start-placeholder="$t('agency.childAgencyReportStartDate')"
          :end-placeholder="$t('agency.childAgencyReportEndDate')"
          :clearable="false"
          @change="onDateRangeChange"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" :loading="loading" @click="onSearch">
          {{ $t("agency.childAgencyReportSearch") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("agency.childAgencyReportReset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('agency.menuChildAgencyReport')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_report_childagency_export')"
          type="primary"
          :icon="Download"
          @click="handleExport"
        >
          {{ $t("agency.childAgencyReportExport") }}
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
          :pagination="pagination"
          show-summary
          :summary-method="getSummaries"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @sort-change="onSortChange"
          @page-size-change="onSizeChange"
          @page-current-change="onCurrentChange"
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
