<script setup lang="ts">
import { ref } from "vue";
import { useGameReport } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import RefreshRight from "~icons/ep/refresh-right";
import Download from "~icons/ep/download";

defineOptions({ name: "ReportGame" });

const formRef = ref();
const {
  searchForm,
  dataList,
  loading,
  total,
  title,
  columns,
  gameTypeOptions,
  gameGroupOptions,
  onSearch,
  onReportTypeChange,
  resetForm,
  handleUpdate,
  handleExport
} = useGameReport();

// pure-table 合計列：第一欄顯示「合計」，其餘對應欄位取 total
function summaryMethod({ columns: cols }) {
  return cols.map((_, idx) => {
    if (idx === 0) return $t("report.total");
    const prop = cols[idx].property;
    const v = (total.value as any)[prop];
    if (v === "" || v === undefined || v === null) return "-";
    if (prop === "kill") return `${commaDecimalFormat(v, 2)}%`;
    if (prop === "betAmount" || prop === "winAmount")
      return commaDecimalFormat(v, 2);
    return commaDecimalFormat(v);
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
      <el-form-item :label="$t('report.type')" prop="reportType">
        <el-select
          v-model="searchForm.reportType"
          class="!w-[120px]"
          @change="onReportTypeChange"
        >
          <el-option :label="$t('report.dailyReport')" value="d" />
          <el-option :label="$t('report.weeklyReport')" value="w" />
          <el-option :label="$t('report.monthlyReport')" value="m" />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('report.timeInterval')">
        <!-- 日報 -->
        <template v-if="searchForm.reportType === 'd'">
          <el-date-picker
            v-model="searchForm.reportDateStart"
            type="date"
            value-format="YYYY-MM-DD HH:mm:ss"
            format="YYYY/MM/DD"
            :clearable="false"
            class="!w-[150px]"
          />
          <span class="px-2">～</span>
          <el-date-picker
            v-model="searchForm.reportDateEnd"
            type="date"
            value-format="YYYY-MM-DD HH:mm:ss"
            format="YYYY/MM/DD"
            :clearable="false"
            class="!w-[150px]"
          />
        </template>
        <!-- 週報 -->
        <template v-else-if="searchForm.reportType === 'w'">
          <el-date-picker
            v-model="searchForm.reportDateStart"
            type="week"
            value-format="YYYY-MM-DD HH:mm:ss"
            format="YYYY/MM/DD"
            :clearable="false"
            class="!w-[150px]"
          />
          <span class="px-2">～</span>
          <el-date-picker
            v-model="searchForm.reportDateEnd"
            type="week"
            value-format="YYYY-MM-DD HH:mm:ss"
            format="YYYY/MM/DD"
            :clearable="false"
            class="!w-[150px]"
          />
        </template>
        <!-- 月報 -->
        <template v-else>
          <el-date-picker
            v-model="searchForm.reportDateStart"
            type="month"
            value-format="YYYY-MM-DD HH:mm:ss"
            format="YYYY/MM"
            :clearable="false"
            class="!w-[150px]"
          />
          <span class="px-2">～</span>
          <el-date-picker
            v-model="searchForm.reportDateEnd"
            type="month"
            value-format="YYYY-MM-DD HH:mm:ss"
            format="YYYY/MM"
            :clearable="false"
            class="!w-[150px]"
          />
        </template>
      </el-form-item>

      <el-form-item :label="$t('report.gameType')" prop="gameType">
        <!-- TODO: gameType 下拉資料來源（@/utils/dropdown）未移植，暫以空陣列 -->
        <el-select
          v-model="searchForm.gameType"
          clearable
          class="!w-[150px]"
        >
          <el-option
            v-for="item in gameTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('report.gameManufacturers')" prop="gameGroup">
        <!-- TODO: gameGroup 下拉資料來源（@/utils/dropdown）未移植，暫以空陣列 -->
        <el-select
          v-model="searchForm.gameGroup"
          clearable
          class="!w-[150px]"
        >
          <el-option
            v-for="item in gameGroupOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('report.agencyAccount')" prop="agencyAccount">
        <el-input
          v-model="searchForm.agencyAccount"
          clearable
          class="!w-[150px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>

      <el-form-item :label="$t('report.memberAccount')" prop="memberAccount">
        <el-input
          v-model="searchForm.memberAccount"
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
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("report.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar :title="title" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <el-button type="primary" :icon="RefreshRight" @click="handleUpdate">
          {{ $t("report.manualUpdate") }}
        </el-button>
        <el-button
          v-if="hasAuth('__bfn_report_game_export')"
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
