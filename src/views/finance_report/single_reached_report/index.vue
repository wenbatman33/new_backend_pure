<script setup lang="ts">
import { ref } from "vue";
import { useSingleReachedReport } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import Download from "~icons/ep/download";
import RefreshRight from "~icons/ep/refresh-right";

defineOptions({ name: "FinanceReportSingleReachedReport" });

const formRef = ref();
const {
  searchForm,
  hoursOption,
  channelOptions,
  loading,
  columns,
  dataList,
  stat,
  getSummaries,
  onSearch,
  resetForm,
  handleExport
} = useSingleReachedReport();
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
      <el-form-item :label="$t('finance_report.startDate')" prop="reportDateStart">
        <el-date-picker
          v-model="searchForm.reportDateStart"
          type="date"
          value-format="YYYY-MM-DD"
          :clearable="false"
          class="!w-[160px]"
        />
      </el-form-item>
      <el-form-item :label="$t('finance_report.startTime')" prop="reportHourStart">
        <el-select v-model="searchForm.reportHourStart" class="!w-[100px]">
          <el-option
            v-for="item in hoursOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('finance_report.endDate')" prop="reportDateEnd">
        <el-date-picker
          v-model="searchForm.reportDateEnd"
          type="date"
          value-format="YYYY-MM-DD"
          :clearable="false"
          class="!w-[160px]"
        />
      </el-form-item>
      <el-form-item :label="$t('finance_report.endTime')" prop="reportHourEnd">
        <el-select v-model="searchForm.reportHourEnd" class="!w-[100px]">
          <el-option
            v-for="item in hoursOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="`${$t('finance_report.gateway')}id`" prop="payChannelServiceID">
        <el-select v-model="searchForm.payChannelServiceID" class="!w-[160px]">
          <el-option
            v-for="item in channelOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" :loading="loading" @click="onSearch">
          {{ $t("finance_report.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("finance_report.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="`${$t('finance_report.lastUpdate')}：${stat.updatedAt}`"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button type="primary" :icon="RefreshRight" @click="onSearch">
          {{ $t("finance_report.manualUpdate") }}
        </el-button>
        <el-button
          v-if="hasAuth('__btn_single_reached_report_export')"
          type="primary"
          :icon="Download"
          @click="handleExport"
        >
          {{ $t("finance_report.exportexcel") }}
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
          :pagination="false"
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
