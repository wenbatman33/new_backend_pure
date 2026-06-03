<script setup lang="ts">
import { ref } from "vue";
import { useReportAdjustment } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "ReportAdjustment" });

const formRef = ref();
const {
  searchForm,
  adjustmentTypeOptions,
  reportTypeOptions,
  reasonOptions,
  loading,
  columns,
  dataList,
  onSearch,
  resetForm
} = useReportAdjustment();
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
        :label="$t('report.upperAndLowerTypes')"
        prop="adjustmentType"
      >
        <el-select
          v-model="searchForm.adjustmentType"
          class="!w-[160px]"
        >
          <el-option
            v-for="item in adjustmentTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('report.type')" prop="reportType">
        <el-select v-model="searchForm.reportType" class="!w-[120px]">
          <el-option
            v-for="item in reportTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('report.timeInterval')">
        <el-date-picker
          v-if="searchForm.reportType === 'd'"
          v-model="searchForm.reportDateStart"
          type="date"
          value-format="YYYY-MM-DD 00:00:00"
          format="YYYY/MM/DD"
          :clearable="false"
          class="!w-[150px]"
        />
        <el-date-picker
          v-else-if="searchForm.reportType === 'w'"
          v-model="searchForm.reportDateStart"
          type="week"
          value-format="YYYY-MM-DD 00:00:00"
          format="YYYY/MM/DD"
          :clearable="false"
          class="!w-[150px]"
        />
        <el-date-picker
          v-else
          v-model="searchForm.reportDateStart"
          type="month"
          value-format="YYYY-MM-DD 00:00:00"
          format="YYYY/MM"
          :clearable="false"
          class="!w-[150px]"
        />
        <span class="px-2">～</span>
        <el-date-picker
          v-if="searchForm.reportType === 'd'"
          v-model="searchForm.reportDateEnd"
          type="date"
          value-format="YYYY-MM-DD 23:59:59"
          format="YYYY/MM/DD"
          :clearable="false"
          class="!w-[150px]"
        />
        <el-date-picker
          v-else-if="searchForm.reportType === 'w'"
          v-model="searchForm.reportDateEnd"
          type="week"
          value-format="YYYY-MM-DD 23:59:59"
          format="YYYY/MM/DD"
          :clearable="false"
          class="!w-[150px]"
        />
        <el-date-picker
          v-else
          v-model="searchForm.reportDateEnd"
          type="month"
          value-format="YYYY-MM-DD 23:59:59"
          format="YYYY/MM"
          :clearable="false"
          class="!w-[150px]"
        />
      </el-form-item>

      <el-form-item
        :label="$t('report.agencyAccount')"
        prop="agencyAccount"
      >
        <el-input
          v-model="searchForm.agencyAccount"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>

      <el-form-item :label="$t('report.reason')" prop="reason">
        <el-select v-model="searchForm.reason" class="!w-[180px]">
          <el-option
            v-for="item in reasonOptions"
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

    <!-- 表格區（樹狀彙總，含合計） -->
    <PureTableBar
      :title="$t('report.menuAdjustment')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          row-key="date"
          table-layout="auto"
          border
          show-summary
          default-expand-all
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :tree-props="{ children: 'children' }"
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
