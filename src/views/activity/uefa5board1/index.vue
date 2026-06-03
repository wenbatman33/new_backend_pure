<script setup lang="ts">
import { ref } from "vue";
import { useUefa5Board1 } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "ActivityUefa5board1" });

const formRef = ref();
const {
  searchForm,
  leagueOptions,
  groupList,
  matchTypeList,
  loading,
  columns,
  dataList,
  onSearch,
  resetForm,
  modify,
  updateAllLists,
  loadLeagueOptions
} = useUefa5Board1();
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
      <el-form-item :label="$t('activity.uefa5League')" prop="league">
        <el-select
          v-model="searchForm.league"
          clearable
          class="!w-[160px]"
          :placeholder="$t('activity.uefa5PleaseChoiceLeague')"
        >
          <el-option
            v-for="item in leagueOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="showInactive">
        <el-checkbox
          v-model="searchForm.showInactive"
          @change="loadLeagueOptions"
        >
          {{ $t("activity.uefa5ShowInactiveLeague") }}
        </el-checkbox>
      </el-form-item>
      <el-form-item :label="$t('activity.uefa5TeamName')" prop="team">
        <el-input
          v-model="searchForm.team"
          clearable
          class="!w-[160px]"
          :placeholder="$t('activity.uefa5PleaseEnterTeamName')"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('activity.uefa5Year')" prop="year">
        <el-input
          v-model="searchForm.year"
          clearable
          class="!w-[140px]"
          :placeholder="$t('activity.uefa5PleaseEnterYear')"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('activity.uefa5MatchProcess')" prop="matchType">
        <el-select v-model="searchForm.matchType" class="!w-[140px]">
          <el-option :label="$t('activity.all')" :value="0" />
          <el-option
            v-for="item in matchTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('activity.uefa5MatchGroup')" prop="matchGroup">
        <el-select
          v-model="searchForm.matchGroup"
          multiple
          clearable
          collapse-tags
          class="!w-[200px]"
          :placeholder="$t('activity.uefa5PleaseChoiceMatchGroup')"
        >
          <el-option
            v-for="item in groupList"
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
          {{ $t("activity.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("activity.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('activity.menuUefa5board1')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_UEFA5board1_edit') && dataList[0]"
          type="primary"
          @click="updateAllLists"
        >
          {{ $t("activity.saveAll") }}
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
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        >
          <template #year="{ row }">
            <el-input
              :model-value="row.year"
              size="small"
              @input="val => modify(val, 'year', row.worldCupTeamId)"
            />
          </template>
          <template #matchGroup="{ row }">
            <el-select
              :model-value="row.matchGroup"
              size="small"
              :placeholder="$t('activity.uefa5PleaseChoiceMatchGroup')"
              @change="val => modify(val, 'matchGroup', row.worldCupTeamId)"
            >
              <el-option
                v-for="item in groupList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
          <template #rank="{ row }">
            <el-input
              :model-value="row.rank"
              size="small"
              @input="val => modify(val, 'rank', row.worldCupTeamId)"
            />
          </template>
          <template #matchTimes="{ row }">
            <el-input
              :model-value="row.matchTimes"
              size="small"
              @input="val => modify(val, 'matchTimes', row.worldCupTeamId)"
            />
          </template>
          <template #win="{ row }">
            <el-input
              :model-value="row.win"
              size="small"
              @input="val => modify(val, 'win', row.worldCupTeamId)"
            />
          </template>
          <template #tie="{ row }">
            <el-input
              :model-value="row.tie"
              size="small"
              @input="val => modify(val, 'tie', row.worldCupTeamId)"
            />
          </template>
          <template #lose="{ row }">
            <el-input
              :model-value="row.lose"
              size="small"
              @input="val => modify(val, 'lose', row.worldCupTeamId)"
            />
          </template>
          <template #difference="{ row }">
            <el-input
              :model-value="row.difference"
              size="small"
              @input="val => modify(val, 'difference', row.worldCupTeamId)"
            />
          </template>
          <template #score="{ row }">
            <el-input
              :model-value="row.score ? row.score : 0"
              size="small"
              @input="val => modify(val, 'score', row.worldCupTeamId)"
            />
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
