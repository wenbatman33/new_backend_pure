<script setup lang="ts">
import { ref } from "vue";
import { useEvent0054Recommender } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "ActivityEvent0054Recommender" });

const formRef = ref();
const {
  searchForm,
  disabledDate,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm
} = useEvent0054Recommender();
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
      <el-form-item
        :label="$t('activity.event0054RecommenderAccount')"
        prop="recommenderAccount"
      >
        <el-input
          v-model="searchForm.recommenderAccount"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('activity.event0054Date')" prop="date">
        <el-date-picker
          v-model="searchForm.date"
          type="daterange"
          unlink-panels
          range-separator="~"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          :start-placeholder="$t('activity.event0054StartDate')"
          :end-placeholder="$t('activity.event0054EndDate')"
          :disabled-date="disabledDate"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="Search"
          :loading="loading"
          @click="onSearch"
        >
          {{ $t("activity.event0054Search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("activity.event0054Reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('activity.menuEvent0054Recommender')"
      :columns="columns"
      @refresh="onSearch"
    >
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
