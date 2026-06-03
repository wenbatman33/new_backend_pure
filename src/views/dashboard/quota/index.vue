<script setup lang="ts">
import dayjs from "dayjs";
import { useQuota } from "./utils/hook";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";

import Refresh from "~icons/ep/refresh";
import EditPen from "~icons/ep/edit-pen";
import Check from "~icons/ep/check";
import Close from "~icons/ep/close";
import InfoFilled from "~icons/ep/info-filled";

defineOptions({ name: "DashboardQuota" });

const {
  quotaData,
  isEditing,
  editedWebsiteName,
  chartRef,
  colorClass,
  init,
  switchChange,
  startEditing,
  cancelEdit,
  submitEdit,
  openLogDialog,
  openTransactionDialog,
  openTotalDialog,
  openSettlementDialog
} = useQuota();
</script>

<template>
  <div class="main">
    <div class="relative px-8 py-4 bg-bg_color">
      <!-- 右上工具：水位開關 + 重新整理 -->
      <div class="absolute right-8 top-4 flex items-center gap-4">
        <el-switch
          v-if="hasAuth('__btn_site_inout_switch')"
          v-model="quotaData.verify"
          active-text="ON"
          inactive-text="OFF"
          @change="switchChange"
        />
        <el-button :icon="Refresh" circle @click="init" />
      </div>

      <!-- 站台名稱 -->
      <div class="mt-8 ml-4 title">
        <div class="text-[var(--el-text-color-secondary)]">WebSite</div>
        <div class="flex items-center">
          <template v-if="!isEditing">
            <span class="text-4xl">{{ quotaData.websiteName }}</span>
            <el-icon class="ml-2 cursor-pointer" @click="startEditing">
              <EditPen />
            </el-icon>
          </template>
          <template v-else>
            <el-input v-model="editedWebsiteName" class="!w-[200px]" />
            <el-icon class="ml-2 cursor-pointer" @click="submitEdit">
              <Check />
            </el-icon>
            <el-icon class="ml-2 cursor-pointer" @click="cancelEdit">
              <Close />
            </el-icon>
          </template>
          <el-button
            v-if="hasAuth('__btn_site_settlement')"
            type="primary"
            class="ml-4"
            @click="openSettlementDialog"
          >
            {{ $t("dashboard.settlementModalTitle") }}
          </el-button>
        </div>
      </div>

      <!-- 額度用量 -->
      <div class="mt-8 ml-8 content" style="max-width: 600px">
        <div class="flex items-center justify-between">
          <div class="text-2xl">{{ $t("dashboard.quotaUsage") }}</div>
          <div>
            <el-button
              v-if="
                hasAuth('__btn_site_inout_fin') ||
                hasAuth('__btn_site_inout_owner')
              "
              size="small"
              @click="openLogDialog"
            >
              {{ $t("dashboard.logModalTitle") }}
            </el-button>
            <el-button size="small" @click="openTransactionDialog">
              {{ $t("dashboard.quotaChangeDailyReport") }}
            </el-button>
            <el-button size="small" @click="openTotalDialog">
              {{ $t("dashboard.monthlyQuotaStatisticsReport") }}
            </el-button>
          </div>
        </div>

        <!-- 進度條 -->
        <div class="flex items-center mt-4">
          <div class="progress" :class="colorClass">
            <div
              class="progress-inner"
              :style="{ width: `${Number(quotaData.percent) || 0}%` }"
            />
            <span class="progress-text"
              >{{ Number(quotaData.percent || 0).toFixed(2) }}%</span
            >
          </div>
          <el-button size="small" type="success" class="ml-2" @click="init">
            {{ $t("dashboard.refreshData") }}
          </el-button>
        </div>

        <!-- 明細列 -->
        <div class="info-row" :class="colorClass">
          <el-icon><InfoFilled /></el-icon>
          <span class="info-label">{{
            $t("dashboard.quotaUsagePercentage")
          }}</span>
          <span class="info-value text"
            >{{ Number(quotaData.percent || 0).toFixed(2) }}%</span
          >
        </div>
        <div class="info-row">
          <el-icon><InfoFilled /></el-icon>
          <span class="info-label">{{ $t("dashboard.platformMargin") }}</span>
          <span class="info-value">{{
            commaDecimalFormat(quotaData.siteQuotaMoney, 2)
          }}</span>
        </div>
        <div class="info-row">
          <el-icon><InfoFilled /></el-icon>
          <span class="info-label">{{ $t("dashboard.totalQuota") }}</span>
          <span class="info-value">{{
            commaDecimalFormat(quotaData.quota, 2)
          }}</span>
        </div>
        <div class="info-row">
          <el-icon><InfoFilled /></el-icon>
          <span class="info-label">{{ $t("dashboard.platformWinLoss") }}</span>
          <span class="info-value">{{
            commaDecimalFormat(quotaData.winAmount, 2)
          }}</span>
        </div>
        <div class="info-row">
          <el-icon><InfoFilled /></el-icon>
          <span class="info-label">{{ $t("dashboard.dataStartDate") }}</span>
          <span class="info-value">{{
            quotaData.settlementDate
              ? dayjs(quotaData.settlementDate)
                  .add(1, "day")
                  .format("YYYY-MM-DD")
              : "-"
          }}</span>
        </div>
      </div>

      <!-- 圖表 -->
      <div ref="chartRef" style="width: 100%; height: 300px" class="mt-8" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.progress {
  position: relative;
  width: 420px;
  height: 20px;
  background-color: #e2dfdf;

  .progress-inner {
    height: 100%;
    transition: width 0.3s;
  }

  .progress-text {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 500;
    z-index: 1;
  }

  &.green .progress-inner {
    background-color: rgb(87 132 11);
  }

  &.orange .progress-inner {
    background-color: rgb(236 165 65);
  }

  &.red .progress-inner {
    background-color: rgb(196 51 44);
  }
}

.info-row {
  display: flex;
  align-items: center;
  margin-top: 16px;

  .info-label {
    flex: 1;
    margin-left: 8px;
  }

  .info-value {
    text-align: right;
  }

  &.green .text {
    color: rgb(87 132 11);
  }

  &.orange .text {
    color: rgb(236 165 65);
  }

  &.red .text {
    color: rgb(196 51 44);
  }
}
</style>
