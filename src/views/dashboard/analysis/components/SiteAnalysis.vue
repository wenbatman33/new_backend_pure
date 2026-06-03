<script setup lang="ts">
import { ref } from "vue";
import { transformI18n as $t } from "@/plugins/i18n";
import VisitAnalysis from "./VisitAnalysis.vue";
import VisitAnalysisBar from "./VisitAnalysisBar.vue";
import type { AnalysisData } from "../utils/types";

defineProps<{
  loading: boolean;
  trend: AnalysisData["visitTrend"] | null;
  bar: AnalysisData["visitBar"] | null;
}>();

const activeName = ref("trend");
</script>

<template>
  <el-card v-loading="loading" shadow="never">
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('dashboard.trafficTrend')" name="trend">
        <VisitAnalysis :trend="trend" />
      </el-tab-pane>
      <el-tab-pane :label="$t('dashboard.visitVolume')" name="volume">
        <VisitAnalysisBar :bar="bar" />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>
