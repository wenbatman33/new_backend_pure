import { ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { transformI18n as $t } from "@/plugins/i18n";
import { tableCustomRender } from "@/utils/number";
import { getRecommenderReport } from "@/api/activity";
import type { RecommenderItem } from "./types";

export function useRecommender() {
  // 报表类型：d 日报 / w 周报 / m 月报
  const dateType = ref("d");

  const searchForm = reactive({
    reportType: "d",
    // 预设为当月区间
    startDate: dayjs().startOf("month").format("YYYY-MM-DD"),
    endDate: dayjs().endOf("month").format("YYYY-MM-DD"),
    account: ""
  });

  const dataList = ref<RecommenderItem[]>([]);
  const summaryData = ref<Partial<RecommenderItem>>({});
  const loading = ref(true);

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  // 类型下拉选项
  const reportTypeOptions = [
    { label: $t("activity.recommenderReportDay"), value: "d" },
    { label: $t("activity.recommenderReportWeek"), value: "w" },
    { label: $t("activity.recommenderReportMonth"), value: "m" }
  ];

  // 推荐人帐号栏位：连结到会员明细
  const accountRenderer = ({ row }: { row: RecommenderItem }) => (
    <a
      href={`/memberDetail/detail/${row.memberID}`}
      target="_blank"
      style="color: var(--el-color-primary)"
    >
      {row.account}
    </a>
  );

  const amountRenderer = (prop: keyof RecommenderItem) => ({
    row
  }: {
    row: RecommenderItem;
  }) => <span>{tableCustomRender(row[prop], 2)}</span>;

  const columns: TableColumnList = [
    {
      label: $t("activity.recommenderAccount"),
      prop: "account",
      width: 130,
      cellRenderer: accountRenderer
    },
    {
      label: $t("activity.recommenderRecommendedCount"),
      prop: "recommendedCount",
      width: 110
    },
    {
      label: $t("activity.recommenderActiveCount"),
      prop: "activeCount",
      width: 110
    },
    {
      label: $t("activity.recommenderBindingCount"),
      prop: "bindingCount",
      width: 110
    },
    { label: $t("activity.recommenderNewCount"), prop: "newCount", width: 110 },
    {
      label: $t("activity.recommenderFirstDepositCount"),
      prop: "firstDepositCount",
      width: 110
    },
    {
      label: $t("activity.recommenderDepositCount"),
      prop: "depositCount",
      width: 110
    },
    {
      label: $t("activity.recommenderDepositAmount"),
      prop: "depositAmount",
      width: 120,
      align: "right",
      cellRenderer: amountRenderer("depositAmount")
    },
    {
      label: $t("activity.recommenderWithdrawCount"),
      prop: "withdrawCount",
      width: 110
    },
    {
      label: $t("activity.recommenderWithdrawAmount"),
      prop: "withdrawAmount",
      width: 120,
      align: "right",
      cellRenderer: amountRenderer("withdrawAmount")
    },
    {
      label: $t("activity.recommenderEventTurnover"),
      prop: "eventTurnover",
      width: 130,
      align: "right",
      cellRenderer: amountRenderer("eventTurnover")
    },
    {
      label: $t("activity.recommenderWinLoseAmount"),
      prop: "winLoseAmount",
      width: 120,
      align: "right",
      cellRenderer: amountRenderer("winLoseAmount")
    },
    {
      label: $t("activity.recommenderBonus"),
      prop: "bonus",
      width: 120,
      align: "right",
      cellRenderer: amountRenderer("bonus")
    },
    {
      label: $t("activity.action"),
      fixed: "right",
      width: 90,
      slot: "operation"
    }
  ];

  // 合计列：pure-table 的 summary-method
  const getSummaries = (param: { columns: any[]; data: any[] }) => {
    const { columns: cols } = param;
    const sums: string[] = [];
    cols.forEach((column, index) => {
      if (index === 0) {
        sums[index] = $t("activity.total");
        return;
      }
      const prop = column.property;
      const val = summaryData.value?.[prop as keyof RecommenderItem];
      if (val === undefined || val === null) {
        sums[index] = "";
        return;
      }
      // 金额栏位带两位小数
      const amountProps = [
        "depositAmount",
        "withdrawAmount",
        "eventTurnover",
        "winLoseAmount",
        "bonus"
      ];
      sums[index] = amountProps.includes(prop)
        ? tableCustomRender(val, 2)
        : String(val);
    });
    return sums;
  };

  // 切换日/周/月时，把区间对齐到对应起讫
  function onReportTypeChange(val: string) {
    dateType.value = val;
    searchForm.reportType = val;
    const start = dayjs(searchForm.startDate);
    const end = dayjs(searchForm.endDate);
    if (val === "w") {
      searchForm.startDate = start.startOf("week").format("YYYY-MM-DD");
      searchForm.endDate = end.endOf("week").format("YYYY-MM-DD");
    } else if (val === "m") {
      searchForm.startDate = start.startOf("month").format("YYYY-MM-DD");
      searchForm.endDate = end.endOf("month").format("YYYY-MM-DD");
    }
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getRecommenderReport({
        reportType: searchForm.reportType,
        startDate: searchForm.startDate,
        endDate: searchForm.endDate,
        account: searchForm.account
      });
      dataList.value = data?.list ?? [];
      summaryData.value = data?.summary ?? {};
      pagination.total = data?.total ?? dataList.value.length;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    dateType.value = "d";
    searchForm.reportType = "d";
    searchForm.account = "";
    searchForm.startDate = dayjs().startOf("month").format("YYYY-MM-DD");
    searchForm.endDate = dayjs().endOf("month").format("YYYY-MM-DD");
    onSearch();
  }

  // 详细：开新分页查看推荐明细
  function openDetail(row: RecommenderItem) {
    const { reportType, startDate, endDate } = searchForm;
    window.open(
      `/activityPage/recommended/${row.memberID}?reportType=${reportType}&startDate=${startDate}&endDate=${endDate}`
    );
  }

  onMounted(() => {
    onSearch();
  });

  return {
    dateType,
    searchForm,
    reportTypeOptions,
    loading,
    columns,
    dataList,
    pagination,
    getSummaries,
    onReportTypeChange,
    onSearch,
    resetForm,
    openDetail
  };
}
