import { ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { useRouter } from "vue-router";
import { transformI18n as $t } from "@/plugins/i18n";
import { tableCustomRender } from "@/utils/number";
import { exportExcel } from "@/utils/report";
import {
  getDepositMemberReport,
  getPayGroups,
  type GetDepositMemberReportParams
} from "@/api/finance_report";
import type { SearchFormProps, MemberReportItem } from "./types";

export function useMemberReport() {
  const router = useRouter();
  const loading = ref(false);
  const dataList = ref<MemberReportItem[]>([]);
  const updatedAt = ref("");
  const totalAmount = ref<string | number>("");

  // 三方金流群組、銀行卡金流群組選項
  const payGroupOptions = ref<Array<{ label: string; value: number | string }>>(
    [{ label: $t("finance_report.all"), value: "" }]
  );
  const bankcardGroupOptions = ref<
    Array<{ label: string; value: number | string }>
  >([{ label: $t("finance_report.all"), value: "" }]);

  // 幣別選項
  const currencyOptions = [
    { label: $t("finance_report.all"), value: "" },
    { label: $t("finance_report.rmb"), value: 1 },
    { label: "USDT-ERC", value: 2 },
    { label: "USDT-TRC", value: 3 }
  ];

  // 顯示筆數（排名）選項
  const showNumOptions = [
    { label: `${$t("finance_report.top20")}${$t("finance_report.ranking")}`, value: 20 },
    { label: `${$t("finance_report.top100")}${$t("finance_report.ranking")}`, value: 100 },
    { label: $t("finance_report.all"), value: "" }
  ];

  const searchForm = reactive<SearchFormProps>({
    reportDateStart: dayjs().startOf("day").format("YYYY-MM-DD"),
    reportDateEnd: dayjs().endOf("day").format("YYYY-MM-DD"),
    currency: "",
    showNum: 20,
    paymentGroup: "",
    bankcardGroup: ""
  });

  // 日期範圍（綁定 el-date-picker daterange）
  const dateRange = ref<[string, string]>([
    searchForm.reportDateStart,
    searchForm.reportDateEnd
  ]);

  const pagination = reactive({
    total: 0,
    pageSize: 50,
    currentPage: 1,
    background: true
  });

  // 跳轉會員明細
  function handleMemberClick(row: MemberReportItem) {
    if (row?.memberID) {
      const routeLocation = router.resolve({
        path: `/memberDetail/detail/${row.memberID}`
      });
      window.open(routeLocation.href, "_blank");
    }
  }

  const columns: TableColumnList = [
    {
      label: $t("finance_report.memberAccount"),
      prop: "memberName",
      cellRenderer: ({ row }) => (
        <a
          style="color: var(--el-color-primary); cursor: pointer"
          onClick={() => handleMemberClick(row)}
        >
          {row.memberName || row.memberID || ""}
        </a>
      )
    },
    {
      label: $t("finance_report.depositAmount"),
      prop: "amount",
      align: "right",
      cellRenderer: ({ row }) => <span>{tableCustomRender(row.amount, 2)}</span>
    },
    {
      label: $t("finance_report.maximumAmountOfSingleTransaction"),
      prop: "maxAmount",
      align: "right",
      cellRenderer: ({ row }) => <span>{tableCustomRender(row.maxAmount, 2)}</span>
    },
    {
      label: $t("finance_report.minimumAmountForSingleTransaction"),
      prop: "minAmount",
      align: "right",
      cellRenderer: ({ row }) => <span>{tableCustomRender(row.minAmount, 2)}</span>
    },
    {
      label: $t("finance_report.averageDepositAmount"),
      prop: "avgAmount",
      align: "right",
      cellRenderer: ({ row }) => <span>{tableCustomRender(row.avgAmount, 2)}</span>
    },
    {
      label: $t("finance_report.averageDailyDepositAmount"),
      prop: "dayAvgAmount",
      align: "right",
      cellRenderer: ({ row }) => (
        <span>{tableCustomRender(row.dayAvgAmount, 2)}</span>
      )
    },
    { label: $t("finance_report.thirdGroup"), prop: "payGroupName" },
    { label: $t("finance_report.bankcardGroups"), prop: "bankGroupName" },
    { label: $t("finance_report.createdAtDate"), prop: "registedDate" }
  ];

  // 組裝查詢參數
  function buildParams(): GetDepositMemberReportParams {
    const params: GetDepositMemberReportParams = {
      reportDateStart: dayjs(dateRange.value?.[0]).format("YYYY-MM-DD"),
      reportDateEnd: dayjs(dateRange.value?.[1]).format("YYYY-MM-DD"),
      page: pagination.currentPage,
      pageSize: pagination.pageSize
    };
    if (searchForm.currency !== "") params.currency = searchForm.currency;
    if (searchForm.showNum !== "") params.showNum = searchForm.showNum;
    if (searchForm.paymentGroup !== "")
      params.paymentGroup = searchForm.paymentGroup;
    if (searchForm.bankcardGroup !== "")
      params.bankcardGroup = searchForm.bankcardGroup;
    return params;
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getDepositMemberReport(buildParams());
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
      updatedAt.value = data?.updatedAt ?? "";
      totalAmount.value = data?.totalAmount ?? "";
    } finally {
      loading.value = false;
    }
  }

  // 手動更新（重新查詢）
  function handleManualUpdate() {
    pagination.currentPage = 1;
    onSearch();
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    dateRange.value = [
      dayjs().startOf("day").format("YYYY-MM-DD"),
      dayjs().endOf("day").format("YYYY-MM-DD")
    ];
    searchForm.currency = "";
    searchForm.showNum = 20;
    searchForm.paymentGroup = "";
    searchForm.bankcardGroup = "";
    pagination.currentPage = 1;
    onSearch();
  }

  // 匯出 excel（沿用後端報表匯出 endpoint）
  function handleExport() {
    exportExcel(
      "/backend/report/deposit/member_report",
      { ...buildParams(), pageSize: 99999, page: 1 },
      `${$t("finance_report.menuMemberReport")}.xlsx`
    );
  }

  // 初始化金流群組選項
  async function initPayGroups() {
    // type 1：三方金流群組
    const { data: payData } = await getPayGroups({ type: 1 });
    payGroupOptions.value = [
      { label: $t("finance_report.all"), value: "" },
      ...(payData?.list ?? []).map((el: any) => ({
        label: el.name ?? "",
        value: el.ID ?? 0
      }))
    ];
    // type 2：銀行卡金流群組
    const { data: bankData } = await getPayGroups({ type: 2 });
    bankcardGroupOptions.value = [
      { label: $t("finance_report.all"), value: "" },
      ...(bankData?.list ?? []).map((el: any) => ({
        label: el.name ?? "",
        value: el.ID ?? 0
      }))
    ];
  }

  onMounted(() => {
    initPayGroups();
    onSearch();
  });

  return {
    loading,
    columns,
    dataList,
    searchForm,
    dateRange,
    pagination,
    updatedAt,
    totalAmount,
    currencyOptions,
    showNumOptions,
    payGroupOptions,
    bankcardGroupOptions,
    onSearch,
    resetForm,
    handleManualUpdate,
    handleExport
  };
}
