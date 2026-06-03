<script setup lang="ts">
import { ref } from "vue";
import { useWithdrawRisk } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "CashflowWithdrawRisk" });

const formRef = ref();
const {
  searchForm,
  withdrawalRange,
  updatedRange,
  statusOptions,
  riskOptions,
  loading,
  columns,
  dataList,
  pagination,
  count,
  totalAmount,
  autoReload,
  intervalTime,
  hasAuth,
  onSearch,
  resetForm,
  handleRiskReview,
  canRiskReview,
  handleSizeChange,
  handleCurrentChange
} = useWithdrawRisk();
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
      <el-form-item :label="$t('cashflow.withdrawalTransactionTime')">
        <el-date-picker
          v-model="withdrawalRange"
          type="datetimerange"
          value-format="YYYY-MM-DD HH:mm:ss"
          :start-placeholder="$t('cashflow.startTime')"
          :end-placeholder="$t('cashflow.endTime')"
          class="!w-[380px]"
        />
      </el-form-item>
      <el-form-item :label="$t('cashflow.memberAC')">
        <el-input
          v-model="searchForm.memberAccount"
          clearable
          class="!w-[150px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('cashflow.transactionID')">
        <el-input
          v-model="searchForm.orderSn"
          clearable
          class="!w-[150px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('cashflow.status')">
        <el-select v-model="searchForm.status" class="!w-[130px]">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('cashflow.lastUpdate')">
        <el-date-picker
          v-model="updatedRange"
          type="datetimerange"
          value-format="YYYY-MM-DD HH:mm:ss"
          :start-placeholder="$t('cashflow.startTime')"
          :end-placeholder="$t('cashflow.endTime')"
          class="!w-[380px]"
        />
      </el-form-item>
      <el-form-item :label="$t('cashflow.riskStatus')">
        <el-select v-model="searchForm.riskCheck" class="!w-[130px]">
          <el-option
            v-for="item in riskOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('cashflow.riskAuditName')">
        <el-input
          v-model="searchForm.riskAuditName"
          clearable
          class="!w-[130px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('cashflow.riskAuditTime')">
        <el-input
          v-model="searchForm.riskAuditMinutes"
          clearable
          class="!w-[110px]"
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
          {{ $t("cashflow.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("cashflow.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="`${$t('cashflow.count', { count })}，${$t('cashflow.totalAmount')} ${totalAmount}`"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <div class="flex items-center gap-2">
          <span>{{ $t("cashflow.autoReload") }}</span>
          <el-input-number
            v-if="autoReload"
            v-model="intervalTime"
            size="small"
            :min="1"
            controls-position="right"
            class="!w-[110px]"
          />
          <el-switch v-model="autoReload" />
        </div>
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
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-button
              v-if="
                canRiskReview(row) && hasAuth('__btn_withdrawal_riskverify')
              "
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="handleRiskReview(row)"
            >
              {{ $t("cashflow.riskReview") }}
            </el-button>
            <span v-else>-</span>
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
