<script setup lang="ts">
import { ref, watch, type Ref } from "vue";
import { useECharts } from "@pureadmin/utils";
import { transformI18n as $t } from "@/plugins/i18n";
import type { NameValueItem } from "../utils/types";

const props = defineProps<{
  loading: boolean;
  pie: NameValueItem[] | null;
}>();

const chartRef = ref<HTMLDivElement | null>(null);
const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

watch(
  () => props.pie,
  () => {
    if (!props.pie) return;
    setOptions({
      tooltip: { trigger: "item" },
      series: [
        {
          name: $t("dashboard.dealRatio"),
          type: "pie",
          radius: "80%",
          center: ["50%", "50%"],
          color: ["#5ab1ef", "#b6a2de", "#67e0e3", "#2ec7c9"],
          data: [...props.pie].sort((a, b) => a.value - b.value),
          roseType: "radius",
          animationType: "scale",
          animationEasing: "exponentialInOut",
          animationDelay: () => Math.random() * 400
        }
      ]
    });
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <el-card v-loading="loading" shadow="never" :header="$t('dashboard.dealRatio')">
    <div ref="chartRef" style="width: 100%; height: 300px" />
  </el-card>
</template>
