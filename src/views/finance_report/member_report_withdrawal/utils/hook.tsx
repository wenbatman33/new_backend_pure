import { ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { transformI18n as $t } from "@/plugins/i18n";
import { tableCustomRender } from "@/utils/number";
import { exportExcel } from "@/utils/report";
import {
  getWithdrawMemberReport,
  getPayGroups,
  type PayGroupItem
} from "@/api/finance_report";
import type { SearchFormProps, ReportItem } from "./types";

const WITHDRAW_MEMBER_REPORT_URL = "/backend/report/Withdraw/member_report";

export function useMemberReportWithdrawal() {
  // 幣別選項
  const currencyOptions = [
    { label: $t("finance_report.all"), value: Number.MIN_VALUE },
    { label: $t("finance_report.rmb"), value: 1 },
    { label: "USDT-ERC", value: 2 },
    { label: "USDT-TRC", value: 3 }
  ];

  // 顯示筆數選項
  const showNumOptions = [
    {
      label: `${$t("finance_report.top")}20${$t("finance_report.ranking")}`,
      value: 20
    },
    {
      label: `${$t("finance_report.top")}100${$t("finance_report.ranking")}`,
      value: 100
    },
    { label: $t("finance_report.all"), value: "" }
  ];

  // 三方金流群組 / 銀行卡金流群組選項（含「全部」）
  const paymentGroupOptions = ref<Array<{ label: string; value: number }>>([
    { label: $t("finance_report.all"), value: Number.MIN_VALUE }
  ]);
  const bankcardGroupOptions = ref<Array<{ label: string; value: number }>>([
    { label: $t("finance_report.all"), value: Number.MIN_VALUE }
  ]);

  const searchForm = reactive<SearchFormProps>({
    reportDateStart: dayjs().startOf("day").format("YYYY-MM-DD"),
    reportDateEnd: dayjs().endOf("day").format("YYYY-MM-DD"),
    currency: Number.MIN_VALUE,
    showNum: 20,
    paymentGroup: Number.MIN_VALUE,
    bankcardGroup: Number.MIN_VALUE
  });

  // 日期區間（綁定 el-date-picker，內部以陣列維護）
  const dateRange = ref<[string, string]>([
    searchForm.reportDateStart,
    searchForm.reportDateEnd
  ]);

  const dataList = ref<ReportItem[]>([]);
  const loading = ref(true);
  const updatedAt = ref("");

  const pagination = reactive({
    total: 0,
    pageSize: 50,
    currentPage: 1,
    background: true
  });

  const amountRender = ({ row }, prop: string) =>
    tableCustomRender(row[prop], 2);

  const columns: TableColumnList = [
    {
      label: $t("finance_report.memberAccount"),
      prop: "memberName",
      cellRenderer: ({ row }) => (
        <a
          class="cursor-pointer text-[var(--el-color-primary)]"
          onClick={() => openMemberDetail(row)}
        >
          {row.memberName || row.memberID || ""}
        </a>
      )
    },
    {
      label: $t("finance_report.withdrawalAmount"),
      prop: "amount",
      align: "right",
      cellRenderer: scope => amountRender(scope, "amount")
    },
    {
      label: $t("finance_report.maximumAmountOfSingleTransaction"),
      prop: "maxAmount",
      align: "right",
      cellRenderer: scope => amountRender(scope, "maxAmount")
    },
    {
      label: $t("finance_report.minimumAmountForSingleTransaction"),
      prop: "minAmount",
      align: "right",
      cellRenderer: scope => amountRender(scope, "minAmount")
    },
    {
      label: $t("finance_report.averageWithdrawalAmount"),
      prop: "avgAmount",
      align: "right",
      cellRenderer: scope => amountRender(scope, "avgAmount")
    },
    {
      label: $t("finance_report.averageDailyWithdrawalAmount"),
      prop: "dayAvgAmount",
      align: "right",
      cellRenderer: scope => amountRender(scope, "dayAvgAmount")
    },
    {
      label: $t("finance_report.paymentGroups"),
      prop: "payGroupName"
    },
    {
      label: $t("finance_report.bankcardGroups"),
      prop: "bankGroupName"
    },
    {
      label: $t("finance_report.createdAtDate"),
      prop: "registedDate"
    }
  ];

  // 開啟會員詳情頁
  function openMemberDetail(row: ReportItem) {
    if (row.memberID) {
      window.open(`/memberDetail/detail/${row.memberID}`, "_blank");
    }
  }

  // 同步日期區間至 searchForm
  function syncDateRange() {
    if (dateRange.value?.length === 2) {
      searchForm.reportDateStart = dayjs(dateRange.value[0]).format(
        "YYYY-MM-DD"
      );
      searchForm.reportDateEnd = dayjs(dateRange.value[1]).format("YYYY-MM-DD");
    }
  }

  // 組裝查詢參數（沿用舊碼：Number.MIN_VALUE 視為「全部」需轉 undefined）
  function buildParams(extra: Record<string, any> = {}) {
    syncDateRange();
    const params: Record<string, any> = {
      reportDateStart: searchForm.reportDateStart,
      reportDateEnd: searchForm.reportDateEnd,
      currency:
        searchForm.currency !== Number.MIN_VALUE
          ? searchForm.currency
          : undefined,
      paymentGroup:
        searchForm.paymentGroup !== Number.MIN_VALUE
          ? searchForm.paymentGroup
          : undefined,
      bankcardGroup:
        searchForm.bankcardGroup !== Number.MIN_VALUE
          ? searchForm.bankcardGroup
          : undefined,
      ...extra
    };
    if (searchForm.showNum !== "") params.showNum = searchForm.showNum;
    return params;
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getWithdrawMemberReport(
        buildParams({
          page: pagination.currentPage,
          pageSize: pagination.pageSize
        })
      );
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
      updatedAt.value = data?.updatedAt ?? "";
    } finally {
      loading.value = false;
    }
  }

  // 手動更新（重新整理報表）
  function handleManualUpdate() {
    pagination.currentPage = 1;
    onSearch();
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.reportDateStart = dayjs().startOf("day").format("YYYY-MM-DD");
    searchForm.reportDateEnd = dayjs().endOf("day").format("YYYY-MM-DD");
    searchForm.currency = Number.MIN_VALUE;
    searchForm.showNum = 20;
    searchForm.paymentGroup = Number.MIN_VALUE;
    searchForm.bankcardGroup = Number.MIN_VALUE;
    dateRange.value = [
      searchForm.reportDateStart,
      searchForm.reportDateEnd
    ];
    pagination.currentPage = 1;
    onSearch();
  }

  // 匯出 Excel（後端直出檔，沿用查詢條件）
  function handleExport() {
    exportExcel(
      WITHDRAW_MEMBER_REPORT_URL,
      buildParams({ page: 1, pageSize: 99999 }),
      `${$t("finance_report.menuMemberReportWithdrawal")}.xlsx`
    );
  }

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  // 載入三方/銀行卡金流群組選項
  async function loadPayGroups() {
    try {
      const { data: payData } = await getPayGroups({ type: 1 });
      const { data: bankData } = await getPayGroups({ type: 2 });
      (payData?.list ?? []).forEach((el: PayGroupItem) => {
        paymentGroupOptions.value.push({
          label: el.name || "",
          value: el.ID || 0
        });
      });
      (bankData?.list ?? []).forEach((el: PayGroupItem) => {
        bankcardGroupOptions.value.push({
          label: el.name || "",
          value: el.ID || 0
        });
      });
    } catch {
      // 取選項失敗不阻斷主流程
    }
  }

  onMounted(() => {
    loadPayGroups();
    onSearch();
  });

  return {
    searchForm,
    dateRange,
    currencyOptions,
    showNumOptions,
    paymentGroupOptions,
    bankcardGroupOptions,
    loading,
    columns,
    dataList,
    pagination,
    updatedAt,
    onSearch,
    resetForm,
    handleManualUpdate,
    handleExport,
    handleSizeChange,
    handleCurrentChange
  };
}
