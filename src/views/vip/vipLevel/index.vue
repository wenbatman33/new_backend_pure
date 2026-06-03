<script setup lang="ts">
import { useVipLevel } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

defineOptions({ name: "VipLevel" });

const {
  loading,
  dataLength,
  goSetup,
  initLevel,
  formDataDisabled,
  formData,
  dataList,
  columns,
  vipKeepOptions,
  vipKeepAgingOptions,
  vipDowngradeOptions,
  customizedServiceOptions,
  giftDeadlineOptions,
  vipWeekOptions,
  vipMonthOptions,
  handleSubmitInit,
  handleSubmitConfigure,
  handleCancelConfigure,
  handleSubmitTable,
  getData,
  openEditDialog
} = useVipLevel();
</script>

<template>
  <div class="main">
    <!-- 初始化引導：尚未設定任何 VIP 等級 -->
    <div
      v-show="dataLength === 0"
      class="bg-bg_color p-6 rounded mb-4"
    >
      <div class="text-center">
        <div class="text-xl font-medium mt-2">{{ $t("vip.setting1") }}</div>
        <div v-if="!goSetup">
          <div class="text-xl font-medium mt-2">{{ $t("vip.setting2") }}</div>
          <div class="mt-6">
            <el-button type="primary" @click="goSetup = true">
              {{ $t("vip.setting3") }}
            </el-button>
          </div>
        </div>
        <div v-else>
          <div class="text-xl font-medium mt-2">{{ $t("vip.setting4") }}</div>
          <div class="mt-6 flex items-center justify-center gap-2">
            <span>{{ $t("vip.setting5") }}</span>
            <el-input
              v-model="initLevel"
              type="number"
              class="!w-[80px]"
            />
            <span>{{ $t("vip.setting6") }}</span>
            <el-button type="primary" @click="handleSubmitInit">
              {{ $t("vip.setting7") }}
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 設定區 + 等級表（已有等級時顯示） -->
    <template v-if="dataLength > 0">
      <!-- VIP 機制設定 -->
      <div class="bg-bg_color p-4 rounded mb-4">
        <!-- 機制開關列 -->
        <div class="flex flex-wrap items-center gap-x-6 gap-y-3 mb-4">
          <div class="flex items-center gap-2">
            <span>{{ $t("vip.setting8") }}</span>
            <el-switch
              v-model="formData.vipStatus"
              active-text="ON"
              inactive-text="OFF"
              :disabled="formDataDisabled"
            />
          </div>
          <div class="flex items-center gap-2">
            <span>{{ $t("vip.setting14") }}</span>
            <el-switch
              v-model="formData.isSpeedLevelUp"
              active-text="ON"
              inactive-text="OFF"
              :disabled="formDataDisabled"
            />
          </div>
          <div class="flex items-center gap-2">
            <span>{{ $t("vip.level2Check") }}</span>
            <el-switch
              v-model="formData.isBindCard"
              active-text="ON"
              inactive-text="OFF"
              :disabled="formDataDisabled"
            />
          </div>
          <div
            v-if="hasAuth('__btn_vipsetting_refundshow')"
            class="flex items-center gap-2"
          >
            <span>{{ $t("vip.counterfeitAndReceiveBlock") }}</span>
            <el-switch
              v-model="formData.isShowRefund"
              active-text="ON"
              inactive-text="OFF"
              :disabled="formDataDisabled"
            />
          </div>
          <div
            v-if="hasAuth('__btn_vipsetting_customized_service')"
            class="flex items-center gap-2"
          >
            <span>{{ $t("vip.exclusiveOfferDisplay") }}</span>
            <el-select
              v-model="formData.customizedService"
              :disabled="formDataDisabled"
              class="!w-[150px]"
            >
              <el-option
                v-for="item in customizedServiceOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>

        <!-- 保級機制列 -->
        <div class="flex flex-wrap items-center gap-x-6 gap-y-3 mb-4">
          <div class="flex items-center gap-2">
            <span>{{ $t("vip.relegationMechanismEnabled") }}</span>
            <el-switch
              v-model="formData.isKeep"
              active-text="ON"
              inactive-text="OFF"
              :disabled="formDataDisabled"
            />
          </div>
          <div class="flex items-center gap-2">
            <span>{{ $t("vip.relegationCalculationSchedule") }}</span>
            <el-select
              v-model="formData.vipKeep"
              :disabled="formDataDisabled"
              class="!w-[150px]"
            >
              <el-option
                v-for="item in vipKeepOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="flex items-center gap-2">
            <span>{{ $t("vip.membershipRetentionTimeLimit") }}</span>
            <el-select
              v-model="formData.vipKeepAging"
              :disabled="formDataDisabled"
              class="!w-[150px]"
            >
              <el-option
                v-for="item in vipKeepAgingOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="flex items-center gap-2">
            <span>{{ $t("vip.downgradeMode") }}</span>
            <el-select
              v-model="formData.vipDowngrade"
              :disabled="formDataDisabled"
              class="!w-[150px]"
            >
              <el-option
                v-for="item in vipDowngradeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>

        <!-- 晉級禮金列 -->
        <div class="flex flex-wrap items-center gap-x-6 gap-y-3 mb-4">
          <div class="flex items-center gap-2">
            <span>{{ $t("vip.isUpgradeGift") }}</span>
            <el-switch
              v-model="formData.isUpgradeGift"
              active-text="ON"
              inactive-text="OFF"
              :disabled="formDataDisabled"
            />
          </div>
          <div class="flex items-center gap-2">
            <span>{{ $t("vip.isUpgradeGifDate") }}</span>
            <el-select
              v-model="formData.giftDeadline"
              :disabled="formDataDisabled"
              class="!w-[150px]"
            >
              <el-option
                v-for="item in giftDeadlineOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <span class="text-[var(--el-text-color-secondary)]">
            {{ $t("vip.giftDeadlineMessage") }}
          </span>
        </div>

        <!-- 日/週/月禮金列 -->
        <div class="flex flex-wrap items-center gap-x-6 gap-y-3 mb-4">
          <div class="flex items-center gap-2">
            <span>{{ $t("vip.isDailyGift") }}</span>
            <el-switch
              v-model="formData.isDailyGift"
              active-text="ON"
              inactive-text="OFF"
              :disabled="formDataDisabled"
            />
          </div>
          <div class="flex items-center gap-2">
            <span>{{ $t("vip.setting9A") }}</span>
            <el-switch
              v-model="formData.isWeeklyGift"
              active-text="ON"
              inactive-text="OFF"
              :disabled="formDataDisabled"
            />
          </div>
          <div class="flex items-center gap-2">
            <span>{{ $t("vip.setting9") }}</span>
            <el-select
              v-model="formData.vipWeek"
              :disabled="formDataDisabled"
              class="!w-[120px]"
            >
              <el-option
                v-for="item in vipWeekOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="flex items-center gap-2">
            <span>{{ $t("vip.setting10A") }}</span>
            <el-switch
              v-model="formData.isMonthlyGift"
              active-text="ON"
              inactive-text="OFF"
              :disabled="formDataDisabled"
            />
          </div>
          <div class="flex items-center gap-2">
            <span>{{ $t("vip.setting10") }}</span>
            <el-select
              v-model="formData.vipMonth"
              :disabled="formDataDisabled"
              class="!w-[120px]"
            >
              <el-option
                v-for="item in vipMonthOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <span class="text-[var(--el-text-color-secondary)]">
            {{ $t("vip.setting12") }}
          </span>
        </div>

        <!-- 生日禮金列 -->
        <div class="flex flex-wrap items-center gap-x-6 gap-y-3 mb-4">
          <div class="flex items-center gap-2">
            <span>{{ $t("vip.setting11A") }}</span>
            <el-switch
              v-model="formData.isBdGift"
              active-text="ON"
              inactive-text="OFF"
              :disabled="formDataDisabled"
            />
          </div>
          <div class="flex items-center gap-2">
            <span>{{ $t("vip.setting13") }}</span>
            <el-select
              v-model="formData.bdGiftDeadline"
              :disabled="formDataDisabled"
              class="!w-[150px]"
            >
              <el-option
                v-for="item in giftDeadlineOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <span class="text-[var(--el-text-color-secondary)]">
            {{ $t("vip.giftDeadlineMessage") }}
          </span>
        </div>

        <!-- 設定區操作按鈕 -->
        <div>
          <el-button
            v-show="formDataDisabled"
            @click="formDataDisabled = false"
          >
            {{ $t("vip.edit") }}
          </el-button>
          <el-button
            v-show="!formDataDisabled"
            @click="handleCancelConfigure"
          >
            {{ $t("vip.cancelText") }}
          </el-button>
          <el-button
            v-show="!formDataDisabled && hasAuth('__btn_vipsetting_edit')"
            type="primary"
            @click="handleSubmitConfigure"
          >
            {{ $t("vip.saveText") }}
          </el-button>
        </div>
      </div>

      <!-- 等級表 -->
      <PureTableBar
        :title="$t('vip.menuVipLevel')"
        :columns="columns"
        @refresh="getData"
      >
        <template #buttons>
          <el-button @click="openEditDialog">
            {{ $t("vip.editTitle") }}
          </el-button>
          <el-button @click="getData">{{ $t("vip.resetText") }}</el-button>
          <el-button
            v-if="hasAuth('__btn_vipsetting_edit')"
            type="primary"
            @click="handleSubmitTable"
          >
            {{ $t("vip.saveTextALL") }}
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
          />
        </template>
      </PureTableBar>
    </template>
  </div>
</template>
