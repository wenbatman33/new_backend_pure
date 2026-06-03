<script setup lang="ts">
import { ref } from "vue";
import { useAgencyNewReg } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "AgencyNewReg" });

const formRef = ref();
const {
  searchForm,
  dateRange,
  giveOfferOptions,
  loading,
  columns,
  dataList,
  onSearch,
  resetForm,
  getSummaries
} = useAgencyNewReg();
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
      <el-form-item :label="$t('agency.agencyID')" prop="agencyID">
        <el-input
          v-model="searchForm.agencyID"
          clearable
          class="!w-[140px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('agency.agencyAccount')" prop="agencyAccount">
        <el-input
          v-model="searchForm.agencyAccount"
          clearable
          class="!w-[140px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('agency.giveOffer')" prop="giveOffer">
        <el-select v-model="searchForm.giveOffer" class="!w-[140px]">
          <el-option
            v-for="item in giveOfferOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('agency.reportDate')" prop="dateRange">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          :range-separator="'～'"
          :start-placeholder="$t('agency.startDate')"
          :end-placeholder="$t('agency.endDate')"
        />
      </el-form-item>
      <el-form-item prop="getChildAgencyData">
        <el-checkbox v-model="searchForm.getChildAgencyData">
          {{ $t("agency.getChildAgencyData") }}
        </el-checkbox>
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

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('agency.menuNewReg')"
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
          show-summary
          :summary-method="getSummaries"
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
