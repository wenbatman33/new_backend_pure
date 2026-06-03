import { ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { transformI18n as $t } from "@/plugins/i18n";
import { changeRedColorForNegative } from "@/utils/number";
import { exportExcel } from "@/utils/report";
import { getOperationReport } from "@/api/report";
import type { SearchFormProps, ReportRow } from "./types";

export function useOperationReport() {
  // 搜寻表单
  const searchForm = reactive<SearchFormProps>({
    reportType: "d",
    reportDateStart: dayjs().startOf("month").format("YYYY-MM-DD"),
    reportDateEnd: dayjs().endOf("month").format("YYYY-MM-DD"),
    agencyAccount: "",
    queryMemberMoney: false,
    includesTest: 0
  });

  const dataList = ref<ReportRow[]>([]);
  const loading = ref(true);
  // 表格最后更新时间（取自合计资料）
  const lastUpdatedAt = ref("");
  // 实际查询当下所使用的报表类型（用于汇出参数）
  const searchParams = ref<Record<string, any>>({});

  // 报表类型 options（日/周/月）
  const reportTypeOptions = [
    { label: $t("report.dailyReport"), value: "d" },
    { label: $t("report.weeklyReport"), value: "w" },
    { label: $t("report.monthlyReport"), value: "m" }
  ];

  const includesTestOptions = [
    { label: $t("report.no"), value: 0 },
    { label: $t("report.yes"), value: 1 }
  ];

  // 金额栏共用渲染（负值标红）
  const amountRender = (prop: string) => ({ row }) =>
    changeRedColorForNegative(row[prop]);

  const columns: TableColumnList = [
    {
      label: $t("report.date"),
      prop: "reportDate",
      width: 180,
      fixed: "left"
    },
    {
      label: $t("report.totalTurnover"),
      prop: "betAmount",
      width: 130,
      align: "right",
      cellRenderer: amountRender("betAmount")
    },
    {
      label: $t("report.totalGameTurnover"),
      prop: "groupBetAmount",
      width: 140,
      align: "right",
      cellRenderer: amountRender("groupBetAmount")
    },
    {
      label: $t("report.companyProfit"),
      prop: "winAmount",
      width: 130,
      align: "right",
      cellRenderer: amountRender("winAmount")
    },
    {
      label: $t("report.killNumber"),
      prop: "kill",
      width: 110,
      cellRenderer: amountRender("kill")
    },
    {
      label: $t("report.totalDeposit"),
      prop: "rechargeAmount",
      width: 120,
      align: "right",
      cellRenderer: amountRender("rechargeAmount")
    },
    {
      label: $t("report.totalWithdrawalMoney"),
      prop: "withdrawAmount",
      width: 130,
      align: "right",
      cellRenderer: amountRender("withdrawAmount")
    },
    {
      label: $t("report.depositWithdrawalReduce"),
      prop: "rechargeWithdrawDiff",
      width: 140,
      align: "right",
      cellRenderer: amountRender("rechargeWithdrawDiff")
    },
    {
      label: $t("report.discounts"),
      prop: "promotionAmount",
      width: 130,
      align: "right",
      cellRenderer: amountRender("promotionAmount")
    },
    {
      label: $t("report.vipGift"),
      prop: "vipGift",
      width: 130,
      align: "right",
      cellRenderer: amountRender("vipGift")
    },
    {
      label: $t("report.vipRebate"),
      prop: "returnAmount",
      width: 130,
      align: "right",
      cellRenderer: amountRender("returnAmount")
    },
    {
      label: $t("report.agencyDeposit"),
      prop: "agencyRechargeAmount",
      width: 130,
      align: "right",
      cellRenderer: amountRender("agencyRechargeAmount")
    },
    {
      label: $t("report.commissionWithdrawal"),
      prop: "agencyWithdrawAmount",
      width: 130,
      align: "right",
      cellRenderer: amountRender("agencyWithdrawAmount")
    },
    {
      label: $t("report.transferMainWallet"),
      prop: "transferMainWallet",
      width: 150,
      align: "right",
      cellRenderer: amountRender("transferMainWallet")
    },
    {
      label: $t("report.transferLuckMoney"),
      prop: "transferLuckMoney",
      width: 150,
      align: "right",
      cellRenderer: amountRender("transferLuckMoney")
    },
    {
      label: $t("report.registeredPeople"),
      prop: "registerPeople",
      width: 120,
      cellRenderer: amountRender("registerPeople")
    },
    {
      label: $t("report.loginPeopleNumber"),
      prop: "loginPeople",
      width: 120,
      cellRenderer: amountRender("loginPeople")
    },
    {
      label: $t("report.bettorsNumber"),
      prop: "betPeople",
      width: 120,
      cellRenderer: amountRender("betPeople")
    },
    {
      label: $t("report.uniqueDepositPeopleCount"),
      prop: "depositNum",
      width: 140,
      cellRenderer: amountRender("depositNum")
    },
    {
      label: $t("report.uniqueWithdrawalPeopleCount"),
      prop: "withdrawNum",
      width: 140,
      cellRenderer: amountRender("withdrawNum")
    },
    {
      label: $t("report.registerAndDeposit"),
      prop: "registerFirstDepositPeople",
      width: 130,
      cellRenderer: amountRender("registerFirstDepositPeople")
    },
    {
      label: $t("report.firstDepositPeople"),
      prop: "firstDepositPeople",
      width: 130,
      cellRenderer: amountRender("firstDepositPeople")
    },
    {
      label: $t("report.maxSameTimeOnlinePeopleNumber"),
      prop: "maxOnlineMember",
      width: 140,
      cellRenderer: amountRender("maxOnlineMember")
    },
    {
      label: $t("report.memberWallet"),
      prop: "memberMoney",
      width: 130,
      align: "right",
      cellRenderer: amountRender("memberMoney")
    }
  ];

  // 报表类型变更：依日/周/月对齐起讫日期区间
  function onReportTypeChange(val: SearchFormProps["reportType"]) {
    searchForm.reportType = val;
    const start = dayjs(searchForm.reportDateStart);
    const end = dayjs(searchForm.reportDateEnd);
    if (val === "w") {
      searchForm.reportDateStart = start.startOf("week").format("YYYY-MM-DD");
      searchForm.reportDateEnd = end.endOf("week").format("YYYY-MM-DD");
    } else if (val === "m") {
      searchForm.reportDateStart = start.startOf("month").format("YYYY-MM-DD");
      searchForm.reportDateEnd = end.endOf("month").format("YYYY-MM-DD");
    }
  }

  async function onSearch() {
    loading.value = true;
    try {
      const params = {
        reportDateStart: searchForm.reportDateStart,
        reportDateEnd: searchForm.reportDateEnd,
        reportType: searchForm.reportType,
        agencyAccount: searchForm.agencyAccount,
        queryMemberMoney: searchForm.queryMemberMoney ? 1 : 0,
        includesTest: searchForm.includesTest
      };
      searchParams.value = params;
      const result = await getOperationReport(params);
      const { success, data } = result;
      if (success) {
        dataList.value = data?.list ?? [];
        lastUpdatedAt.value = data?.total?.lastUpdatedAt ?? "";
      }
    } finally {
      loading.value = false;
    }
  }

  function resetForm() {
    searchForm.reportType = "d";
    searchForm.reportDateStart = dayjs().startOf("month").format("YYYY-MM-DD");
    searchForm.reportDateEnd = dayjs().endOf("month").format("YYYY-MM-DD");
    searchForm.agencyAccount = "";
    searchForm.queryMemberMoney = false;
    searchForm.includesTest = 0;
    onSearch();
  }

  // 汇出 Excel（沿用旧 endpoint）
  function handleExport() {
    exportExcel("/backend/report/operation/export", searchParams.value);
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    reportTypeOptions,
    includesTestOptions,
    loading,
    columns,
    dataList,
    lastUpdatedAt,
    onSearch,
    resetForm,
    onReportTypeChange,
    handleExport
  };
}
