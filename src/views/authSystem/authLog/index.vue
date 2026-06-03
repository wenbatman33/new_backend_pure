<script setup lang="ts">
import { ref } from "vue";
import { useAuthLog } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "AuthSystemAuthLog" });

const formRef = ref();
const {
  searchForm,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm
} = useAuthLog();
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
      <el-form-item :label="$t('authSystem.startDate')" prop="startDate">
        <el-date-picker
          v-model="searchForm.startDate"
          type="date"
          value-format="YYYY-MM-DD"
          clearable
          class="!w-[160px]"
        />
      </el-form-item>
      <el-form-item :label="$t('authSystem.endDate')" prop="endDate">
        <el-date-picker
          v-model="searchForm.endDate"
          type="date"
          value-format="YYYY-MM-DD"
          clearable
          class="!w-[160px]"
        />
      </el-form-item>
      <el-form-item :label="$t('authSystem.account')" prop="account">
        <el-input
          v-model="searchForm.account"
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
          {{ $t("authSystem.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("authSystem.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('authSystem.menuAuthLog')"
      :columns="columns"
      @refresh="onSearch"
    >
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

:deep(.auth-log-content-row) {
  margin-bottom: 0;
  line-height: 2rem;
}
</style>
