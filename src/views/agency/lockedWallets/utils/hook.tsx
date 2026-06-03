import { ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";
import {
  getAgencyLockedWalletList,
  unlockAgencyWallet,
  type LockedWalletItem
} from "@/api/agency";

// 狀態對應：1 鎖定中 / 2 已解鎖
const statusMap: Record<number, string> = {
  1: $t("agency.lockedStatusLocked"),
  2: $t("agency.lockedStatusUnlocked")
};

export function useLockedWallets() {
  const searchForm = reactive({
    status: 1
  });
  const dataList = ref<LockedWalletItem[]>([]);
  const loading = ref(true);

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  // 狀態下拉選項（沿用舊碼四個選項）
  const statusOptions = [
    { label: $t("agency.lockedStatusLocked"), value: 1 },
    { label: $t("agency.lockedStatusUnlocked"), value: 2 },
    { label: $t("agency.notProcess"), value: 3 },
    { label: $t("agency.depositForm1"), value: 4 }
  ];

  const columns: TableColumnList = [
    { label: "lockID", prop: "lockID", width: 90 },
    { label: $t("agency.agencyID"), prop: "agencyID", width: 100 },
    { label: $t("agency.agencyAccount"), prop: "agencyAccount" },
    {
      label: $t("agency.status"),
      prop: "status",
      width: 100,
      cellRenderer: ({ row }) => <span>{statusMap[row.status] ?? row.status}</span>
    },
    { label: $t("agency.remark"), prop: "note" },
    { label: $t("agency.createdAt"), prop: "createdAt", width: 160 },
    { label: $t("agency.updatedAt"), prop: "updatedAt", width: 160 },
    { label: $t("agency.action"), fixed: "right", width: 120, slot: "operation" }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getAgencyLockedWalletList({
        status: searchForm.status
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
    onSearch();
  }

  function handleUnlock(row: LockedWalletItem) {
    ElMessageBox.confirm($t("agency.lockedConfirmUnlock"), "", {
      type: "warning"
    })
      .then(async () => {
        const { success } = await unlockAgencyWallet({ lockID: row.lockID });
        if (success) {
          message($t("agency.lockedUnlockSuccess"), { type: "success" });
          onSearch();
        }
      })
      .catch(() => {});
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    statusOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    handleUnlock
  };
}
