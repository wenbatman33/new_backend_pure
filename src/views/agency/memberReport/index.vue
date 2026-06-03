<script setup lang="ts">
import { ref } from "vue";
import { useMemberReport } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import Download from "~icons/ep/download";

defineOptions({ name: "AgencyMemberReport" });

const formRef = ref();
const {
  searchForm,
  dateRange,
  platformTypeOptions,
  loading,
  columns,
  dataList,
  pagination,
  totalData,
  onSearch,
  resetForm,
  handleExport,
  handleSizeChange,
  handleCurrentChange
} = useMemberReport();

// pure-table summary：依欄位 prop 從 totalData 取值
function getSummaries({ columns: cols }) {
  return cols.map((col, idx) => {
    if (idx === 0) return totalData.memberAccount ?? $t("agency.memberReportTotal");
    const val = totalData[col.property];
    return val === undefined || val === null ? "" : val;
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
      <el-form-item :label="$t('agency.memberReportAgencyID')" prop="agencyID">
        <el-input
          v-model="searchForm.agencyID"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item
        :label="$t('agency.memberReportAgencyAccount')"
        prop="agencyAccount"
      >
        <el-input
          v-model="searchForm.agencyAccount"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('agency.memberReportDateRange')" prop="dateRange">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          value-format="YYYY-MM-DD"
          format="YYYY/MM/DD"
          :range-separator="'～'"
          :start-placeholder="$t('agency.memberReportStart')"
          :end-placeholder="$t('agency.memberReportEnd')"
          :clearable="false"
        />
      </el-form-item>
      <el-form-item :label="$t('agency.memberReportPlatform')" prop="platformType">
        <el-select v-model="searchForm.platformType" class="!w-[140px]">
          <el-option
            v-for="item in platformTypeOptions"
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
          {{ $t("agency.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("agency.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('agency.menuMemberReport')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_ag_member_report_export')"
          type="primary"
          :icon="Download"
          @click="handleExport"
        >
          {{ $t("agency.handleExport") }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          border
          show-summary
          :summary-method="getSummaries"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
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
