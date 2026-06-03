import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import { changeRedColorForNegative } from "@/utils/number";
import { exportExcel } from "@/utils/report";
import {
  getWinnerReport,
  winnerReportRank,
  getWinnerGameGroups,
  type WinnerItem
} from "@/api/report";

// 排序欄位 → 後端排序代碼
const sortColumnMapping: Record<string, number> = {
  killNum: 1,
  betCnt: 2,
  betAmount: 3,
  profit: 4,
  eventBetAmount: 5,
  agencyID: 6,
  deposit: 7,
  withdraw: 8,
  bonus: 9,
  depositCount: 12,
  withdrawCount: 13
};
// 排序方向 → 後端代碼
const orderByMapping: Record<string, number> = {
  ascending: 1,
  descending: 2
};

export function useWinner() {
  const route = useRoute();
  const router = useRouter();

  const searchForm = reactive({
    reportStart: dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
    reportEnd: dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss"),
    topAgencyID: "",
    agencyID: "",
    memberAccount: "",
    gameGroupIDs: [] as number[]
  });
  // 時間區間（el-date-picker 雙向綁定用），預設今日
  const dateRange = ref<[string, string]>([
    searchForm.reportStart,
    searchForm.reportEnd
  ]);

  const dataList = ref<WinnerItem[]>([]);
  const loading = ref(true);
  const exportLoading = ref(false);
  const lastUpdate = ref("");
  const gameGroupOptions = ref<{ label: string; value: number }[]>([]);
  // 最近一次送出的查詢參數（給匯出/排行榜沿用）
  const lastParams = ref<Record<string, any>>({});

  const pagination = reactive({
    total: 0,
    pageSize: 50,
    currentPage: 1,
    background: true
  });

  // 排序狀態
  const sort = reactive<{ field: string; order: string }>({
    field: "",
    order: ""
  });

  const numCell = (prop: string) => ({ row }: { row: WinnerItem }) =>
    changeRedColorForNegative((row as any)[prop]);

  const columns: TableColumnList = [
    {
      label: $t("report.topAgencyID"),
      prop: "topAgencyID",
      fixed: "left",
      width: 140,
      sortable: "custom",
      cellRenderer: ({ row }) => <span>{row.topAgencyID === 0 ? "" : row.topAgencyID}</span>
    },
    {
      label: $t("report.agencyID"),
      prop: "agencyID",
      fixed: "left",
      width: 100,
      sortable: "custom",
      cellRenderer: ({ row }) => <span>{row.agencyID === 0 ? "" : row.agencyID}</span>
    },
    { label: $t("report.memberID"), prop: "memberID", fixed: "left", width: 120 },
    {
      label: $t("report.memberAccount"),
      prop: "memberAccount",
      fixed: "left",
      width: 140,
      slot: "memberAccount"
    },
    { label: $t("report.bettorsCount"), prop: "betCnt", sortable: "custom", slot: "betCnt" },
    {
      label: $t("report.totalTurnover"),
      prop: "betAmount",
      align: "right",
      sortable: "custom",
      cellRenderer: numCell("betAmount")
    },
    {
      label: $t("report.activityTotalFlow"),
      prop: "eventBetAmount",
      align: "right",
      sortable: "custom",
      cellRenderer: numCell("eventBetAmount")
    },
    {
      label: $t("report.killNumber"),
      prop: "killNum",
      sortable: "custom",
      cellRenderer: numCell("killNum")
    },
    {
      label: $t("report.companyProfit"),
      prop: "profit",
      align: "right",
      sortable: "custom",
      cellRenderer: numCell("profit")
    },
    {
      label: $t("report.depositAmount"),
      prop: "deposit",
      align: "right",
      sortable: "custom",
      cellRenderer: numCell("deposit")
    },
    {
      label: $t("report.depositCount"),
      prop: "depositCount",
      align: "right",
      sortable: "custom",
      cellRenderer: numCell("depositCount")
    },
    {
      label: $t("report.withdrawalAmount"),
      prop: "withdraw",
      align: "right",
      sortable: "custom",
      cellRenderer: numCell("withdraw")
    },
    {
      label: $t("report.withdrawCount"),
      prop: "withdrawCount",
      align: "right",
      sortable: "custom",
      cellRenderer: numCell("withdrawCount")
    },
    {
      label: $t("report.claimBonus"),
      prop: "bonus",
      align: "right",
      sortable: "custom",
      cellRenderer: numCell("bonus")
    }
  ];

  // 組裝查詢參數
  function buildParams() {
    const arg: Record<string, any> = {
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
      reportStart: dateRange.value?.[0] ?? "",
      reportEnd: dateRange.value?.[1] ?? "",
      memberAccount: searchForm.memberAccount,
      order: sort.field ? sortColumnMapping[sort.field] : undefined,
      orderParam: sort.order ? orderByMapping[sort.order] : undefined,
      gameGroupIDs: searchForm.gameGroupIDs?.length
        ? searchForm.gameGroupIDs.join(",")
        : ""
    };
    if (searchForm.topAgencyID) arg.topAgencyID = searchForm.topAgencyID;
    if (searchForm.agencyID) arg.agencyID = searchForm.agencyID;
    if (!arg.gameGroupIDs) delete arg.gameGroupIDs;
    return arg;
  }

  async function onSearch() {
    loading.value = true;
    try {
      const arg = buildParams();
      lastParams.value = arg;
      const { success, data } = await getWinnerReport(arg);
      if (success) {
        dataList.value = data?.list ?? [];
        pagination.total = data?.total ?? 0;
        lastUpdate.value = (data as any)?.updatedAt ?? "";
      }
    } finally {
      loading.value = false;
    }
  }

  // 排序變更
  function onSortChange({ prop, order }: { prop: string; order: string }) {
    sort.field = order ? prop : "";
    sort.order = order ?? "";
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

  function resetForm(formEl: any) {
    if (formEl) formEl.resetFields();
    searchForm.topAgencyID = "";
    searchForm.agencyID = "";
    searchForm.memberAccount = "";
    searchForm.gameGroupIDs = [];
    dateRange.value = [
      dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
      dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss")
    ];
    sort.field = "";
    sort.order = "";
    pagination.currentPage = 1;
    onSearch();
  }

  // 匯出 Excel
  function handleExport() {
    exportExcel("/backend/report/winner/export", lastParams.value);
  }

  // 匯出排行榜：呼叫 rank endpoint 後導向 winnerRank 頁
  async function handleExportRank() {
    exportLoading.value = true;
    try {
      const p: Record<string, any> = { ...buildParams() };
      delete p.page;
      delete p.pageSize;
      if (!p.gameGroupIDs) delete p.gameGroupIDs;
      if (p.reportStart) p.reportStart = String(p.reportStart).substr(0, 10);
      if (p.reportEnd) p.reportEnd = String(p.reportEnd).substr(0, 10);
      const { success } = await winnerReportRank(p);
      if (success) {
        message($t("report.exportSuccess"), { type: "success" });
        router.push({ path: "/independentEvent/winnerRank" });
      }
    } finally {
      exportLoading.value = false;
    }
  }

  onMounted(async () => {
    // 由 gameLog 跳轉帶入查詢條件
    if (route.query.gameGroupID) {
      dateRange.value = [
        (route.query.start as string) || dateRange.value[0],
        (route.query.end as string) || dateRange.value[1]
      ];
      searchForm.gameGroupIDs = [Number(route.query.gameGroupID)];
      searchForm.memberAccount = (route.query.memberAccount as string) || "";
    }
    // 載入遊戲廠商選項
    const { success, data } = await getWinnerGameGroups({ gameType: true });
    if (success) {
      gameGroupOptions.value = (data?.list ?? []).map((item: any) => ({
        label: item.name,
        value: item.id
      }));
    }
    onSearch();
  });

  return {
    searchForm,
    dateRange,
    loading,
    exportLoading,
    lastUpdate,
    gameGroupOptions,
    columns,
    dataList,
    pagination,
    sort,
    onSearch,
    onSortChange,
    onSizeChange,
    onCurrentChange,
    resetForm,
    handleExport,
    handleExportRank
  };
}
