import { ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";
import { exportExcel } from "@/utils/report";
import {
  getPayChannelReport,
  getSearchCheckbox,
  getPayGroups
} from "@/api/finance_report";
import type { PayChannelReportItem, SearchFormProps } from "./types";

// 日期區間最大查詢天數
const MAX_DAY_RANGE = 32;

export function usePayChannelDepositWithdraw() {
  const loading = ref(false);
  const dataList = ref<PayChannelReportItem[]>([]);
  const lastUpdate = ref("");

  // 商戶號 / 用戶組別 多選選項
  const payChannelOptions = ref<
    Array<{ label: string; value: number | string }>
  >([]);
  const payGroupOptions = ref<Array<{ label: string; value: number | string }>>(
    []
  );

  // 建立時間範圍（el-date-picker datetimerange）
  const reportDateRange = ref<[string, string]>([
    dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
    dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss")
  ]);
  // 完成時間範圍
  const completedDateRange = ref<[string, string]>([
    dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
    dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss")
  ]);

  const searchForm = reactive<SearchFormProps>({
    payChannelIDList: [],
    payGroupIdList: [],
    reportDateStart: reportDateRange.value[0],
    reportDateEnd: reportDateRange.value[1],
    completedDateStart: completedDateRange.value[0],
    completedDateEnd: completedDateRange.value[1]
  });

  // 報表彙總列（總計）
  const totalData = ref<Partial<PayChannelReportItem>>({});

  const pagination = reactive({
    total: 0,
    pageSize: 50,
    currentPage: 1,
    background: true
  });

  const rateRender = (text: any) => commaDecimalFormat(text ?? 0, 2) + "%";
  const amountRender = (text: any) => commaDecimalFormat(text ?? 0, 2);

  const columns: TableColumnList = [
    { label: $t("finance_report.date"), prop: "reportDate", width: 180 },
    {
      label: $t("finance_report.merchantPaymentMethod"),
      prop: "serviceCode"
    },
    { label: $t("finance_report.merchantNumber"), prop: "payChannelSn" },
    {
      label: $t("finance_report.totalDepositRMB"),
      prop: "depositAmount",
      align: "right",
      cellRenderer: ({ row }) => <span>{amountRender(row.depositAmount)}</span>
    },
    {
      label: $t("finance_report.totalDepositOther"),
      prop: "depositOtherAmount",
      align: "right",
      cellRenderer: ({ row }) => (
        <span>{amountRender(row.depositOtherAmount)}</span>
      )
    },
    {
      label: $t("finance_report.numberOfDepositSlips"),
      prop: "depositNum",
      hide: true
    },
    {
      label: $t("finance_report.numberOfDepositsCompleted"),
      prop: "successDepositNum"
    },
    {
      label: $t("finance_report.depositSuccessRate"),
      prop: "successDepositRate",
      cellRenderer: ({ row }) => <span>{rateRender(row.successDepositRate)}</span>
    },
    {
      label: $t("finance_report.totalWithdrawalAmountRMB"),
      prop: "withdrawalAmount",
      align: "right",
      cellRenderer: ({ row }) => (
        <span>{amountRender(row.withdrawalAmount)}</span>
      )
    },
    {
      label: $t("finance_report.totalWithdrawalAmountOther"),
      prop: "withdrawalOtherAmount",
      align: "right",
      cellRenderer: ({ row }) => (
        <span>{amountRender(row.withdrawalOtherAmount)}</span>
      )
    },
    {
      label: $t("finance_report.numberOfWithdrawals"),
      prop: "withdrawalNum",
      hide: true
    },
    {
      label: $t("finance_report.numberOfWithdrawalsCompleted"),
      prop: "successWithdrawalNum"
    },
    {
      label: $t("finance_report.withdrawalSuccessRate"),
      prop: "successWithdrawalRate",
      cellRenderer: ({ row }) => (
        <span>{rateRender(row.successWithdrawalRate)}</span>
      )
    }
  ];

  // pure-table 彙總列：依欄位 prop 回填總計
  function summaryMethod({ columns: cols }: { columns: any[] }) {
    const t = totalData.value;
    return cols.map((col, index) => {
      if (index === 0) return $t("finance_report.total");
      const map: Record<string, string> = {
        depositAmount: amountRender(t.depositAmount),
        depositOtherAmount: amountRender(t.depositOtherAmount),
        depositNum: String(t.depositNum ?? "-"),
        successDepositNum: String(t.successDepositNum ?? "-"),
        successDepositRate: rateRender(t.successDepositRate),
        withdrawalAmount: amountRender(t.withdrawalAmount),
        withdrawalOtherAmount: amountRender(t.withdrawalOtherAmount),
        withdrawalNum: String(t.withdrawalNum ?? "-"),
        successWithdrawalNum: String(t.successWithdrawalNum ?? "-"),
        successWithdrawalRate: rateRender(t.successWithdrawalRate)
      };
      return map[col.property] ?? "";
    });
  }

  // 校驗日期區間（不可超過 32 天），並回填查詢參數
  function validateAndBuildParams(): SearchFormProps | null {
    const rStart = dayjs(reportDateRange.value?.[0]);
    const rEnd = dayjs(reportDateRange.value?.[1]);
    const cStart = dayjs(completedDateRange.value?.[0]);
    const cEnd = dayjs(completedDateRange.value?.[1]);

    if (
      rEnd.diff(rStart, "day") > MAX_DAY_RANGE ||
      cEnd.diff(cStart, "day") > MAX_DAY_RANGE
    ) {
      message($t("finance_report.queryDateRangeCannotExceed32Days"), {
        type: "error"
      });
      return null;
    }

    searchForm.reportDateStart = rStart.format("YYYY-MM-DD HH:mm:ss");
    searchForm.reportDateEnd = rEnd.format("YYYY-MM-DD HH:mm:ss");
    searchForm.completedDateStart = cStart.format("YYYY-MM-DD HH:mm:ss");
    searchForm.completedDateEnd = cEnd.format("YYYY-MM-DD HH:mm:ss");

    return {
      payChannelIDList: searchForm.payChannelIDList,
      payGroupIdList: searchForm.payGroupIdList,
      reportDateStart: searchForm.reportDateStart,
      reportDateEnd: searchForm.reportDateEnd,
      completedDateStart: searchForm.completedDateStart,
      completedDateEnd: searchForm.completedDateEnd
    };
  }

  async function onSearch() {
    const params = validateAndBuildParams();
    if (!params) return;
    loading.value = true;
    try {
      const { data } = await getPayChannelReport(params);
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? dataList.value.length;
      lastUpdate.value = data?.updatedAt ?? "";
      totalData.value = {
        depositAmount: data?.depositTotalAmount,
        depositOtherAmount: data?.depositOtherTotalAmount,
        depositNum: data?.depositTotalNum,
        successDepositNum: data?.successDepositTotalNum,
        successDepositRate: data?.successDepositTotalRate,
        withdrawalAmount: data?.withdrawalTotalAmount,
        withdrawalOtherAmount: data?.withdrawalOtherTotalAmount,
        withdrawalNum: data?.withdrawalTotalNum,
        successWithdrawalNum: data?.successWithdrawalTotalNum,
        successWithdrawalRate: data?.successWithdrawalTotalRate
      };
    } finally {
      loading.value = false;
    }
  }

  function resetForm() {
    reportDateRange.value = [
      dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
      dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss")
    ];
    completedDateRange.value = [
      dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
      dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss")
    ];
    searchForm.payChannelIDList = [];
    searchForm.payGroupIdList = [];
    onSearch();
  }

  // 匯出 excel（沿用報表 endpoint）
  function handleExport() {
    const params = validateAndBuildParams();
    if (!params) return;
    exportExcel(
      "/backend/report/channel/deposit_withdraw",
      { ...params } as any,
      `${$t("finance_report.menuPayChannelDepositWithdraw")}.xlsx`
    );
  }

  // 初始化商戶號、用戶組別選項
  async function initOptions() {
    // 用戶組別（type 1）
    const { data: groupData } = await getPayGroups({ type: 1 });
    payGroupOptions.value = (groupData?.list ?? []).map((el: any) => ({
      label: el.name ?? "",
      value: el.ID ?? el.id ?? 0
    }));
    // 商戶號（僅取啟用 status==1）
    const { data: channelData } = await getSearchCheckbox();
    payChannelOptions.value = (channelData?.list ?? [])
      .filter((el: any) => el.status === 1)
      .map((el: any) => ({ label: el.name ?? "", value: el.id ?? 0 }));
  }

  onMounted(() => {
    initOptions();
    onSearch();
  });

  return {
    loading,
    columns,
    dataList,
    searchForm,
    reportDateRange,
    completedDateRange,
    pagination,
    lastUpdate,
    payChannelOptions,
    payGroupOptions,
    summaryMethod,
    onSearch,
    resetForm,
    handleExport
  };
}
