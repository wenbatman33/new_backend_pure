<script setup lang="ts">
import { ref, computed } from "vue";
import { useLmGameGroup } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import Download from "~icons/ep/download";

defineOptions({ name: "LuckmoneyLmGameGroup" });

const formRef = ref();
const {
  searchForm,
  dateRange,
  loading,
  columns,
  dataList,
  lastUpdatedAt,
  onSearch,
  resetForm,
  handleExport,
  summaryMethod
} = useLmGameGroup();

const title = computed(
  () => `${$t("luckmoney.lastUpdate")}：${lastUpdatedAt.value || ""}`
);
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
      <el-form-item :label="$t('luckmoney.timeInterval')">
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          range-separator="～"
          value-format="YYYY-MM-DD HH:mm:ss"
          format="YYYY/MM/DD HH:mm"
          :start-placeholder="$t('luckmoney.reportDateStart')"
          :end-placeholder="$t('luckmoney.reportDateEnd')"
        />
      </el-form-item>
      <el-form-item :label="$t('luckmoney.memberAccount')" prop="memberAccount">
        <el-input
          v-model="searchForm.memberAccount"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('luckmoney.gameAccount')" prop="gameAccount">
        <el-input
          v-model="searchForm.gameAccount"
          clearable
          class="!w-[160px]"
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
          {{ $t("luckmoney.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm">
          {{ $t("luckmoney.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar :title="title" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_report_game_typegroup_export')"
          type="primary"
          :icon="Download"
          @click="handleExport"
        >
          {{ $t("luckmoney.exportexcel") }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          row-key="gameGroupID"
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          border
          default-expand-all
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :tree-props="{ children: 'children' }"
          show-summary
          :summary-method="summaryMethod"
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
