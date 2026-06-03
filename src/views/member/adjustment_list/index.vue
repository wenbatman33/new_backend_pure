<script setup lang="ts">
import { ref } from "vue";
import { useAdjustmentList } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import Download from "~icons/ep/download";

defineOptions({ name: "MemberAdjustmentList" });

const formRef = ref();
const {
  searchForm,
  dateRange,
  loading,
  columns,
  dataList,
  pagination,
  adjustReasonOptions,
  statusOptions,
  adjustmentTypeOptions,
  onSearch,
  onDateChange,
  resetForm,
  handleExport,
  handleSizeChange,
  handleCurrentChange
} = useAdjustmentList();
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
      <el-form-item :label="$t('member.member')" prop="memberName">
        <el-input
          v-model="searchForm.memberName"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('member.adjustmentReason')" prop="reason">
        <el-select v-model="searchForm.reason" clearable class="!w-[180px]">
          <el-option
            v-for="item in adjustReasonOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('member.tradeStatus')" prop="status">
        <el-select v-model="searchForm.status" clearable class="!w-[160px]">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('member.upperAndLower')" prop="adjustmentType">
        <el-radio-group v-model="searchForm.adjustmentType">
          <el-radio
            v-for="item in adjustmentTypeOptions"
            :key="item.value"
            :value="item.value"
            >{{ item.label }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('member.tradeId')" prop="transactionID">
        <el-input
          v-model="searchForm.transactionID"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('member.depositSection11')" prop="updateUser">
        <el-input
          v-model="searchForm.updateUser"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('member.VipSection11')" prop="amountTimes">
        <el-input
          v-model="searchForm.amountTimes"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('member.tradeTime')">
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          range-separator="～"
          :start-placeholder="$t('member.tradeTimeStart')"
          :end-placeholder="$t('member.tradeTimeEnd')"
          format="YYYY/MM/DD HH:mm"
          value-format="YYYY-MM-DD HH:mm"
          @change="onDateChange"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="Search"
          :loading="loading"
          @click="onSearch"
        >
          {{ $t("member.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("member.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('member.menuAdjustmentList')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_adjustment_member_export')"
          type="primary"
          :icon="Download"
          @click="handleExport"
        >
          {{ $t("member.handleExport") }}
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
