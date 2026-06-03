import { reactive, ref, onMounted, computed } from "vue";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";
import { exportExcel } from "@/utils/report";
import { getGameReport, gameReportRefresh } from "@/api/report";
import type { ReportItem, ReportTotal } from "./types";

dayjs.extend(isoWeek);

// 報表數值渲染：空值顯示 "-"，否則千分位
const renderNum = (text: any, n = 0) =>
  text === "" || text === undefined || text === null
    ? "-"
    : commaDecimalFormat(text, n);

export function useGameReport() {
  // dateType 驅動 reportDate 區塊顯示哪種日期選擇器
  const searchForm = reactive({
    reportType: "d",
    // 預設本月起訖
    reportDateStart: dayjs()
      .startOf("month")
      .startOf("day")
      .format("YYYY-MM-DD HH:mm:ss"),
    reportDateEnd: dayjs()
      .endOf("month")
      .endOf("day")
      .format("YYYY-MM-DD HH:mm:ss"),
    gameType: "",
    gameGroup: "",
    agencyAccount: "",
    memberAccount: ""
  });

  const dataList = ref<ReportItem[]>([]);
  const loading = ref(true);
  const total = ref<ReportTotal>({
    betAmount: "",
    kill: "",
    winAmount: "",
    betPeople: "",
    betCount: "",
    lastUpdatedAt: ""
  });

  // TODO: gameOptions 來源 @/utils/dropdown 未移植，先以空陣列佔位
  // 之後接上下拉資料來源後，gameType 變動時需連動過濾 gameGroup
  const gameTypeOptions = ref<any[]>([]);
  const gameGroupOptions = ref<any[]>([]);

  // 最後更新時間標題
  const title = computed(
    () => `${$t("report.lastUpdate")}：${total.value.lastUpdatedAt || ""}`
  );

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
      align: "right",
      cellRenderer: ({ row }) => <span>{renderNum(row.betAmount, 2)}</span>
    },
    {
      label: $t("report.killNumber"),
      prop: "kill",
      align: "right",
      cellRenderer: ({ row }) => (
        <span style={Number(row.kill) >= 0 ? "" : "color:#F00"}>
          {renderNum(row.kill, 2)}%
        </span>
      )
    },
    {
      label: $t("report.companyProfit"),
      prop: "winAmount",
      align: "right",
      cellRenderer: ({ row }) => (
        <span style={Number(row.winAmount) >= 0 ? "" : "color:#F00"}>
          {renderNum(row.winAmount, 2)}
        </span>
      )
    },
    {
      label: $t("report.bettorsNumber"),
      prop: "betPeople",
      align: "right",
      cellRenderer: ({ row }) => <span>{renderNum(row.betPeople)}</span>
    },
    {
      label: $t("report.bettorsCount"),
      prop: "betCount",
      align: "right",
      cellRenderer: ({ row }) => <span>{renderNum(row.betCount)}</span>
    }
  ];

  // 依目前 reportType 取得送後端的查詢參數（移除空值）
  function buildParams() {
    const raw: Record<string, any> = {
      reportDateStart: searchForm.reportDateStart,
      reportDateEnd: searchForm.reportDateEnd,
      reportType: searchForm.reportType,
      agencyAccount: searchForm.agencyAccount,
      gameType: searchForm.gameType,
      gameGroup: searchForm.gameGroup,
      memberAccount: searchForm.memberAccount
    };
    Object.keys(raw).forEach(k => {
      if (raw[k] === "" || raw[k] === undefined) delete raw[k];
    });
    return raw;
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getGameReport(buildParams());
      dataList.value = data?.list ?? [];
      total.value = data?.total ?? total.value;
    } finally {
      loading.value = false;
    }
  }

  // reportType 切換時，依新型別重新對齊起訖日期邊界
  function onReportTypeChange() {
    const start = dayjs(searchForm.reportDateStart);
    const end = dayjs(searchForm.reportDateEnd);
    if (searchForm.reportType === "w") {
      searchForm.reportDateStart = start
        .startOf("isoWeek")
        .format("YYYY-MM-DD HH:mm:ss");
      searchForm.reportDateEnd = end
        .endOf("isoWeek")
        .format("YYYY-MM-DD HH:mm:ss");
    } else if (searchForm.reportType === "m") {
      searchForm.reportDateStart = start
        .startOf("month")
        .format("YYYY-MM-DD HH:mm:ss");
      searchForm.reportDateEnd = end
        .endOf("month")
        .format("YYYY-MM-DD HH:mm:ss");
    }
  }

  function resetForm(formEl) {
    if (formEl) formEl.resetFields();
    searchForm.reportType = "d";
    searchForm.reportDateStart = dayjs()
      .startOf("month")
      .startOf("day")
      .format("YYYY-MM-DD HH:mm:ss");
    searchForm.reportDateEnd = dayjs()
      .endOf("month")
      .endOf("day")
      .format("YYYY-MM-DD HH:mm:ss");
    searchForm.gameType = "";
    searchForm.gameGroup = "";
    searchForm.agencyAccount = "";
    searchForm.memberAccount = "";
    onSearch();
  }

  // 手動更新報表後重新查詢
  async function handleUpdate() {
    const { success } = await gameReportRefresh();
    if (success) {
      message($t("report.manualUpdate"), { type: "success" });
      onSearch();
    }
  }

  // 匯出 excel（沿用舊 endpoint）
  function handleExport() {
    exportExcel("/backend/report/game/export", buildParams());
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    dataList,
    loading,
    total,
    title,
    columns,
    gameTypeOptions,
    gameGroupOptions,
    onSearch,
    onReportTypeChange,
    resetForm,
    handleUpdate,
    handleExport
  };
}
