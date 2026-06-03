import { reactive, ref, onMounted } from "vue";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";
import dayjs from "dayjs";
import {
  getLockedWalletList,
  unlockMemberWallet,
  lockPaddingMemberWallet,
  type LockedWalletItem
} from "@/api/member";

// 状态文案对应
const statusMap: Record<number, string> = {
  1: $t("member.lock"),
  2: $t("member.lockedWalletsUnlocked"),
  3: $t("member.lockedWalletsReturned")
};

export function useLockedWallets() {
  // 搜寻条件（status 预设 1：锁定中；date 为日期区间）
  const searchForm = reactive({
    status: 1,
    memberID: "",
    memberAccount: "",
    createStartTime: "",
    createEndTime: ""
  });
  // 日期区间 v-model 暂存
  const dateRange = ref<[Date, Date] | null>(null);

  const dataList = ref<LockedWalletItem[]>([]);
  const loading = ref(true);

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  // 状态下拉选项
  const statusOptions = [
    { label: $t("member.lock"), value: 1 },
    { label: $t("member.lockedWalletsUnlocked"), value: 2 },
    { label: $t("member.lockedWalletsReturned"), value: 3 },
    { label: $t("member.all"), value: 4 }
  ];

  const columns: TableColumnList = [
    { label: $t("member.lockedWalletsLockID"), prop: "lockID", width: 90 },
    { label: $t("member.memberID"), prop: "memberID", width: 90 },
    { label: $t("member.memberAccount"), prop: "memberAccount", minWidth: 150 },
    {
      label: $t("member.amount"),
      prop: "lockMoney",
      minWidth: 140,
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
    { label: $t("member.createTime"), prop: "createdAt", width: 180 },
    { label: $t("member.updatedAt2"), prop: "updatedAt", width: 180 },
    { label: $t("member.operation"), fixed: "right", width: 300, slot: "operation" }
  ];

  async function onSearch() {
    loading.value = true;
    // 处理日期区间
    if (dateRange.value && dateRange.value.length === 2) {
      searchForm.createStartTime = dayjs(dateRange.value[0]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      searchForm.createEndTime = dayjs(dateRange.value[1]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
    } else {
      searchForm.createStartTime = "";
      searchForm.createEndTime = "";
    }
    try {
      const { data } = await getLockedWalletList({
        status: searchForm.status,
        memberID: searchForm.memberID,
        memberAccount: searchForm.memberAccount,
        createStartTime: searchForm.createStartTime,
        createEndTime: searchForm.createEndTime
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
    searchForm.status = 1;
    dateRange.value = null;
    onSearch();
  }

  /** 解锁钱包；isRepay=true 退回会员，false 不退回 */
  async function handleUnlock(lockID: number, isRepay: boolean) {
    const { success } = await unlockMemberWallet({ lockID, isRepay });
    if (success) {
      message($t("member.lockedWalletsSuccess"), { type: "success" });
      onSearch();
    }
  }

  /** 锁定挂起 */
  async function handleLockPadding(lockID: number) {
    const { success } = await lockPaddingMemberWallet({ lockID });
    if (success) {
      message($t("member.lockedWalletsSuccess"), { type: "success" });
      onSearch();
    }
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
    handleLockPadding
  };
}
