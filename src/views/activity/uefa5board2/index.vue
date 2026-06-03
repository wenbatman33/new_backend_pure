<script setup lang="ts">
import { ref } from "vue";
import { useUefa5Board2 } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import Upload from "~icons/ep/upload-filled";

defineOptions({ name: "ActivityUefa5board2" });

const formRef = ref();
const {
  searchForm,
  leagueOptions,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  loadLeagueOptions,
  updateAllLists
} = useUefa5Board2();

// 切換是否顯示未啟用聯賽時，重新載入下拉
function onShowInactiveChange() {
  loadLeagueOptions();
}
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
      <el-form-item :label="$t('activity.uefa5board2League')" prop="league">
        <el-select
          v-model="searchForm.league"
          clearable
          class="!w-[160px]"
          :placeholder="$t('activity.uefa5board2PleaseChoiceLeague')"
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
          @change="onShowInactiveChange"
        >
          {{ $t("activity.uefa5board2ShowInactiveLeague") }}
        </el-checkbox>
      </el-form-item>
      <el-form-item :label="$t('activity.uefa5board2Team')" prop="team">
        <el-input
          v-model="searchForm.team"
          clearable
          class="!w-[160px]"
          :placeholder="$t('activity.uefa5board2PleaseInputTeam')"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="Search"
          :loading="loading"
          @click="onSearch"
        >
          {{ $t("activity.uefa5board2Search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("activity.uefa5board2Reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('activity.menuUefa5board2')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_UEFA5board2_edit') && dataList[0]"
          type="primary"
          :icon="Upload"
          @click="updateAllLists"
        >
          {{ $t("activity.uefa5board2SaveAll") }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          row-key="worldCupTeamId"
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
