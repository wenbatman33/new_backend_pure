<script setup lang="ts">
import { usePlayerReport } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import Download from "~icons/ep/download";

defineOptions({ name: "LuckmoneyPlayerReport" });

const {
  searchForm,
  dateRange,
  loading,
  columns,
  dataList,
  pagination,
  gameGroupList,
  onSearch,
  onSortChange,
  resetForm,
  handleExport
} = usePlayerReport();
</script>

<template>
  <div class="main">
    <!-- 搜尋區 -->
    <el-form
      :inline="true"
      :model="searchForm"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item :label="$t('luckmoney.timeInterval')" prop="reportTime">
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          range-separator="～"
          :start-placeholder="$t('luckmoney.startTime')"
          :end-placeholder="$t('luckmoney.endTime')"
          format="YYYY/MM/DD HH:mm"
          value-format="YYYY-MM-DD HH:mm:ss"
          class="!w-[360px]"
        />
      </el-form-item>
      <el-form-item :label="$t('luckmoney.agencyId')" prop="agencyID">
        <el-input
          v-model="searchForm.agencyID"
          clearable
          class="!w-[140px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('luckmoney.activityId')" prop="promotionID">
        <el-input
          v-model="searchForm.promotionID"
          clearable
          class="!w-[140px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('luckmoney.activityData')" prop="promotionFiltType">
        <el-checkbox v-model="searchForm.promotionFiltType" />
      </el-form-item>
      <el-form-item :label="$t('luckmoney.memberAccount')" prop="memberAccount">
        <el-input
          v-model="searchForm.memberAccount"
          clearable
          class="!w-[140px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('luckmoney.gameAccount')" prop="gameAccount">
        <el-input
          v-model="searchForm.gameAccount"
          clearable
          class="!w-[140px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('luckmoney.gameManufacturers')" prop="gameGroupIDs">
        <el-select
          v-model="searchForm.gameGroupIDs"
          multiple
          clearable
          collapse-tags
          collapse-tags-tooltip
          class="!w-[260px]"
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
        <el-button type="primary" :icon="Search" :loading="loading" @click="onSearch">
          {{ $t("luckmoney.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm">
          {{ $t("luckmoney.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('luckmoney.menuPlayerReport')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button type="primary" :icon="Download" @click="handleExport">
          {{ $t("luckmoney.handleExport") }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          border
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
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
