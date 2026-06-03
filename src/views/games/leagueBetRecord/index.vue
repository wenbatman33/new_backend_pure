<script setup lang="ts">
import { useLeagueBetRecord } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import Download from "~icons/ep/download";

defineOptions({ name: "GamesLeagueBetRecord" });

const {
  searchForm,
  dateRange,
  ifShowDetail,
  loading,
  columns,
  dataList,
  pagination,
  summary,
  gameGroupOptions,
  sportOptions,
  leagueOptions,
  teamOptions,
  betTypeOptions,
  teamTypeOptions,
  orderOptions,
  isLiveOptions,
  isComboBetOptions,
  betLogStatusOptions,
  findBetItemLabel,
  onSearch,
  onDateChange,
  loadBettingLogDropdown,
  resetForm,
  handleExport
} = useLeagueBetRecord();
</script>

<template>
  <div class="main">
    <!-- 搜尋區 -->
    <el-form
      :inline="true"
      :model="searchForm"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item :label="$t('games.leagueRangePicker')">
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          value-format="YYYY-MM-DD HH:mm:ss"
          :start-placeholder="$t('games.leagueStartTime')"
          :end-placeholder="$t('games.leagueEndTime')"
          @change="onDateChange"
        />
        <el-radio-group
          v-model="searchForm.order"
          class="ml-4"
          @change="loadBettingLogDropdown"
        >
          <el-radio
            v-for="item in orderOptions"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item :label="$t('games.leagueGameGroup')">
        <el-select
          v-model="searchForm.gameGroupID"
          multiple
          filterable
          clearable
          collapse-tags
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

      <el-form-item :label="$t('games.leagueSport')">
        <el-select
          v-model="searchForm.sport"
          multiple
          filterable
          clearable
          collapse-tags
          class="!w-[160px]"
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

      <el-form-item :label="$t('games.leagueLeague')">
        <el-select
          v-model="searchForm.league"
          multiple
          filterable
          clearable
          collapse-tags
          class="!w-[160px]"
        >
          <el-option
            v-for="item in leagueOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('games.leagueTeam')">
        <el-select
          v-model="searchForm.team"
          multiple
          filterable
          clearable
          collapse-tags
          class="!w-[160px]"
        >
          <el-option
            v-for="item in teamOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-radio-group v-model="searchForm.teamType" class="ml-2">
          <el-radio
            v-for="item in teamTypeOptions"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item :label="$t('games.leagueBetType')">
        <el-select
          v-model="searchForm.betType"
          multiple
          filterable
          clearable
          collapse-tags
          class="!w-[160px]"
        >
          <el-option
            v-for="item in betTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('games.leagueIsLive')">
        <el-select
          v-model="searchForm.isLive"
          clearable
          class="!w-[120px]"
        >
          <el-option
            v-for="item in isLiveOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('games.leagueIsComboBet')">
        <el-select
          v-model="searchForm.isComboBet"
          clearable
          class="!w-[120px]"
        >
          <el-option
            v-for="item in isComboBetOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('games.leagueBetLogStatus')">
        <el-select
          v-model="searchForm.betLogStatus"
          clearable
          class="!w-[120px]"
        >
          <el-option
            v-for="item in betLogStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('games.leagueBetAmount')">
        <el-input
          v-model="searchForm.minBetAmount"
          clearable
          class="!w-[100px]"
        />
        <span class="mx-2">~</span>
        <el-input
          v-model="searchForm.maxBetAmount"
          clearable
          class="!w-[100px]"
        />
      </el-form-item>

      <el-form-item>
        <el-checkbox v-model="ifShowDetail">
          {{ $t("games.leagueIfShowDetail") }}
        </el-checkbox>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          :icon="Search"
          :loading="loading"
          @click="onSearch"
        >
          {{ $t("games.leagueSearch") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm">
          {{ $t("games.leagueReset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('games.menuLeagueBetRecord')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_banner_report_export')"
          type="primary"
          :icon="Download"
          @click="handleExport"
        >
          {{ $t("games.leagueExportExcel") }}
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
        >
          <template #betItem="{ row }">
            <div
              v-if="ifShowDetail || row.showDetail"
              class="text-left bet-item-detail"
            >
              <div
                v-for="(betItem, bi) in row.betItemList"
                :key="bi"
                :class="row.betItemList.length > 1 ? 'bet-item-block' : ''"
              >
                <div v-for="(key, ki) in Object.keys(betItem)" :key="ki">
                  {{ findBetItemLabel(key) }} | {{ betItem[key] }}
                </div>
              </div>
            </div>
            <template v-if="row.betItemList && row.betItemList.length > 0">
              <el-button
                v-if="!row.showDetail && !ifShowDetail"
                size="small"
                type="primary"
                @click="row.showDetail = true"
              >
                {{ $t("games.leagueCheck") }}
              </el-button>
              <el-button
                v-if="row.showDetail && !ifShowDetail"
                size="small"
                @click="row.showDetail = false"
              >
                {{ $t("games.leagueCancel") }}
              </el-button>
            </template>
          </template>
        </pure-table>
      </template>
    </PureTableBar>

    <!-- 合計 -->
    <div class="summary-bar bg-bg_color">
      <span class="mr-8">
        {{ $t("games.leagueTotal") }}
      </span>
      <span class="mr-8">
        {{ $t("games.leagueBetAmount") }}：{{ summary.betAmountText }}
      </span>
      <span>
        {{ $t("games.leagueWinAmount") }}：{{ summary.winAmountText }}
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
.bet-item-detail {
  font-size: 12px;
  line-height: 1.6;
}
.bet-item-block {
  margin-bottom: 8px;
  padding: 4px;
  border: 1px solid var(--el-border-color);
}
.summary-bar {
  margin-top: 12px;
  padding: 12px 16px;
  font-weight: bold;
}
</style>
