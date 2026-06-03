<script setup lang="ts">
import { useAnalysis } from "./utils/hook";
import GrowCard from "./components/GrowCard.vue";
import SiteAnalysis from "./components/SiteAnalysis.vue";
import VisitRadar from "./components/VisitRadar.vue";
import VisitSource from "./components/VisitSource.vue";
import SalesProductPie from "./components/SalesProductPie.vue";

defineOptions({ name: "DashboardAnalysis" });

const { loading, data } = useAnalysis();
</script>

<template>
  <div class="main">
    <GrowCard :loading="loading" :list="data?.growCardList ?? []" />

    <SiteAnalysis
      class="my-4"
      :loading="loading"
      :trend="data?.visitTrend ?? null"
      :bar="data?.visitBar ?? null"
    />

    <div class="chart-row">
      <VisitRadar :loading="loading" :radar="data?.radar ?? null" />
      <VisitSource :loading="loading" :source="data?.visitSource ?? null" />
      <SalesProductPie :loading="loading" :pie="data?.salesPie ?? null" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.chart-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}
</style>
