import { ref, reactive, computed, onMounted } from "vue";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { ElTooltip } from "element-plus";
import QuestionFilled from "~icons/ep/question-filled";
import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";
import { exportExcel } from "@/utils/report";
import { getMemberReport, type MemberReportListResult } from "@/api/report";
import type { OptionItem, MemberReportRow, MemberReportTotal } from "./types";

dayjs.extend(isoWeek);

// 報表類型選項：日 / 週 / 月
export const reportTypeOptions: OptionItem[] = [
  { label: $t("report.dailyReport"), value: "d" },
  { label: $t("report.weeklyReport"), value: "w" },
  { label: $t("report.monthlyReport"), value: "m" }
];

// 數值格式化：空值顯示「-」，否則千分位 + 指定小數位
function fmt(text: any, n = 0): string {
  return text === "" || text === undefined || text === null
    ? "-"
    : commaDecimalFormat(text, n);
}

// 表頭含說明提示（icon hover）
function headerWithTip(labelKey: string, tipKey: string) {
  return () => (
    <span class="inline-flex items-center gap-1">
      {$t(labelKey)}
      <ElTooltip effect="dark" content={$t(tipKey)} placement="top">
        <QuestionFilled style="width:14px;height:14px;cursor:help;" />
      </ElTooltip>
    </span>
  );
}

export function useMemberReport() {
  const loading = ref(false);
  const dataList = ref<MemberReportRow[]>([]);

  // 合計列資料
  const totalData = ref<MemberReportTotal>({ lastUpdatedAt: "" });

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
    agencyAccount: ""
  });

  // 表頭「最後更新時間」標題
  const title = computed(
    () => `${$t("report.lastUpdate")}：${totalData.value.lastUpdatedAt || ""}`
  );

  // 一般人數欄（整數）渲染
  const intCell = (prop: string) => ({
    cellRenderer: ({ row }: any) => <span>{fmt(row[prop])}</span>
  });
  // 比率/金額欄（2 位小數）渲染
  const decCell = (prop: string) => ({
    cellRenderer: ({ row }: any) => <span>{fmt(row[prop], 2)}</span>
  });

  const columns: TableColumnList = [
    {
      label: $t("report.date"),
      prop: "reportDate",
      width: 180,
      fixed: "left"
    },
    {
      prop: "registerPeople",
      headerRenderer: headerWithTip(
        "report.registeredPeople",
        "report.registeredPeopleAnnotation"
      ),
      ...intCell("registerPeople")
    },
    {
      prop: "organicRegisterPeople",
      headerRenderer: headerWithTip(
        "report.natureRegisteredPeople",
        "report.natureFirstDepositNotRegisterAnnotation"
      ),
      ...intCell("organicRegisterPeople")
    },
    {
      prop: "firstDepositPeople",
      headerRenderer: headerWithTip(
        "report.firstDepositPeople",
        "report.firstDepositPeopleAnnotation"
      ),
      ...intCell("firstDepositPeople")
    },
    {
      prop: "firstDepositAmount",
      headerRenderer: headerWithTip(
        "report.memberFirstDepositAmount",
        "report.memberFirstDepositAmountAnnotation"
      ),
      ...decCell("firstDepositAmount")
    },
    {
      prop: "continueDepositCount",
      headerRenderer: headerWithTip(
        "report.continueDepositPeople",
        "report.continueDepositPeopleAnnotation"
      ),
      ...intCell("continueDepositCount")
    },
    {
      prop: "continueDepositAmount",
      headerRenderer: headerWithTip(
        "report.continueDepositAmount",
        "report.continueDepositAmountAnnotation"
      ),
      ...decCell("continueDepositAmount")
    },
    {
      prop: "organicRegisterFirstDepositPeople",
      headerRenderer: headerWithTip(
        "report.firstDepositNatureRegister",
        "report.firstDepositNatureRegisterAnnotation"
      ),
      ...intCell("organicRegisterFirstDepositPeople")
    },
    {
      prop: "registerFirstDepositPeople",
      headerRenderer: headerWithTip(
        "report.firstDepositAndRegister",
        "report.firstDepositAndRegisterAnnotation"
      ),
      ...intCell("registerFirstDepositPeople")
    },
    {
      prop: "organicRegisterNotFirstDepositPeople",
      headerRenderer: headerWithTip(
        "report.natureFirstDepositNotRegister",
        "report.natureFirstDepositNotRegisterAnnotation"
      ),
      ...intCell("organicRegisterNotFirstDepositPeople")
    },
    {
      prop: "agentRegisterNotFirstDepositPeople",
      headerRenderer: headerWithTip(
        "report.agencyFirstDepositNotRegister",
        "report.agencyFirstDepositNotRegisterAnnotation"
      ),
      ...intCell("agentRegisterNotFirstDepositPeople")
    },
    {
      prop: "loginPeople",
      headerRenderer: headerWithTip(
        "report.loginPeopleNumber",
        "report.loginPeopleNumberAnnotation"
      ),
      ...intCell("loginPeople")
    },
    {
      prop: "loginCount",
      headerRenderer: headerWithTip(
        "report.loginPeopleCount",
        "report.loginPeopleCountAnnotation"
      ),
      ...intCell("loginCount")
    },
    {
      prop: "betPeople",
      headerRenderer: headerWithTip(
        "report.bettorsNumber",
        "report.bettorsNumberAnnotation"
      ),
      ...intCell("betPeople")
    },
    {
      prop: "maxOnlineMember",
      headerRenderer: headerWithTip(
        "report.maxSameTimeOnlinePeopleNumber",
        "report.maxSameTimeOnlinePeopleNumberAnnotation"
      ),
      ...intCell("maxOnlineMember")
    },
    // 登入留存率
    { label: $t("report.nextDayRetentionRate"), prop: "retentionRateDay1", ...decCell("retentionRateDay1") },
    { label: $t("report.threeDayRetentionRate"), prop: "retentionRateDay3", ...decCell("retentionRateDay3") },
    { label: $t("report.sevenDayRetentionRate"), prop: "retentionRateDay7", ...decCell("retentionRateDay7") },
    { label: $t("report.fifteenDayRetentionRate"), prop: "retentionRateDay15", ...decCell("retentionRateDay15") },
    { label: $t("report.thirtyDayRetentionRate"), prop: "retentionRateDay30", ...decCell("retentionRateDay30") },
    // 註冊留存人數 / 留存率
    { label: $t("report.registerRetentionDay1"), prop: "registerRetentionDay1", ...intCell("registerRetentionDay1") },
    { label: $t("report.registerRetentionRateDay1"), prop: "registerRetentionRateDay1", ...decCell("registerRetentionRateDay1") },
    { label: $t("report.registerRetentionDay3"), prop: "registerRetentionDay3", ...intCell("registerRetentionDay3") },
    { label: $t("report.registerRetentionRateDay3"), prop: "registerRetentionRateDay3", ...decCell("registerRetentionRateDay3") },
    { label: $t("report.registerRetentionDay7"), prop: "registerRetentionDay7", ...intCell("registerRetentionDay7") },
    { label: $t("report.registerRetentionRateDay7"), prop: "registerRetentionRateDay7", ...decCell("registerRetentionRateDay7") },
    { label: $t("report.registerRetentionDay15"), prop: "registerRetentionDay15", ...intCell("registerRetentionDay15") },
    { label: $t("report.registerRetentionRateDay15"), prop: "registerRetentionRateDay15", ...decCell("registerRetentionRateDay15") },
    { label: $t("report.registerRetentionDay30"), prop: "registerRetentionDay30", ...intCell("registerRetentionDay30") },
    { label: $t("report.registerRetentionRateDay30"), prop: "registerRetentionRateDay30", ...decCell("registerRetentionRateDay30") },
    // 首存留存人數 / 留存率
    { label: $t("report.registerFirstDepositRetentionDay1"), prop: "registerFirstDepositRetentionDay1", ...intCell("registerFirstDepositRetentionDay1") },
    { label: $t("report.registerFirstDepositRetentionRateDay1"), prop: "registerFirstDepositRetentionRateDay1", ...decCell("registerFirstDepositRetentionRateDay1") },
    { label: $t("report.registerFirstDepositRetentionDay3"), prop: "registerFirstDepositRetentionDay3", ...intCell("registerFirstDepositRetentionDay3") },
    { label: $t("report.registerFirstDepositRetentionRateDay3"), prop: "registerFirstDepositRetentionRateDay3", ...decCell("registerFirstDepositRetentionRateDay3") },
    { label: $t("report.registerFirstDepositRetentionDay7"), prop: "registerFirstDepositRetentionDay7", ...intCell("registerFirstDepositRetentionDay7") },
    { label: $t("report.registerFirstDepositRetentionRateDay7"), prop: "registerFirstDepositRetentionRateDay7", ...decCell("registerFirstDepositRetentionRateDay7") },
    { label: $t("report.registerFirstDepositRetentionDay15"), prop: "registerFirstDepositRetentionDay15", ...intCell("registerFirstDepositRetentionDay15") },
    { label: $t("report.registerFirstDepositRetentionRateDay15"), prop: "registerFirstDepositRetentionRateDay15", ...decCell("registerFirstDepositRetentionRateDay15") },
    { label: $t("report.registerFirstDepositRetentionDay30"), prop: "registerFirstDepositRetentionDay30", ...intCell("registerFirstDepositRetentionDay30") },
    { label: $t("report.registerFirstDepositRetentionRateDay30"), prop: "registerFirstDepositRetentionRateDay30", ...decCell("registerFirstDepositRetentionRateDay30") }
  ];

  // pure-table 合計列：第一欄顯示「合計」，其餘對應 prop 輸出合計值
  function summaryMethod(param: { columns: any[] }) {
    return param.columns.map((col, idx) => {
      if (idx === 0) return $t("report.total");
      const prop = col.property;
      const v = (totalData.value as any)[prop];
      // 比率/金額欄 2 位小數，其餘整數
      const isDec = /Rate|Amount/.test(prop || "");
      return fmt(v, isDec ? 2 : 0);
    });
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

  // 日期選擇器更新
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
      agencyAccount: searchForm.agencyAccount
    };
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = (await getMemberReport(
        buildParams()
      )) as MemberReportListResult;
      dataList.value = data?.list ?? [];
      if (data?.total) {
        totalData.value = data.total as MemberReportTotal;
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
    searchForm.agencyAccount = "";
    onSearch();
  }

  // 匯出 Excel（沿用舊 endpoint）
  function handleExport() {
    exportExcel("/backend/report/memberrelated/export", buildParams());
  }

  onMounted(() => {
    onSearch();
  });

  return {
    loading,
    dataList,
    columns,
    title,
    searchForm,
    summaryMethod,
    onReportTypeChange,
    onDateChange,
    onSearch,
    resetForm,
    handleExport
  };
}
