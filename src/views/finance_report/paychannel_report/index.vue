<script setup lang="ts">
import { ref } from "vue";
import { usePaychannelReport } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import EditPen from "~icons/ep/edit-pen";
import Download from "~icons/ep/download";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "FinanceReportPaychannelReport" });

const formRef = ref();
const {
  searchForm,
  showDisabledPayChannelID,
  showDisabledService,
  loading,
  columns,
  dataList,
  pagination,
  subjectOptions,
  payChannelOptions,
  serviceOptions,
  summaryMethod,
  onSearch,
  resetForm,
  exportXlsx,
  handleEditNote,
  handleShowDisabledService,
  handleShowDisabledPayChannelID
} = usePaychannelReport();
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
      <el-form-item :label="$t('finance_report.tradeTime')">
        <el-date-picker
          v-model="searchForm.createdAtStart"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          format="YYYY/MM/DD HH:mm"
          class="!w-[180px]"
          :placeholder="$t('finance_report.startTime')"
        />
        <span class="px-2">~</span>
        <el-date-picker
          v-model="searchForm.createdAtEnd"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          format="YYYY/MM/DD HH:mm"
          class="!w-[180px]"
          :placeholder="$t('finance_report.endTime')"
        />
      </el-form-item>

      <el-form-item :label="$t('finance_report.merchantNumber')">
        <el-select v-model="searchForm.payChannelID" clearable class="!w-[160px]">
          <el-option :label="$t('finance_report.all')" :value="0" />
          <el-option
            v-for="item in payChannelOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-checkbox
          v-model="showDisabledPayChannelID"
          @change="handleShowDisabledPayChannelID"
        >
          {{ $t("finance_report.showDisabledMerchantNumber") }}
        </el-checkbox>
      </el-form-item>

      <el-form-item :label="$t('finance_report.gateway')">
        <el-select
          v-model="searchForm.payChannelService"
          clearable
          class="!w-[160px]"
        >
          <el-option :label="$t('finance_report.all')" value="" />
          <el-option
            v-for="item in serviceOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-checkbox
          v-model="showDisabledService"
          @change="handleShowDisabledService"
        >
          {{ $t("finance_report.showDisabledLines") }}
        </el-checkbox>
      </el-form-item>

      <el-form-item :label="$t('finance_report.subject')">
        <el-select
          v-model="searchForm.subjects"
          multiple
          clearable
          collapse-tags
          collapse-tags-tooltip
          class="!w-[260px]"
        >
          <el-option
            v-for="item in subjectOptions"
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
      :title="$t('finance_report.menuPaychannelReport')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_paychannel_report_export')"
          type="primary"
          :icon="Download"
          @click="exportXlsx"
        >
          {{ $t("finance_report.exportExcel") }}
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
          :pagination="pagination"
          show-summary
          :summary-method="summaryMethod"
          :max-height="600"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        >
          <template #note="{ row }">
            <div class="flex items-center justify-between">
              <span class="truncate">{{ row.note }}</span>
              <el-button
                link
                type="primary"
                :icon="EditPen"
                @click="handleEditNote(row)"
              />
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
