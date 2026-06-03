<script setup lang="ts">
import { ref } from "vue";
import { useUsdtReport } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import EditPen from "~icons/ep/edit-pen";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import Download from "~icons/ep/download";

defineOptions({ name: "FinanceReportUsdtReport" });

const formRef = ref();
const {
  searchForm,
  loading,
  columns,
  dataList,
  usdtOptions,
  summaryInfo,
  onSearch,
  resetForm,
  openNoteDialog,
  exportXlsx
} = useUsdtReport();
</script>

<template>
  <div class="main">
    <!-- 搜寻区 -->
    <el-form
      ref="formRef"
      :inline="true"
      :model="searchForm"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item :label="$t('finance_report.tradeTime')" prop="dateRange">
        <el-date-picker
          v-model="searchForm.dateRange"
          type="datetimerange"
          range-separator="～"
          :start-placeholder="$t('finance_report.startDate')"
          :end-placeholder="$t('finance_report.endDate')"
          format="YYYY/MM/DD HH:mm"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="U Account ID" prop="usdtID">
        <el-select
          v-model="searchForm.usdtID"
          clearable
          class="!w-[180px]"
          :placeholder="$t('finance_report.chooseText')"
        >
          <el-option
            v-for="item in usdtOptions"
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

    <!-- 表格区 -->
    <PureTableBar
      :title="$t('finance_report.menuUsdtReport')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <span class="mr-4 text-sm">
          {{ $t("finance_report.quantity") }}：{{ summaryInfo.count }}
          （{{ $t("finance_report.dataProfit") }}：{{ summaryInfo.countIn }}
          {{ $t("finance_report.dataExpense") }}：{{ summaryInfo.countOut }}）
        </span>
        <el-button
          v-if="hasAuth('__btn_usdt_datily_detail_export')"
          type="primary"
          :icon="Download"
          @click="exportXlsx"
        >
          {{ $t("finance_report.exportexcel") }}
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
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        >
          <template #note="{ row }">
            <div class="flex items-center justify-between">
              <span class="truncate">{{ row.note }}</span>
              <el-icon
                class="ml-2 cursor-pointer"
                @click="openNoteDialog(row)"
              >
                <component :is="EditPen" />
              </el-icon>
            </div>
          </template>
        </pure-table>
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
