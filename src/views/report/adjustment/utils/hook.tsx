import { ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { transformI18n as $t } from "@/plugins/i18n";
import { tableCustomRender } from "@/utils/number";
import { getReportAdjustment } from "@/api/report";
import type { SearchFormProps, ReportRow } from "./types";

export function useReportAdjustment() {
  const searchForm = reactive<SearchFormProps>({
    adjustmentType: "",
    reportType: "d",
    reportDateStart: dayjs()
      .startOf("month")
      .format("YYYY-MM-DD 00:00:00"),
    reportDateEnd: dayjs().endOf("month").format("YYYY-MM-DD 23:59:59"),
    agencyAccount: "",
    reason: 0
  });

  const dataList = ref<ReportRow[]>([]);
  const loading = ref(true);

  // 上下分類型選項（含「全部」）
  const adjustmentTypeOptions = [
    { label: $t("report.all"), value: "" },
    { label: $t("report.highScore"), value: "1" },
    { label: $t("report.lowerScore"), value: "2" }
  ];

  // 報表類型（日/週/月）
  const reportTypeOptions = [
    { label: $t("report.dailyReport"), value: "d" },
    { label: $t("report.weeklyReport"), value: "w" },
    { label: $t("report.monthlyReport"), value: "m" }
  ];

  // 原因選項（沿用舊 adjustReasonOptions 中 ifShow 為 true 的項目）
  // 舊碼透過 /@/views/member/adjustment/components/data 的 adjustReasonOptions 取得，
  // 此處以本地常數內聯，含「全部」(value:0)
  const reasonOptions = [
    { label: $t("report.all"), value: 0 },
    { label: $t("report.innerMemberTestNumber"), value: 3 },
    { label: $t("report.financeSpecialDeposit"), value: 4 },
    { label: $t("report.marketingSpecialDeposit"), value: 5 },
    { label: $t("report.transferSpecialDeposit"), value: 6 },
    { label: $t("report.riskViolationBetDeduct"), value: 7 },
    { label: $t("report.rickControlEedEnvelopsDistribute"), value: 8 },
    { label: $t("report.gameWalletNegativeNumber"), value: 9 },
    { label: $t("report.manufactorPayoutError"), value: 10 },
    { label: $t("report.closeProduct"), value: 11 },
    { label: $t("report.offlineEventPayout"), value: 13 },
    { label: $t("report.onlineEventDeposit"), value: 14 },
    { label: $t("report.thirdPartyDepositError"), value: 15 }
  ];

  const columns: TableColumnList = [
    {
      label: $t("report.date"),
      prop: "date",
      width: 200,
      fixed: "left"
    },
    {
      label: $t("report.upperDistributedAmount"),
      prop: "amountAdd",
      align: "right",
      cellRenderer: ({ row }) => <span>{tableCustomRender(row.amountAdd, 2)}</span>
    },
    {
      label: $t("report.lowerDistributedAmount"),
      prop: "amountSub",
      align: "right",
      cellRenderer: ({ row }) => <span>{tableCustomRender(row.amountSub, 2)}</span>
    },
    {
      label: $t("report.applicationNumber"),
      prop: "applyCount",
      cellRenderer: ({ row }) => <span>{tableCustomRender(row.applyCount)}</span>
    },
    {
      label: $t("report.totalApplicationPeopleNumber"),
      prop: "applyMember",
      cellRenderer: ({ row }) => <span>{tableCustomRender(row.applyMember)}</span>
    },
    {
      label: $t("report.approverPeopleNumber"),
      prop: "approvedMember",
      cellRenderer: ({ row }) => (
        <span>{tableCustomRender(row.approvedMember)}</span>
      )
    },
    {
      label: $t("report.applicationAmount"),
      prop: "applyAmount",
      align: "right",
      cellRenderer: ({ row }) => (
        <span>{tableCustomRender(row.applyAmount, 2)}</span>
      )
    },
    {
      label: $t("report.approvedAmount"),
      prop: "approvedAmount",
      align: "right",
      cellRenderer: ({ row }) => (
        <span>{tableCustomRender(row.approvedAmount, 2)}</span>
      )
    }
  ];

  // 依報表類型把日期對齊到週/月起訖
  function normalizeRange() {
    const t = searchForm.reportType;
    const s = dayjs(searchForm.reportDateStart);
    const e = dayjs(searchForm.reportDateEnd);
    if (t === "w") {
      searchForm.reportDateStart = s
        .startOf("week")
        .format("YYYY-MM-DD HH:mm:ss");
      searchForm.reportDateEnd = e.endOf("week").format("YYYY-MM-DD HH:mm:ss");
    } else if (t === "m") {
      searchForm.reportDateStart = s
        .startOf("month")
        .format("YYYY-MM-DD HH:mm:ss");
      searchForm.reportDateEnd = e.endOf("month").format("YYYY-MM-DD HH:mm:ss");
    }
  }

  async function onSearch() {
    loading.value = true;
    try {
      normalizeRange();
      const { data } = await getReportAdjustment({
        reportDateStart: searchForm.reportDateStart,
        reportDateEnd: searchForm.reportDateEnd,
        reportType: searchForm.reportType,
        adjustmentType: searchForm.adjustmentType,
        agencyAccount: searchForm.agencyAccount,
        reason: searchForm.reason
      });
      dataList.value = data?.list ?? [];
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (formEl) formEl.resetFields();
    searchForm.adjustmentType = "";
    searchForm.reportType = "d";
    searchForm.reportDateStart = dayjs()
      .startOf("month")
      .format("YYYY-MM-DD 00:00:00");
    searchForm.reportDateEnd = dayjs()
      .endOf("month")
      .format("YYYY-MM-DD 23:59:59");
    searchForm.agencyAccount = "";
    searchForm.reason = 0;
    onSearch();
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    adjustmentTypeOptions,
    reportTypeOptions,
    reasonOptions,
    loading,
    columns,
    dataList,
    onSearch,
    resetForm
  };
}
