<script setup lang="ts">
import { ref } from "vue";
import { useLuckWalletList } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "MemberLuckwalletList" });

const formRef = ref();
const {
  searchForm,
  statusOptions,
  sourceOptions,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  onSortChange,
  resetForm,
  goToLog,
  handleWallet,
  handleSizeChange,
  handleCurrentChange
} = useLuckWalletList();
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
      <el-form-item :label="$t('member.luckWalletMemberAccount')" prop="account">
        <el-input
          v-model="searchForm.account"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('member.luckWalletStatus')" prop="status">
        <el-select
          v-model="searchForm.status"
          clearable
          class="!w-[160px]"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('member.luckWalletDateRange')">
        <el-date-picker
          v-model="searchForm.startTime"
          type="date"
          value-format="YYYY-MM-DD"
          class="!w-[150px]"
          :placeholder="$t('member.luckWalletStartTime')"
        />
        <span class="px-2">~</span>
        <el-date-picker
          v-model="searchForm.endTime"
          type="date"
          value-format="YYYY-MM-DD"
          class="!w-[150px]"
          :placeholder="$t('member.luckWalletEndTime')"
        />
      </el-form-item>
      <el-form-item :label="$t('member.luckWalletName')" prop="name">
        <el-input
          v-model="searchForm.name"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('member.luckWalletRelatedOrderNumber')" prop="orderID">
        <el-input
          v-model="searchForm.orderID"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('member.luckWalletId')" prop="id">
        <el-input
          v-model="searchForm.id"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('member.luckWalletPromotionID')" prop="promotionID">
        <el-input
          v-model="searchForm.promotionID"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('member.luckWalletSource')" prop="source">
        <el-select
          v-model="searchForm.source"
          clearable
          class="!w-[160px]"
        >
          <el-option
            v-for="item in sourceOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" :loading="loading" @click="onSearch">
          {{ $t("member.luckWalletSearch") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("member.luckWalletReset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('member.menuLuckwalletList')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          row-key="id"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :header-cell-style="{ background: 'var(--el-fill-color-light)', color: 'var(--el-text-color-primary)' }"
          @sort-change="onSortChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="goToLog(row.id)"
            >
              {{ $t("member.luckWalletViewDetails") }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_lm_close') && row.status !== 4"
              class="reset-margin"
              link
              type="danger"
              :size="size"
              @click="handleWallet(row, 'close')"
            >
              {{ $t("member.luckWalletCloseWallet") }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_lm_active') && (row.status === 1 || row.status === 2) && row.status !== 5"
              class="reset-margin"
              link
              type="warning"
              :size="size"
              @click="handleWallet(row, 'freeze')"
            >
              {{ $t("member.luckWalletFreeze") }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_lm_active') && row.status === 5"
              class="reset-margin"
              link
              type="success"
              :size="size"
              @click="handleWallet(row, 'unfreeze')"
            >
              {{ $t("member.luckWalletRecover") }}
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
