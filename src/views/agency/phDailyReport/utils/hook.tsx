import { ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import { getPhDailyReport, PhDailyReportApi } from "@/api/agency";
import { exportExcel } from "@/utils/report";
import type {
  SearchFormProps,
  PhDailyReportItem,
  ParentAgencyItem
} from "./types";

// 代理模式文案对应
const businessTypeMap: Record<string, string> = {
  "0": $t("agency.phDailyReportTable30"),
  "1": $t("agency.agencyBusinessType1"),
  "2": $t("agency.agencyBusinessType2")
};

// 结算周期文案对应
const billingCycleMap: Record<string, string> = {
  "1": $t("agency.phDailyReportTable36"),
  "2": $t("agency.phDailyReportTable37")
};

export function usePhDailyReport() {
  const searchForm = reactive<SearchFormProps>({
    startTime: dayjs().startOf("month").format("YYYY-MM-DD"),
    endTime: dayjs().format("YYYY-MM-DD"),
    agencyAccount: "",
    parentAgencyAccount: "",
    businessType: "0",
    memberType: ""
  });

  const dataList = ref<PhDailyReportItem[]>([]);
  // 上级代理面包屑
  const parentAgencyData = ref<ParentAgencyItem[]>([]);
  // 合计列资料
  const summaryData = ref<Record<string, any>>({});
  const loading = ref(true);

  const businessTypeOptions = [
    { label: $t("agency.phDailyReportForm4"), value: "0" },
    { label: $t("agency.phDailyReportForm5"), value: "1" },
    { label: $t("agency.phDailyReportForm6"), value: "2" }
  ];

  const memberTypeOptions = [
    { label: $t("agency.phDailyReportForm8"), value: 1 },
    { label: $t("agency.phDailyReportForm9"), value: 2 }
  ];

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    { label: $t("agency.phDailyReportTable1"), prop: "agencyID", width: 120, sortable: true },
    { label: $t("agency.phDailyReportTable2"), prop: "agencyAccount", width: 140 },
    {
      label: $t("agency.phDailyReportTable29"),
      prop: "businessType",
      width: 140,
      cellRenderer: ({ row }) => (
        <span>{businessTypeMap[String(row.businessType)] ?? "--"}</span>
      )
    },
    { label: $t("agency.phDailyReportTable3"), prop: "parentAgencyAccount", width: 140 },
    {
      label: $t("agency.phDailyReportTable33"),
      prop: "agencyChildCnt",
      width: 140,
      cellRenderer: ({ row }) =>
        row.agencyChildCnt > 0 ? (
          <a
            class="cursor-pointer text-primary"
            onClick={() => drillDown(row.agencyAccount)}
          >
            {row.agencyChildCnt}
          </a>
        ) : (
          <span>{row.agencyChildCnt}</span>
        )
    },
    { label: $t("agency.phDailyReportTable34"), prop: "rankSettingOfferPercent", width: 140 },
    {
      label: $t("agency.phDailyReportTable4"),
      prop: "rankSettingGroupName",
      width: 140,
      cellRenderer: ({ row }) => (
        <span>
          {String(row.businessType) === "2" ? "--" : row.rankSettingGroupName}
        </span>
      )
    },
    { label: $t("agency.phDailyReportTable5"), prop: "rechargeAmount", width: 110 },
    {
      label: $t("agency.phDailyReportTable35"),
      prop: "billingCycle",
      width: 110,
      cellRenderer: ({ row }) => (
        <span>{billingCycleMap[String(row.billingCycle)] ?? "--"}</span>
      )
    },
    { label: $t("agency.phDailyReportTable7"), prop: "withdrawAmount", width: 110 },
    { label: $t("agency.phDailyReportTable9"), prop: "betAmount", width: 110 },
    { label: $t("agency.phDailyReportTable10"), prop: "totalWinAmount", width: 110 },
    { label: $t("agency.phDailyReportTable11"), prop: "depositWithdrawDiff", width: 110 },
    { label: $t("agency.phDailyReportTable12"), prop: "regMemberCount", width: 110 },
    { label: $t("agency.phDailyReportTable13"), prop: "rechargeMemberCount", width: 120 },
    { label: $t("agency.phDailyReportTable15"), prop: "withdrawMemberCount", width: 120 },
    { label: $t("agency.phDailyReportTable17"), prop: "betMemberCount", width: 100 },
    { label: $t("agency.phDailyReportTable18"), prop: "firstDepositCount", width: 100 },
    { label: $t("agency.phDailyReportTable19"), prop: "firstDepositAmount", width: 110 },
    { label: $t("agency.phDailyReportTable21"), prop: "continueDepositCount", width: 110 },
    { label: $t("agency.phDailyReportTable23"), prop: "continueDepositAmount", width: 110 },
    { label: $t("agency.phDailyReportTable25"), prop: "transferMemberCount", width: 120 },
    { label: $t("agency.phDailyReportTable27"), prop: "transferMemberAmount", width: 120 }
  ];

  // 合计行：pure-table 透过 summary-method 取得
  function getSummaries(param: { columns: any[] }) {
    const { columns: cols } = param;
    return cols.map((col, idx) => {
      if (idx === 0) return $t("agency.total");
      const v = summaryData.value[col.property];
      return v === undefined || v === null ? "" : v;
    });
  }

  // 把搜寻条件正规化（去空值、补时间）
  function buildParams(extra: Partial<SearchFormProps> = {}) {
    const merged = { ...searchForm, ...extra };
    const params: Record<string, any> = {};
    Object.keys(merged).forEach(key => {
      const val = (merged as any)[key];
      if (val !== undefined && val !== "" && val !== null) {
        params[key] = val;
      }
    });
    if (params.startTime) {
      params.startTime = `${dayjs(params.startTime).format("YYYY-MM-DD")} 00:00:00`;
    }
    if (params.endTime) {
      params.endTime = `${dayjs(params.endTime).format("YYYY-MM-DD")} 23:59:59`;
    }
    return params;
  }

  async function onSearch() {
    loading.value = true;
    try {
      const params = buildParams({
        page: pagination.currentPage,
        pageSize: pagination.pageSize
      } as any);
      const { data } = await getPhDailyReport(params);
      dataList.value = data?.list ?? [];
      // 列表总笔数：优先 count，退回 list 长度（total 阵列保留给合计行）
      pagination.total = data?.count ?? data?.list?.length ?? 0;
      parentAgencyData.value = data?.parentAgencyData ?? [];
      // 合计：后端 total 为阵列，取首笔
      const totalRow = Array.isArray(data?.total) ? data.total[0] : data?.total;
      summaryData.value = totalRow ?? {};
    } finally {
      loading.value = false;
    }
  }

  // 点选下级代理数 / 面包屑：切换上级代理帐号后重新查询
  function drillDown(agencyAccount: string) {
    searchForm.parentAgencyAccount = agencyAccount;
    pagination.currentPage = 1;
    onSearch();
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.startTime = dayjs().startOf("month").format("YYYY-MM-DD");
    searchForm.endTime = dayjs().format("YYYY-MM-DD");
    searchForm.businessType = "0";
    searchForm.parentAgencyAccount = "";
    pagination.currentPage = 1;
    onSearch();
  }

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  // 汇出报表：须填开始/结束时间
  function handleExport() {
    if (!searchForm.startTime || !searchForm.endTime) {
      message($t("agency.phDailyReport2"), { type: "error" });
      return;
    }
    const params = {
      startTime: `${dayjs(searchForm.startTime).format("YYYY-MM-DD")} 00:00:00`,
      endTime: `${dayjs(searchForm.endTime).format("YYYY-MM-DD")} 23:59:59`
    };
    exportExcel(
      PhDailyReportApi.phDailyReportExport,
      params,
      $t("agency.phDailyReport3")
    );
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    businessTypeOptions,
    memberTypeOptions,
    loading,
    columns,
    dataList,
    parentAgencyData,
    pagination,
    onSearch,
    resetForm,
    drillDown,
    getSummaries,
    handleExport,
    handleSizeChange,
    handleCurrentChange
  };
}
