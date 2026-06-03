import { ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { transformI18n as $t } from "@/plugins/i18n";
import { getEvent0054Recommender } from "@/api/activity";
import type { RecommenderItem } from "./types";

export function useEvent0054Recommender() {
  // 預設區間：近 30 天（今天往前 29 天 ~ 今天）
  const defaultRange: [string, string] = [
    dayjs().subtract(29, "day").format("YYYY-MM-DD"),
    dayjs().format("YYYY-MM-DD")
  ];

  const searchForm = reactive({
    recommenderAccount: "",
    date: [...defaultRange] as [string, string]
  });

  // 查詢區間限制：僅可選最近 30 天到今天
  const disabledDate = (current: Date) => {
    const today = dayjs().endOf("day");
    const thirtyDaysAgo = dayjs().subtract(30, "day").startOf("day");
    const d = dayjs(current);
    return d.isBefore(thirtyDaysAgo) || d.isAfter(today);
  };

  // 目前查詢條件（提供連結組裝起訖日使用）
  const query = reactive({ startDate: defaultRange[0], endDate: defaultRange[1] });

  const dataList = ref<RecommenderItem[]>([]);
  const loading = ref(true);

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    {
      label: $t("activity.event0054RecommenderAccount"),
      prop: "account",
      width: 140,
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
      label: $t("activity.event0054FriendTotal"),
      prop: "friendTotal",
      width: 120,
      cellRenderer: ({ row }) => (
        <a
          href="javascript:void(0)"
          style="color: var(--el-color-primary)"
          onClick={() => handleOpenRecommendedUrl(row.account)}
        >
          {row.friendTotal}
        </a>
      )
    },
    { label: $t("activity.event0054Friend"), prop: "friend", width: 120 },
    { label: $t("activity.event0054DepositPeople"), prop: "depositPeople", width: 120 },
    { label: $t("activity.event0054DepositAmount"), prop: "depositAmount", width: 130 },
    { label: $t("activity.event0054BetPeople"), prop: "betPeople", width: 120 },
    { label: $t("activity.event0054EventTurnover"), prop: "eventTurnover", width: 130 },
    { label: $t("activity.event0054WithdrawPeople"), prop: "withdrawPeople", width: 120 },
    { label: $t("activity.event0054EventBonus"), prop: "eventBonus", width: 120 }
  ];

  async function onSearch() {
    loading.value = true;
    const range = searchForm.date ?? [];
    query.startDate = range[0]
      ? dayjs(range[0]).format("YYYY-MM-DD")
      : "";
    query.endDate = range[1] ? dayjs(range[1]).format("YYYY-MM-DD") : "";
    try {
      const { data } = await getEvent0054Recommender({
        recommenderAccount: searchForm.recommenderAccount,
        startDate: query.startDate,
        endDate: query.endDate
      });
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.recommenderAccount = "";
    searchForm.date = [...defaultRange] as [string, string];
    onSearch();
  }

  // 開新分頁查看該推薦人的被推薦明細
  function handleOpenRecommendedUrl(account: string) {
    window.open(
      `/activity/recommend/event0054Recommended?recommenderAccount=${account}&startDate=${query.startDate}&endDate=${query.endDate}`
    );
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    disabledDate,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm
  };
}
