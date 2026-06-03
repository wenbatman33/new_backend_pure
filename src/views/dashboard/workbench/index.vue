<script setup lang="ts">
import { computed } from "vue";
import { useWorkbench } from "./utils/hook";
import { useUserStoreHook } from "@/store/modules/user";
import { transformI18n as $t } from "@/plugins/i18n";
import { IconifyIconOnline } from "@/components/ReIcon";
import SaleRadar from "./components/SaleRadar.vue";

defineOptions({ name: "DashboardWorkbench" });

const { loading, data } = useWorkbench();

const userStore = useUserStoreHook();
const userName = computed(() => userStore.nickname || userStore.username);
const userAvatar = computed(() => userStore.avatar);
</script>

<template>
  <div class="main">
    <!-- 頂部歡迎/統計列 -->
    <el-card shadow="never" class="welcome-header">
      <div class="flex items-center flex-wrap">
        <el-avatar :size="72" :src="userAvatar" />
        <div class="ml-6 flex flex-col justify-center">
          <h1 class="text-lg m-0">
            {{ $t("dashboard.greeting", { name: userName }) }}
          </h1>
          <span class="text-[var(--el-text-color-secondary)]">
            {{ $t("dashboard.weatherTip") }}
          </span>
        </div>
        <div class="flex flex-1 justify-end mt-2">
          <div class="flex flex-col justify-center text-right">
            <span class="text-[var(--el-text-color-secondary)]">
              {{ $t("dashboard.todo") }}
            </span>
            <span class="text-2xl">{{ data.stats.todo }}</span>
          </div>
          <div class="flex flex-col justify-center text-right mx-12">
            <span class="text-[var(--el-text-color-secondary)]">
              {{ $t("dashboard.project") }}
            </span>
            <span class="text-2xl">{{ data.stats.project }}</span>
          </div>
          <div class="flex flex-col justify-center text-right mr-4">
            <span class="text-[var(--el-text-color-secondary)]">
              {{ $t("dashboard.team") }}
            </span>
            <span class="text-2xl">{{ data.stats.team }}</span>
          </div>
        </div>
      </div>
    </el-card>

    <div class="flex flex-wrap mt-4">
      <!-- 左欄 -->
      <div class="left-col">
        <!-- 項目 -->
        <el-card v-loading="loading" shadow="never">
          <template #header>
            <div class="flex justify-between items-center">
              <span class="font-medium">{{ $t("dashboard.project") }}</span>
              <el-button text type="primary" size="small">
                {{ $t("dashboard.more") }}
              </el-button>
            </div>
          </template>
          <div class="flex flex-wrap">
            <div
              v-for="(item, idx) in data.groupItems"
              :key="idx"
              class="project-grid"
            >
              <span class="flex items-center">
                <IconifyIconOnline
                  :icon="item.icon"
                  :style="{ color: item.color, fontSize: '30px' }"
                />
                <span class="text-lg ml-4">{{ item.title }}</span>
              </span>
              <div
                class="flex mt-2 h-10 text-[var(--el-text-color-secondary)]"
              >
                {{ item.desc }}
              </div>
              <div
                class="flex justify-between text-[var(--el-text-color-secondary)]"
              >
                <span>{{ item.group }}</span>
                <span>{{ item.date }}</span>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 最新動態 -->
        <el-card v-loading="loading" shadow="never" class="mt-4">
          <template #header>
            <div class="flex justify-between items-center">
              <span class="font-medium">{{ $t("dashboard.latestActivity") }}</span>
              <el-button text type="primary" size="small">
                {{ $t("dashboard.more") }}
              </el-button>
            </div>
          </template>
          <ul class="dynamic-list">
            <li
              v-for="(item, idx) in data.dynamicInfoItems"
              :key="idx"
              class="flex items-center py-3 border-b border-[var(--el-border-color-lighter)]"
            >
              <el-avatar :size="30">{{ item.name.charAt(0) }}</el-avatar>
              <div class="ml-3">
                <!-- eslint-disable-next-line vue/no-v-html -->
                <div><b>{{ item.name }}</b> <span v-html="item.desc" /></div>
                <div class="text-xs text-[var(--el-text-color-secondary)]">
                  {{ item.date }}
                </div>
              </div>
            </li>
          </ul>
        </el-card>
      </div>

      <!-- 右欄 -->
      <div class="right-col">
        <!-- 快捷導航 -->
        <el-card v-loading="loading" shadow="never">
          <template #header>
            <span class="font-medium">{{ $t("dashboard.quickNav") }}</span>
          </template>
          <div class="flex flex-wrap">
            <div
              v-for="(item, idx) in data.navItems"
              :key="idx"
              class="nav-grid"
            >
              <span class="flex flex-col items-center">
                <IconifyIconOnline
                  :icon="item.icon"
                  :style="{ color: item.color, fontSize: '20px' }"
                />
                <span class="mt-2">{{ item.title }}</span>
              </span>
            </div>
          </div>
        </el-card>

        <!-- 銷售統計 -->
        <SaleRadar :loading="loading" :data="data.saleRadar" class="mt-4" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.welcome-header :deep(.el-card__body) {
  width: 100%;
}

.left-col {
  width: 70%;
  padding-right: 16px;
}

.right-col {
  width: 30%;
}

@media (max-width: 992px) {
  .left-col,
  .right-col {
    width: 100%;
    padding-right: 0;
  }

  .right-col {
    margin-top: 16px;
  }
}

.project-grid {
  width: 33.33%;
  padding: 16px;
  border: 1px solid var(--el-border-color-lighter);
  box-sizing: border-box;
}

.nav-grid {
  width: 33.33%;
  padding: 16px 0;
  display: flex;
  justify-content: center;
  cursor: pointer;
  border: 1px solid var(--el-border-color-lighter);
  box-sizing: border-box;

  &:hover {
    background: var(--el-fill-color-light);
  }
}

.dynamic-list li:last-child {
  border-bottom: none;
}

:deep(a) {
  color: var(--el-color-primary);
}
</style>
