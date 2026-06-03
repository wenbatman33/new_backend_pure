import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";
import { getRecommended } from "@/api/activity";
import type { OptionItem, RecommendedRow, RecommendedSummary } from "./types";

dayjs.extend(isoWeek);

// 報表類型選項：日 / 週 / 月
export const reportTypeOptions: OptionItem[] = [
  { label: $t("activity.dailyReport"), value: "d" },
  { label: $t("activity.weeklyReport"), value: "w" },
  { label: $t("activity.monthlyReport"), value: "m" }
];

// 數值格式化：空值顯示「-」，否則千分位 + 指定小數位
function fmt(text: any, n = 0): string {
  return text === "" || text === undefined || text === null
    ? "-"
    : commaDecimalFormat(text, n);
}

// 日期欄位：空值顯示「-」
function fmtDate(text: any): string {
  return text === "" || text === undefined || text === null ? "-" : text;
}

export function useRecommended() {
  const route = useRoute();
  // 推荐人 ID 來自路由參數
  const recommenderID = Number(route.params?.id) || 0;

  const loading = ref(false);
  const dataList = ref<RecommendedRow[]>([]);

  // 合計列資料
  const totalData = ref<RecommendedSummary>({
    firstDepositAmount: "",
    depositAmount: "",
    withdrawAmount: "",
    eventTurnover: "",
    winLoseAmount: ""
  });

  // 搜尋表單；日期預設為本月起訖
  const searchForm = reactive({
    reportType: "d",
    startDate: dayjs().startOf("month").startOf("day").format("YYYY-MM-DD"),
    endDate: dayjs().endOf("month").endOf("day").format("YYYY-MM-DD"),
    account: ""
  });

  const columns: TableColumnList = [
    {
      label: $t("activity.recommendedAccount"),
      prop: "account",
      width: 140,
      fixed: "left",
      cellRenderer: ({ row }) => (
        <a
          href={`/memberDetail/detail/${row.memberID}`}
          target="_blank"
          style="color: var(--el-color-primary)"
        >
          {row.account}
        </a>
      )
    },
    {
      label: $t("activity.cardBinding"),
      prop: "isCardBinding",
      width: 80,
      cellRenderer: ({ row }) => (
        <span style={row.isCardBinding ? "color:#01A39D" : ""}>
          {row.isCardBinding ? "✓" : "-"}
        </span>
      )
    },
    {
      label: $t("activity.cardBindingDate"),
      prop: "cardBindingDate",
      width: 160,
      cellRenderer: ({ row }) => <span>{fmtDate(row.cardBindingDate)}</span>
    },
    {
      label: $t("activity.firstDepositAmount"),
      prop: "firstDepositAmount",
      align: "right",
      cellRenderer: ({ row }) => <span>{fmt(row.firstDepositAmount, 2)}</span>
    },
    {
      label: $t("activity.firstDepositDate"),
      prop: "firstDepositDate",
      width: 160,
      cellRenderer: ({ row }) => <span>{fmtDate(row.firstDepositDate)}</span>
    },
    {
      label: $t("activity.depositAmount"),
      prop: "depositAmount",
      align: "right",
      cellRenderer: ({ row }) => <span>{fmt(row.depositAmount, 2)}</span>
    },
    {
      label: $t("activity.withdrawAmount"),
      prop: "withdrawAmount",
      align: "right",
      cellRenderer: ({ row }) => <span>{fmt(row.withdrawAmount, 2)}</span>
    },
    {
      label: $t("activity.eventTurnover"),
      prop: "eventTurnover",
      align: "right",
      cellRenderer: ({ row }) => <span>{fmt(row.eventTurnover, 2)}</span>
    },
    {
      label: $t("activity.winLoseAmount"),
      prop: "winLoseAmount",
      align: "right",
      cellRenderer: ({ row }) => (
        <span style={Number(row.winLoseAmount) < 0 ? "color:#F00" : ""}>
          {fmt(row.winLoseAmount, 2)}
        </span>
      )
    },
    {
      label: $t("activity.registerDate"),
      prop: "registerDate",
      width: 160,
      cellRenderer: ({ row }) => <span>{fmtDate(row.registerDate)}</span>
    },
    {
      label: $t("activity.lastLoginAt"),
      prop: "lastLoginAt",
      width: 160,
      cellRenderer: ({ row }) => <span>{fmtDate(row.lastLoginAt)}</span>
    }
  ];

  // pure-table 合計列：對應 columns 順序輸出每欄合計字串
  function summaryMethod() {
    return [
      $t("activity.total"),
      "",
      "",
      fmt(totalData.value.firstDepositAmount, 2),
      "",
      fmt(totalData.value.depositAmount, 2),
      fmt(totalData.value.withdrawAmount, 2),
      fmt(totalData.value.eventTurnover, 2),
      fmt(totalData.value.winLoseAmount, 2),
      "",
      ""
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
    return d.format("YYYY-MM-DD");
  }

  // 報表類型切換時，重新對齊現有起訖日期
  function onReportTypeChange() {
    searchForm.startDate = alignDate(dayjs(searchForm.startDate), true);
    searchForm.endDate = alignDate(dayjs(searchForm.endDate), false);
  }

  // 日期選擇器更新（value 為 Date 或 dayjs）
  function onDateChange(field: "startDate" | "endDate", value: any) {
    if (!value) return;
    searchForm[field] = alignDate(dayjs(value), field === "startDate");
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getRecommended({
        recommenderID,
        reportType: searchForm.reportType,
        startDate: searchForm.startDate,
        endDate: searchForm.endDate,
        account: searchForm.account
      });
      dataList.value = data?.list ?? [];
      if (data?.summary) {
        totalData.value = data.summary as RecommendedSummary;
      }
    } finally {
      loading.value = false;
    }
  }

  function resetForm() {
    searchForm.reportType = "d";
    searchForm.startDate = dayjs()
      .startOf("month")
      .startOf("day")
      .format("YYYY-MM-DD");
    searchForm.endDate = dayjs().endOf("month").endOf("day").format("YYYY-MM-DD");
    searchForm.account = "";
    onSearch();
  }

  onMounted(() => {
    onSearch();
  });

  return {
    loading,
    dataList,
    columns,
    searchForm,
    summaryMethod,
    onReportTypeChange,
    onDateChange,
    onSearch,
    resetForm
  };
}
