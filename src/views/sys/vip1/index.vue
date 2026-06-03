<script setup lang="ts">
import { ref } from "vue";
import { useVip1 } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "SysVip1" });

const formRef = ref();
const {
  searchForm,
  loading,
  showSubTable,
  groupColumns,
  agencyColumns,
  listColumns,
  groupList,
  agencyList,
  listList,
  onSearch,
  resetForm
} = useVip1();
</script>

<template>
  <div class="main">
    <!-- 搜尋區：以遊戲 ID 查詢 -->
    <el-form
      ref="formRef"
      :inline="true"
      :model="searchForm"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item label="ID" prop="id">
        <el-input
          v-model="searchForm.id"
          clearable
          class="!w-[180px]"
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
          {{ $t("sys.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("sys.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- Group 表 -->
    <PureTableBar :title="$t('sys.gameGroup')" :columns="groupColumns">
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          row-key="id"
          :loading="loading"
          :size="size"
          :data="groupList"
          :columns="dynamicColumns"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        />
      </template>
    </PureTableBar>

    <!-- Agency 表 -->
    <PureTableBar
      v-show="showSubTable"
      class="mt-2"
      :title="$t('sys.gameAgency')"
      :columns="agencyColumns"
    >
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          row-key="id"
          :loading="loading"
          :size="size"
          :data="agencyList"
          :columns="dynamicColumns"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        />
      </template>
    </PureTableBar>

    <!-- List 表 -->
    <PureTableBar
      v-show="showSubTable"
      class="mt-2"
      :title="$t('sys.gameList')"
      :columns="listColumns"
    >
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          row-key="id"
          :loading="loading"
          :size="size"
          :data="listList"
          :columns="dynamicColumns"
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
