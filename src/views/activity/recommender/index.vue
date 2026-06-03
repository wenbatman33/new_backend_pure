<script setup lang="ts">
import { ref } from "vue";
import { useRecommender } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import View from "~icons/ep/view";

defineOptions({ name: "ActivityRecommender" });

const formRef = ref();
const {
  dateType,
  searchForm,
  reportTypeOptions,
  loading,
  columns,
  dataList,
  pagination,
  getSummaries,
  onReportTypeChange,
  onSearch,
  resetForm,
  openDetail
} = useRecommender();
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
      <el-form-item :label="$t('activity.recommenderReportType')" prop="reportType">
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

      <el-form-item :label="$t('activity.recommenderDateRange')">
        <!-- 日报：日期区间 -->
        <el-date-picker
          v-if="dateType === 'd'"
          v-model="searchForm.startDate"
          type="date"
          value-format="YYYY-MM-DD"
          :clearable="false"
          class="!w-[150px]"
        />
        <!-- 周报：周区间 -->
        <el-date-picker
          v-else-if="dateType === 'w'"
          v-model="searchForm.startDate"
          type="week"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
          :clearable="false"
          class="!w-[150px]"
        />
        <!-- 月报：月区间 -->
        <el-date-picker
          v-else
          v-model="searchForm.startDate"
          type="month"
          value-format="YYYY-MM-DD"
          :clearable="false"
          class="!w-[150px]"
        />
        <span class="px-2">～</span>
        <el-date-picker
          v-if="dateType === 'd'"
          v-model="searchForm.endDate"
          type="date"
          value-format="YYYY-MM-DD"
          :clearable="false"
          class="!w-[150px]"
        />
        <el-date-picker
          v-else-if="dateType === 'w'"
          v-model="searchForm.endDate"
          type="week"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
          :clearable="false"
          class="!w-[150px]"
        />
        <el-date-picker
          v-else
          v-model="searchForm.endDate"
          type="month"
          value-format="YYYY-MM-DD"
          :clearable="false"
          class="!w-[150px]"
        />
      </el-form-item>

      <el-form-item :label="$t('activity.recommenderAccount')" prop="account">
        <el-input
          v-model="searchForm.account"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :icon="Search" :loading="loading" @click="onSearch">
          {{ $t("activity.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("activity.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('activity.menuRecommender')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
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
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="View"
              @click="openDetail(row)"
            >
              {{ $t("activity.detail") }}
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
