<script setup lang="ts">
import { ref } from "vue";
import { useAgencyDeposit } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import AddFill from "~icons/ri/add-circle-line";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "AgencyDeposit" });

const formRef = ref();
const {
  searchForm,
  createdAtRange,
  updateAtRange,
  loading,
  columns,
  dataList,
  pagination,
  summary,
  autoReload,
  intervalTime,
  statusOptions,
  balanceTypeOptions,
  methodOptions,
  payChannelOptions,
  payChannelNameOptions,
  onSearch,
  resetForm,
  scheduleReload,
  openCreateDialog,
  getRowActions,
  onActionClick
} = useAgencyDeposit();
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
      <el-form-item :label="$t('agency.transactionTime')">
        <el-date-picker
          v-model="createdAtRange"
          type="datetimerange"
          range-separator="～"
          value-format="YYYY-MM-DD HH:mm:ss"
          format="YYYY/MM/DD HH:mm"
          class="!w-[360px]"
        />
      </el-form-item>
      <el-form-item :label="$t('agency.status')">
        <el-select v-model="searchForm.status" class="!w-[140px]">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('agency.transactionID')">
        <el-input
          v-model="searchForm.id"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('agency.payment')">
        <el-select v-model="searchForm.method" clearable class="!w-[140px]">
          <el-option :label="$t('agency.depositAll')" value="" />
          <el-option
            v-for="item in methodOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('agency.agencyAccount')">
        <el-input
          v-model="searchForm.memberName"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('agency.gateway')">
        <el-input
          v-model="searchForm.serviceName"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('agency.balanceType')">
        <el-select v-model="searchForm.type" class="!w-[140px]">
          <el-option
            v-for="item in balanceTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('agency.merchantNumber')">
        <el-select v-model="searchForm.payChannelID" clearable class="!w-[160px]">
          <el-option
            v-for="item in payChannelOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('agency.merchant')">
        <el-select v-model="searchForm.payChannelNameID" clearable class="!w-[160px]">
          <el-option
            v-for="item in payChannelNameOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('agency.bankCard')">
        <el-input
          v-model="searchForm.bankcard"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('agency.lastUpdate')">
        <el-date-picker
          v-model="updateAtRange"
          type="datetimerange"
          range-separator="～"
          value-format="YYYY-MM-DD HH:mm:ss"
          format="YYYY/MM/DD HH:mm"
          class="!w-[360px]"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" :loading="loading" @click="onSearch">
          {{ $t("agency.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("agency.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('agency.menuDeposit')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <div class="flex items-center mr-4">
          <span class="mr-3 text-sm">
            {{
              $t("agency.depositSummary", {
                count: summary.count,
                amount: summary.amount,
                erc: summary.erctotal,
                trc: summary.trctotal,
                fee: summary.fee
              })
            }}
          </span>
          <span class="mr-1 text-sm">{{ $t("agency.autoReload") }}</span>
          <el-switch v-model="autoReload" @change="scheduleReload" />
          <el-input-number
            v-show="autoReload"
            v-model="intervalTime"
            size="small"
            :min="1"
            class="!w-[100px] mx-2"
          />
        </div>
        <el-button
          v-if="hasAuth('__btn_agency_deposit_create')"
          type="primary"
          :icon="AddFill"
          @click="openCreateDialog"
        >
          {{ $t("agency.create") }}
        </el-button>
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
            <el-dropdown v-if="getRowActions(row).length">
              <el-button link type="primary" :size="size">
                {{ $t("agency.operate") }}
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="act in getRowActions(row)"
                    :key="act.key"
                    @click="onActionClick(act.key, row)"
                  >
                    <span
                      :class="{
                        'text-[var(--el-color-danger)]': act.type === 'danger',
                        'text-[var(--el-color-success)]': act.type === 'success'
                      }"
                    >
                      {{ act.label }}
                    </span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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
