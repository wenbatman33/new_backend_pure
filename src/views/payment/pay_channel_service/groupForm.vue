<script setup lang="ts">
import { ref } from "vue";
import { transformI18n as $t } from "@/plugins/i18n";
import type { GroupTransferItem } from "./utils/types";

const props = withDefaults(
  defineProps<{
    allGroups: GroupTransferItem[];
    targetKeys: string[];
  }>(),
  {
    allGroups: () => [],
    targetKeys: () => []
  }
);

const value = ref<string[]>([...props.targetKeys]);
// el-transfer data 需要 key/label
const transferData = props.allGroups.map(g => ({
  key: g.key,
  label: g.label
}));

function getTargetKeys() {
  return value.value;
}

defineExpose({ getTargetKeys });
</script>

<template>
  <div class="flex justify-center">
    <el-transfer
      v-model="value"
      :data="transferData"
      :titles="[$t('payment.allLineGroups'), $t('payment.existingGroups')]"
    />
  </div>
</template>
