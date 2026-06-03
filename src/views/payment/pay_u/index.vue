<script setup lang="ts">
import { ref } from "vue";
import { usePayU } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import AddFill from "~icons/ri/add-circle-line";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import CopyIcon from "~icons/ep/copy-document";

defineOptions({ name: "PaymentPayU" });

const formRef = ref();
const {
  searchForm,
  useTypeOptions,
  walletTypeOptions,
  statusOptions,
  loading,
  columns,
  dataList,
  summary,
  pagination,
  onSearch,
  resetForm,
  openDialog,
  handleChangeStatus,
  openMoneyDialog,
  openFreezeDialog,
  openTransferDialog,
  openTradeDialog,
  openBill,
  handleCopy
} = usePayU();
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
      <el-form-item :label="$t('payment.payUName')" prop="name">
        <el-input
          v-model="searchForm.name"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('payment.payUUseType')" prop="useType">
        <el-select v-model="searchForm.useType" clearable class="!w-[140px]">
          <el-option
            v-for="item in useTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('payment.payUWalletType')" prop="type">
        <el-select v-model="searchForm.type" clearable class="!w-[120px]">
          <el-option
            v-for="item in walletTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('payment.status')" prop="status">
        <el-select v-model="searchForm.status" clearable class="!w-[120px]">
          <el-option
            v-for="item in statusOptions"
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
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("payment.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('payment.menuPayU')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_usdt_create')"
          type="primary"
          :icon="AddFill"
          @click="openDialog()"
        >
          {{ $t("payment.payUAddAccount") }}
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
          show-summary
          :summary-method="
            () => [
              $t('payment.total'),
              '',
              '',
              summary.todayIn.toLocaleString(),
              summary.todayOut.toLocaleString(),
              summary.balance.toLocaleString(),
              '',
              ''
            ]
          "
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        >
          <template #address="{ row }">
            <span class="mr-1">{{ row.address }}</span>
            <el-button
              link
              type="primary"
              :icon="CopyIcon"
              @click="handleCopy(row.address)"
            />
          </template>
          <template #operation="{ row }">
            <el-button
              v-if="hasAuth('__btn_usdt_active')"
              link
              type="primary"
              :size="size"
              @click="handleChangeStatus(row)"
            >
              {{
                Number(row.status) === 1
                  ? $t("payment.disable")
                  : $t("payment.enable")
              }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_usdt_detail')"
              link
              type="primary"
              :size="size"
              @click="openBill(row)"
            >
              {{ $t("payment.payUBill") }}
            </el-button>
            <el-dropdown>
              <el-button link type="primary" :size="size">
                {{ $t("payment.more") }}
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-if="hasAuth('__btn_usdt_edit')"
                    @click="openDialog(row)"
                  >
                    {{ $t("payment.edit") }}
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="hasAuth('__btn_usdt_transfer')"
                    @click="openMoneyDialog(row, 'out')"
                  >
                    {{ $t("payment.payUMerchantCharge") }}
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="hasAuth('__btn_usdt_recharge')"
                    @click="openMoneyDialog(row, 'in')"
                  >
                    {{ $t("payment.payUMoneyIn") }}
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="hasAuth('__btn_usdt_2usdt')"
                    @click="openTransferDialog(row)"
                  >
                    {{ $t("payment.payUTransfer") }}
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="hasAuth('__btn_usdt_freeze')"
                    @click="openFreezeDialog(row, 'lock')"
                  >
                    {{ $t("payment.payUFreeze") }}
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="hasAuth('__btn_usdt_freeze')"
                    @click="openFreezeDialog(row, 'unlock')"
                  >
                    {{ $t("payment.payUUnFreeze") }}
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="hasAuth('__btn_usdt_trade')"
                    @click="openTradeDialog(row)"
                  >
                    {{ $t("payment.payUMoneyChange") }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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
