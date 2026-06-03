<script setup lang="ts">
import { ref, onMounted, h } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";
import { formatAmount, formatAmountWithRed } from "@/utils/number";
import { exportExcel } from "@/utils/report";
import {
  getCustomLeagueDetail,
  type DetailRow,
  type DetailTotal
} from "@/api/report";
import Download from "~icons/ep/download";

defineOptions({ name: "CustomLeagueDetail" });

const props = defineProps<{
  leagueName: string;
  leagueID: number;
  date: string;
}>();

const EXPORT_DETAIL_URL = "/backend/league/custom/log/list/detail/export";

const loading = ref(false);
const dataList = ref<DetailRow[]>([]);
const summary = ref<DetailTotal>({
  totalBetCount: 0,
  totalBetAmount: 0,
  totalWinAmount: 0
});
const lastParams = ref<Record<string, any>>({});

const columns: TableColumnList = [
  { label: $t("report.memberAccount"), prop: "memberAccount", width: 200 },
  { label: $t("report.betCount"), prop: "betCount", width: 150 },
  {
    label: $t("report.betAmount"),
    prop: "betAmount",
    width: 200,
    cellRenderer: ({ row }) => h("span", formatAmount(row.betAmount))
  },
  {
    label: $t("report.winAmount"),
    prop: "winAmount",
    width: 200,
    cellRenderer: ({ row }) => h("span", formatAmountWithRed(row.winAmount))
  }
];

function getSummaries(param: { columns: any[] }) {
  const { columns: cols } = param;
  const sums: any[] = [];
  cols.forEach((column, index) => {
    if (index === 0) {
      sums[index] = $t("report.total");
    } else if (column.property === "betCount") {
      sums[index] = summary.value.totalBetCount;
    } else if (column.property === "betAmount") {
      sums[index] = formatAmount(summary.value.totalBetAmount);
    } else if (column.property === "winAmount") {
      sums[index] = formatAmountWithRed(summary.value.totalWinAmount);
    } else {
      sums[index] = "";
    }
  });
  return sums;
}

async function onSearch() {
  loading.value = true;
  try {
    const params = {
      startTime: `${props.date} 00:00:00`,
      endTime: `${props.date} 23:59:59`,
      leagueID: props.leagueID
    };
    lastParams.value = { ...params };
    const { data } = await getCustomLeagueDetail(params);
    dataList.value = data?.list ?? [];
    const total = data?.total ?? {};
    summary.value = {
      totalBetCount: total.totalBetCount ?? 0,
      totalBetAmount: total.totalBetAmount ?? 0,
      totalWinAmount: total.totalWinAmount ?? 0
    };
  } finally {
    loading.value = false;
  }
}

function handleExport() {
  exportExcel(
    EXPORT_DETAIL_URL,
    lastParams.value,
    `${props.leagueName}${props.date}.zip`
  );
}

onMounted(() => {
  onSearch();
});
</script>

<template>
  <PureTableBar :title="`${props.leagueName}: ${props.date}`" :columns="columns">
    <template #buttons>
      <el-button
        v-if="hasAuth('__btn_report_custom_league')"
        type="primary"
        :icon="Download"
        @click="handleExport"
      >
        {{ $t("report.exportExcel") }}
      </el-button>
    </template>
    <template v-slot="{ size, dynamicColumns }">
      <pure-table
        align-whole="center"
        showOverflowTooltip
        table-layout="auto"
        border
        :loading="loading"
        :size="size"
        :data="dataList"
        :columns="dynamicColumns"
        :show-summary="true"
        :summary-method="getSummaries"
        :header-cell-style="{
          background: 'var(--el-fill-color-light)',
          color: 'var(--el-text-color-primary)'
        }"
      />
    </template>
  </PureTableBar>
</template>
