import { ref, reactive, onMounted } from "vue";
import { transformI18n as $t } from "@/plugins/i18n";
import { getMemberOnlineList } from "@/api/member";
import type { MemberOnlineItem, SearchFormProps } from "./types";

export function useMemberOnline() {
  const searchForm = reactive<SearchFormProps>({
    id: "",
    account: "",
    isFuzzy: 1, // 預設模糊比對
    name: "",
    loginIP: "",
    loginDevice: ""
  });
  const dataList = ref<MemberOnlineItem[]>([]);
  const loading = ref(true);

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  // 帳號比對方式選項：1 模糊 / 2 完全相符
  const fuzzyOptions = [
    { label: $t("member.fuzzyMatch"), value: 1 },
    { label: $t("member.exactMatch"), value: 2 }
  ];

  // 點擊 ID 開新視窗檢視會員明細
  const handleView = (row: MemberOnlineItem) => {
    window.open(`/memberDetail/detail/${row.ID}`);
  };

  const columns: TableColumnList = [
    {
      label: "ID",
      prop: "ID",
      width: 100,
      cellRenderer: ({ row }) => (
        <el-link type="primary" onClick={() => handleView(row)}>
          {row.ID}
        </el-link>
      )
    },
    { label: $t("member.account"), prop: "account", width: 175 },
    { label: $t("member.name"), prop: "name", width: 175 },
    { label: $t("member.loginArea"), prop: "loginArea", width: 175 },
    { label: $t("member.loginIP"), prop: "loginIP", width: 175 },
    { label: $t("member.loginDevice"), prop: "loginDevice" },
    { label: $t("member.loginTime"), prop: "loginAt", width: 200 }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getMemberOnlineList({
        id: searchForm.id,
        account: searchForm.account,
        isFuzzy: searchForm.isFuzzy,
        name: searchForm.name,
        loginIP: searchForm.loginIP,
        loginDevice: searchForm.loginDevice
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
    searchForm.isFuzzy = 1;
    onSearch();
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    fuzzyOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    handleView
  };
}
