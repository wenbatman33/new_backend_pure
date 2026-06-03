<script setup lang="ts">
import { ref } from "vue";
import { useBankcardReport } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import EditPen from "~icons/ep/edit-pen";
import Download from "~icons/ep/download";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "FinanceReportBankcardReport" });

const formRef = ref();
const {
  searchForm,
  loading,
  columns,
  dataList,
  total,
  cardNoOptions,
  subjectOptions,
  onSearch,
  resetForm,
  refreshCardOptions,
  exportXlsx,
  handleEditNote
} = useBankcardReport();
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
      <el-form-item :label="$t('finance_report.tradeTime')" prop="dateRange">
        <el-date-picker
          v-model="searchForm.dateRange"
          type="datetimerange"
          value-format="YYYY-MM-DD HH:mm:ss"
          range-separator="～"
          :start-placeholder="$t('finance_report.startDate')"
          :end-placeholder="$t('finance_report.endDate')"
          class="!w-[380px]"
        />
      </el-form-item>

      <el-form-item
        :label="$t('finance_report.withdrawalCardNumber')"
        prop="cardNo"
      >
        <el-select
          v-model="searchForm.cardNo"
          filterable
          clearable
          class="!w-[220px]"
        >
          <el-option
            v-for="item in cardNoOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item prop="showDisabledCardNo">
        <el-checkbox
          v-model="searchForm.showDisabledCardNo"
          @change="refreshCardOptions"
        >
          {{ $t("finance_report.showDeactivatedBankCard") }}
        </el-checkbox>
      </el-form-item>

      <el-form-item :label="$t('finance_report.subject')" prop="subjects">
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
        <el-button :icon="Refresh" @click="resetForm($refs.formRef)">
          {{ $t("finance_report.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('finance_report.menuBankcardReport')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <div class="flex items-center">
          <el-button
            v-if="hasAuth('__btn_bankcard_report_export')"
            type="primary"
            :icon="Download"
            @click="exportXlsx"
          >
            {{ $t("finance_report.exportExcel") }}
          </el-button>
          <span class="mx-2"
            >{{ $t("finance_report.totalCount") }}: {{ total.count }}</span
          >
          <span class="mx-2"
            >({{ $t("finance_report.income") }}: {{ total.countIn }}</span
          >
          <span class="mx-2"
            >{{ $t("finance_report.expenditure") }}: {{ total.countOut }})</span
          >
        </div>
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
              <el-button
                class="flex-shrink-0"
                link
                type="primary"
                :icon="EditPen"
                :size="size"
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
