<script setup lang="ts">
import { ref } from "vue";
import { useAdjustment } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import View from "~icons/ep/view";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "MemberAdjustment" });

const formRef = ref();
const {
  searchForm,
  dateRange,
  statusOptions,
  typeOptions,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  openReviewDialog,
  handleDelete
} = useAdjustment();
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
      <el-form-item :label="$t('member.name')" prop="subject">
        <el-input
          v-model="searchForm.subject"
          clearable
          class="!w-[180px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('member.status')" prop="status">
        <el-select v-model="searchForm.status" class="!w-[160px]">
          <el-option :label="$t('member.all')" :value="0" />
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('member.type')" prop="type">
        <el-select v-model="searchForm.type" class="!w-[160px]">
          <el-option :label="$t('member.all')" :value="0" />
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('member.dateRange')" prop="dateRange">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          value-format="YYYY-MM-DD"
          :start-placeholder="$t('member.startDate')"
          :end-placeholder="$t('member.endDate')"
          class="!w-[260px]"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" :loading="loading" @click="onSearch">
          {{ $t("member.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("member.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar
      :title="$t('member.menuManualWalletAdjustment')"
      :columns="columns"
      @refresh="onSearch"
    >
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
            <!-- 已審核(status=3 未審核)：未審核時顯示「審核」，否則顯示「明細」 -->
            <el-button
              v-if="
                Number(row.status) === 3 &&
                hasAuth('__btn_risk_change_point_audit')
              "
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="View"
              @click="openReviewDialog(row, false)"
            >
              {{ $t("member.promotionSection10") }}
            </el-button>
            <el-button
              v-else-if="Number(row.status) !== 3"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="View"
              @click="openReviewDialog(row, true)"
            >
              {{ $t("member.dataDetail") }}
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
