<script setup lang="ts">
import { ref } from "vue";
import { useLmGameLog } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "GamesLmGameLog" });

const formRef = ref();
const {
  searchForm,
  gameGroupList,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  onSortChange,
  resetForm,
  summaryMethod
} = useLmGameLog();
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
      <el-form-item :label="$t('games.memberID')" prop="memberID">
        <el-input
          v-model="searchForm.memberID"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('games.group')" prop="gameGroupID">
        <el-select
          v-model="searchForm.gameGroupID"
          filterable
          clearable
          class="!w-[180px]"
        >
          <el-option
            v-for="item in gameGroupList"
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
          class="!w-[180px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('games.gameAccountSearch')" prop="gameAccount">
        <el-input
          v-model="searchForm.gameAccount"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('games.settlementTime')">
        <el-date-picker
          v-model="searchForm.settlementTimeStart"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          :placeholder="$t('games.settlementTimeStarts')"
          class="!w-[190px]"
        />
        <span class="px-2">～</span>
        <el-date-picker
          v-model="searchForm.settlementTimeEnd"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          :placeholder="$t('games.settlementTimeEnds')"
          class="!w-[190px]"
        />
      </el-form-item>
      <el-form-item :label="$t('games.bettingTime')">
        <el-date-picker
          v-model="searchForm.bettleTimeStart"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          :placeholder="$t('games.bettingTimeStarts')"
          class="!w-[190px]"
        />
        <span class="px-2">～</span>
        <el-date-picker
          v-model="searchForm.bettleTimeEnd"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          :placeholder="$t('games.bettingTimeEnds')"
          class="!w-[190px]"
        />
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
      :title="$t('games.menuLmGameLog')"
      :columns="columns"
      @refresh="onSearch"
    >
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
