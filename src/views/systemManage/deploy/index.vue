<script setup lang="ts">
import { useDeploy } from "./utils/hook";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

defineOptions({ name: "SystemManageDeploy" });

const {
  vdPlatform,
  platform91,
  v2platform,
  show91,
  showConfirm91,
  showConfirmVD,
  showConfirm,
  openOperateLog
} = useDeploy();
</script>

<template>
  <div class="main">
    <div class="flex justify-end mb-3">
      <el-button type="primary" @click="openOperateLog">
        {{ $t("systemManage.deployOperateLog") }}
      </el-button>
    </div>

    <!-- 包網（前台站台） -->
    <el-card shadow="never" class="mb-3">
      <template #header>
        <span>{{ $t("systemManage.deployFrontTitle") }}</span>
      </template>
      <div class="platform-grid">
        <div
          v-for="platform in vdPlatform"
          :key="platform.id"
          class="platform-cell"
        >
          <el-tag :color="platform.color" effect="dark" class="platform-tag">
            {{ platform.displayName }}
          </el-tag>
          <el-link
            v-if="hasAuth('__btn_frontend_deploy')"
            type="primary"
            class="mt-2"
            @click="showConfirmVD(platform)"
          >
            {{ $t("systemManage.deployClickToPublish") }}
          </el-link>
        </div>
      </div>
    </el-card>

    <!-- 91 站台 -->
    <el-card
      v-if="show91 && hasAuth('__block_deploy_91')"
      shadow="never"
      class="mb-3"
    >
      <template #header>
        <span>{{ $t("systemManage.deploy91Title") }}</span>
      </template>
      <div class="platform-grid">
        <div
          v-for="platform in platform91"
          :key="platform.id"
          class="platform-cell"
        >
          <el-tag :color="platform.color" effect="dark" class="platform-tag">
            {{ platform.displayName }}
          </el-tag>
          <el-link
            v-if="hasAuth('__btn_frontend_deploy')"
            type="primary"
            class="mt-2"
            @click="showConfirm91(platform)"
          >
            {{ $t("systemManage.deployClickToPublish") }}
          </el-link>
        </div>
      </div>
    </el-card>

    <!-- v2 前台站台 -->
    <el-card v-if="hasAuth('__block_deploy_v2')" shadow="never">
      <template #header>
        <span>{{ $t("systemManage.deployV2Title") }}</span>
      </template>
      <div class="platform-grid">
        <div
          v-for="platform in v2platform"
          :key="platform.id"
          class="platform-cell"
        >
          <el-tag :color="platform.color" effect="dark" class="platform-tag">
            {{ platform.displayName }}
          </el-tag>
          <el-link
            v-if="hasAuth('__btn_frontend_deploy')"
            type="primary"
            class="mt-2"
            @click="showConfirm(platform)"
          >
            {{ $t("systemManage.deployClickToPublish") }}
          </el-link>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.platform-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.platform-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 160px;
  padding: 16px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 4px;
}

.platform-tag {
  padding: 5px 14px;
  border: none;
}
</style>
