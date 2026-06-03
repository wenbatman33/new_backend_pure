import { ref, reactive, onMounted } from "vue";
import { transformI18n as $t } from "@/plugins/i18n";
import { getReferList, type ReferListItem } from "@/api/activity";

export function useReferList() {
  const searchForm = reactive({
    memberAccount: "",
    recommenderAccount: "",
    startTime: "",
    endTime: ""
  });
  // 日期區間（dayjs / el-date-picker 綁定值）
  const dateRange = ref<[Date, Date] | []>([]);

  const dataList = ref<ReferListItem[]>([]);
  const loading = ref(true);

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    {
      label: $t("activity.referRecommendedAccount"),
      prop: "memberAccount",
      minWidth: 150,
      cellRenderer: ({ row }) => (
        <a
          class="text-primary cursor-pointer"
          onClick={() =>
            window.open(`/memberDetail/detail/${row.memberID}`)
          }
        >
          {row.memberAccount}
        </a>
      )
    },
    {
      label: $t("activity.referRecommendAccount"),
      prop: "recommenderAccount",
      minWidth: 150,
      cellRenderer: ({ row }) => (
        <a
          class="text-primary cursor-pointer"
          onClick={() =>
            window.open(`/memberDetail/detail/${row.recommenderID}`)
          }
        >
          {row.recommenderAccount}
        </a>
      )
    },
    {
      label: $t("activity.referReferralCode"),
      prop: "recommendCode",
      minWidth: 120
    },
    {
      label: $t("activity.referCreateDate"),
      prop: "createdTime",
      minWidth: 160
    }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      // 同步日期區間到 searchForm
      if (dateRange.value && dateRange.value.length === 2) {
        searchForm.startTime = formatDateTime(dateRange.value[0], false);
        searchForm.endTime = formatDateTime(dateRange.value[1], true);
      } else {
        searchForm.startTime = "";
        searchForm.endTime = "";
      }
      const { data } = await getReferList({
        memberAccount: searchForm.memberAccount,
        recommenderAccount: searchForm.recommenderAccount,
        startTime: searchForm.startTime,
        endTime: searchForm.endTime
      });
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  // 將 Date 轉成 YYYY-MM-DD HH:mm:ss；end=true 取當日結束
  function formatDateTime(d: Date, end: boolean) {
    const date = new Date(d);
    const pad = (n: number) => String(n).padStart(2, "0");
    const ymd = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    return end ? `${ymd} 23:59:59` : `${ymd} 00:00:00`;
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    dateRange.value = [];
    onSearch();
  }

  onMounted(() => {
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
    resetForm
  };
}
