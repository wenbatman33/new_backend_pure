<script setup lang="ts">
import { ref, watch, type Ref } from "vue";
import { useECharts } from "@pureadmin/utils";
import { transformI18n as $t } from "@/plugins/i18n";
import type { AnalysisData } from "../utils/types";

const props = defineProps<{
  trend: AnalysisData["visitTrend"] | null;
}>();

const chartRef = ref<HTMLDivElement | null>(null);
const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

watch(
  () => props.trend,
  () => {
    if (!props.trend) return;
    setOptions({
      tooltip: {
        trigger: "axis",
        axisPointer: { lineStyle: { width: 1, color: "#019680" } }
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: props.trend.xAxis,
        axisTick: { show: false }
      },
      yAxis: [{ type: "value", splitNumber: 4, axisTick: { show: false } }],
      grid: { left: "1%", right: "1%", top: "2%", bottom: 0, containLabel: true },
      legend: {
        data: [$t("dashboard.visitNumber"), $t("dashboard.dealCount")]
      },
      series: [
        {
          name: $t("dashboard.visitNumber"),
          smooth: true,
          data: props.trend.series1,
          type: "line",
          areaStyle: {},
          itemStyle: { color: "#5ab1ef" }
        },
        {
          name: $t("dashboard.dealCount"),
          smooth: true,
          data: props.trend.series2,
          type: "line",
          areaStyle: {},
          itemStyle: { color: "#019680" }
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
