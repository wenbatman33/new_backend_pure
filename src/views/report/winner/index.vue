<script setup lang="ts">
import { ref } from "vue";
import { useWinner } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import Download from "~icons/ep/download";

defineOptions({ name: "ReportWinner" });

const formRef = ref();
const {
  searchForm,
  dateRange,
  loading,
  exportLoading,
  gameGroupOptions,
  columns,
  dataList,
  pagination,
  onSearch,
  onSortChange,
  onSizeChange,
  onCurrentChange,
  resetForm,
  handleExport,
  handleExportRank
} = useWinner();
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
      <el-form-item :label="$t('report.timeInterval')" prop="reportDate">
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          value-format="YYYY-MM-DD HH:mm:ss"
          :start-placeholder="$t('report.reportDateStart')"
          :end-placeholder="$t('report.reportDateEnd')"
          range-separator="~"
        />
      </el-form-item>
      <el-form-item :label="$t('report.topAgencyID')" prop="topAgencyID">
        <el-input
          v-model="searchForm.topAgencyID"
          clearable
          class="!w-[140px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('report.agencyID')" prop="agencyID">
        <el-input
          v-model="searchForm.agencyID"
          clearable
          class="!w-[140px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('report.memberAccount')" prop="memberAccount">
        <el-input
          v-model="searchForm.memberAccount"
          clearable
          class="!w-[140px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('report.gameManufacturers')" prop="gameGroupIDs">
        <el-select
          v-model="searchForm.gameGroupIDs"
          multiple
          filterable
          collapse-tags
          clearable
          class="!w-[260px]"
        >
          <el-option
            v-for="item in gameGroupOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" :loading="loading" @click="onSearch">
          {{ $t("report.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("report.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar :title="$t('report.menuWinner')" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <el-button
          v-if="hasAuth('btn__report_leaderboard_export')"
          type="primary"
          :icon="Download"
          :loading="exportLoading"
          @click="handleExportRank"
        >
          {{ $t("report.exportRankList") }}
        </el-button>
        <el-button type="primary" :icon="Download" @click="handleExport">
          {{ $t("report.exportExcel") }}
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
          @page-size-change="onSizeChange"
          @page-current-change="onCurrentChange"
        >
          <template #memberAccount="{ row }">
            <a
              class="text-primary"
              :href="`/memberDetail/detail/${row.memberID}`"
              target="_blank"
            >
              {{ row.memberAccount }}
            </a>
          </template>
          <template #betCnt="{ row }">
            <a
              v-if="searchForm.gameGroupIDs && searchForm.gameGroupIDs.length === 1"
              class="text-primary"
              :href="`/games/gameLog?memberAccount=${row.memberAccount}&gameGroupID=${searchForm.gameGroupIDs[0]}&start=${dateRange[0]}&end=${dateRange[1]}`"
              target="_blank"
            >
              {{ row.betCnt }}
            </a>
            <span v-else>{{ row.betCnt }}</span>
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
