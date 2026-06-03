import { ref, reactive, onMounted, onUnmounted, h } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";
import { hasAuth } from "@/router/utils";
import { getWithdrawRiskList, postRiskAuditLock } from "@/api/cashflow";
import type {
  WithdrawRiskItem,
  SearchFormProps,
  KeyValueItem
} from "./types";

/** 狀態文字對應 */
const statusTextMap: Record<number, string> = {
  1: $t("cashflow.withdrawRiskStatus1"),
  2: $t("cashflow.withdrawRiskStatus2"),
  3: $t("cashflow.withdrawRiskStatus3"),
  4: $t("cashflow.withdrawRiskStatus4"),
  5: $t("cashflow.withdrawRiskStatus5"),
  6: $t("cashflow.withdrawRiskStatus6")
};
const statusTypeMap: Record<number, string> = {
  1: "warning",
  2: "warning",
  3: "info",
  4: "warning",
  5: "success",
  6: "danger"
};

/** 風控狀態文字對應 */
const riskTextMap: Record<number, string> = {
  1: $t("cashflow.riskCheck1"),
  2: $t("cashflow.riskCheck2"),
  3: $t("cashflow.riskCheck3"),
  4: $t("cashflow.riskCheck4")
};
const riskTypeMap: Record<number, string> = {
  1: "warning",
  2: "info",
  3: "success",
  4: "info"
};

export function useWithdrawRisk() {
  const todayStart = dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss");
  const todayEnd = dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss");

  const searchForm = reactive<SearchFormProps>({
    withdrawalStart: todayStart,
    withdrawalEnd: todayEnd,
    memberAccount: "",
    orderSn: "",
    status: Number.MIN_VALUE,
    updatedStart: "",
    updatedEnd: "",
    riskCheck: Number.MIN_VALUE,
    riskAuditName: "",
    riskAuditMinutes: ""
  });

  // el-date-picker 綁定（陣列）
  const withdrawalRange = ref<[string, string]>([todayStart, todayEnd]);
  const updatedRange = ref<[string, string]>(["", ""]);

  const dataList = ref<WithdrawRiskItem[]>([]);
  const loading = ref(false);
  const totalAmount = ref(0);
  const count = ref(0);

  // 自動刷新
  const autoReload = ref(false);
  const intervalTime = ref(20);
  let reloadTimer: ReturnType<typeof setTimeout> | null = null;

  const pagination = reactive({
    total: 0,
    pageSize: 50,
    currentPage: 1,
    background: true
  });

  const statusOptions = [
    { label: $t("cashflow.all"), value: Number.MIN_VALUE },
    { label: $t("cashflow.withdrawRiskStatus1"), value: 1 },
    { label: $t("cashflow.withdrawRiskStatus2"), value: 2 },
    { label: $t("cashflow.withdrawRiskStatus3"), value: 3 },
    { label: $t("cashflow.withdrawRiskStatus4"), value: 4 },
    { label: $t("cashflow.withdrawRiskStatus5"), value: 5 },
    { label: $t("cashflow.withdrawRiskStatus6"), value: 6 }
  ];

  const riskOptions = [
    { label: $t("cashflow.all"), value: Number.MIN_VALUE },
    { label: $t("cashflow.riskCheck1"), value: 1 },
    { label: $t("cashflow.riskCheck2"), value: 2 },
    { label: $t("cashflow.riskCheck3"), value: 3 },
    { label: $t("cashflow.riskCheck4"), value: 4 }
  ];

  const renderTag = (item: KeyValueItem, textMap, typeMap) => {
    if (!item) return <span>-</span>;
    const text = textMap[item.key] ?? item.value;
    const type = typeMap[item.key] ?? "info";
    return (
      <el-tag type={type} effect="plain">
        {text}
      </el-tag>
    );
  };

  const columns: TableColumnList = [
    {
      label: $t("cashflow.transactionID"),
      prop: "transactionID",
      fixed: "left",
      width: 220
    },
    {
      label: $t("cashflow.withdrawalTime"),
      prop: "transactionTime",
      width: 165,
      cellRenderer: ({ row }) => (
        <span>
          {row.transactionTime
            ? dayjs(row.transactionTime).format("YYYY/MM/DD HH:mm:ss")
            : "-"}
        </span>
      )
    },
    { label: $t("cashflow.agencyID"), prop: "agencyID", width: 150 },
    {
      label: $t("cashflow.memberAC"),
      prop: "member",
      width: 140,
      cellRenderer: ({ row }) => (
        <span>{row.member?.value?.account ?? "-"}</span>
      )
    },
    { label: $t("cashflow.withdrawalName"), prop: "bankAccount", width: 110 },
    {
      label: $t("cashflow.status"),
      prop: "status",
      width: 100,
      cellRenderer: ({ row }) =>
        renderTag(row.status, statusTextMap, statusTypeMap)
    },
    {
      label: $t("cashflow.withdrawalAmount"),
      prop: "amount",
      width: 120,
      cellRenderer: ({ row }) => (
        <span>{Number(row.amount || 0).toLocaleString()}</span>
      )
    },
    {
      label: $t("cashflow.withdrawalBankName"),
      prop: "bankName",
      width: 110,
      cellRenderer: ({ row }) => (
        <span>{row.bankName ? row.bankName : row.bankCode}</span>
      )
    },
    { label: $t("cashflow.memberBankNumber"), prop: "memberBankNo", width: 160 },
    {
      label: $t("cashflow.financialCheck"),
      prop: "financialCheck",
      width: 120,
      cellRenderer: ({ row }) => (
        <span>{row.financialCheck?.value ?? "-"}</span>
      )
    },
    {
      label: $t("cashflow.riskStatus"),
      prop: "riskCheck",
      width: 120,
      cellRenderer: ({ row }) =>
        renderTag(row.riskCheck, riskTextMap, riskTypeMap)
    },
    { label: $t("cashflow.riskCheckName"), prop: "riskCheckName", width: 120 },
    {
      label: $t("cashflow.lastUpdate"),
      prop: "lastUpdate",
      width: 165,
      cellRenderer: ({ row }) => (
        <span>
          {row.lastUpdate
            ? dayjs(row.lastUpdate).format("YYYY/MM/DD HH:mm:ss")
            : "-"}
        </span>
      )
    },
    { label: $t("cashflow.updatedBy"), prop: "updatedBy", width: 110 },
    {
      label: $t("cashflow.action"),
      fixed: "right",
      width: 140,
      slot: "operation"
    }
  ];

  /** 組查詢參數，過濾掉全部/空值 */
  function buildQuery() {
    const query: Record<string, any> = {
      source: 1,
      withdrawalStart: withdrawalRange.value?.[0] || "",
      withdrawalEnd: withdrawalRange.value?.[1] || "",
      memberAccount: searchForm.memberAccount,
      orderSn: searchForm.orderSn,
      status: searchForm.status,
      updatedStart: updatedRange.value?.[0] || "",
      updatedEnd: updatedRange.value?.[1] || "",
      riskCheck: searchForm.riskCheck,
      riskAuditName: searchForm.riskAuditName,
      riskAuditMinutes: searchForm.riskAuditMinutes,
      page: pagination.currentPage,
      pageSize: pagination.pageSize
    };
    Object.keys(query).forEach(key => {
      const v = query[key];
      if (v === undefined || v === "" || v === Number.MIN_VALUE) {
        delete query[key];
      }
    });
    return query;
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getWithdrawRiskList(buildQuery());
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? data?.count ?? 0;
      count.value = data?.count ?? data?.total ?? 0;
      totalAmount.value = data?.total_amount ?? data?.totalAmount ?? 0;
    } finally {
      loading.value = false;
      scheduleReload();
    }
  }

  function resetForm(formEl) {
    if (formEl) formEl.resetFields();
    withdrawalRange.value = [todayStart, todayEnd];
    updatedRange.value = ["", ""];
    searchForm.memberAccount = "";
    searchForm.orderSn = "";
    searchForm.status = Number.MIN_VALUE;
    searchForm.riskCheck = Number.MIN_VALUE;
    searchForm.riskAuditName = "";
    searchForm.riskAuditMinutes = "";
    pagination.currentPage = 1;
    onSearch();
  }

  /** 風控審核：先鎖單，被其他人鎖住則提示，否則開啟風控審核頁 */
  async function handleRiskReview(row: WithdrawRiskItem) {
    const { data } = await postRiskAuditLock({ id: row.transactionID });
    if (data?.adminAccount) {
      ElMessageBox.confirm(
        $t("cashflow.riskAuditLocked", { account: data.adminAccount }),
        $t("cashflow.systemHint"),
        { type: "warning" }
      )
        .then(() => openRiskCheckPage(row))
        .catch(() => {});
      return;
    }
    openRiskCheckPage(row);
    onSearch();
  }

  function openRiskCheckPage(row: WithdrawRiskItem) {
    // 沿用舊路徑於新分頁開啟風控審核頁
    const href = `#/withdrawal/risk/check/${row.transactionID}`;
    window.open(href, "_blank");
  }

  /** 是否顯示「風控審核」按鈕：狀態待處理 + 財務通過 + 風控待審 */
  function canRiskReview(row: WithdrawRiskItem) {
    const status = row.status?.key ?? -1;
    const financial = row.financialCheck?.key ?? -1;
    const risk = row.riskCheck?.key ?? -1;
    return (
      status === 1 &&
      (financial === 1 || financial === 3 || financial === 6) &&
      (risk === 1 || risk === 6)
    );
  }

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }
  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  /** 自動刷新排程 */
  function scheduleReload() {
    if (reloadTimer) clearTimeout(reloadTimer);
    const t = intervalTime.value > 0 ? intervalTime.value * 1000 : 20000;
    reloadTimer = setTimeout(() => {
      if (autoReload.value) onSearch();
    }, t);
  }

  onMounted(() => {
    onSearch();
  });
  onUnmounted(() => {
    if (reloadTimer) clearTimeout(reloadTimer);
  });

  return {
    searchForm,
    withdrawalRange,
    updatedRange,
    statusOptions,
    riskOptions,
    loading,
    columns,
    dataList,
    pagination,
    count,
    totalAmount,
    autoReload,
    intervalTime,
    hasAuth,
    onSearch,
    resetForm,
    handleRiskReview,
    canRiskReview,
    handleSizeChange,
    handleCurrentChange
  };
}
