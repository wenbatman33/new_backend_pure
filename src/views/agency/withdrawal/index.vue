<script setup lang="ts">
import { ref } from "vue";
import { useWithdrawal } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import AddFill from "~icons/ri/add-circle-line";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import Download from "~icons/ep/download";

defineOptions({ name: "AgencyWithdrawal" });

const formRef = ref();
const {
  searchForm,
  dateRange,
  statusOptions,
  title,
  loading,
  columns,
  dataList,
  pagination,
  autoReload,
  intervalTime,
  rowActions,
  onSearch,
  resetForm,
  openDialog,
  handleExport
} = useWithdrawal();
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
      <el-form-item :label="$t('agency.withdrawalTime')" prop="dateRange">
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          value-format="YYYY-MM-DD HH:mm:ss"
          :range-separator="'～'"
          :start-placeholder="$t('agency.withdrawalTime')"
          :end-placeholder="$t('agency.withdrawalTime')"
        />
      </el-form-item>
      <el-form-item
        :label="$t('agency.withdrawalAgencyAccount')"
        prop="memberAccount"
      >
        <el-input
          v-model="searchForm.memberAccount"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('agency.withdrawalTransactionID')" prop="orderSn">
        <el-input
          v-model="searchForm.orderSn"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('agency.commonStatus')" prop="status">
        <el-select v-model="searchForm.status" clearable class="!w-[140px]">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('agency.memberRealname')" prop="withdrawalName">
        <el-input
          v-model="searchForm.withdrawalName"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item
        :label="$t('agency.withdrawalBankName')"
        prop="bankName"
      >
        <el-input
          v-model="searchForm.bankName"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item
        :label="$t('agency.withdrawalCardNumber')"
        prop="bankcardNo"
      >
        <el-input
          v-model="searchForm.bankcardNo"
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
          {{ $t("agency.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("agency.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar :title="title" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <span class="flex items-center mr-2">
          {{ $t("agency.autoreload") }}
          <el-switch v-model="autoReload" class="mx-2" @change="onSearch" />
          <template v-if="autoReload">
            <el-input-number
              v-model="intervalTime"
              size="small"
              :min="1"
              controls-position="right"
              class="!w-[100px]"
            />
            <span class="ml-1">{{ $t("agency.withdrawalSecond") }}</span>
          </template>
        </span>
        <el-button type="primary" :icon="AddFill" @click="openDialog">
          {{ $t("agency.withdrawalAddTitle") }}
        </el-button>
        <el-button
          v-if="hasAuth('__btn_withdrawal_export')"
          type="primary"
          :icon="Download"
          @click="handleExport"
        >
          {{ $t("agency.exportexcel") }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          row-key="transactionID"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @page-size-change="onSearch"
          @page-current-change="onSearch"
        >
          <template #operation="{ row }">
            <el-button
              v-for="(act, idx) in rowActions(row)"
              :key="idx"
              link
              type="primary"
              :size="size"
              @click="act.click"
            >
              {{ act.label }}
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
