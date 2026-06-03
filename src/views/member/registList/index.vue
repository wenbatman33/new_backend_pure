<script setup lang="ts">
import { ref, computed } from "vue";
import { useRegistList } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Download from "~icons/ep/download";
import Search from "~icons/ep/search";

defineOptions({ name: "MemberRegistList" });

const formRef = ref();
const {
  searchForm,
  loading,
  columns,
  dataList,
  onSearch,
  onDateChange,
  handleExport
} = useRegistList();

// el-date-picker(range) 綁定值
const dateRange = computed<[string, string]>({
  get: () => [searchForm.start, searchForm.end],
  set: val => onDateChange(val)
});
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
      <el-form-item :label="$t('member.timeInterval')">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          value-format="YYYY-MM-DD"
          format="YYYY/MM/DD"
          :clearable="false"
          range-separator="～"
          :start-placeholder="$t('member.reportDateStart')"
          :end-placeholder="$t('member.reportDateEnd')"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="Search"
          :loading="loading"
          @click="onSearch"
        >
          {{ $t("member.search") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('member.menuRegistList')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_member_register_export')"
          type="primary"
          :icon="Download"
          @click="handleExport"
        >
          {{ $t("member.handleExport") }}
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
