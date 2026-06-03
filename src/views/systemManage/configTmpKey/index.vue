<script setup lang="ts">
import { useConfigTmpKey } from "./utils/hook";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

defineOptions({ name: "SystemManageConfigTmpKey" });

const { loading, jsonText, formatJson, handleSubmit, handleDeploy } =
  useConfigTmpKey();
</script>

<template>
  <div class="main">
    <el-card v-loading="loading" shadow="never">
      <template #header>
        <div class="card-header">
          <span class="font-medium">{{ $t("systemManage.configTmpKeyTitle") }}</span>
          <el-button link type="primary" @click="formatJson">
            {{ $t("systemManage.configTmpKeyFormat") }}
          </el-button>
        </div>
      </template>

      <el-input
        v-model="jsonText"
        type="textarea"
        :rows="22"
        spellcheck="false"
        class="json-edit-area"
        :placeholder="$t('systemManage.configTmpKeyPlaceholder')"
      />

      <div class="flex flex-row-reverse mt-4">
        <el-button
          v-if="hasAuth('__btn_frontend_layoutsetting_deploy')"
          type="danger"
          class="ml-3"
          :loading="loading"
          @click="handleDeploy"
        >
          {{ $t("systemManage.configTmpKeyPublish") }}
        </el-button>
        <el-button
          v-if="hasAuth('__btn_frontend_layoutsetting_edit')"
          type="primary"
          :loading="loading"
          @click="handleSubmit"
        >
          {{ $t("systemManage.configTmpKeySave") }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.json-edit-area {
  :deep(.el-textarea__inner) {
    font-family:
      ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 13px;
    line-height: 1.6;
  }
}
</style>
