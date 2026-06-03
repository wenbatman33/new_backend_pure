<script setup lang="ts">
import { ref, watch, type Ref } from "vue";
import { useECharts } from "@pureadmin/utils";
import type { SaleRadarData } from "../utils/types";

const props = defineProps<{
  loading: boolean;
  data: SaleRadarData;
}>();

const chartRef = ref<HTMLDivElement | null>(null);
const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

function render() {
  if (!props.data?.series?.length) return;
  setOptions({
    legend: {
      bottom: 0,
      data: props.data.series.map(s => s.name)
    },
    tooltip: {},
    radar: {
      radius: "60%",
      splitNumber: 8,
      indicator: props.data.indicator
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
        data: props.data.series.map(s => ({
          value: s.value,
          name: s.name,
          itemStyle: { color: s.color }
        }))
      }
    ]
  });
}

watch(
  () => props.loading,
  val => {
    if (!val) render();
  },
  { immediate: true }
);
</script>

<template>
  <el-card v-loading="loading" shadow="never">
    <template #header>
      <span class="font-medium">{{ $t("dashboard.saleStatistics") }}</span>
    </template>
    <div ref="chartRef" style="width: 100%; height: 400px" />
  </el-card>
</template>
