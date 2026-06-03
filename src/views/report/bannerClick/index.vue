<script setup lang="ts">
import { ref } from "vue";
import { useBannerClick } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import Download from "~icons/ep/download";
import View from "~icons/ep/view";

defineOptions({ name: "ReportBannerClick" });

const formRef = ref();
const {
  searchForm,
  bannerOptions,
  loading,
  columns,
  dataList,
  pagination,
  getSummaries,
  hasBannerFilter,
  onSearch,
  resetForm,
  openDetail,
  handleExport
} = useBannerClick();
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
      <el-form-item :label="$t('report.adName')" prop="bannerTitle">
        <el-select
          v-model="searchForm.bannerTitle"
          clearable
          filterable
          class="!w-[180px]"
          :placeholder="$t('report.adName')"
        >
          <el-option
            v-for="item in bannerOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('report.adId')" prop="bannerID">
        <el-input
          v-model="searchForm.bannerID"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('report.rangePicker')" prop="date">
        <el-date-picker
          v-model="searchForm.date"
          type="daterange"
          range-separator="~"
          value-format="YYYY-MM-DD"
          :start-placeholder="$t('report.startDate')"
          :end-placeholder="$t('report.endDate')"
          class="!w-[260px]"
        />
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
      :title="$t('report.menuBannerClick')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_banner_report_export')"
          type="primary"
          :icon="Download"
          @click="handleExport"
        >
          {{ $t("report.exportExcel") }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          border
          show-summary
          :summary-method="getSummaries"
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
        >
          <template #operation="{ row }">
            <el-button
              v-if="!hasBannerFilter()"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="View"
              @click="openDetail(row)"
            >
              {{ $t("report.detail") }}
            </el-button>
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
