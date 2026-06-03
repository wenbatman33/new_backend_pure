<script setup lang="ts">
import { ref, type Ref } from "vue";
import { useECharts } from "@pureadmin/utils";
import { transformI18n as $t } from "@/plugins/i18n";
import type { SpeedResult } from "./utils/types";

const props = defineProps<{ result: SpeedResult }>();

const chartRef = ref<HTMLDivElement | null>(null);
const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

// 0-1 ~ 23-24 時段
const xData: string[] = [];
for (let n = 0; n < 24; n++) xData.push(`${n}-${n + 1}`);

function render() {
  setOptions({
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "cross", crossStyle: { color: "#999" } }
    },
    legend: {
      data: [
        $t("finance_report.completionTimeOfEachTransaction"),
        $t("finance_report.piecesOf"),
        $t("finance_report.amount")
      ]
    },
    xAxis: [
      {
        type: "category",
        data: xData,
        axisPointer: { type: "line", status: "show" }
      }
    ],
    yAxis: [
      { type: "value", min: 0, max: 100, interval: 25 },
      { type: "value", min: 0, max: 100000, interval: 25000 }
    ],
    series: [
      {
        name: $t("finance_report.completionTimeOfEachTransaction"),
        type: "bar",
        data: props.result?.depositSpeed ?? [],
        color: "#FFD306",
        yAxisIndex: 1
      },
      {
        name: $t("finance_report.piecesOf"),
        type: "line",
        data: props.result?.depositCount ?? [],
        color: "#0080FF"
      },
      {
        name: $t("finance_report.amount"),
        type: "line",
        data: props.result?.depositAmount ?? [],
        color: "#F75000",
        yAxisIndex: 1
      }
    ]
  });
}

defineExpose({ render });
</script>

<template>
  <div ref="chartRef" style="width: 100%; height: 300px" />
</template>
