import { ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";
import dayjs from "dayjs";
import {
  getLockedLuckWalletList,
  unlockMemberLuckWallet,
  lockPaddingMemberLuckWallet,
  type LockedWalletItem
} from "@/api/member";

// 狀態對應：1 鎖定 / 2 已解鎖 / 3 已還款
const statusMap: Record<number, string> = {
  1: $t("member.lockedWalletsLock"),
  2: $t("member.lockedWalletsUnlocked"),
  3: $t("member.lockedWalletsRepaid")
};

export function useLockedLuckWallets() {
  const searchForm = reactive({
    status: 1,
    memberID: "",
    memberAccount: "",
    createStartTime: "",
    createEndTime: ""
  });
  // 日期範圍（el-date-picker 用陣列雙向綁定）
  const dateRange = ref<[Date, Date] | []>([]);

  const dataList = ref<LockedWalletItem[]>([]);
  const loading = ref(true);

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const statusOptions = [
    { label: $t("member.lockedWalletsLock"), value: 1 },
    { label: $t("member.lockedWalletsUnlocked"), value: 2 },
    { label: $t("member.lockedWalletsRepaid"), value: 3 },
    { label: $t("member.all"), value: 4 }
  ];

  const columns: TableColumnList = [
    { label: $t("member.lockedWalletsLockID"), prop: "lockID", width: 90 },
    { label: $t("member.memberID"), prop: "memberID", width: 90 },
    {
      label: $t("member.memberAccount"),
      prop: "memberAccount",
      minWidth: 140,
      slot: "memberAccount"
    },
    {
      label: $t("member.amount"),
      prop: "lockMoney",
      minWidth: 130,
      cellRenderer: ({ row }) => (
        <span>{commaDecimalFormat(row.lockMoney, 2, true)}</span>
      )
    },
    {
      label: $t("member.status"),
      prop: "status",
      width: 100,
      cellRenderer: ({ row }) => <span>{statusMap[row.status] ?? ""}</span>
    },
    { label: $t("member.tagWord"), prop: "note", minWidth: 150 },
    { label: $t("member.createTime"), prop: "createdAt", minWidth: 160 },
    { label: $t("member.updatedAt"), prop: "updatedAt", minWidth: 160 },
    {
      label: $t("member.operation"),
      fixed: "right",
      width: 260,
      slot: "operation"
    }
  ];

  // 同步日期範圍到查詢欄位
  function syncDateRange() {
    if (dateRange.value && dateRange.value.length === 2) {
      searchForm.createStartTime = dayjs(dateRange.value[0])
        .startOf("minute")
        .format("YYYY-MM-DD HH:mm:ss");
      searchForm.createEndTime = dayjs(dateRange.value[1])
        .endOf("minute")
        .format("YYYY-MM-DD HH:mm:ss");
    } else {
      searchForm.createStartTime = "";
      searchForm.createEndTime = "";
    }
  }

  async function onSearch() {
    syncDateRange();
    loading.value = true;
    try {
      const params: Record<string, any> = {
        status: searchForm.status,
        memberID: searchForm.memberID,
        memberAccount: searchForm.memberAccount,
        createStartTime: searchForm.createStartTime,
        createEndTime: searchForm.createEndTime
      };
      // 移除空值查詢
      Object.keys(params).forEach(k => {
        if (params[k] === "" || params[k] === null || params[k] === undefined) {
          delete params[k];
        }
      });
      const { data } = await getLockedLuckWalletList(params);
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.status = 1;
    dateRange.value = [];
    onSearch();
  }

  // 解鎖（isRepay=true 還款 / false 不還款）
  async function handleUnlock(lockID: number, isRepay: boolean) {
    const { success } = await unlockMemberLuckWallet({ lockID, isRepay });
    if (success) {
      message($t("member.lockedWalletsSuccess"), { type: "success" });
      onSearch();
    }
  }

  // 鎖定補單
  async function handleLockPadding(lockID: number) {
    const { success } = await lockPaddingMemberLuckWallet({ lockID });
    if (success) {
      message($t("member.lockedWalletsSuccess"), { type: "success" });
      onSearch();
    }
  }

  // 開啟會員明細頁
  function handleView(row: LockedWalletItem) {
    window.open(`/memberDetail/detail/${row.memberID}`);
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    dateRange,
    statusOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    handleUnlock,
    handleLockPadding,
    handleView
  };
}
