<script setup lang="ts">
import { ref } from "vue";
import { useRiskReport } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "ReportRisk" });

const formRef = ref();
const {
  searchForm,
  loading,
  columns,
  dataList,
  pagination,
  latestTime,
  dealwithWayOptions,
  dealwithDeptOptions,
  onSearch,
  resetForm,
  handleSelectionChange,
  handleSave,
  handleBatchDelete,
  handleRiskToday,
  handleExport
} = useRiskReport();
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
      <el-form-item :label="$t('report.rangePicker')" prop="date">
        <el-date-picker
          v-model="searchForm.date"
          type="daterange"
          value-format="YYYY-MM-DD"
          :range-separator="$t('report.to')"
          :start-placeholder="$t('report.startDate')"
          :end-placeholder="$t('report.endDate')"
          class="!w-[260px]"
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
      <el-form-item :label="$t('report.agencyIDS')" prop="agencyID">
        <el-input
          v-model="searchForm.agencyID"
          clearable
          class="!w-[160px]"
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
    <PureTableBar
      :title="$t('report.menuRisk')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button type="primary" @click="handleRiskToday">
          {{ $t("report.manualUpdate") }}
        </el-button>
        <span v-if="latestTime" class="ml-2 text-sm">
          {{ $t("report.latestUpdate") }} : {{ latestTime }}
        </span>
        <el-button type="primary" @click="handleExport">
          {{ $t("report.exportExcel") }}
        </el-button>
        <el-button type="danger" @click="handleBatchDelete">
          {{ $t("report.batchDelete") }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          row-key="id"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @selection-change="handleSelectionChange"
        >
          <!-- 處理內容 -->
          <template #dealwith="{ row }">
            <el-input
              v-model="row.dealwith"
              type="textarea"
              :rows="3"
              class="!w-[180px]"
            />
          </template>
          <!-- 處理方式 -->
          <template #dealwithWay="{ row }">
            <el-select
              v-model="row.dealwithWay"
              clearable
              :placeholder="$t('report.pleaseSelect')"
              class="!w-[210px]"
            >
              <el-option
                v-for="item in dealwithWayOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
          <!-- 處理部門 -->
          <template #dealwithDept="{ row }">
            <el-select
              v-model="row.dealwithDept"
              clearable
              :placeholder="$t('report.pleaseSelect')"
              class="!w-[170px]"
            >
              <el-option
                v-for="item in dealwithDeptOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
          <!-- 操作 -->
          <template #operation="{ row }">
            <el-button
              v-if="hasAuth('__btn_report_risk_save')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="handleSave(row)"
            >
              {{ $t("report.save") }}
            </el-button>
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
