<script setup lang="ts">
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { transformI18n as $t } from "@/plugins/i18n";
import { formatNumber } from "@/utils/number";
import type { GrowCardItem } from "../utils/types";

defineProps<{
  loading: boolean;
  list: GrowCardItem[];
}>();
</script>

<template>
  <div class="grow-card-wrap">
    <el-card
      v-for="item in list"
      :key="item.titleKey"
      v-loading="loading"
      shadow="hover"
      class="grow-card"
    >
      <div class="flex items-center justify-between">
        <span class="text-base font-medium">{{ $t(item.titleKey) }}</span>
        <el-tag :color="item.color" effect="dark">{{ $t(item.actionKey) }}</el-tag>
      </div>
      <div class="flex items-center justify-between py-4">
        <span class="text-2xl font-bold">$ {{ formatNumber(item.value) }}</span>
        <component
          :is="useRenderIcon(item.icon || 'ep:data-line')"
          style="font-size: 40px"
        />
      </div>
      <div class="flex items-center justify-between text-text_color_regular">
        <span>{{ $t("dashboard.total") }}{{ $t(item.titleKey) }}</span>
        <span>$ {{ formatNumber(item.total) }}</span>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.grow-card-wrap {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}
</style>
