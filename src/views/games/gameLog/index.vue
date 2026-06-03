<script setup lang="ts">
import { ref } from "vue";
import { useGameLog } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import Download from "~icons/ep/download";

defineOptions({ name: "GamesGameLog" });

const formRef = ref();
const {
  searchForm,
  loading,
  columns,
  dataList,
  pagination,
  gameGroupOptions,
  gameListOptions,
  betLogStatusOptions,
  onSearch,
  resetForm,
  handleSortChange,
  handleExport,
  handleTimeTypeChange
} = useGameLog();
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
      <el-form-item :label="$t('games.memberAccount')" prop="memberAccount">
        <el-input
          v-model="searchForm.memberAccount"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('games.group')" prop="gameGroupID">
        <el-select
          v-model="searchForm.gameGroupID"
          clearable
          filterable
          class="!w-[180px]"
        >
          <el-option
            v-for="item in gameGroupOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('games.gameList')" prop="gameListID">
        <el-select
          v-model="searchForm.gameListID"
          clearable
          filterable
          class="!w-[180px]"
        >
          <el-option
            v-for="item in gameListOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('games.gameBettingNumberSearch')" prop="betId">
        <el-input
          v-model="searchForm.betId"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('games.bettingRecordStatus')" prop="betLogStatus">
        <el-select
          v-model="searchForm.betLogStatus"
          clearable
          class="!w-[140px]"
        >
          <el-option
            v-for="item in betLogStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <!-- 時間區間 + 時間類型切換 -->
      <el-form-item :label="$t('games.time')">
        <template v-if="searchForm.timeType === 'settlementTime'">
          <el-date-picker
            v-model="searchForm.settlementTimeStart"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            :placeholder="$t('games.settlementTimeStarts')"
            class="!w-[185px]"
          />
          <span class="mx-1">~</span>
          <el-date-picker
            v-model="searchForm.settlementTimeEnd"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            :placeholder="$t('games.settlementTimeEnds')"
            class="!w-[185px]"
          />
        </template>
        <template v-else>
          <el-date-picker
            v-model="searchForm.betTimeStart"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            :placeholder="$t('games.bettingTimeStarts')"
            class="!w-[185px]"
          />
          <span class="mx-1">~</span>
          <el-date-picker
            v-model="searchForm.betTimeEnd"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            :placeholder="$t('games.bettingTimeEnds')"
            class="!w-[185px]"
          />
        </template>
      </el-form-item>
      <el-form-item>
        <el-radio-group
          v-model="searchForm.timeType"
          @change="handleTimeTypeChange"
        >
          <el-radio value="settlementTime">
            {{ $t("games.platformSettlementTime") }}
          </el-radio>
          <el-radio value="betTime">
            {{ $t("games.platformBettingTime") }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item :label="$t('games.keywordSearch')" prop="keyword">
        <el-input
          v-model="searchForm.keyword"
          clearable
          class="!w-[200px]"
          @keyup.enter="onSearch"
        />
        <span class="ml-1 text-[12px] text-[red]">
          {{ $t("games.keywordSearchWarning") }}
        </span>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          :icon="Search"
          :loading="loading"
          @click="onSearch"
        >
          {{ $t("games.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("games.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('games.menuGameLog')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__bnt_member_played_log_export')"
          type="primary"
          :icon="Download"
          @click="handleExport"
        >
          {{ $t("games.handleExport") }}
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
          @sort-change="handleSortChange"
          @page-size-change="onSearch"
          @page-current-change="onSearch"
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
