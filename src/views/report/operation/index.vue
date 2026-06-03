<script setup lang="ts">
import { computed } from "vue";
import { useOperationReport } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import Download from "~icons/ep/download";

defineOptions({ name: "ReportOperation" });

const {
  searchForm,
  reportTypeOptions,
  includesTestOptions,
  loading,
  columns,
  dataList,
  lastUpdatedAt,
  onSearch,
  resetForm,
  onReportTypeChange,
  handleExport
} = useOperationReport();

// 表格标题：显示最后更新时间
const tableTitle = computed(
  () => `${$t("report.lastUpdate")}：${lastUpdatedAt.value || ""}`
);
</script>

<template>
  <div class="main">
    <!-- 搜寻区 -->
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

      <!-- 日报：日期区间 -->
      <el-form-item
        v-if="searchForm.reportType === 'd'"
        :label="$t('report.timeInterval')"
      >
        <el-date-picker
          v-model="searchForm.reportDateStart"
          type="date"
          value-format="YYYY-MM-DD"
          :clearable="false"
          class="!w-[150px]"
        />
        <span class="px-2">～</span>
        <el-date-picker
          v-model="searchForm.reportDateEnd"
          type="date"
          value-format="YYYY-MM-DD"
          :clearable="false"
          class="!w-[150px]"
        />
      </el-form-item>

      <!-- 周报：周选择 -->
      <el-form-item
        v-else-if="searchForm.reportType === 'w'"
        :label="$t('report.timeInterval')"
      >
        <el-date-picker
          v-model="searchForm.reportDateStart"
          type="week"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
          :clearable="false"
          class="!w-[150px]"
        />
        <span class="px-2">～</span>
        <el-date-picker
          v-model="searchForm.reportDateEnd"
          type="week"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
          :clearable="false"
          class="!w-[150px]"
        />
      </el-form-item>

      <!-- 月报：月选择 -->
      <el-form-item v-else :label="$t('report.timeInterval')">
        <el-date-picker
          v-model="searchForm.reportDateStart"
          type="month"
          value-format="YYYY-MM-DD"
          :clearable="false"
          class="!w-[150px]"
        />
        <span class="px-2">～</span>
        <el-date-picker
          v-model="searchForm.reportDateEnd"
          type="month"
          value-format="YYYY-MM-DD"
          :clearable="false"
          class="!w-[150px]"
        />
      </el-form-item>

      <el-form-item :label="$t('report.agencyAccount')" prop="agencyAccount">
        <el-input
          v-model="searchForm.agencyAccount"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>

      <el-form-item prop="queryMemberMoney">
        <el-checkbox v-model="searchForm.queryMemberMoney">
          {{ $t("report.searchMemberWalletNeedWait") }}
        </el-checkbox>
      </el-form-item>

      <el-form-item
        :label="$t('report.includeTestAccount')"
        prop="includesTest"
      >
        <el-radio-group v-model="searchForm.includesTest">
          <el-radio-button
            v-for="item in includesTestOptions"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
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

    <!-- 表格区 -->
    <PureTableBar :title="tableTitle" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_report_operation_export')"
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
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          border
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
