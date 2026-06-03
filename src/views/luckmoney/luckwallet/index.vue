<script setup lang="ts">
import { useLuckwallet } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "LuckmoneyLuckwallet" });

const {
  searchForm,
  reportTypeOptions,
  loading,
  columns,
  dataList,
  title,
  summaryMethod,
  onReportTypeChange,
  onSearch,
  resetForm,
  openSettlementPeople
} = useLuckwallet();

/** 依日期类型决定 el-date-picker 的 type */
const pickerTypeMap: Record<string, any> = {
  d: "date",
  w: "week",
  m: "month"
};
</script>

<template>
  <div class="main">
    <!-- 搜寻区 -->
    <el-form
      :inline="true"
      :model="searchForm"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item :label="$t('luckmoney.type')">
        <el-select
          v-model="searchForm.reportType"
          class="!w-[120px]"
          @change="onReportTypeChange"
        >
          <el-option
            v-for="item in reportTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('luckmoney.timeInterval')">
        <el-date-picker
          v-model="searchForm.reportDateStart"
          :type="pickerTypeMap[searchForm.reportType]"
          value-format="YYYY-MM-DD HH:mm:ss"
          format="YYYY/MM/DD"
          :clearable="false"
          class="!w-[160px]"
        />
        <span class="px-2">～</span>
        <el-date-picker
          v-model="searchForm.reportDateEnd"
          :type="pickerTypeMap[searchForm.reportType]"
          value-format="YYYY-MM-DD HH:mm:ss"
          format="YYYY/MM/DD"
          :clearable="false"
          class="!w-[160px]"
        />
      </el-form-item>

      <el-form-item :label="$t('luckmoney.agencyAccount')">
        <el-input
          v-model="searchForm.agencyAccount"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>

      <el-form-item>
        <el-checkbox v-model="searchForm.queryMemberMoney">
          {{ $t("luckmoney.searchMemberWallet") }}
        </el-checkbox>
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

    <!-- 表格区 -->
    <PureTableBar :title="title" :columns="columns" @refresh="onSearch">
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          border
          show-summary
          :summary-method="summaryMethod"
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
          <template #settlementPeople="{ row }">
            <el-button
              v-if="Number(row.settlementPeople) > 0"
              link
              type="primary"
              @click="openSettlementPeople(row)"
            >
              {{ row.settlementPeople }}
            </el-button>
            <span v-else>0</span>
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
