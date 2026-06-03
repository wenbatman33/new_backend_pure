<script setup lang="ts">
import { ref } from "vue";
import { useOperationRecord } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "AgencyOperationRecord" });

const formRef = ref();
const {
  searchForm,
  opTypeOptions,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm
} = useOperationRecord();
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
      <el-form-item :label="$t('agency.operationRecordAdmin')" prop="adminAccount">
        <el-input
          v-model="searchForm.adminAccount"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('agency.operationRecordTime')" prop="dateRange">
        <el-date-picker
          v-model="searchForm.dateRange"
          type="datetimerange"
          range-separator="～"
          :start-placeholder="$t('agency.operationRecordStartTime')"
          :end-placeholder="$t('agency.operationRecordEndTime')"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item :label="$t('agency.operationRecordOpType')" prop="opType">
        <el-select
          v-model="searchForm.opType"
          clearable
          class="!w-[160px]"
          :placeholder="$t('agency.operationRecordOpType')"
        >
          <el-option
            v-for="item in opTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" :loading="loading" @click="onSearch">
          {{ $t("agency.operationRecordSearch") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("agency.operationRecordReset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('agency.menuOperationRecord')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          row-key="createdAt"
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
