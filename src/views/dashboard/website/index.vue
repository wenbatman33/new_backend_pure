<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, type Ref } from "vue";
import { useECharts } from "@pureadmin/utils";
import { transformI18n as $t } from "@/plugins/i18n";
import { useWebsite } from "./utils/hook";

import Search from "~icons/ep/search";

defineOptions({ name: "DashboardWebsite" });

const {
  loading,
  date,
  reportData,
  xAxisData,
  dateHandler,
  fetchData,
  onSearch,
  startPolling,
  stopPolling
} = useWebsite();

// 盈利
const chartRefWinAmount = ref<HTMLDivElement | null>(null);
const { setOptions: setOptionsWinAmount } = useECharts(
  chartRefWinAmount as Ref<HTMLDivElement>
);
// 註冊＆首存數
const chartRefRegisterMember = ref<HTMLDivElement | null>(null);
const { setOptions: setOptionsRegisterMember } = useECharts(
  chartRefRegisterMember as Ref<HTMLDivElement>
);
// 活躍會員數
const chartRefMember = ref<HTMLDivElement | null>(null);
const { setOptions: setOptionsMember } = useECharts(
  chartRefMember as Ref<HTMLDivElement>
);
// 存提款
const chartRefWithdrawRecharge = ref<HTMLDivElement | null>(null);
const { setOptions: setOptionsWithdrawRecharge } = useECharts(
  chartRefWithdrawRecharge as Ref<HTMLDivElement>
);

function setData() {
  const d = reportData.value;

  // 盈利：每小時 GGR(長條) + 累積 GGR(折線)
  setOptionsWinAmount({
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "cross", crossStyle: { color: "#999" } }
    },
    legend: {
      data: [$t("dashboard.dataProfit"), $t("dashboard.cumulativeProfit")]
    },
    xAxis: [{ type: "category", data: xAxisData }],
    yAxis: [{ type: "value" }],
    series: [
      {
        name: $t("dashboard.dataProfit"),
        type: "bar",
        data: d.winAmount,
        color: "#FFD306"
      },
      {
        name: $t("dashboard.cumulativeProfit"),
        type: "line",
        data: d.totalWinAmount,
        color: "#0080FF"
      }
    ]
  });

  // 註冊＆首存數
  setOptionsRegisterMember({
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "cross", crossStyle: { color: "#999" } }
    },
    legend: {
      data: [
        $t("dashboard.hourlyRegistrationCount"),
        $t("dashboard.hourlyFirstDepositCount"),
        $t("dashboard.cumulativeRegistrationCount"),
        $t("dashboard.cumulativeFirstDepositCount")
      ]
    },
    xAxis: [{ type: "category", data: xAxisData }],
    yAxis: [{ type: "value" }],
    series: [
      {
        name: $t("dashboard.hourlyRegistrationCount"),
        type: "bar",
        data: d.registerMember,
        color: "#FFD306"
      },
      {
        name: $t("dashboard.hourlyFirstDepositCount"),
        type: "bar",
        data: d.firstDepositMember,
        color: "#ba86f2"
      },
      {
        name: $t("dashboard.cumulativeRegistrationCount"),
        type: "line",
        data: d.totalRegisterMember,
        color: "#0080FF"
      },
      {
        name: $t("dashboard.cumulativeFirstDepositCount"),
        type: "line",
        data: d.totalFirstDepositMember,
        color: "#2ddf4e"
      }
    ]
  });

  // 活躍會員數
  setOptionsMember({
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "cross", crossStyle: { color: "#999" } }
    },
    legend: {
      data: [
        $t("dashboard.hourlyPlayerCount"),
        $t("dashboard.hourlyUniqueDepositCount"),
        $t("dashboard.hourlyUniqueWithdrawalCount")
      ]
    },
    xAxis: [{ type: "category", data: xAxisData }],
    yAxis: [{ type: "value" }],
    series: [
      {
        name: $t("dashboard.hourlyPlayerCount"),
        type: "line",
        data: d.gameMember,
        color: "#FFD306"
      },
      {
        name: $t("dashboard.hourlyUniqueDepositCount"),
        type: "line",
        data: d.rechargeMember,
        color: "#e56433"
      },
      {
        name: $t("dashboard.hourlyUniqueWithdrawalCount"),
        type: "line",
        data: d.withdrawMember,
        color: "#0080FF"
      }
    ]
  });

  // 存提款
  setOptionsWithdrawRecharge({
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "cross", crossStyle: { color: "#999" } }
    },
    legend: {
      data: [
        $t("dashboard.depositAmount"),
        $t("dashboard.withdrawalAmount"),
        $t("dashboard.depositCount"),
        $t("dashboard.withdrawalCount")
      ]
    },
    xAxis: [{ type: "category", data: xAxisData }],
    yAxis: [
      { type: "value", name: $t("dashboard.amount") },
      { type: "value", name: $t("dashboard.times"), splitLine: { show: false } }
    ],
    series: [
      {
        name: $t("dashboard.depositAmount"),
        type: "bar",
        data: d.rechargeAmount,
        color: "#FFD306"
      },
      {
        name: $t("dashboard.withdrawalAmount"),
        type: "bar",
        data: d.withdrawAmount,
        color: "#c692f2"
      },
      {
        name: $t("dashboard.depositCount"),
        type: "line",
        data: d.rechargeCount,
        color: "#43d969",
        yAxisIndex: 1
      },
      {
        name: $t("dashboard.withdrawalCount"),
        type: "line",
        data: d.withdrawCount,
        color: "#33b9e5",
        yAxisIndex: 1
      }
    ]
  });
}

// 資料更新即重繪圖表
watch(reportData, () => setData(), { deep: true });

onMounted(() => {
  fetchData();
  startPolling();
});

onBeforeUnmount(() => stopPolling());
</script>

<template>
  <div class="main">
    <div class="px-8 py-4 bg-bg_color">
      <div class="flex justify-center w-full gap-3 my-5">
        <el-date-picker
          :model-value="date"
          type="date"
          value-format="YYYY/MM/DD"
          format="YYYY/MM/DD"
          :clearable="false"
          :placeholder="$t('dashboard.selectDate')"
          @change="dateHandler"
        />
        <el-button type="primary" :icon="Search" :loading="loading" @click="onSearch">
          {{ $t("dashboard.search") }}
        </el-button>
      </div>

      <el-row :gutter="24">
        <el-col :span="12">
          <h2 class="chart-title">{{ $t("dashboard.profit") }}</h2>
          <div ref="chartRefWinAmount" style="width: 100%; height: 300px" />
        </el-col>
        <el-col :span="12">
          <h2 class="chart-title">
            {{ $t("dashboard.registerAndFirstDepositCount") }}
          </h2>
          <div ref="chartRefRegisterMember" style="width: 100%; height: 300px" />
        </el-col>
        <el-col :span="12">
          <h2 class="chart-title">{{ $t("dashboard.activeMemberCount") }}</h2>
          <div ref="chartRefMember" style="width: 100%; height: 300px" />
        </el-col>
        <el-col :span="12">
          <h2 class="chart-title">{{ $t("dashboard.depositWithdrawal") }}</h2>
          <div ref="chartRefWithdrawRecharge" style="width: 100%; height: 300px" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style scoped lang="scss">
.chart-title {
  margin: 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}
</style>
