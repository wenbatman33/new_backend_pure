<script setup lang="ts">
import { useGameList } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import Download from "~icons/ep/download";

defineOptions({ name: "ReportGameList" });

const {
  searchForm,
  dataList,
  loading,
  columns,
  gameTypeOptions,
  gameListOptions,
  filteredGameGroupOptions,
  showMaintainGameGroup,
  onSearch,
  onSortChange,
  summaryMethod,
  resetForm,
  handleExport
} = useGameList();
</script>

<template>
  <div class="main">
    <!-- 搜尋區 -->
    <el-form
      :inline="true"
      :model="searchForm"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item :label="$t('report.startDate')" prop="start">
        <el-date-picker
          v-model="searchForm.start"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item :label="$t('report.endDate')" prop="end">
        <el-date-picker
          v-model="searchForm.end"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item :label="$t('report.memberAccount')" prop="memberAccount">
        <el-input
          v-model="searchForm.memberAccount"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
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
      <el-form-item :label="$t('report.gameManufacturers')" prop="gameGroupId">
        <div class="flex items-center gap-2">
          <el-select
            v-model="searchForm.gameGroupId"
            clearable
            class="!w-[150px]"
          >
            <el-option
              v-for="item in filteredGameGroupOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-checkbox v-model="showMaintainGameGroup" />
          <span>{{ $t("report.showMaintainGameGroup") }}</span>
        </div>
      </el-form-item>
      <el-form-item :label="$t('report.gameListId')" prop="gameListId">
        <el-select v-model="searchForm.gameListId" clearable class="!w-[160px]">
          <el-option
            v-for="item in gameListOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('report.gameType')" prop="gameTypeId">
        <el-select v-model="searchForm.gameTypeId" clearable class="!w-[160px]">
          <el-option
            v-for="item in gameTypeOptions"
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
        <el-button :icon="Refresh" @click="resetForm">
          {{ $t("report.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('report.menuGameList')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_report_gamelist_export')"
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
          border
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
          @sort-change="onSortChange"
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
