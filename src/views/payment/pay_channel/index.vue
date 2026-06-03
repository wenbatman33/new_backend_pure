<script setup lang="ts">
import { ref } from "vue";
import { usePayChannel } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import AddFill from "~icons/ri/add-circle-line";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "PaymentPayChannel" });

const formRef = ref();
const {
  searchForm,
  statusOptions,
  supplyApOptions,
  nameList,
  autoReload,
  intervalTime,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  onAutoReloadChange,
  resetForm,
  openDialog,
  openNameDialog,
  openGcashDialog,
  openAmountDialog,
  handleStatus,
  handleApStatus
} = usePayChannel();
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
      <el-form-item :label="$t('payment.merchant')" prop="sn">
        <el-input
          v-model="searchForm.sn"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('payment.merchantStatus')" prop="status">
        <el-select v-model="searchForm.status" clearable class="!w-[140px]">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('payment.merchant2')" prop="name">
        <el-select
          v-model="searchForm.name"
          filterable
          clearable
          class="!w-[160px]"
        >
          <el-option :label="$t('payment.all')" value="" />
          <el-option
            v-for="item in nameList"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('payment.supplyAp')" prop="supplyAp">
        <el-select v-model="searchForm.supplyAp" clearable class="!w-[140px]">
          <el-option
            v-for="item in supplyApOptions"
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
      :title="$t('payment.menuPayChannel')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <div class="flex items-center mr-4">
          <el-switch
            v-model="autoReload"
            :active-text="$t('payment.autoRenew')"
            @change="onAutoReloadChange"
          />
          <el-input-number
            v-if="autoReload"
            v-model="intervalTime"
            :min="5"
            size="small"
            class="!w-[110px] ml-2"
            @change="onAutoReloadChange"
          />
        </div>
        <el-button
          v-if="hasAuth('__btn_pay_channel_create')"
          type="primary"
          :icon="AddFill"
          @click="openDialog($t('payment.addMerchant'))"
        >
          {{ $t("payment.addMerchant") }}
        </el-button>
        <el-button
          v-if="hasAuth('__btn_pay_channel_create')"
          type="primary"
          :icon="AddFill"
          @click="openNameDialog"
        >
          {{ $t("payment.addMerchantName") }}
        </el-button>
        <el-button
          v-if="hasAuth('__btn_pay_channelgc_create')"
          type="primary"
          :icon="AddFill"
          @click="openGcashDialog"
        >
          {{ $t("payment.addGcash") }}
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
            <el-button
              v-if="hasAuth('__btn_pay_channel_active')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="handleStatus(row)"
            >
              {{ row.status === 1 ? $t("payment.disable") : $t("payment.enable") }}
            </el-button>
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="openDialog($t('payment.edit'), row)"
            >
              {{ $t("payment.edit") }}
            </el-button>
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="openAmountDialog('add', row)"
            >
              {{ $t("payment.remainAdd") }}
            </el-button>
            <el-button
              class="reset-margin"
              link
              type="warning"
              :size="size"
              @click="openAmountDialog('sub', row)"
            >
              {{ $t("payment.remainSub") }}
            </el-button>
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="handleApStatus(row)"
            >
              {{ $t("payment.supplyAp") }}
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
