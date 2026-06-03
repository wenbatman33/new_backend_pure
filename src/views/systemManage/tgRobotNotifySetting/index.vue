<script setup lang="ts">
import { useTgRobotNotifySetting } from "./utils/hook";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

defineOptions({ name: "SystemManageTgRobotNotifySetting" });

const { form, loading, saving, handleSwitchChange, handleSave } =
  useTgRobotNotifySetting();
</script>

<template>
  <div class="main">
    <el-card v-loading="loading" shadow="never" class="tg-setting-card">
      <!-- 启用开关 -->
      <div class="flex items-center mb-6">
        <label class="mr-4">{{ $t("systemManage.tgRobotNotifyEnable") }}</label>
        <el-switch
          v-model="form.open"
          active-text="ON"
          inactive-text="OFF"
          inline-prompt
          @change="handleSwitchChange"
        />
      </div>

      <!-- 启用后才显示 Chat ID 设定 -->
      <template v-if="form.open">
        <div class="flex items-center mb-6">
          <label class="mr-4">
            TG {{ $t("systemManage.tgRobotNotify") }} Chat ID
          </label>
          <el-input
            v-model="form.chatId"
            clearable
            class="!w-[320px]"
            :placeholder="$t('systemManage.tgRobotNotifyInputText')"
          />
        </div>
        <div class="flex items-center mb-6">
          <span class="mr-4">
            {{ $t("systemManage.tgRobotNotifyHowToObtain") }} Chat ID
          </span>
          <span class="text-text_color_regular break-all">{{ form.manual }}</span>
        </div>
      </template>

      <!-- 保存 -->
      <div class="flex justify-center mt-8">
        <el-button
          v-if="hasAuth('__btn_tg_bot_edit')"
          type="primary"
          :loading="saving"
          @click="handleSave"
        >
          {{ $t("systemManage.tgRobotNotifySave") }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.tg-setting-card {
  max-width: 640px;
}
</style>
