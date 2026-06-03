<script setup lang="ts">
import { ref } from "vue";
import { usePromotionApply } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import Download from "~icons/ep/download";

defineOptions({ name: "PromotionApply" });

const formRef = ref();
const {
  searchForm,
  loading,
  columns,
  dataList,
  pagination,
  statusOptions,
  approveWayOptions,
  walletTypeOptions,
  totalAmount,
  count,
  onSearch,
  resetForm,
  handleSizeChange,
  handleCurrentChange,
  handleCancel,
  handleReApply,
  handleApprove,
  openLog,
  openVerifyDetail,
  openPromotionView,
  handleExport
} = usePromotionApply();
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
      <el-form-item label="ID" prop="id">
        <el-input
          v-model="searchForm.id"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('promotion.memberID')" prop="memberID">
        <el-input
          v-model="searchForm.memberID"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('promotion.memberAccount')" prop="memberAccount">
        <el-input
          v-model="searchForm.memberAccount"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('promotion.name')" prop="promotionName">
        <el-input
          v-model="searchForm.promotionName"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('promotion.batchID')" prop="batchID">
        <el-input
          v-model="searchForm.batchID"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('promotion.promotionID')" prop="promotionID">
        <el-input
          v-model="searchForm.promotionID"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('promotion.approveWay')" prop="approveWay">
        <el-select
          v-model="searchForm.approveWay"
          clearable
          class="!w-[160px]"
        >
          <el-option
            v-for="item in approveWayOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('promotion.status')" prop="status">
        <el-select v-model="searchForm.status" clearable class="!w-[160px]">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('promotion.createdAtStart')" prop="createdAtStart">
        <el-date-picker
          v-model="searchForm.createdAtStart"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item :label="$t('promotion.createdAtEnd')" prop="createdAtEnd">
        <el-date-picker
          v-model="searchForm.createdAtEnd"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item :label="$t('promotion.sendAtStart')" prop="sendAtStart">
        <el-date-picker
          v-model="searchForm.sendAtStart"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item :label="$t('promotion.sendAtEnd')" prop="sendAtEnd">
        <el-date-picker
          v-model="searchForm.sendAtEnd"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item :label="$t('promotion.refIds')" prop="refIds">
        <el-input
          v-model="searchForm.refIds"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('promotion.walletType2')" prop="walletType">
        <el-select
          v-model="searchForm.walletType"
          clearable
          class="!w-[160px]"
        >
          <el-option
            v-for="item in walletTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('promotion.agencyID')" prop="agencyID">
        <el-input
          v-model="searchForm.agencyID"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('promotion.registerIP')" prop="registerIP">
        <el-input
          v-model="searchForm.registerIP"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('promotion.lastLoginIP')" prop="lastLoginIP">
        <el-input
          v-model="searchForm.lastLoginIP"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('promotion.code')" prop="codes">
        <el-input
          v-model="searchForm.codes"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('promotion.internalName')" prop="internalName">
        <el-input
          v-model="searchForm.internalName"
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
          {{ $t("promotion.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("promotion.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('promotion.menuApply')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <span class="mr-4 text-sm">
          {{ $t("promotion.batchAmount") }}{{ totalAmount }}
        </span>
        <span class="mr-4 text-sm">
          {{ $t("promotion.batchCount") }}{{ count }}
        </span>
        <el-button
          v-if="hasAuth('__bnt_promotion_apply_record_export')"
          type="primary"
          :icon="Download"
          @click="handleExport"
        >
          {{ $t("promotion.handleExport") }}
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
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-button
              v-if="hasAuth('__btn_promotion_apply_record')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="openLog(row)"
            >
              {{ $t("promotion.applyRecord") }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_promotion_apply_view')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="openPromotionView(row)"
            >
              {{ $t("promotion.applyView") }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_promotion_apply_detail')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="openVerifyDetail(row)"
            >
              {{ $t("promotion.applyDetail") }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_promotion_apply_reapply')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="handleReApply(row)"
            >
              {{ $t("promotion.applyReapply") }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_promotion_apply_cancel') && row.status !== 7"
              class="reset-margin"
              link
              type="danger"
              :size="size"
              @click="handleCancel(row)"
            >
              {{ $t("promotion.cancelApply") }}
            </el-button>
            <el-button
              v-if="
                hasAuth('__btn_promotion_batch_pass_reject') &&
                row.status === 2 &&
                row.sendWay === 2
              "
              class="reset-margin"
              link
              type="success"
              :size="size"
              @click="handleApprove(3, row)"
            >
              {{ $t("promotion.manualSend") }}
            </el-button>
            <el-button
              v-if="
                hasAuth('__btn_promotion_batch_pass_reject') &&
                row.status === 2 &&
                row.sendWay === 2
              "
              class="reset-margin"
              link
              type="danger"
              :size="size"
              @click="handleApprove(7, row)"
            >
              {{ $t("promotion.rejectSend") }}
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
