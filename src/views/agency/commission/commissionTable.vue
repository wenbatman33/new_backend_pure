<script setup lang="ts">
import { useCommission } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import Download from "~icons/ep/download";

const props = defineProps<{ tab: 1 | 2 | 3 }>();

const {
  searchForm,
  dataList,
  loading,
  columns,
  isWeek,
  billingCycleOptions,
  distributedCalc,
  childDistributedCalc,
  passCount,
  passAmount,
  passChildCommission,
  passChildBonus,
  commissionShow,
  commissionDisabled,
  canOperate,
  setRowStatus,
  onSearch,
  resetForm,
  handleExport,
  openCheckDialog
} = useCommission(props.tab);

const tableTitle =
  props.tab === 1
    ? $t("agency.commissionTab1")
    : props.tab === 2
      ? $t("agency.commissionTab2")
      : $t("agency.commissionTab3");
</script>

<template>
  <div class="main">
    <!-- 搜尋區 -->
    <el-form
      :inline="true"
      :model="searchForm"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item :label="$t('agency.commissionBillingCycle')">
        <el-select v-model="searchForm.billingCycle" class="!w-[120px]">
          <el-option
            v-for="item in billingCycleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="!isWeek"
        :label="$t('agency.commissionMonth')"
      >
        <el-date-picker
          v-model="searchForm.date"
          type="month"
          value-format="YYYY-MM-DD HH:mm:ss"
          class="!w-[160px]"
        />
      </el-form-item>
      <el-form-item v-else :label="$t('agency.commissionWeek')">
        <el-date-picker
          v-model="searchForm.date"
          type="week"
          format="YYYY[w]ww"
          value-format="YYYY-MM-DD HH:mm:ss"
          class="!w-[160px]"
        />
      </el-form-item>
      <el-form-item :label="$t('agency.commissionAgencyId')">
        <el-input
          v-model="searchForm.agencyID"
          clearable
          :placeholder="$t('agency.commissionAgencyIdPlaceholder')"
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('agency.commissionDisplayZero')">
        <el-switch
          v-model="searchForm.displayZero"
          :active-text="$t('agency.commissionShow')"
          :inactive-text="$t('agency.commissionHide')"
          inline-prompt
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="Search"
          :loading="loading"
          @click="onSearch"
        >
          {{ $t("agency.commissionSearch") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm">
          {{ $t("agency.commissionReset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格區 -->
    <PureTableBar :title="tableTitle" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <el-button type="primary" :icon="Download" @click="handleExport">
          {{ $t("agency.commissionExportExcel") }}
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
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        >
          <template #operation="{ row }">
            <template
              v-if="
                canOperate(row) &&
                hasAuth('__btn_commission_distribution_operate')
              "
            >
              <el-radio-group
                v-if="Number(row.totalCommission) !== 0"
                :model-value="row.setStatus"
                size="small"
                @update:model-value="val => setRowStatus(row, val)"
              >
                <el-radio-button :value="2">
                  {{ $t("agency.commissionPass") }}
                </el-radio-button>
                <el-radio-button :value="3">
                  {{ $t("agency.commissionDeny") }}
                </el-radio-button>
                <el-radio-button v-if="tab !== 2" :value="4">
                  {{ $t("agency.commissionDelay") }}
                </el-radio-button>
              </el-radio-group>
              <span v-else class="zero-tip">
                {{ $t("agency.commissionZeroCommissionTip") }}
              </span>
            </template>
          </template>
        </pure-table>

        <!-- 合計與派發 -->
        <div class="footer-bar">
          <el-descriptions
            v-if="tab === 1"
            :column="4"
            border
            size="small"
            class="footer-desc"
          >
            <el-descriptions-item :label="$t('agency.commissionPassCount')">
              {{ passCount }}
            </el-descriptions-item>
            <el-descriptions-item
              :label="
                isWeek
                  ? $t('agency.commissionWeekPassAmount')
                  : $t('agency.commissionMonthPassAmount')
              "
            >
              {{ passAmount }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('agency.commissionDistributedCount')">
              {{ distributedCalc.cnt }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('agency.commissionDistributedAmount')">
              {{ Number(distributedCalc.amount).toFixed(2) }}
            </el-descriptions-item>
          </el-descriptions>

          <el-descriptions
            v-else
            :column="5"
            border
            size="small"
            class="footer-desc"
          >
            <el-descriptions-item :label="$t('agency.commissionPassCount')">
              {{ passCount }}
            </el-descriptions-item>
            <el-descriptions-item
              :label="
                isWeek
                  ? $t('agency.commissionWeekTotalCommission')
                  : $t('agency.commissionMonthTotalCommission')
              "
            >
              {{ passChildCommission }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('agency.commissionChildBonusAmount')">
              {{ passChildBonus }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('agency.commissionDistributedCount')">
              {{ childDistributedCalc.cnt }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('agency.commissionDistributedAmount')">
              {{ Number(childDistributedCalc.childCommissionAmount).toFixed(2) }}
            </el-descriptions-item>
          </el-descriptions>

          <el-button
            v-if="
              commissionShow &&
              hasAuth('__btn_commission_distribution_operate')
            "
            class="ml-3"
            type="primary"
            :disabled="commissionDisabled"
            @click="openCheckDialog"
          >
            {{ $t("agency.commissionDistribute") }}
          </el-button>
        </div>
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

.footer-bar {
  display: flex;
  align-items: center;
  margin-top: 12px;
}

.footer-desc {
  flex: 1;
}

.zero-tip {
  color: var(--el-color-danger);
}
</style>
