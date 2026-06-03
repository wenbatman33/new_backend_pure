import { h, ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";
import ActiveModal from "../form.vue";
import {
  getAgencyDailyReport,
  getAgencyDailyTotal,
  type DailyReportListResult,
  type DailyTotalResult
} from "@/api/agency";
import type { DailyReportItem, DailyReportSearch } from "./types";

// 数字千分位（合计列已是字串，原样输出）
function fmt(val: any) {
  if (val === "" || val === null || val === undefined) return val;
  if (typeof val === "string" && /[^\d.-]/.test(val)) return val;
  return commaDecimalFormat(val, 0);
}

// 正负颜色渲染（正绿负红）
function colorNum(val: any) {
  const num = Number(String(val).replace(/,/g, ""));
  const color = num >= 0 ? "#00BB00" : "#F00";
  return <span style={{ color }}>{fmt(val)}</span>;
}

function redNum(val: any) {
  return <span style={{ color: "#F00" }}>{fmt(val)}</span>;
}

export function useDailyReport() {
  const searchForm = reactive<DailyReportSearch>({
    reportDateStart: dayjs().startOf("month").format("YYYY-MM-DD"),
    reportDateEnd: dayjs().endOf("day").format("YYYY-MM-DD"),
    giveOffer: 0
  });

  const dataList = ref<DailyReportItem[]>([]);
  const summaryData = ref<Record<string, any>>({});
  const loading = ref(true);

  // 是否发放优惠 下拉
  const giveOfferOptions = [
    { label: $t("agency.giveOfferAll"), value: 0 },
    { label: $t("agency.giveOfferYes"), value: 1 },
    { label: $t("agency.giveOfferNo"), value: 2 }
  ];

  // 报表不分页
  const pagination = reactive({
    total: 0,
    pageSize: 9999,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    {
      label: $t("agency.dailyReportDate"),
      prop: "date",
      width: 120,
      fixed: "left",
      cellRenderer: ({ row }) =>
        row.isSummary ? (
          <span>{row.date}</span>
        ) : (
          <span>{dayjs(row.date).format("YYYY-MM-DD")}</span>
        )
    },
    {
      label: $t("agency.dailyReportActiveAgency"),
      prop: "activeAgencyCount",
      width: 110,
      cellRenderer: ({ row }) =>
        row.isSummary ? (
          <span>{row.activeAgencyCount}</span>
        ) : (
          <el-link type="primary" onClick={() => openActive(row)}>
            {row.activeAgencyCount}
          </el-link>
        )
    },
    { label: $t("agency.dailyReportActiveMember"), prop: "activeMemberCount", width: 110 },
    {
      label: $t("agency.dailyReportBetAmount"),
      prop: "betAmount",
      width: 130,
      cellRenderer: ({ row }) => <span>{fmt(row.betAmount)}</span>
    },
    { label: $t("agency.dailyReportRegMember"), prop: "regMemberCount", width: 110 },
    {
      label: $t("agency.dailyReportRegAlsoDeposit"),
      prop: "regAlsoDepositMemberCount",
      width: 130
    },
    { label: $t("agency.dailyReportFirstDeposit"), prop: "firstDepositCount", width: 110 },
    {
      label: $t("agency.dailyReportTotalWin"),
      prop: "totalWinAmount",
      width: 130,
      cellRenderer: ({ row }) => colorNum(row.totalWinAmount)
    },
    { label: $t("agency.dailyReportRechargeMember"), prop: "rechargeMemberCount", width: 110 },
    {
      label: $t("agency.dailyReportRechargeAmount"),
      prop: "rechargeAmount",
      width: 130,
      cellRenderer: ({ row }) => <span>{fmt(row.rechargeAmount)}</span>
    },
    {
      label: $t("agency.dailyReportRechargeFee"),
      prop: "rechargeFee",
      width: 110,
      cellRenderer: ({ row }) => redNum(row.rechargeFee)
    },
    { label: $t("agency.dailyReportWithdrawMember"), prop: "withdrawMemberCount", width: 110 },
    {
      label: $t("agency.dailyReportWithdrawAmount"),
      prop: "withdrawAmount",
      width: 130,
      cellRenderer: ({ row }) => <span>{fmt(row.withdrawAmount)}</span>
    },
    {
      label: $t("agency.dailyReportPayoutFee"),
      prop: "payoutFee",
      width: 110,
      cellRenderer: ({ row }) => redNum(row.payoutFee)
    },
    { label: $t("agency.dailyReportTransferMemberCount"), prop: "transferMemberCount", width: 110 },
    { label: $t("agency.dailyReportTransferMember"), prop: "transferMember", width: 110 },
    {
      label: $t("agency.dailyReportPromotionAmount"),
      prop: "promotionAmount",
      width: 110,
      cellRenderer: ({ row }) => <span>{fmt(row.promotionAmount)}</span>
    },
    {
      label: $t("agency.dailyReportVipGift"),
      prop: "vipGift",
      width: 110,
      cellRenderer: ({ row }) => <span>{fmt(row.vipGift)}</span>
    },
    {
      label: $t("agency.dailyReportReturnAmount"),
      prop: "returnAmount",
      width: 110,
      cellRenderer: ({ row }) => <span>{fmt(row.returnAmount)}</span>
    },
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
    },
    {
      label: $t("agency.dailyReportAgencyWallet"),
      prop: "agencyWallet",
      width: 110,
      cellRenderer: ({ row }) => <span>{fmt(row.agencyWallet)}</span>
    }
  ];

  function buildParams() {
    return {
      startTime: searchForm.reportDateStart,
      endTime: searchForm.reportDateEnd,
      giveOffer: searchForm.giveOffer
    };
  }

  async function onSearch() {
    loading.value = true;
    try {
      const params = buildParams();
      const { data } = await getAgencyDailyReport(params);
      const list = (data?.list ?? []) as DailyReportItem[];

      // 取得合计 brief
      const { data: total } = await getAgencyDailyTotal(params);
      summaryData.value = total ?? {};

      // 把合计列追加在表格底部
      const summaryRow: any = {
        isSummary: true,
        date: $t("agency.dailyReportSummary"),
        ...summaryData.value
      };
      dataList.value = [...list, summaryRow];
      pagination.total = dataList.value.length;
    } finally {
      loading.value = false;
    }
  }

  function resetForm() {
    searchForm.reportDateStart = dayjs().startOf("month").format("YYYY-MM-DD");
    searchForm.reportDateEnd = dayjs().endOf("day").format("YYYY-MM-DD");
    searchForm.giveOffer = 0;
    onSearch();
  }

  // 开启活跃代理明细弹窗
  // record === "all" 代表用搜寻条件的日期区间，否则用该列的单日 date
  function openActive(record: "all" | DailyReportItem) {
    let startTime: string;
    let endTime: string;
    if (record === "all") {
      startTime = searchForm.reportDateStart;
      endTime = searchForm.reportDateEnd;
    } else {
      startTime = record.date;
      endTime = record.date;
    }
    addDialog({
      title: `${dayjs(startTime).format("YYYY-MM-DD")} - ${dayjs(endTime).format("YYYY-MM-DD")}`,
      width: "90%",
      fullscreen: true,
      hideFooter: true,
      props: {
        startTime,
        endTime,
        giveOffer: searchForm.giveOffer
      },
      contentRenderer: () =>
        h(ActiveModal, {
          startTime,
          endTime,
          giveOffer: searchForm.giveOffer
        })
    });
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    giveOfferOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    openActive
  };
}
