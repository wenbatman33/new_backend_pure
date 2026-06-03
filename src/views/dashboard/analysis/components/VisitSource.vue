<script setup lang="ts">
import { ref, watch, type Ref } from "vue";
import { useECharts } from "@pureadmin/utils";
import { transformI18n as $t } from "@/plugins/i18n";
import type { NameValueItem } from "../utils/types";

const props = defineProps<{
  loading: boolean;
  source: NameValueItem[] | null;
}>();

const chartRef = ref<HTMLDivElement | null>(null);
const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

watch(
  () => props.source,
  () => {
    if (!props.source) return;
    setOptions({
      tooltip: { trigger: "item" },
      legend: { bottom: "1%", left: "center" },
      series: [
        {
          color: ["#5ab1ef", "#b6a2de", "#67e0e3", "#2ec7c9"],
          name: $t("dashboard.visitSource"),
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 10, borderColor: "#fff", borderWidth: 2 },
          label: { show: false, position: "center" },
          emphasis: {
            label: { show: true, fontSize: 12, fontWeight: "bold" }
          },
          labelLine: { show: false },
          data: props.source,
          animationType: "scale",
          animationEasing: "exponentialInOut",
          animationDelay: () => Math.random() * 100
        }
      ]
    });
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <el-card v-loading="loading" shadow="never" :header="$t('dashboard.visitSource')">
    <div ref="chartRef" style="width: 100%; height: 300px" />
  </el-card>
</template>
