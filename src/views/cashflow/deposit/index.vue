<script setup lang="ts">
import { ref } from "vue";
import { useDeposit } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import AddFill from "~icons/ri/add-circle-line";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import Download from "~icons/ep/download";

defineOptions({ name: "CashflowDeposit" });

const formRef = ref();
const {
  searchForm,
  loading,
  columns,
  dataList,
  pagination,
  title,
  showUTC,
  autoReload,
  intervalTime,
  statusOptions,
  typeOptions,
  deviceOptions,
  methodOptions,
  payGroupOptions,
  bankcardGroupOptions,
  payChannelOptions,
  payChannelNameOptions,
  onSearch,
  resetForm,
  handleExport,
  openDialog,
  toggleUTC,
  getRowActions,
  runAction
} = useDeposit();
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
      <el-form-item :label="$t('cashflow.transactionTime')" prop="createdAtRange">
        <el-date-picker
          v-model="searchForm.createdAtRange"
          type="datetimerange"
          value-format="YYYY-MM-DD HH:mm:ss"
          :range-separator="'~'"
          :start-placeholder="$t('cashflow.transactionTime')"
          :end-placeholder="$t('cashflow.transactionTime')"
          class="!w-[360px]"
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
      <el-form-item :label="$t('cashflow.transactionID')" prop="id">
        <el-input
          v-model="searchForm.id"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('cashflow.payment')" prop="method">
        <el-select v-model="searchForm.method" clearable class="!w-[140px]">
          <el-option
            v-for="item in methodOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('cashflow.memberAC')" prop="memberName">
        <el-input
          v-model="searchForm.memberName"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('cashflow.gateway')" prop="serviceName">
        <el-input
          v-model="searchForm.serviceName"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('cashflow.thirdGroup')" prop="payGroupID">
        <el-select v-model="searchForm.payGroupID" clearable class="!w-[140px]">
          <el-option
            v-for="item in payGroupOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('cashflow.bankGroup')" prop="bankcardGroupID">
        <el-select v-model="searchForm.bankcardGroupID" clearable class="!w-[140px]">
          <el-option
            v-for="item in bankcardGroupOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('cashflow.balanceType')" prop="type">
        <el-select v-model="searchForm.type" class="!w-[140px]">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('cashflow.MerchantNumber')" prop="payChannelID">
        <el-select v-model="searchForm.payChannelID" clearable class="!w-[140px]">
          <el-option
            v-for="item in payChannelOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('cashflow.Merchant')" prop="payChannelNameID">
        <el-select v-model="searchForm.payChannelNameID" clearable class="!w-[140px]">
          <el-option
            v-for="item in payChannelNameOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('cashflow.platform')" prop="device">
        <el-select v-model="searchForm.device" clearable class="!w-[140px]">
          <el-option
            v-for="item in deviceOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('cashflow.bankCard')" prop="bankcard">
        <el-input v-model="searchForm.bankcard" clearable class="!w-[160px]" />
      </el-form-item>
      <el-form-item :label="$t('cashflow.amount')" prop="amountMin">
        <el-input v-model="searchForm.amountMin" type="number" class="!w-[110px]" />
        <span class="px-1">~</span>
        <el-input v-model="searchForm.amountMax" type="number" class="!w-[110px]" />
      </el-form-item>
      <el-form-item :label="$t('cashflow.lastUpdate')" prop="updateAtRange">
        <el-date-picker
          v-model="searchForm.updateAtRange"
          type="datetimerange"
          value-format="YYYY-MM-DD HH:mm:ss"
          :range-separator="'~'"
          :start-placeholder="$t('cashflow.lastUpdate')"
          :end-placeholder="$t('cashflow.lastUpdate')"
          class="!w-[360px]"
        />
      </el-form-item>
      <el-form-item :label="$t('cashflow.balanceDate')" prop="balanceDate">
        <el-date-picker
          v-model="searchForm.balanceDate"
          type="date"
          value-format="YYYY-MM-DD"
          class="!w-[160px]"
        />
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="showUTC" @change="toggleUTC">
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
    <PureTableBar :title="title" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <div class="flex items-center gap-2">
          <span class="text-sm">{{ $t("cashflow.autoreload") }}</span>
          <el-switch v-model="autoReload" />
          <el-input-number
            v-if="autoReload"
            v-model="intervalTime"
            :min="1"
            size="small"
            class="!w-[110px]"
          />
          <el-button
            v-if="hasAuth('__btn_deposit_export')"
            type="primary"
            :icon="Download"
            @click="handleExport"
          >
            {{ $t("cashflow.exportexcel") }}
          </el-button>
          <el-button
            v-if="hasAuth('__btn_deposit_create')"
            type="primary"
            :icon="AddFill"
            @click="openDialog"
          >
            {{ $t("cashflow.create") }}
          </el-button>
        </div>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
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
              v-for="act in getRowActions(row)"
              :key="act.key"
              link
              :type="act.type || 'primary'"
              :size="size"
              @click="runAction(act.key, row)"
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
