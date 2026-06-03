import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { transformI18n as $t } from "@/plugins/i18n";
import { getEvent0054Recommended } from "@/api/activity";
import type { RecommendedItem, SearchForm } from "./types";

// 排序欄位對應後端 orderBy 值：
// 1:總存款 2:活動有效投注額 3:總提款 4:最後上線時間 5:註冊日期
const orderByMap: Record<string, number> = {
  depositAmount: 1,
  eventTurnover: 2,
  withdrawAmount: 3,
  lastLoginAt: 4,
  registerAt: 5
};

export function useEvent0054Recommended() {
  const route = useRoute();

  const searchForm = reactive<SearchForm>({
    recommenderAccount: "",
    startDate: "",
    endDate: ""
  });
  // 日期區間 v-model（el-date-picker daterange）
  const dateRange = ref<[string, string] | null>(null);

  const dataList = ref<RecommendedItem[]>([]);
  const loading = ref(false);

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  // 目前排序狀態
  const sortState = reactive<{ orderBy?: number; order?: string }>({});

  const columns: TableColumnList = [
    {
      label: $t("activity.event0054RecommendedAccount"),
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
      label: $t("activity.event0054DepositAmount"),
      prop: "depositAmount",
      width: 140,
      sortable: "custom"
    },
    {
      label: $t("activity.event0054EventTurnover"),
      prop: "eventTurnover",
      width: 160,
      sortable: "custom"
    },
    {
      label: $t("activity.event0054WithdrawAmount"),
      prop: "withdrawAmount",
      width: 140,
      sortable: "custom"
    },
    {
      label: $t("activity.event0054RegisterAt"),
      prop: "registerAt",
      width: 170,
      sortable: "custom"
    },
    {
      label: $t("activity.event0054LastLoginAt"),
      prop: "lastLoginAt",
      width: 170,
      sortable: "custom"
    }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const params: Record<string, any> = {
        recommenderAccount: searchForm.recommenderAccount,
        startDate: searchForm.startDate,
        endDate: searchForm.endDate,
        page: pagination.currentPage,
        pageSize: pagination.pageSize
      };
      if (sortState.orderBy) {
        params.orderBy = sortState.orderBy;
        params.order = sortState.order;
      }
      const { data } = await getEvent0054Recommended(params);
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  // 日期區間變更
  function onDateChange(val: [string, string] | null) {
    searchForm.startDate = val?.[0] ?? "";
    searchForm.endDate = val?.[1] ?? "";
  }

  // 排序變更（server-side）
  function onSortChange({ prop, order }: { prop: string; order: string }) {
    if (order && orderByMap[prop]) {
      sortState.orderBy = orderByMap[prop];
      sortState.order = order === "ascending" ? "asc" : "desc";
    } else {
      sortState.orderBy = undefined;
      sortState.order = undefined;
    }
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

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    dateRange.value = null;
    searchForm.startDate = "";
    searchForm.endDate = "";
    sortState.orderBy = undefined;
    sortState.order = undefined;
    pagination.currentPage = 1;
    onSearch();
  }

  onMounted(() => {
    // 支援由其他頁面帶 query 參數進入並自動查詢
    const { recommenderAccount, startDate, endDate } = route.query;
    if (recommenderAccount) {
      searchForm.recommenderAccount = String(recommenderAccount);
    }
    if (startDate && endDate) {
      searchForm.startDate = String(startDate);
      searchForm.endDate = String(endDate);
      dateRange.value = [String(startDate), String(endDate)];
    }
    onSearch();
  });

  return {
    searchForm,
    dateRange,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    onDateChange,
    onSortChange,
    onSizeChange,
    onCurrentChange,
    resetForm
  };
}
