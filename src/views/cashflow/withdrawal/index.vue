<script setup lang="ts">
import { ref, computed } from "vue";
import { useWithdrawal } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import Download from "~icons/ep/download";

defineOptions({ name: "CashflowWithdrawal" });

const formRef = ref();
const {
  searchForm,
  statusOptions,
  riskOptions,
  payGroupOptions,
  bankcardGroupOptions,
  loading,
  columns,
  dataList,
  summary,
  showUTC,
  autoReload,
  intervalTime,
  rowStyle,
  onSearch,
  resetForm,
  handleExport
} = useWithdrawal();

// 提款時間區間（el-date-picker 綁定陣列，回寫字串欄位）
const withdrawalRange = computed<[string, string]>({
  get: () => [searchForm.withdrawalStart, searchForm.withdrawalEnd],
  set: val => {
    searchForm.withdrawalStart = val?.[0] ?? "";
    searchForm.withdrawalEnd = val?.[1] ?? "";
  }
});

const updateRange = computed<[string, string]>({
  get: () => [searchForm.updatedStart, searchForm.updatedEnd],
  set: val => {
    searchForm.updatedStart = val?.[0] ?? "";
    searchForm.updatedEnd = val?.[1] ?? "";
  }
});

// 標題統計列
const tableTitle = computed(
  () =>
    `${$t("cashflow.count", { count: summary.count })}，${$t(
      "cashflow.totalAmount"
    )} ${summary.total}、ERC：${summary.erctotal}、TRC：${summary.trctotal}；${$t(
      "cashflow.totalFee"
    )} ${summary.fee}`
);

// 切換 UTC 欄位顯示後重繪標題（columns hide 為函式，刷新即可）
function onToggleUTC() {
  onSearch();
}
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
          class="!w-[360px]"
        />
      </el-form-item>
      <el-form-item :label="$t('cashflow.memberAC')" prop="memberAccount">
        <el-input
          v-model="searchForm.memberAccount"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('cashflow.transactionID')" prop="orderSn">
        <el-input
          v-model="searchForm.orderSn"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('cashflow.status')" prop="status">
        <el-select v-model="searchForm.status" class="!w-[140px]">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('cashflow.withdrawalName')" prop="withdrawalName">
        <el-input
          v-model="searchForm.withdrawalName"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('cashflow.withdrawalBankName')" prop="bankName">
        <el-input
          v-model="searchForm.bankName"
          clearable
          class="!w-[140px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item
        :label="$t('cashflow.withdrawalCardNumber')"
        prop="bankcardNo"
      >
        <el-input
          v-model="searchForm.bankcardNo"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('cashflow.lastUpdate')">
        <el-date-picker
          v-model="updateRange"
          type="datetimerange"
          value-format="YYYY-MM-DD HH:mm:ss"
          :start-placeholder="$t('cashflow.startTime')"
          :end-placeholder="$t('cashflow.endTime')"
          class="!w-[360px]"
        />
      </el-form-item>
      <el-form-item :label="$t('cashflow.riskStatus')" prop="riskCheck">
        <el-select v-model="searchForm.riskCheck" class="!w-[140px]">
          <el-option
            v-for="item in riskOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('cashflow.thirdGroup')" prop="payGroupID">
        <el-select v-model="searchForm.payGroupID" class="!w-[140px]">
          <el-option
            v-for="item in payGroupOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('cashflow.bankGroup')" prop="bankcardGroupID">
        <el-select v-model="searchForm.bankcardGroupID" class="!w-[140px]">
          <el-option
            v-for="item in bankcardGroupOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('cashflow.riskAuditName')" prop="riskAuditName">
        <el-input
          v-model="searchForm.riskAuditName"
          clearable
          class="!w-[140px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('cashflow.merchantNumber')" prop="snList">
        <el-input
          v-model="searchForm.snList"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="showUTC" @change="onToggleUTC">
          {{ $t("cashflow.showAdd8time") }}
        </el-checkbox>
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
    <PureTableBar :title="tableTitle" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <div class="flex items-center mr-4">
          <span class="mr-2">{{ $t("cashflow.autoReload") }}</span>
          <el-switch v-model="autoReload" />
          <el-input-number
            v-show="autoReload"
            v-model="intervalTime"
            :min="5"
            size="small"
            class="!w-[120px] ml-2"
          />
          <span v-show="autoReload" class="ml-1">{{
            $t("cashflow.seconds")
          }}</span>
        </div>
        <el-button
          v-if="hasAuth('__btn_withdrawal_export')"
          type="primary"
          :icon="Download"
          @click="handleExport"
        >
          {{ $t("cashflow.exportExcel") }}
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
          :row-style="rowStyle"
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
