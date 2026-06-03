<script setup lang="ts">
import { ref, watch, type Ref } from "vue";
import { useECharts } from "@pureadmin/utils";
import type { AnalysisData } from "../utils/types";

const props = defineProps<{
  bar: AnalysisData["visitBar"] | null;
}>();

const chartRef = ref<HTMLDivElement | null>(null);
const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

watch(
  () => props.bar,
  () => {
    if (!props.bar) return;
    setOptions({
      tooltip: {
        trigger: "axis",
        axisPointer: { lineStyle: { width: 1, color: "#019680" } }
      },
      grid: { left: "1%", right: "1%", top: "2%", bottom: 0, containLabel: true },
      xAxis: { type: "category", data: props.bar.xAxis },
      yAxis: { type: "value", splitNumber: 4 },
      series: [
        {
          data: props.bar.data,
          type: "bar",
          barMaxWidth: 80
        }
      ]
    });
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <div ref="chartRef" style="width: 100%; height: 300px" />
</template>
