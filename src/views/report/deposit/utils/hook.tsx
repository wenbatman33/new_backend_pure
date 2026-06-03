import { reactive, ref, computed, onMounted } from "vue";
import dayjs from "dayjs";
import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";
import { exportExcel } from "@/utils/report";
import {
  getDepositPeopleReport,
  getDepositPeopleWeekReport,
  getDepositPeopleMonthReport,
  getDepositAmountRangeReport,
  getDepositAmountRangeWeekReport,
  getDepositAmountRangeMonthReport,
  getServiceDropdown
} from "@/api/report";
import type {
  DepositSearchForm,
  DepositPeopleReportItem,
  GetDepositPeopleReportResultModel,
  DepositAmountRangeReportItem,
  GetDepositAmountRangeReportResultModel
} from "./types";

// 安全格式化（沿用舊碼 try/catch 行為）
function fmt(value: any, decimal = 0) {
  try {
    return commaDecimalFormat(value, decimal);
  } catch (e) {
    return value;
  }
}

export function useDepositReport() {
  const searchForm = reactive<DepositSearchForm>({
    dateType: 1,
    reportDateStart: dayjs().startOf("month").format("YYYY-MM-DD"),
    reportDateEnd: dayjs().endOf("month").format("YYYY-MM-DD"),
    serviceCode: "",
    reportType: 1
  });

  const loading = ref(false);
  const dataList = ref<any[]>([]);
  const updatedAt = ref("");
  // 目前畫面實際呈現的報表類型（送出後才更新）
  const showReportType = ref(1);
  const showDateType = ref(1);
  const peopleReportData = ref<GetDepositPeopleReportResultModel>();
  const amountRangeReportData = ref<GetDepositAmountRangeReportResultModel>();

  // 支付方式下拉
  const serviceOptions = ref<{ label: string; value: string }[]>([
    { label: $t("report.all"), value: "" }
  ]);

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
    { label: $t("report.uniqueDepositPeopleCount"), prop: "uniquePeople" },
    { label: $t("report.firstDepositPeople"), prop: "firstPeople" },
    { label: $t("report.depositCount"), prop: "depositNum" },
    {
      label: $t("report.depositAmount"),
      prop: "amount",
      align: "right",
      cellRenderer: ({ row }) => <span>{fmt(row.amount, 2)}</span>
    },
    {
      label: $t("report.memberDepositAmount"),
      prop: "memberAmount",
      align: "right",
      cellRenderer: ({ row }) => <span>{fmt(row.memberAmount, 2)}</span>
    },
    {
      label: $t("report.agencyDepositAmount"),
      prop: "agencyAmount",
      align: "right",
      cellRenderer: ({ row }) => <span>{fmt(row.agencyAmount, 2)}</span>
    },
    {
      label: $t("report.depositAmountPerCapita"),
      prop: "avgAmount",
      align: "right",
      cellRenderer: ({ row }) => <span>{fmt(row.avgAmount, 2)}</span>
    },
    {
      label: $t("report.handlingFee"),
      prop: "fee",
      align: "right",
      cellRenderer: ({ row }) => <span>{fmt(row.fee, 2)}</span>
    },
    {
      label: $t("report.amountActuallyReceived"),
      prop: "actualAmount",
      align: "right",
      cellRenderer: ({ row }) => <span>{fmt(row.actualAmount, 2)}</span>
    },
    {
      label: $t("report.depositRatio"),
      prop: "depositRate",
      cellRenderer: ({ row }) => (
        <span>{row.depositRate === "-" ? "-" : fmt(row.depositRate, 2)}</span>
      )
    }
  ];

  // 計算金額區間單列加總
  function rowSum(row: DepositAmountRangeReportItem) {
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
        fmt(d?.totalDepositNum),
        fmt(d?.totalAmount, 2),
        fmt(d?.totalMemberAmount, 2),
        fmt(d?.totalAgencyAmount, 2),
        "-",
        fmt(d?.totalFee, 2),
        fmt(d?.totalActualAmount, 2),
        "-"
      ];
    } else {
      const d = amountRangeData();
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

  function amountRangeData() {
    return amountRangeReportData.value;
  }

  // 組查詢參數
  function buildQuery() {
    const query: Record<string, any> = {
      reportDateStart: searchForm.reportDateStart,
      reportDateEnd: searchForm.reportDateEnd
    };
    if (searchForm.serviceCode) {
      query.serviceCode = searchForm.serviceCode;
    }
    return query;
  }

  async function onSearch() {
    loading.value = true;
    const query = buildQuery();
    try {
      if (searchForm.reportType === 1) {
        // 人數報表
        let res: GetDepositPeopleReportResultModel | undefined;
        if (searchForm.dateType === 1) {
          ({ data: res } = await getDepositPeopleReport(query));
        } else if (searchForm.dateType === 2) {
          ({ data: res } = await getDepositPeopleWeekReport(query));
        } else {
          ({ data: res } = await getDepositPeopleMonthReport(query));
        }
        peopleReportData.value = res;
        dataList.value = res?.list ?? [];
        updatedAt.value = formatUpdatedAt(res?.updatedAt);
      } else {
        // 金額區間報表
        let res: GetDepositAmountRangeReportResultModel | undefined;
        if (searchForm.dateType === 1) {
          ({ data: res } = await getDepositAmountRangeReport(query));
        } else if (searchForm.dateType === 2) {
          ({ data: res } = await getDepositAmountRangeWeekReport(query));
        } else {
          ({ data: res } = await getDepositAmountRangeMonthReport(query));
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
    searchForm.serviceCode = "";
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
        url = "/backend/report/deposit/people_report/export";
      } else if (showDateType.value === 2) {
        url = "/backend/report/deposit/people_week_report/export";
      } else {
        url = "/backend/report/deposit/people_month_report/export";
      }
    } else {
      if (showDateType.value === 1) {
        url = "/backend/report/deposit/amount_range_report/export";
      } else if (showDateType.value === 2) {
        url = "/backend/report/deposit/amount_range_week_report/export";
      } else {
        url = "/backend/report/deposit/amount_range_month_report/export";
      }
    }
    if (url) exportExcel(url, buildQuery());
  }

  // 取得支付方式下拉
  async function loadServiceDropdown() {
    try {
      const { data } = await getServiceDropdown();
      const list = (data?.serviceCode ?? []).map(item => {
        const key = Object.keys(item)[0];
        const value = (item as any)[key];
        return { label: `${value}`, value: `${key}` };
      });
      serviceOptions.value = [
        { label: $t("report.all"), value: "" },
        ...list
      ];
    } catch (e) {
      serviceOptions.value = [{ label: $t("report.all"), value: "" }];
    }
  }

  onMounted(() => {
    loadServiceDropdown();
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
    serviceOptions,
    showReportType,
    getSummaries,
    onSearch,
    resetForm,
    handleExport
  };
}
