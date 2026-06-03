import { ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";
import { exportExcel } from "@/utils/report";
import { getChildAgencyReport } from "@/api/agency";
import type { SearchFormProps, ChildAgencyReportItem } from "./types";

// 數值渲染：正綠負紅
function renderColorNumber(text: any) {
  if (text === null || text === undefined || text === "") return <span />;
  const formatText = commaDecimalFormat(text, 2);
  const color = Number(text) >= 0 ? "#00BB00" : "#F00";
  return <span style={{ color }}>{formatText}</span>;
}

export function useChildAgencyReport() {
  const searchForm = reactive<SearchFormProps>({
    agencyID: "",
    agencyAccount: "",
    memberType: "",
    // 預設：本月初 ~ 今日
    reportDateStart: dayjs().startOf("month").format("YYYY-MM-DD"),
    reportDateEnd: dayjs().endOf("day").format("YYYY-MM-DD")
  });

  // 日期範圍（el-date-picker v-model 用陣列）
  const dateRange = ref<[string, string]>([
    searchForm.reportDateStart,
    searchForm.reportDateEnd
  ]);

  const dataList = ref<ChildAgencyReportItem[]>([]);
  const summaryRow = ref<Record<string, any>>({});
  const loading = ref(true);

  // 會員類型選項
  const memberTypeOptions = [
    { label: $t("agency.childAgencyReportMemberTypeNormal"), value: 1 },
    { label: $t("agency.childAgencyReportMemberTypeTest"), value: 2 }
  ];

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  // 排序狀態
  const sortState = reactive<{ field: string; order: "ASC" | "DESC" }>({
    field: "",
    order: "DESC"
  });

  const columns: TableColumnList = [
    { label: $t("agency.childAgencyReportAgencyID"), prop: "agencyID", width: 120 },
    { label: $t("agency.childAgencyReportAgencyAccount"), prop: "agencyAccount", width: 120 },
    { label: $t("agency.childAgencyReportAgencyName"), prop: "agencyName", width: 120 },
    {
      label: $t("agency.childAgencyReportRechargeAmount"),
      prop: "rechargeAmount",
      width: 130,
      sortable: "custom",
      cellRenderer: ({ row }) => <span>{commaDecimalFormat(row.rechargeAmount, 2)}</span>
    },
    {
      label: $t("agency.childAgencyReportWithdrawAmount"),
      prop: "withdrawAmount",
      width: 130,
      sortable: "custom",
      cellRenderer: ({ row }) => <span>{commaDecimalFormat(row.withdrawAmount, 2)}</span>
    },
    {
      label: $t("agency.childAgencyReportBetAmount"),
      prop: "betAmount",
      width: 130,
      sortable: "custom",
      cellRenderer: ({ row }) => <span>{commaDecimalFormat(row.betAmount, 2)}</span>
    },
    {
      label: $t("agency.childAgencyReportTotalWinAmount"),
      prop: "totalWinAmount",
      width: 130,
      sortable: "custom",
      cellRenderer: ({ row }) => <span>{commaDecimalFormat(row.totalWinAmount, 2)}</span>
    },
    {
      label: $t("agency.childAgencyReportNetProfit"),
      prop: "netProfit",
      width: 130,
      sortable: "custom",
      cellRenderer: ({ row }) => renderColorNumber(row.netProfit)
    },
    {
      label: $t("agency.childAgencyReportCommissionPercent"),
      prop: "commissionPercent",
      width: 130
    },
    {
      label: $t("agency.childAgencyReportTotalCommission"),
      prop: "totalCommission",
      width: 130,
      cellRenderer: ({ row }) => renderColorNumber(row.totalCommission)
    },
    {
      label: $t("agency.childAgencyReportTotalCommissionPaid"),
      prop: "totalCommissionPaid",
      width: 130,
      cellRenderer: ({ row }) => <span>{commaDecimalFormat(row.totalCommissionPaid, 2)}</span>
    },
    {
      label: $t("agency.childAgencyReportRegMemberCount"),
      prop: "regMemberCount",
      width: 130,
      sortable: "custom",
      cellRenderer: ({ row }) => <span>{commaDecimalFormat(row.regMemberCount)}</span>
    },
    {
      label: $t("agency.childAgencyReportFirstDepositCount"),
      prop: "firstDepositCount",
      width: 130,
      cellRenderer: ({ row }) => <span>{commaDecimalFormat(row.firstDepositCount)}</span>
    },
    {
      label: $t("agency.childAgencyReportPlatformCharge"),
      prop: "platformCharge",
      width: 130,
      cellRenderer: ({ row }) => <span>{commaDecimalFormat(row.platformCharge, 2)}</span>
    },
    {
      label: $t("agency.childAgencyReportTotalBonus"),
      prop: "totalBonus",
      width: 130,
      cellRenderer: ({ row }) => <span>{commaDecimalFormat(row.totalBonus, 2)}</span>
    },
    {
      label: $t("agency.childAgencyReportTotalCharge"),
      prop: "totalCharge",
      width: 130,
      cellRenderer: ({ row }) => <span>{commaDecimalFormat(row.totalCharge, 2)}</span>
    },
    {
      label: $t("agency.childAgencyReportActiveMemberCount"),
      prop: "activeMemberCount",
      width: 130,
      cellRenderer: ({ row }) => <span>{commaDecimalFormat(row.activeMemberCount)}</span>
    },
    {
      label: $t("agency.childAgencyReportLastLoginTime"),
      prop: "lastLoginTime",
      width: 160
    },
    {
      label: $t("agency.childAgencyReportIsActive"),
      prop: "isActive",
      width: 120,
      cellRenderer: ({ row }) => (
        <span>
          {row.isActive === 1
            ? $t("agency.childAgencyReportIsActiveYes")
            : row.isActive === 2
              ? $t("agency.childAgencyReportIsActiveNo")
              : ""}
        </span>
      )
    }
  ];

  // 組合查詢參數（沿用舊端點參數命名）
  function buildParams() {
    return {
      agencyID: searchForm.agencyID || undefined,
      agencyAccount: searchForm.agencyAccount || undefined,
      memberType: searchForm.memberType || undefined,
      startTime: searchForm.reportDateStart,
      endTime: searchForm.reportDateEnd,
      sortColumnName: sortState.field || undefined,
      sortDir: sortState.field ? sortState.order : undefined,
      page: pagination.currentPage,
      pageSize: pagination.pageSize
    };
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getChildAgencyReport(buildParams());
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
      summaryRow.value = data?.subTotal?.[0] ?? {};
    } finally {
      loading.value = false;
    }
  }

  // 日期範圍變更
  function onDateRangeChange(val: [string, string] | null) {
    if (val && val.length === 2) {
      searchForm.reportDateStart = val[0];
      searchForm.reportDateEnd = val[1];
    }
  }

  function resetForm(formEl) {
    if (formEl) formEl.resetFields();
    searchForm.agencyID = "";
    searchForm.agencyAccount = "";
    searchForm.memberType = "";
    searchForm.reportDateStart = dayjs().startOf("month").format("YYYY-MM-DD");
    searchForm.reportDateEnd = dayjs().endOf("day").format("YYYY-MM-DD");
    dateRange.value = [searchForm.reportDateStart, searchForm.reportDateEnd];
    sortState.field = "";
    sortState.order = "DESC";
    pagination.currentPage = 1;
    onSearch();
  }

  // 排序變更
  function onSortChange({ prop, order }: { prop: string; order: string }) {
    sortState.field = order ? prop : "";
    sortState.order = order === "ascending" ? "ASC" : "DESC";
    pagination.currentPage = 1;
    onSearch();
  }

  function onSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function onCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  // 匯出 Excel（沿用舊端點 /backend/report/childagency/export）
  function handleExport() {
    const params = {
      agencyID: searchForm.agencyID,
      agencyAccount: searchForm.agencyAccount,
      memberType: searchForm.memberType,
      startTime: searchForm.reportDateStart,
      endTime: searchForm.reportDateEnd,
      sortColumnName: sortState.field,
      sortDir: sortState.field ? sortState.order : "",
      page: pagination.currentPage,
      pageSize: pagination.pageSize
    };
    exportExcel("/backend/report/childagency/export", params, "childAgencyReport.csv");
  }

  // 合計列（el-table summary-method 需要）
  function getSummaries({ columns: cols }: { columns: any[] }) {
    const sums: string[] = [];
    cols.forEach((column, index) => {
      if (index === 0) {
        sums[index] = $t("agency.childAgencyReportTotal");
        return;
      }
      const prop = column.property;
      const val = summaryRow.value[prop];
      sums[index] =
        val === undefined || val === null || val === ""
          ? ""
          : commaDecimalFormat(val, 2);
    });
    return sums;
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    dateRange,
    memberTypeOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    onDateRangeChange,
    resetForm,
    onSortChange,
    onSizeChange,
    onCurrentChange,
    handleExport,
    getSummaries
  };
}
