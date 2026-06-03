<script setup lang="ts">
import { ref, watch, type Ref } from "vue";
import { useECharts } from "@pureadmin/utils";
import { transformI18n as $t } from "@/plugins/i18n";
// 雷達圖元件未在共用 echarts plugin 註冊，於此局部按需引入，避免改動共用檔
import * as echarts from "echarts/core";
import { RadarChart } from "echarts/charts";
import { RadarComponent } from "echarts/components";
import type { AnalysisData } from "../utils/types";

echarts.use([RadarChart, RadarComponent]);

const props = defineProps<{
  loading: boolean;
  radar: AnalysisData["radar"] | null;
}>();

const chartRef = ref<HTMLDivElement | null>(null);
const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

watch(
  () => props.radar,
  () => {
    if (!props.radar) return;
    setOptions({
      legend: {
        bottom: 0,
        data: [$t("dashboard.visit"), $t("dashboard.buy")]
      },
      tooltip: {},
      radar: {
        radius: "60%",
        splitNumber: 8,
        indicator: props.radar.indicator.map(i => ({
          text: $t(i.textKey),
          max: i.max
        }))
      },
      series: [
        {
          type: "radar",
          symbolSize: 0,
          areaStyle: {
            shadowBlur: 0,
            shadowColor: "rgba(0,0,0,.2)",
            shadowOffsetX: 0,
            shadowOffsetY: 10,
            opacity: 1
          },
          data: [
            {
              value: props.radar.visit,
              name: $t("dashboard.visit"),
              itemStyle: { color: "#b6a2de" }
            },
            {
              value: props.radar.buy,
              name: $t("dashboard.buy"),
              itemStyle: { color: "#5ab1ef" }
            }
          ]
        }
      ]
    });
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <el-card v-loading="loading" shadow="never" :header="$t('dashboard.conversionRate')">
    <div ref="chartRef" style="width: 100%; height: 300px" />
  </el-card>
</template>
