<script setup lang="ts">
import { ref } from "vue";
import { usePhDailyReport } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import Download from "~icons/ep/download";

defineOptions({ name: "AgencyPhDailyReport" });

const formRef = ref();
const {
  searchForm,
  businessTypeOptions,
  memberTypeOptions,
  loading,
  columns,
  dataList,
  parentAgencyData,
  pagination,
  onSearch,
  resetForm,
  drillDown,
  getSummaries,
  handleExport,
  handleSizeChange,
  handleCurrentChange
} = usePhDailyReport();
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
      <el-form-item :label="$t('agency.phDailyReportForm1')">
        <el-date-picker
          v-model="searchForm.startTime"
          type="date"
          value-format="YYYY-MM-DD"
          :clearable="false"
          class="!w-[150px]"
        />
        <span class="mx-2">~</span>
        <el-date-picker
          v-model="searchForm.endTime"
          type="date"
          value-format="YYYY-MM-DD"
          :clearable="false"
          class="!w-[150px]"
        />
      </el-form-item>
      <el-form-item :label="$t('agency.phDailyReportForm2')" prop="agencyAccount">
        <el-input
          v-model="searchForm.agencyAccount"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('agency.agencyMainTable13')" prop="parentAgencyAccount">
        <el-input
          v-model="searchForm.parentAgencyAccount"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('agency.phDailyReportForm3')" prop="businessType">
        <el-select v-model="searchForm.businessType" class="!w-[160px]">
          <el-option
            v-for="item in businessTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('agency.phDailyReportForm7')" prop="memberType">
        <el-select v-model="searchForm.memberType" clearable class="!w-[180px]">
          <el-option
            v-for="item in memberTypeOptions"
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
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("agency.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区 -->
    <PureTableBar
      :title="$t('agency.menuPhDailyReport')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <!-- 上级代理面包屑 -->
        <div
          v-if="parentAgencyData.length > 0"
          class="flex flex-row items-center mr-4"
        >
          <template v-for="(item, index) in parentAgencyData" :key="index">
            <a
              class="cursor-pointer text-primary"
              @click="drillDown(item.parentAgencyAccount)"
            >
              {{ item.parentAgencyAccount }}
            </a>
            <span v-if="index < parentAgencyData.length - 1" class="mx-2">
              &gt;
            </span>
          </template>
        </div>
        <el-button
          v-if="hasAuth('__btn_phaffreport_operation_export')"
          type="primary"
          :icon="Download"
          @click="handleExport"
        >
          {{ $t("agency.phDailyReport1") }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          show-summary
          :summary-method="getSummaries"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
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
