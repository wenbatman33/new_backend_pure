import { ref, reactive, onMounted } from "vue";
import { transformI18n as $t } from "@/plugins/i18n";
import { findByValue } from "@/utils/options";
import { getVipKeepList, type VipLevelHistoryItem } from "@/api/vip";

export function useVipLevelHistory() {
  const searchForm = reactive({
    memberID: "",
    memberAccount: "",
    // 時間區間（el-date-picker datetimerange 綁定陣列）
    timeRange: [] as string[],
    // VIP 異動狀態（多選）
    types: [] as number[]
  });

  const dataList = ref<VipLevelHistoryItem[]>([]);
  const loading = ref(true);

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  // VIP 異動類型選項
  const typesOptions = [
    { label: $t("vip.promotion"), value: 1 },
    { label: $t("vip.demotion"), value: 2 },
    { label: $t("vip.maintain"), value: 3 },
    { label: $t("vip.manualPromotion"), value: 4 },
    { label: $t("vip.manualDemotion"), value: 5 }
  ];

  const columns: TableColumnList = [
    { label: $t("vip.memberID"), prop: "memberID" },
    { label: $t("vip.memberAccount"), prop: "memberAccount" },
    {
      label: $t("vip.vipStatus"),
      prop: "type",
      cellRenderer: ({ row }) => (
        <span>{findByValue(typesOptions, row.type)}</span>
      )
    },
    { label: $t("vip.originalVipLevel"), prop: "oldLevel" },
    { label: $t("vip.newVipLevel"), prop: "newLevel" },
    { label: $t("vip.time"), prop: "createdAt" },
    { label: $t("vip.operator"), prop: "editorName", width: 80 }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getVipKeepList({
        memberID: searchForm.memberID,
        memberAccount: searchForm.memberAccount,
        startTime: searchForm.timeRange?.[0] ?? "",
        endTime: searchForm.timeRange?.[1] ?? "",
        // 舊版以逗號串接多選類型
        types: searchForm.types.join(","),
        page: pagination.currentPage,
        pageSize: pagination.pageSize
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
    searchForm.timeRange = [];
    searchForm.types = [];
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

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    typesOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    handleSizeChange,
    handleCurrentChange
  };
}
