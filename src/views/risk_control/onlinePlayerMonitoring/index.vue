<script setup lang="ts">
import { useOnlinePlayerMonitoring } from "./utils/hook";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

defineOptions({ name: "RiskControlOnlinePlayerMonitoring" });

const { loading, saving, onlineCount, formData, handleSave } =
  useOnlinePlayerMonitoring();

// 無編輯權限時停用儲存
const noEditAuth = !hasAuth("__btn_edit_online_monitoring");
</script>

<template>
  <div class="main">
    <el-card v-loading="loading" shadow="never">
      <div class="flex flex-col">
        <p class="text-2xl font-medium">
          {{ $t("risk_control.onlinePlayerMonitoring") }}
        </p>
        <p class="mt-6 text-lg">
          {{ $t("risk_control.numberOfPeopleOnlineCurrently") }}：
          <span class="font-semibold text-primary">{{ onlineCount }}</span>
          {{ $t("risk_control.peopleNo") }}
        </p>
        <p class="mt-6 mb-8 text-lg font-medium">
          {{ $t("risk_control.multipleAccountLoginMonitoring") }}
        </p>

        <!-- 同裝置 -->
        <div class="flex items-center gap-4 mb-5 flex-wrap">
          <el-switch v-model="formData.same_device_enable" />
          <span class="flex items-center gap-3">
            {{ $t("risk_control.sameDevice") }}：
            <el-input-number
              v-model="formData.same_device_limit"
              :min="0"
              :controls="false"
              class="!w-[80px]"
            />
            {{ $t("risk_control.sameTimeLoginRemovePlayer") }}
          </span>
        </div>

        <!-- 同 IP -->
        <div class="flex items-center gap-4 mb-5 flex-wrap">
          <el-switch v-model="formData.same_ip_enable" />
          <span class="flex items-center gap-3">
            {{ $t("risk_control.sameIP") }}：
            <el-input-number
              v-model="formData.same_ip_limit"
              :min="0"
              :controls="false"
              class="!w-[80px]"
            />
            {{ $t("risk_control.sameTimeLoginRemovePlayer") }}
          </span>
        </div>

        <el-button
          type="primary"
          class="mt-6 self-end"
          :disabled="noEditAuth"
          :loading="saving"
          @click="handleSave"
        >
          {{ $t("risk_control.save") }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>
