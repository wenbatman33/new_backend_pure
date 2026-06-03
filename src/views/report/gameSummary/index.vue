<script setup lang="ts">
import { ref } from "vue";
import { useGameSummary } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import Setting from "~icons/ep/setting";
import Refund from "~icons/ri/refund-2-line";

defineOptions({ name: "ReportGameSummary" });

const formRef = ref();
const {
  searchForm,
  dateRange,
  loading,
  columns,
  dataList,
  pagination,
  gameGroupList,
  onSearch,
  resetForm,
  openReCalcDialog,
  openBettingLogSetting
} = useGameSummary();
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
      <el-form-item :label="$t('report.dateRange')" prop="dateRange">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          value-format="YYYY-MM-DD"
          :range-separator="$t('report.to')"
          :start-placeholder="$t('report.startDate')"
          :end-placeholder="$t('report.endDate')"
        />
      </el-form-item>
      <el-form-item :label="$t('report.gameVendor')" prop="gameGroupID">
        <el-select
          v-model="searchForm.gameGroupID"
          clearable
          filterable
          class="!w-[220px]"
          :placeholder="$t('report.gameVendor')"
        >
          <el-option
            v-for="item in gameGroupList"
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
          {{ $t("report.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("report.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('report.menuGameSummary')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_bettinglog_setting_create')"
          type="primary"
          :icon="Setting"
          @click="openBettingLogSetting"
        >
          {{ $t("report.vendorSetting") }}
        </el-button>
        <el-button type="primary" :icon="Refund" @click="openReCalcDialog">
          {{ $t("report.reCalc") }}
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
