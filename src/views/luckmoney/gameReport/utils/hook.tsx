import { ref, reactive, computed, onMounted } from "vue";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";
import { exportExcel } from "@/utils/report";
import {
  getGameReport,
  getOriginGameListType,
  getGameGroupsList,
  type GameReportListResult
} from "@/api/luckmoney";
import type {
  OptionItem,
  GameReportRow,
  GameReportTotal
} from "./types";

dayjs.extend(isoWeek);

// 報表類型選項：日 / 週 / 月
export const reportTypeOptions: OptionItem[] = [
  { label: $t("luckmoney.dailyReport"), value: "d" },
  { label: $t("luckmoney.weeklyReport"), value: "w" },
  { label: $t("luckmoney.monthlyReport"), value: "m" }
];

// 數值格式化：空值顯示「-」，否則千分位 + 指定小數位
function fmt(text: any, n = 0): string {
  return text === "" || text === undefined || text === null
    ? "-"
    : commaDecimalFormat(text, n);
}

export function useGameReport() {
  const loading = ref(false);
  const dataList = ref<GameReportRow[]>([]);

  // 遊戲類型 / 遊戲廠商選項
  const gameTypeList = ref<OptionItem[]>([]);
  const gameGroupList = ref<OptionItem[]>([]);

  // 合計列資料
  const totalData = ref<GameReportTotal>({
    betAmount: "",
    kill: "",
    winAmount: "",
    betPeople: "",
    betCount: "",
    lastUpdatedAt: ""
  });

  // 搜尋表單；日期預設為本月起訖
  const searchForm = reactive({
    reportType: "d",
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
    memberAccount: "",
    gameAccount: ""
  });

  // 表頭「最後更新時間」標題
  const title = computed(
    () => `${$t("luckmoney.lastUpdate")}：${totalData.value.lastUpdatedAt || ""}`
  );

  const columns: TableColumnList = [
    {
      label: $t("luckmoney.date"),
      prop: "reportDate",
      width: 180,
      fixed: "left",
      sortable: true
    },
    {
      label: $t("luckmoney.betAmount"),
      prop: "betAmount",
      align: "right",
      cellRenderer: ({ row }) => <span>{fmt(row.betAmount, 2)}</span>
    },
    {
      label: $t("luckmoney.killNumber"),
      prop: "kill",
      cellRenderer: ({ row }) => (
        <span style={Number(row.kill) < 0 ? "color:#F00" : ""}>
          {fmt(row.kill, 2)}%
        </span>
      )
    },
    {
      label: $t("luckmoney.companyProfit"),
      prop: "winAmount",
      align: "right",
      cellRenderer: ({ row }) => (
        <span style={Number(row.winAmount) < 0 ? "color:#F00" : ""}>
          {fmt(row.winAmount, 2)}
        </span>
      )
    },
    {
      label: $t("luckmoney.betPeople"),
      prop: "betPeople",
      cellRenderer: ({ row }) => <span>{fmt(row.betPeople)}</span>
    },
    {
      label: $t("luckmoney.betNumber"),
      prop: "betCount",
      cellRenderer: ({ row }) => <span>{fmt(row.betCount)}</span>
    }
  ];

  // pure-table 合計列：對應 columns 順序輸出每欄合計字串
  function summaryMethod() {
    return [
      $t("luckmoney.total"),
      fmt(totalData.value.betAmount, 2),
      `${fmt(totalData.value.kill, 2)}%`,
      fmt(totalData.value.winAmount, 2),
      fmt(totalData.value.betPeople),
      fmt(totalData.value.betCount)
    ];
  }

  // 依報表類型把日期對齊到週/月起訖
  function alignDate(value: dayjs.Dayjs, isStart: boolean): string {
    let d = value;
    if (searchForm.reportType === "w") {
      d = isStart ? value.startOf("isoWeek") : value.endOf("isoWeek");
    } else if (searchForm.reportType === "m") {
      d = isStart ? value.startOf("month") : value.endOf("month");
    }
    return d.format("YYYY-MM-DD HH:mm:ss");
  }

  // 報表類型切換時，重新對齊現有起訖日期
  function onReportTypeChange() {
    searchForm.reportDateStart = alignDate(
      dayjs(searchForm.reportDateStart),
      true
    );
    searchForm.reportDateEnd = alignDate(dayjs(searchForm.reportDateEnd), false);
  }

  // 日期選擇器更新（value 為 Date 或 dayjs）
  function onDateChange(field: "reportDateStart" | "reportDateEnd", value: any) {
    if (!value) return;
    searchForm[field] = alignDate(dayjs(value), field === "reportDateStart");
  }

  // 組查詢參數
  function buildParams() {
    return {
      reportDateStart: searchForm.reportDateStart,
      reportDateEnd: searchForm.reportDateEnd,
      reportType: searchForm.reportType,
      agencyAccount: searchForm.agencyAccount,
      gameType: searchForm.gameType,
      gameGroup: searchForm.gameGroup,
      memberAccount: searchForm.memberAccount,
      gameAccount: searchForm.gameAccount
    };
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = (await getGameReport(buildParams())) as GameReportListResult;
      dataList.value = data?.list ?? [];
      if (data?.total) {
        totalData.value = data.total as GameReportTotal;
      }
    } finally {
      loading.value = false;
    }
  }

  function resetForm() {
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
    searchForm.gameAccount = "";
    gameGroupList.value = [];
    onSearch();
  }

  // 遊戲類型變更 → 載入對應廠商清單
  async function onGameTypeChange(val: string) {
    searchForm.gameGroup = "";
    gameGroupList.value = [];
    if (!val) return;
    const { data } = await getGameGroupsList({ gameTypeID: val });
    gameGroupList.value = (data?.list ?? []).map((item: any) => ({
      label: item.displayName,
      value: item.id
    }));
  }

  // 匯出 Excel（沿用舊 endpoint）
  function handleExport() {
    exportExcel("/backend/report/game/export/lm", buildParams());
  }

  async function loadGameTypeList() {
    const { data } = await getOriginGameListType();
    gameTypeList.value = (data?.list ?? []).map((item: any) => ({
      label: item.value,
      value: item.key
    }));
  }

  onMounted(() => {
    loadGameTypeList();
    onSearch();
  });

  return {
    loading,
    dataList,
    columns,
    title,
    searchForm,
    gameTypeList,
    gameGroupList,
    summaryMethod,
    onReportTypeChange,
    onDateChange,
    onGameTypeChange,
    onSearch,
    resetForm,
    handleExport
  };
}
