<script setup lang="ts">
import { useWithdrawalTime } from "./utils/hook";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

defineOptions({ name: "SystemManageWithdrawalTime" });

const {
  loading,
  formData,
  dayConfigs,
  isCrossDay,
  onStartChange,
  onEndChange,
  getData,
  handleSubmit
} = useWithdrawalTime();
</script>

<template>
  <div class="main">
    <el-card v-loading="loading" shadow="never">
      <!-- 提款时间开关 -->
      <div class="mb-5 flex items-center">
        <span class="mr-3">{{ $t("systemManage.withdrawalTimeEnable") }}</span>
        <el-switch
          v-model="formData.withdrawalTimeEnable"
          active-text="ON"
          inactive-text="OFF"
        />
      </div>

      <!-- 一周七天时间区间设定 -->
      <div
        v-for="day in dayConfigs"
        :key="day.startField"
        class="mb-3 flex items-center"
      >
        <span class="w-[90px]">{{ $t(day.titleKey) }}</span>
        <el-time-picker
          :model-value="formData[day.startField] || ''"
          format="HH:mm"
          value-format="HH:mm:ss"
          :clearable="false"
          :disabled="!formData.withdrawalTimeEnable"
          class="!w-[120px]"
          @update:model-value="val => onStartChange(day.startField, val)"
        />
        <span class="mx-2">~</span>
        <el-time-picker
          :model-value="formData[day.endField] || ''"
          format="HH:mm"
          value-format="HH:mm:ss"
          :clearable="false"
          :disabled="!formData.withdrawalTimeEnable"
          class="!w-[120px]"
          @update:model-value="val => onEndChange(day.endField, val)"
        />
        <el-checkbox
          class="ml-4"
          :model-value="isCrossDay(formData[day.startField], formData[day.endField])"
          :disabled="true"
        >
          {{ $t("systemManage.crossDay") }}
        </el-checkbox>
      </div>

      <!-- 提示文字 -->
      <div class="mt-4 text-[var(--el-color-danger)]">
        <div>* {{ $t("systemManage.note1") }}</div>
        <div>* {{ $t("systemManage.note2") }}</div>
      </div>

      <!-- 操作按钮 -->
      <div v-if="hasAuth('__btn_withdrawal_time_management')" class="mt-5">
        <el-button class="mr-3" @click="getData">
          {{ $t("systemManage.cancel") }}
        </el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit">
          {{ $t("systemManage.saveSetting") }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>
