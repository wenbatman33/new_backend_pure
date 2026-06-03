<script setup lang="ts">
import { ref, computed } from "vue";
import dayjs from "dayjs";
import { useDailyReport } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import View from "~icons/ep/view";

defineOptions({ name: "AgencyDailyReport" });

const formRef = ref();
const {
  searchForm,
  giveOfferOptions,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  openActive
} = useDailyReport();

// 标题：显示最后一笔（合计列前一笔）的日期
const title = computed(() => {
  const rows = dataList.value.filter((r: any) => !r.isSummary);
  const last = rows[rows.length - 1];
  const date = last?.date ? dayjs(last.date).format("YYYY-MM-DD") : "";
  return `${$t("agency.dailyReportTitle")}${date}`;
});
</script>

<template>
  <div class="main">
    <!-- 搜寻区 -->
    <el-form
      ref="formRef"
      :inline="true"
      :model="searchForm"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item :label="$t('agency.dailyReportDateRange')">
        <el-date-picker
          v-model="searchForm.reportDateStart"
          type="date"
          value-format="YYYY-MM-DD"
          :clearable="false"
          class="!w-[150px]"
        />
        <span class="px-2">~</span>
        <el-date-picker
          v-model="searchForm.reportDateEnd"
          type="date"
          value-format="YYYY-MM-DD"
          :clearable="false"
          class="!w-[150px]"
        />
      </el-form-item>
      <el-form-item :label="$t('agency.dailyReportGiveOffer')" prop="giveOffer">
        <el-select v-model="searchForm.giveOffer" class="!w-[140px]">
          <el-option
            v-for="item in giveOfferOptions"
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
          {{ $t("agency.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm">
          {{ $t("agency.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区 -->
    <PureTableBar
      :title="$t('agency.menuDailyReport')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button type="primary" :icon="View" @click="openActive('all')">
          {{ $t("agency.dailyReportActiveAgencyList") }}
        </el-button>
        <span class="ml-4 text-sm text-gray-500">{{ title }}</span>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          show-overflow-tooltip
          border
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
