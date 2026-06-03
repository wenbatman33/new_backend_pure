import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";
import {
  getLuckWalletList,
  closeLuckWallet,
  freezeLuckWallet,
  unfreezeLuckWallet
} from "@/api/member";
import type { LuckWalletItem } from "./types";

// 錢包狀態對應：文字 + 顏色
const statusMap: Record<number, [string, string]> = {
  1: [$t("member.luckWalletEstablished"), "#000000"],
  2: [$t("member.luckWalletInProgress"), "#87D1CE"],
  3: [$t("member.luckWalletProcessing"), "#000000"],
  4: [$t("member.luckWalletEndClose"), "#E9726A"],
  5: [$t("member.luckWalletEndFreeze"), "#000000"]
};

function fmtMoney(text: number | string) {
  try {
    return commaDecimalFormat(text, 2);
  } catch (e) {
    return text;
  }
}

export function useLuckWalletList() {
  const route = useRoute();

  const searchForm = reactive({
    account: "",
    status: "",
    startTime: "",
    endTime: "",
    name: "",
    orderID: "",
    id: "",
    promotionID: "",
    source: ""
  });

  // 排序資料：sortByField 1=createdAt 2=updatedAt；sortBy 1=asc 2=desc
  const sortData = reactive<{ sortBy: number | ""; sortByField: number | "" }>({
    sortBy: 2,
    sortByField: 1
  });

  const dataList = ref<LuckWalletItem[]>([]);
  const loading = ref(true);

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const statusOptions = [
    { label: $t("member.luckWalletEstablished"), value: 1 },
    { label: $t("member.luckWalletInProgress"), value: 2 },
    { label: $t("member.luckWalletProcessing"), value: 3 },
    { label: $t("member.luckWalletEndClose"), value: 4 },
    { label: $t("member.luckWalletEndFreeze"), value: 5 }
  ];

  const sourceOptions = [
    { label: $t("member.luckWalletAll"), value: "" },
    { label: $t("member.luckWalletSourceSystem"), value: 1 },
    { label: $t("member.luckWalletSourceManual"), value: 2 }
  ];

  const columns: TableColumnList = [
    {
      label: $t("member.luckWalletCreateTime"),
      prop: "createdAt",
      sortable: true,
      width: 160
    },
    {
      label: $t("member.luckWalletId"),
      prop: "id",
      width: 100,
      cellRenderer: ({ row }) => (
        <a
          href="#"
          style="color: #ff647c"
          onClick={(e: MouseEvent) => {
            e.preventDefault();
            goToLog(row.id);
          }}
        >
          {row.id}
        </a>
      )
    },
    { label: $t("member.luckWalletName"), prop: "name", width: 130 },
    {
      label: $t("member.luckWalletStatus"),
      prop: "status",
      width: 100,
      cellRenderer: ({ row }) => {
        const m = statusMap[row.status];
        return <span style={{ color: m?.[1] ?? "#000" }}>{m?.[0] ?? row.status}</span>;
      }
    },
    {
      label: $t("member.luckWalletStartAmount"),
      prop: "initialMoney",
      width: 110,
      cellRenderer: ({ row }) => <span>{fmtMoney(row.initialMoney)}</span>
    },
    {
      label: $t("member.luckWalletTotalBonus"),
      prop: "totalBonus",
      width: 110,
      cellRenderer: ({ row }) => <span>{fmtMoney(row.totalBonus)}</span>
    },
    {
      label: $t("member.luckWalletCurrentBalance"),
      prop: "money",
      width: 110,
      cellRenderer: ({ row }) => <span>{fmtMoney(row.money)}</span>
    },
    { label: $t("member.luckWalletAdjustMoney"), prop: "adjustMoney", width: 120 },
    { label: $t("member.luckWalletTransferLimit"), prop: "maxWithdrawal", width: 100 },
    { label: $t("member.luckWalletPeriodOfUse"), prop: "expirationDate", width: 160 },
    { label: $t("member.luckWalletRelatedOrderNumber"), prop: "orderID", width: 130 },
    {
      label: $t("member.luckWalletSource"),
      prop: "source",
      width: 90,
      cellRenderer: ({ row }) => <span style="color: #7B828E">{row.source}</span>
    },
    {
      label: $t("member.luckWalletAvailableManufacturers"),
      prop: "gameItem",
      width: 160,
      cellRenderer: ({ row }) => {
        const game = (row.gameItem ?? [])
          .map((item: { gameGroupName?: string }) => item.gameGroupName)
          .filter((item: string | undefined) => item != null)
          .join("\n");
        return <span style="color: #7B828E; white-space: pre-line">{game}</span>;
      }
    },
    {
      label: $t("member.luckWalletVendorSpecified"),
      prop: "assignedGameGroup",
      width: 100,
      cellRenderer: ({ row }) => (
        <span style="color: #7B828E">{row.assignedGameGroup}</span>
      )
    },
    { label: $t("member.luckWalletGameAccount"), prop: "gameAccount", width: 150 },
    {
      label: $t("member.luckWalletAccountCreateTime"),
      prop: "gameAccountCreatedAt",
      width: 160
    },
    {
      label: $t("member.luckWalletLastUpdate"),
      prop: "updatedAt",
      sortable: true,
      width: 160
    },
    { label: $t("member.luckWalletOperate"), fixed: "right", width: 180, slot: "operation" }
  ];

  function buildParams() {
    const search: Record<string, any> = {};
    if (sortData.sortByField || sortData.sortBy) {
      search.sortByField = sortData.sortByField;
      search.sortBy = sortData.sortBy;
    }
    const form: Record<string, any> = { ...searchForm };
    if (form.startTime) {
      form.startTime = String(form.startTime).split(" ")[0] + " 00:00:00";
    }
    if (form.endTime) {
      form.endTime = String(form.endTime).split(" ")[0] + " 23:59:59";
    }
    for (const key in form) {
      if (form[key] !== undefined && form[key] !== "") {
        search[key] = form[key];
      }
    }
    search.page = pagination.currentPage;
    search.pageSize = pagination.pageSize;
    return search;
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getLuckWalletList(buildParams());
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  // 排序變更：pure-table sort-change 事件
  function onSortChange({ prop, order }: { prop: string; order: string | null }) {
    if (prop === "createdAt") {
      sortData.sortByField = 1;
    } else if (prop === "updatedAt") {
      sortData.sortByField = 2;
    }
    if (order === "ascending") {
      sortData.sortBy = 1;
    } else if (order === "descending") {
      sortData.sortBy = 2;
    } else {
      sortData.sortByField = "";
      sortData.sortBy = "";
    }
    onSearch();
  }

  function resetForm(formEl: any) {
    if (!formEl) return;
    formEl.resetFields();
    pagination.currentPage = 1;
    onSearch();
  }

  function goToLog(id: number | string) {
    window.open(`/memberDetail/luckwalletLog/${id}`);
  }

  // close / freeze / unfreeze 錢包操作
  // 注意：舊系統此操作走 OTP 二次驗證（OtpModal + otpStore），
  // pure 專案尚未移植 OTP 流程，暫以一般確認框替代，待 OTP 模組移植後補上。
  async function handleWallet(
    row: LuckWalletItem,
    type: "close" | "freeze" | "unfreeze"
  ) {
    const titleMap = {
      close: $t("member.luckWalletCloseWallet"),
      freeze: $t("member.luckWalletFreeze"),
      unfreeze: $t("member.luckWalletRecover")
    };
    try {
      await ElMessageBox.confirm(titleMap[type], "", { type: "warning" });
    } catch {
      return;
    }
    let success = false;
    if (type === "close") {
      ({ success } = await closeLuckWallet({ id: row.id }));
    } else if (type === "freeze") {
      ({ success } = await freezeLuckWallet({ id: row.id }));
    } else {
      ({ success } = await unfreezeLuckWallet({ id: row.id }));
    }
    if (success) {
      message(titleMap[type], { type: "success" });
      onSearch();
    }
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
    // 從會員明細帶 account 進來時自動查詢
    if (route.params.id) {
      searchForm.account = String(route.params.id);
    }
    onSearch();
  });

  return {
    searchForm,
    statusOptions,
    sourceOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    onSortChange,
    resetForm,
    goToLog,
    handleWallet,
    handleSizeChange,
    handleCurrentChange
  };
}
