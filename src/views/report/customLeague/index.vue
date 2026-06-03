<script setup lang="ts">
import { ref } from "vue";
import { useCustomLeague } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import Download from "~icons/ep/download";

defineOptions({ name: "ReportCustomLeague" });

const formRef = ref();
const {
  searchForm,
  loading,
  columns,
  dataList,
  leagueOptions,
  onSearch,
  resetForm,
  handleExport,
  getSummaries
} = useCustomLeague();
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
          range-separator="~"
          :start-placeholder="$t('report.startTime')"
          :end-placeholder="$t('report.endTime')"
          class="!w-[260px]"
        />
      </el-form-item>
      <el-form-item :label="$t('report.leagueSelect')" prop="leagueID">
        <el-select
          v-model="searchForm.leagueID"
          multiple
          filterable
          clearable
          collapse-tags
          collapse-tags-tooltip
          class="!w-[260px]"
          :placeholder="$t('report.leagueSelect')"
        >
          <el-option
            v-for="item in leagueOptions"
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
      :title="$t('report.menuCustomLeague')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_report_custom_league')"
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
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :show-summary="true"
          :summary-method="getSummaries"
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
