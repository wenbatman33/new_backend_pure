<script setup lang="ts">
import { ref } from "vue";
import { useContribution } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "AgencyContribution" });

const formRef = ref();
const {
  searchForm,
  loading,
  columns,
  childColumns,
  mainList,
  childList,
  parentAgency,
  onSearch,
  resetForm,
  handleAgencyAccount,
  searchParentAgency,
  handleBettingRecord
} = useContribution();
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
      <el-form-item :label="$t('agency.agencyAccount')" prop="agencyAccount">
        <el-input
          v-model="searchForm.agencyAccount"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('agency.startDate')" prop="startTime">
        <el-date-picker
          v-model="searchForm.startTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item :label="$t('agency.endDate')" prop="endTime">
        <el-date-picker
          v-model="searchForm.endTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          class="!w-[200px]"
        />
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

    <!-- 主代理統計 -->
    <PureTableBar
      :title="$t('agency.statistics')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          type="primary"
          :disabled="!parentAgency"
          @click="searchParentAgency"
        >
          {{ $t("agency.return") }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          row-key="agencyAccount"
          :loading="loading"
          :size="size"
          :data="mainList"
          :columns="dynamicColumns"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        >
          <template #childAgencyPeople="{ row }">
            <span
              class="cursor-pointer text-[var(--el-color-danger)]"
              @click="handleAgencyAccount(row.agencyAccount)"
            >
              {{ row.childAgencyCount }}
            </span>
          </template>
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="handleBettingRecord(row)"
            >
              {{ $t("agency.bettingRecord") }}
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>

    <!-- 下層代理統計 -->
    <PureTableBar
      :title="$t('agency.detailData')"
      :columns="childColumns"
      @refresh="onSearch"
    >
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          row-key="agencyAccount"
          :loading="loading"
          :size="size"
          :data="childList"
          :columns="dynamicColumns"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        >
          <template #childAgencyPeople="{ row }">
            <span
              class="cursor-pointer text-[var(--el-color-danger)]"
              @click="handleAgencyAccount(row.agencyAccount)"
            >
              {{ row.childAgencyCount }}
            </span>
          </template>
          <template #childOperation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="handleAgencyAccount(row.agencyAccount)"
            >
              {{ $t("agency.viewChildAgency") }}
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
