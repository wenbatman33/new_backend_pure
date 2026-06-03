import { reactive, ref, computed, onMounted } from "vue";
import dayjs from "dayjs";
import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";
import { exportExcel } from "@/utils/report";
import {
  getWithdrawPeopleReport,
  getWithdrawPeopleWeekReport,
  getWithdrawPeopleMonthReport,
  getWithdrawAmountRangeReport,
  getWithdrawAmountRangeWeekReport,
  getWithdrawAmountRangeMonthReport
} from "@/api/report";
import type {
  WithdrawSearchForm,
  GetWithdrawPeopleReportResultModel,
  WithdrawAmountRangeReportItem,
  GetWithdrawAmountRangeReportResultModel
} from "./types";

// 安全格式化（沿用舊碼 try/catch 行為）
function fmt(value: any, decimal = 0) {
  try {
    return commaDecimalFormat(value, decimal);
  } catch (e) {
    return value;
  }
}

export function useWithdrawReport() {
  const searchForm = reactive<WithdrawSearchForm>({
    dateType: 1,
    reportDateStart: dayjs().startOf("month").format("YYYY-MM-DD"),
    reportDateEnd: dayjs().endOf("month").format("YYYY-MM-DD"),
    reportType: 1
  });

  const loading = ref(false);
  const dataList = ref<any[]>([]);
  const updatedAt = ref("");
  // 目前畫面實際呈現的報表類型（送出後才更新）
  const showReportType = ref(1);
  const showDateType = ref(1);
  const peopleReportData = ref<GetWithdrawPeopleReportResultModel>();
  const amountRangeReportData = ref<GetWithdrawAmountRangeReportResultModel>();

  // 日期類型選項
  const dateTypeOptions = [
    { label: $t("report.dailyReport"), value: 1 },
    { label: $t("report.weeklyReport"), value: 2 },
    { label: $t("report.monthlyReport"), value: 3 }
  ];

  // 報表項目選項
  const reportTypeOptions = [
    { label: $t("report.numberOfPeople"), value: 1 },
    { label: $t("report.amountRange"), value: 2 }
  ];

  // 標題（最後更新時間）
  const title = computed(
    () => `${$t("report.lastUpdate")}：${updatedAt.value}`
  );

  // 人數報表欄位
  const peopleColumns: TableColumnList = [
    { label: $t("report.date"), prop: "reportDate", fixed: "left", width: 160 },
    { label: $t("report.uniqueWithdrawalPeopleCount"), prop: "uniquePeople" },
    { label: $t("report.numberOfFirstMentioners"), prop: "firstPeople" },
    { label: $t("report.withdrawalCount"), prop: "withdrawNum" },
    {
      label: $t("report.withdrawalAmount"),
      prop: "amount",
      align: "right",
      cellRenderer: ({ row }) => (
        <span>{row.amount === "-" ? "-" : fmt(row.amount, 2)}</span>
      )
    },
    {
      label: $t("report.withdrawalAmountPerCapita"),
      prop: "avgAmount",
      align: "right",
      cellRenderer: ({ row }) => (
        <span>{row.avgAmount === "-" ? "-" : fmt(row.avgAmount, 2)}</span>
      )
    },
    {
      label: $t("report.handlingFee"),
      prop: "fee",
      align: "right",
      cellRenderer: ({ row }) => (
        <span>{row.fee === "-" ? "-" : fmt(row.fee, 2)}</span>
      )
    },
    {
      label: $t("report.amountActuallyPaid"),
      prop: "actualAmount",
      align: "right",
      cellRenderer: ({ row }) => (
        <span>{row.actualAmount === "-" ? "-" : fmt(row.actualAmount, 2)}</span>
      )
    },
    {
      label: $t("report.withdrawalRatio"),
      prop: "withdrawRate",
      cellRenderer: ({ row }) => (
        <span>{row.withdrawRate === "-" ? "-" : fmt(row.withdrawRate, 2)}</span>
      )
    }
  ];

  // 計算金額區間單列加總
  function rowSum(row: WithdrawAmountRangeReportItem) {
    try {
      const sum =
        (row.amount100 || 0) +
        (row.amount500 || 0) +
        (row.amount1000 || 0) +
        (row.amount2000 || 0) +
        (row.amount6000 || 0) +
        (row.amount10000 || 0) +
        (row.amount20000 || 0) +
        (row.amountMore20000 || 0);
      return commaDecimalFormat(sum);
    } catch (e) {
      return "0";
    }
  }

  // 金額區間報表欄位
  const amountRangeColumns: TableColumnList = [
    { label: $t("report.date"), prop: "reportDate", fixed: "left", width: 160 },
    {
      label: "0~100",
      prop: "amount100",
      cellRenderer: ({ row }) => <span>{fmt(row.amount100)}</span>
    },
    {
      label: "101~500",
      prop: "amount500",
      cellRenderer: ({ row }) => <span>{fmt(row.amount500)}</span>
    },
    {
      label: "501~1,000",
      prop: "amount1000",
      cellRenderer: ({ row }) => <span>{fmt(row.amount1000)}</span>
    },
    {
      label: "1,001~2,000",
      prop: "amount2000",
      cellRenderer: ({ row }) => <span>{fmt(row.amount2000)}</span>
    },
    {
      label: "2,001~6,000",
      prop: "amount6000",
      cellRenderer: ({ row }) => <span>{fmt(row.amount6000)}</span>
    },
    {
      label: "6,001~10,000",
      prop: "amount10000",
      cellRenderer: ({ row }) => <span>{fmt(row.amount10000)}</span>
    },
    {
      label: "10,001~20,000",
      prop: "amount20000",
      cellRenderer: ({ row }) => <span>{fmt(row.amount20000)}</span>
    },
    {
      label: $t("report.moreThan20000"),
      prop: "amountMore20000",
      cellRenderer: ({ row }) => <span>{fmt(row.amountMore20000)}</span>
    },
    {
      label: $t("report.subtotal"),
      prop: "sum",
      cellRenderer: ({ row }) => <span>{rowSum(row)}</span>
    }
  ];

  // 目前顯示用欄位
  const columns = computed<TableColumnList>(() =>
    showReportType.value === 1 ? peopleColumns : amountRangeColumns
  );

  // pure-table summary 方法（顯示合計列）
  function getSummaries() {
    if (showReportType.value === 1) {
      const d = peopleReportData.value;
      // 對應 peopleColumns 欄位順序
      return [
        $t("report.total"),
        "-",
        "-",
        fmt(d?.totalWithdrawNum),
        fmt(d?.totalAmount, 2),
        "-",
        fmt(d?.totalFee, 2),
        fmt(d?.totalActualAmount, 2),
        "-"
      ];
    } else {
      const d = amountRangeReportData.value;
      const total =
        (d?.totalAmount100 || 0) +
        (d?.totalAmount500 || 0) +
        (d?.totalAmount1000 || 0) +
        (d?.totalAmount2000 || 0) +
        (d?.totalAmount6000 || 0) +
        (d?.totalAmount10000 || 0) +
        (d?.totalAmount20000 || 0) +
        (d?.totalAmountMore20000 || 0);
      return [
        $t("report.total"),
        fmt(d?.totalAmount100),
        fmt(d?.totalAmount500),
        fmt(d?.totalAmount1000),
        fmt(d?.totalAmount2000),
        fmt(d?.totalAmount6000),
        fmt(d?.totalAmount10000),
        fmt(d?.totalAmount20000),
        fmt(d?.totalAmountMore20000),
        fmt(total)
      ];
    }
  }

  // 組查詢參數
  function buildQuery() {
    return {
      reportDateStart: searchForm.reportDateStart,
      reportDateEnd: searchForm.reportDateEnd
    };
  }

  async function onSearch() {
    loading.value = true;
    const query = buildQuery();
    try {
      if (searchForm.reportType === 1) {
        // 人數報表
        let res: GetWithdrawPeopleReportResultModel | undefined;
        if (searchForm.dateType === 1) {
          ({ data: res } = await getWithdrawPeopleReport(query));
        } else if (searchForm.dateType === 2) {
          ({ data: res } = await getWithdrawPeopleWeekReport(query));
        } else {
          ({ data: res } = await getWithdrawPeopleMonthReport(query));
        }
        peopleReportData.value = res;
        dataList.value = res?.list ?? [];
        updatedAt.value = formatUpdatedAt(res?.updatedAt);
      } else {
        // 金額區間報表
        let res: GetWithdrawAmountRangeReportResultModel | undefined;
        if (searchForm.dateType === 1) {
          ({ data: res } = await getWithdrawAmountRangeReport(query));
        } else if (searchForm.dateType === 2) {
          ({ data: res } = await getWithdrawAmountRangeWeekReport(query));
        } else {
          ({ data: res } = await getWithdrawAmountRangeMonthReport(query));
        }
        amountRangeReportData.value = res;
        dataList.value = res?.list ?? [];
        updatedAt.value = formatUpdatedAt(res?.updatedAt);
      }
      // 送出後才切換顯示用的欄位與類型
      showReportType.value = searchForm.reportType;
      showDateType.value = searchForm.dateType;
    } finally {
      loading.value = false;
    }
  }

  function formatUpdatedAt(str?: string) {
    if (!str) return "";
    const d = dayjs(str);
    return d.isValid() ? d.format("YYYY/MM/DD HH:mm:ss") : str;
  }

  function resetForm() {
    searchForm.dateType = 1;
    searchForm.reportType = 1;
    searchForm.reportDateStart = dayjs().startOf("month").format("YYYY-MM-DD");
    searchForm.reportDateEnd = dayjs().endOf("month").format("YYYY-MM-DD");
    onSearch();
  }

  // 匯出 Excel（依目前顯示的報表類型與日期類型決定 endpoint）
  function handleExport() {
    let url = "";
    if (showReportType.value === 1) {
      if (showDateType.value === 1) {
        url = "/backend/report/withdraw/people_report/export";
      } else if (showDateType.value === 2) {
        url = "/backend/report/withdraw/people_week_report/export";
      } else {
        url = "/backend/report/withdraw/people_month_report/export";
      }
    } else {
      if (showDateType.value === 1) {
        url = "/backend/report/withdraw/amount_range_report/export";
      } else if (showDateType.value === 2) {
        url = "/backend/report/withdraw/amount_range_week_report/export";
      } else {
        url = "/backend/report/withdraw/amount_range_month_report/export";
      }
    }
    if (url) exportExcel(url, buildQuery());
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    loading,
    dataList,
    columns,
    title,
    dateTypeOptions,
    reportTypeOptions,
    showReportType,
    getSummaries,
    onSearch,
    resetForm,
    handleExport
  };
}
