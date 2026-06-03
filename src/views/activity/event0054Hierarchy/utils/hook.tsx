import { ref, reactive, onMounted } from "vue";
import { transformI18n as $t } from "@/plugins/i18n";
import { getEvent0054Hierarchy } from "@/api/activity";
import type { HierarchyItem } from "./types";

export function useEvent0054Hierarchy() {
  const searchForm = reactive({
    recommenderAccount: ""
  });

  const dataList = ref<HierarchyItem[]>([]);
  const loading = ref(true);

  // 排序欄位 -> 後端 orderBy 編號（沿用舊碼 beforeFetch 映射）
  const orderByMap: Record<string, number> = {
    people1: 1,
    eventTurnover1: 2,
    people2: 3,
    eventTurnover2: 4,
    people3: 5,
    eventTurnover3: 6
  };

  // 目前排序狀態
  const sortState = reactive<{ orderBy?: number; order?: string }>({});

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

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
      label: $t("activity.event0054People1"),
      prop: "people1",
      width: 120,
      sortable: "custom"
    },
    {
      label: $t("activity.event0054EventTurnover1"),
      prop: "eventTurnover1",
      width: 130,
      sortable: "custom"
    },
    { label: $t("activity.event0054EventBonus1"), prop: "eventBonus1", width: 150 },
    {
      label: $t("activity.event0054People2"),
      prop: "people2",
      width: 120,
      sortable: "custom"
    },
    {
      label: $t("activity.event0054EventTurnover2"),
      prop: "eventTurnover2",
      width: 130,
      sortable: "custom"
    },
    { label: $t("activity.event0054EventBonus2"), prop: "eventBonus2", width: 150 },
    {
      label: $t("activity.event0054People3"),
      prop: "people3",
      width: 120,
      sortable: "custom"
    },
    {
      label: $t("activity.event0054EventTurnover3"),
      prop: "eventTurnover3",
      width: 130,
      sortable: "custom"
    },
    { label: $t("activity.event0054EventBonus3"), prop: "eventBonus3", width: 150 }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const params: Record<string, any> = {
        recommenderAccount: searchForm.recommenderAccount
      };
      // 帶入排序條件（order：ascend / descend）
      if (sortState.orderBy) {
        params.orderBy = sortState.orderBy;
        params.order = sortState.order;
      }
      const { data } = await getEvent0054Hierarchy(params);
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  // pure-table 排序變更：把欄位轉成後端 orderBy 編號
  function handleSortChange({ prop, order }: { prop: string; order: string }) {
    const orderBy = orderByMap[prop];
    if (order && orderBy) {
      sortState.orderBy = orderBy;
      sortState.order = order === "ascending" ? "ascend" : "descend";
    } else {
      sortState.orderBy = undefined;
      sortState.order = undefined;
    }
    onSearch();
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.recommenderAccount = "";
    sortState.orderBy = undefined;
    sortState.order = undefined;
    onSearch();
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    handleSortChange
  };
}
