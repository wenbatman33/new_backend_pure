<script setup lang="ts">
import { ref } from "vue";
import { useLgGame } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import RefreshRight from "~icons/ep/refresh-right";

defineOptions({ name: "ReportLgGame" });

const formRef = ref();
const {
  searchForm,
  walletTypeOptions,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  openRecalculateDialog
} = useLgGame();
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
      <el-form-item :label="$t('report.month')" prop="date">
        <el-date-picker
          v-model="searchForm.date"
          type="month"
          value-format="YYYY-MM"
          class="!w-[160px]"
          :placeholder="$t('report.searchDesc')"
        />
      </el-form-item>
      <el-form-item :label="$t('report.walletType')" prop="walletType">
        <el-select
          v-model="searchForm.walletType"
          clearable
          class="!w-[160px]"
          :placeholder="$t('report.walletType')"
        >
          <el-option
            v-for="item in walletTypeOptions"
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
      :title="$t('report.menuLgGame')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__bnt_gamegroup_reconciliation_recalculate')"
          type="primary"
          :icon="RefreshRight"
          @click="openRecalculateDialog"
        >
          {{ $t("report.manualUpdate") }}
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
