<script setup lang="ts">
import { ref, type Ref } from "vue";
import { useECharts } from "@pureadmin/utils";
import { transformI18n as $t } from "@/plugins/i18n";
import type { SpeedResult } from "./utils/types";

const props = defineProps<{ result: SpeedResult }>();

const chartRef = ref<HTMLDivElement | null>(null);
const chartRef2 = ref<HTMLDivElement | null>(null);
const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);
const { setOptions: setOptions2 } = useECharts(chartRef2 as Ref<HTMLDivElement>);

const xData: string[] = [];
for (let n = 0; n < 24; n++) xData.push(`${n}-${n + 1}`);

function render() {
  // 圖一：完成速度 / 筆數 / 金額
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
        data: props.result?.withdrawalSpeed ?? [],
        color: "#FFD306",
        yAxisIndex: 1
      },
      {
        name: $t("finance_report.piecesOf"),
        type: "line",
        data: props.result?.withdrawalCount ?? [],
        color: "#0080FF"
      },
      {
        name: $t("finance_report.amount"),
        type: "line",
        data: props.result?.withdrawalAmount ?? [],
        color: "#F75000",
        yAxisIndex: 1
      }
    ]
  });

  // 圖二：出款 / 風控 / 財務審核時間（堆疊）
  setOptions2({
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "cross", crossStyle: { color: "#999" } }
    },
    legend: {
      data: [
        $t("finance_report.withdrawalTime"),
        $t("finance_report.riskControlReviewTime"),
        $t("finance_report.financialReviewTime")
      ]
    },
    xAxis: [
      {
        type: "category",
        data: xData,
        axisPointer: { type: "line", status: "show" }
      }
    ],
    yAxis: [{ type: "value", min: 0, max: 300, interval: 100 }],
    series: [
      {
        name: $t("finance_report.withdrawalTime"),
        type: "bar",
        data: props.result?.payoutSpeed ?? [],
        color: "#FFD306",
        stack: "Ad"
      },
      {
        name: $t("finance_report.riskControlReviewTime"),
        type: "bar",
        data: props.result?.withdrawalRiskCheckSpeed ?? [],
        color: "#0080FF",
        stack: "Ad"
      },
      {
        name: $t("finance_report.financialReviewTime"),
        type: "bar",
        data: props.result?.withdrawalFinancialCheckSpeed ?? [],
        color: "#F75000",
        stack: "Ad"
      }
    ]
  });
}

defineExpose({ render });
</script>

<template>
  <div>
    <div ref="chartRef" style="width: 100%; height: 300px" />
    <div ref="chartRef2" style="width: 100%; height: 300px" />
  </div>
</template>
