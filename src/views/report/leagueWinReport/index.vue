<script setup lang="ts">
import { ref } from "vue";
import { useLeagueWinReport } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import Download from "~icons/ep/download";

defineOptions({ name: "ReportLeagueWinReport" });

const formRef = ref();
const {
  searchForm,
  dateRange,
  loading,
  columns,
  dataList,
  gameGroupOptions,
  sportOptions,
  leagueOptions,
  teamOptions,
  betTypeOptions,
  teamTypeOptions,
  betLogStatusOptions,
  onSearch,
  resetForm,
  handleExport,
  loadBettingLogDropdown
} = useLeagueWinReport();
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
      <el-form-item :label="$t('report.rangePicker')" prop="dateRange">
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          :range-separator="$t('report.to')"
          :start-placeholder="$t('report.startTime')"
          :end-placeholder="$t('report.endTime')"
          value-format="YYYY-MM-DD HH:mm:ss"
          class="!w-[380px]"
          @change="loadBettingLogDropdown"
        />
      </el-form-item>
      <el-form-item prop="order">
        <el-radio-group
          v-model="searchForm.order"
          @change="loadBettingLogDropdown"
        >
          <el-radio value="1">{{ $t("report.settlementTime") }}</el-radio>
          <el-radio value="2">{{ $t("report.bettingTime") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('report.gameGroup')" prop="gameGroupID">
        <el-select
          v-model="searchForm.gameGroupID"
          multiple
          filterable
          collapse-tags
          clearable
          class="!w-[200px]"
        >
          <el-option
            v-for="item in gameGroupOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('report.sport')" prop="sport">
        <el-select
          v-model="searchForm.sport"
          multiple
          filterable
          collapse-tags
          clearable
          class="!w-[200px]"
          @change="loadBettingLogDropdown"
        >
          <el-option
            v-for="item in sportOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('report.league')" prop="league">
        <el-select
          v-model="searchForm.league"
          multiple
          filterable
          collapse-tags
          clearable
          class="!w-[200px]"
        >
          <el-option
            v-for="item in leagueOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('report.teamType')" prop="teamType">
        <el-select v-model="searchForm.teamType" class="!w-[120px]">
          <el-option
            v-for="item in teamTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('report.team')" prop="team">
        <el-select
          v-model="searchForm.team"
          multiple
          filterable
          collapse-tags
          clearable
          class="!w-[200px]"
        >
          <el-option
            v-for="item in teamOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('report.betType')" prop="betType">
        <el-select
          v-model="searchForm.betType"
          multiple
          filterable
          collapse-tags
          clearable
          class="!w-[200px]"
        >
          <el-option
            v-for="item in betTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('report.betLogStatus')" prop="betLogStatus">
        <el-select
          v-model="searchForm.betLogStatus"
          clearable
          class="!w-[160px]"
        >
          <el-option
            v-for="item in betLogStatusOptions"
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
      :title="$t('report.menuLeagueWinReport')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_report_sportsbook_export')"
          type="primary"
          :icon="Download"
          @click="handleExport"
        >
          {{ $t("report.exportExcel") }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          row-key="title"
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          default-expand-all
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :tree-props="{ children: 'children' }"
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
