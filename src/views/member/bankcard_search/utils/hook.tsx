import { reactive, ref } from "vue";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import { getBankCardList, type BankCardItem } from "@/api/member";
import type { SearchFormProps } from "./types";

// 卡片類型對應文案
const typeMap: Record<number, string> = {
  1: $t("member.bankCard"),
  2: "USDT",
  3: "ecny",
  4: $t("member.cellPhoneAddress"),
  5: $t("member.openMpaymentsModal")
};

export function useBankCardSearch() {
  const searchForm = reactive<SearchFormProps>({
    bankNo: "",
    type: 1
  });
  const dataList = ref<BankCardItem[]>([]);
  const loading = ref(false);

  // 類型選項（搜尋條件）
  const typeOptions = [
    { label: $t("member.bankCard"), value: 1 },
    { label: "USDT", value: 2 },
    { label: "Ecny", value: 3 },
    { label: $t("member.other"), value: 5 }
  ];

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    {
      label: $t("member.memberAccount"),
      prop: "memberAccount",
      width: 120,
      slot: "memberAccount"
    },
    {
      label: $t("member.type"),
      prop: "type",
      width: 90,
      cellRenderer: ({ row }) => <span>{typeMap[row.type] ?? row.type}</span>
    },
    { label: $t("member.lmSection7"), prop: "name", width: 110 },
    { label: "Service Code", prop: "serviceCode", width: 110 },
    { label: $t("member.withdrawalAccount"), prop: "address", minWidth: 180 },
    { label: $t("member.accountOpeningBanck"), prop: "bankCode", width: 110 },
    { label: $t("member.area"), prop: "area", width: 100 },
    { label: $t("member.branch"), prop: "branch", width: 100 },
    {
      label: $t("member.default"),
      prop: "isDefault",
      width: 90,
      cellRenderer: ({ row }) => (
        <span>{row.isDefault == 1 ? $t("member.yes") : $t("member.no")}</span>
      )
    },
    {
      label: $t("member.status"),
      prop: "status",
      width: 90,
      cellRenderer: ({ row }) => (
        <span>{row.status == 1 ? $t("member.enable") : $t("member.disable")}</span>
      )
    },
    { label: $t("member.createTime"), prop: "createdAt", width: 160 },
    { label: $t("member.updateTime"), prop: "updatedAt", width: 160 }
  ];

  async function onSearch() {
    // bankNo 與 type 為必填
    if (!searchForm.bankNo) {
      message($t("member.bankCardUtAdress"), { type: "warning" });
      return;
    }
    loading.value = true;
    try {
      const { data } = await getBankCardList({
        bankNo: searchForm.bankNo,
        type: searchForm.type
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
    searchForm.type = 1;
    dataList.value = [];
    pagination.total = 0;
  }

  // 開啟會員明細
  function openMemberDetail(memberId: number | string) {
    window.open("/memberDetail/detail/" + memberId);
  }

  return {
    searchForm,
    typeOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    openMemberDetail
  };
}
