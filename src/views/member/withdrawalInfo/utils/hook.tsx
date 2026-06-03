import { ref, reactive, onMounted } from "vue";
import { transformI18n as $t } from "@/plugins/i18n";
import { arrayToOptions } from "@/utils/options";
import {
  getMemberWithdrawalInfo,
  getMemberWithdrawalInfoDropdown,
  type WithdrawalInfoItem,
  type ServiceOption
} from "@/api/member";

export function useWithdrawalInfo() {
  // 搜尋條件：address 為提款帳號（必填），serviceCode 為服務類型
  const searchForm = reactive({
    address: "",
    serviceCode: ""
  });
  const dataList = ref<WithdrawalInfoItem[]>([]);
  const loading = ref(false);
  // 服務代碼選項（來自 dropdown）
  const serviceCodeOptions = ref<Array<{ label: string; value: string }>>([]);

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  // 跳轉會員明細頁
  function openMemberDetail(userID: number) {
    window.open("/memberDetail/detail/" + userID);
  }

  const columns: TableColumnList = [
    {
      label: $t("member.memberAccount"),
      prop: "userAccount",
      cellRenderer: ({ row }) => (
        <span
          style="color:#ff647c;cursor:pointer"
          onClick={() => openMemberDetail(row.userID)}
        >
          {row.userAccount}
        </span>
      )
    },
    { label: $t("member.withdrawalName"), prop: "name" },
    { label: $t("member.type"), prop: "serviceName" },
    { label: $t("member.withdrawalAccount"), prop: "address", minWidth: 180 },
    { label: $t("member.bankName"), prop: "bankName" },
    { label: $t("member.bankCode"), prop: "bankCode" },
    { label: $t("member.area"), prop: "area" },
    { label: $t("member.branch"), prop: "branch" },
    {
      label: $t("member.default"),
      prop: "isDefault",
      cellRenderer: ({ row }) => (
        <span>{row.isDefault == 1 ? $t("member.yes") : $t("member.no")}</span>
      )
    },
    {
      label: $t("member.status"),
      prop: "status",
      cellRenderer: ({ row }) => (
        <span>{row.status == 1 ? $t("member.enable") : $t("member.disable")}</span>
      )
    },
    { label: $t("member.createTime"), prop: "createdAt" },
    { label: $t("member.updateTime"), prop: "updatedAt" }
  ];

  async function onSearch() {
    // 提款帳號為必填，未填不查詢（沿用舊版必填邏輯）
    if (!searchForm.address) {
      return;
    }
    loading.value = true;
    try {
      // source 固定帶 1（沿用舊版 searchInfo）
      const params: Record<string, any> = { source: 1 };
      if (searchForm.address) params.address = searchForm.address;
      if (searchForm.serviceCode) params.serviceCode = searchForm.serviceCode;
      const { data } = await getMemberWithdrawalInfo(params);
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    dataList.value = [];
    pagination.total = 0;
  }

  async function loadDropdown() {
    const { data } = await getMemberWithdrawalInfoDropdown();
    const services: ServiceOption[] = data?.services ?? [];
    serviceCodeOptions.value = arrayToOptions(services, "serviceCode", "name");
  }

  onMounted(() => {
    loadDropdown();
  });

  return {
    searchForm,
    serviceCodeOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm
  };
}
