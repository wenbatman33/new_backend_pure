<script setup lang="ts">
import { ref } from "vue";
import { usePayBankCard } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import AddFill from "~icons/ri/add-circle-line";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import ArrowDown from "~icons/ep/arrow-down";

defineOptions({ name: "PaymentPayBankCard" });

const formRef = ref();
const {
  searchForm,
  loading,
  columns,
  dataList,
  pagination,
  statusOptions,
  typeOptions,
  bankNameOptions,
  summary,
  onSearch,
  resetForm,
  openDialog,
  handleEdit,
  handleChangeStatus,
  handleLock,
  handleUnlock,
  handleTransfer,
  handleTrade,
  openBankCardReport
} = usePayBankCard();
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
      <el-form-item :label="$t('payment.accountName')" prop="accountName">
        <el-input
          v-model="searchForm.accountName"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('payment.type')" prop="type">
        <el-select
          v-model="searchForm.type"
          clearable
          class="!w-[160px]"
          :placeholder="$t('payment.pleaseChoose') + $t('payment.type')"
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('payment.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          clearable
          class="!w-[160px]"
          :placeholder="$t('payment.pleaseChoose') + $t('payment.status')"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="String(item.value)"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('payment.payBankID')" prop="payBankID">
        <el-select
          v-model="searchForm.payBankID"
          filterable
          clearable
          class="!w-[160px]"
          :placeholder="$t('payment.pleaseChoose') + $t('payment.payBankID')"
        >
          <el-option
            v-for="item in bankNameOptions"
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
          {{ $t("payment.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm($refs.formRef)">
          {{ $t("payment.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('payment.menuPayBankCard')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_bankcard_create')"
          type="primary"
          :icon="AddFill"
          @click="openDialog"
        >
          {{ $t("payment.addCard") }}
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
          @page-size-change="onSearch"
          @page-current-change="onSearch"
        >
          <template #operation="{ row }">
            <el-dropdown>
              <el-button link type="primary" :size="size">
                {{ $t("payment.operate") }}
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-if="hasAuth('__btn_bankcard_active')"
                    @click="handleChangeStatus(row)"
                  >
                    {{
                      Number(row.status) === 1
                        ? $t("payment.disable")
                        : $t("payment.enable")
                    }}
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="hasAuth('__btn_bankcard_detail')"
                    @click="openBankCardReport(row)"
                  >
                    {{ $t("payment.bill") }}
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="hasAuth('__btn_bankcard_edit')"
                    @click="handleEdit(row)"
                  >
                    {{ $t("payment.edit") }}
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="hasAuth('__btn_bankcard_transfer')"
                    @click="handleTransfer(row)"
                  >
                    {{ $t("payment.transfer") }}
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="hasAuth('__btn_bankcard_freeze')"
                    @click="handleLock(row)"
                  >
                    {{ $t("payment.freeze") }}
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="hasAuth('__btn_bankcard_unfreeze')"
                    @click="handleUnlock(row)"
                  >
                    {{ $t("payment.unFreeze") }}
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="hasAuth('__btn_bankcard_trade')"
                    @click="handleTrade(row)"
                  >
                    {{ $t("payment.moneyChange") }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </pure-table>
      </template>
    </PureTableBar>

    <!-- 合計 -->
    <div class="summary-bar bg-bg_color mt-[10px] px-[16px] py-[10px]">
      <span class="mr-[24px]"
        >{{ $t("payment.total") }} {{ $t("payment.balance") }}:
        {{ summary.balance.toLocaleString() }}</span
      >
      <span class="mr-[24px]"
        >{{ $t("payment.dayIn") }}: {{ summary.dayIn.toLocaleString() }}</span
      >
      <span
        >{{ $t("payment.dayOut") }}:
        {{ summary.dayOut.toLocaleString() }}</span
      >
    </div>
  </div>
</template>

<style scoped lang="scss">
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
