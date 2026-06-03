<script setup lang="tsx">
import { ref, onMounted } from "vue";
import dayjs from "dayjs";
import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";
import {
  getAgencyDailyActive,
  type ActiveAgencyItem
} from "@/api/agency";

defineOptions({ name: "DailyReportActiveModal" });

const props = defineProps<{
  startTime: string;
  endTime: string;
  giveOffer: number | string;
}>();

const dataList = ref<ActiveAgencyItem[]>([]);
const loading = ref(true);

function fmt(val: any) {
  if (val === "" || val === null || val === undefined) return val;
  return commaDecimalFormat(val, 0);
}

// 点击代理帐号开新页前往会员报表
function handleAccount(row: ActiveAgencyItem) {
  const start = dayjs(props.startTime).format("YYYY-MM-DD");
  const end = dayjs(props.endTime).format("YYYY-MM-DD");
  window.open(
    `/agency/report/memberReport?agencyAccount=${row.agencyAccount}&startTime=${start}&endTime=${end}`
  );
}

const columns: TableColumnList = [
  { label: "ID", prop: "agencyID", width: 100, sortable: true },
  {
    label: $t("agency.dailyReportAgencyAccount"),
    prop: "agencyAccount",
    cellRenderer: ({ row }) => (
      <el-link type="primary" onClick={() => handleAccount(row)}>
        {row.agencyAccount}
      </el-link>
    )
  },
  { label: $t("agency.dailyReportActiveMember"), prop: "activeMemberCount", width: 120 },
  {
    label: $t("agency.dailyReportBetAmount"),
    prop: "betAmount",
    width: 130,
    sortable: true,
    cellRenderer: ({ row }) => <span>{fmt(row.betAmount)}</span>
  },
  {
    label: $t("agency.dailyReportTotalWin"),
    prop: "totalWinAmount",
    width: 130,
    sortable: true,
    cellRenderer: ({ row }) => <span>{fmt(row.totalWinAmount)}</span>
  },
  {
    label: $t("agency.dailyReportRechargeAmount"),
    prop: "rechargeAmount",
    width: 130,
    sortable: true,
    cellRenderer: ({ row }) => <span>{fmt(row.rechargeAmount)}</span>
  },
  {
    label: $t("agency.dailyReportRechargeFee"),
    prop: "rechargeFee",
    width: 110,
    cellRenderer: ({ row }) => <span>{fmt(row.rechargeFee)}</span>
  },
  {
    label: $t("agency.dailyReportWithdrawAmount"),
    prop: "withdrawAmount",
    width: 130,
    sortable: true,
    cellRenderer: ({ row }) => <span>{fmt(row.withdrawAmount)}</span>
  },
  {
    label: $t("agency.dailyReportPayoutFee"),
    prop: "payoutFee",
    width: 110,
    cellRenderer: ({ row }) => <span>{fmt(row.payoutFee)}</span>
  },
  {
    label: $t("agency.dailyReportDepositWithdrawDiff"),
    prop: "depositWithdrawDiff",
    width: 130,
    cellRenderer: ({ row }) => <span>{fmt(row.depositWithdrawDiff)}</span>
  },
  {
    label: $t("agency.dailyReportTotalBonus"),
    prop: "totalBonus",
    width: 110,
    cellRenderer: ({ row }) => <span>{fmt(row.totalBonus)}</span>
  },
  { label: $t("agency.dailyReportTransferMember"), prop: "transferMember", width: 110 },
  {
    label: $t("agency.dailyReportPlatformCharge"),
    prop: "platformCharge",
    width: 110,
    cellRenderer: ({ row }) => <span>{fmt(row.platformCharge)}</span>
  },
  {
    label: $t("agency.dailyReportNetProfit"),
    prop: "netProfit",
    width: 110,
    cellRenderer: ({ row }) => <span>{fmt(row.netProfit)}</span>
  }
];

async function loadData() {
  loading.value = true;
  try {
    const { data } = await getAgencyDailyActive({
      startTime: dayjs(props.startTime).format("YYYY-MM-DD"),
      endTime: dayjs(props.endTime).format("YYYY-MM-DD"),
      giveOffer: props.giveOffer
    });
    dataList.value = (data?.list ?? []) as ActiveAgencyItem[];
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadData();
});
</script>

<template>
  <pure-table
    align-whole="center"
    show-overflow-tooltip
    border
    table-layout="auto"
    :loading="loading"
    :data="dataList"
    :columns="columns"
    :header-cell-style="{
      background: 'var(--el-fill-color-light)',
      color: 'var(--el-text-color-primary)'
    }"
  />
</template>
