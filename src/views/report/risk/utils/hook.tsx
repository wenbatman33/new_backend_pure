import { ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";
import { formatNumber } from "@/utils/number";
import { objectToOptions } from "@/utils/options";
import { countryCheck } from "@/utils/country";
import { exportExcel } from "@/utils/report";
import {
  getRiskReport,
  getRiskDropdown,
  updateRiskReport,
  deleteRiskReport,
  calcRiskToday
} from "@/api/report";
import type { RiskItem, OptionType } from "./types";

const REPORT_EXPORT_URL = "/backend/report/risk/export";

// 依國別取得固定標籤字串（沿用舊邏輯）
function getTagIDByCountry(): string {
  if (countryCheck(["CN"])) return "112,109,1003,1004,1005";
  if (countryCheck(["PH"])) return "109,155,1002,1003,1004";
  return "112,109,108";
}

export function useRiskReport() {
  const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

  const searchForm = reactive({
    date: [yesterday, yesterday] as [string, string],
    agencyAccount: "",
    agencyID: ""
  });

  const dataList = ref<RiskItem[]>([]);
  const loading = ref(true);
  const latestTime = ref("");
  const multipleSelection = ref<RiskItem[]>([]);

  // 處理方式 / 處理部門下拉
  const dealwithWayOptions = ref<OptionType[]>([]);
  const dealwithDeptOptions = ref<OptionType[]>([]);

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  // 內嵌可編輯欄位：處理內容（textarea）、處理方式、處理部門（select）
  const columns: TableColumnList = [
    { type: "selection", align: "left", width: 50 },
    { label: $t("report.reportDate"), prop: "reportDate", width: 110 },
    { label: $t("report.agencyID"), prop: "agencyID", width: 90 },
    { label: $t("report.memberID"), prop: "memberID", width: 90 },
    {
      label: $t("report.memberAccount"),
      prop: "memberAccount",
      width: 120,
      cellRenderer: ({ row }) => (
        <a
          href={`/memberDetail/detail/${row.memberID}`}
          target="_blank"
          style="color: var(--el-color-primary)"
        >
          {row.memberAccount}
        </a>
      )
    },
    { label: $t("report.tagID"), prop: "tagID", minWidth: 120 },
    {
      label: $t("report.betAmount"),
      prop: "betAmount",
      width: 110,
      sortable: true,
      cellRenderer: ({ row }) => <span>{formatNumber(row.betAmount)}</span>
    },
    {
      label: $t("report.deposit"),
      prop: "deposit",
      width: 110,
      sortable: true,
      cellRenderer: ({ row }) => <span>{formatNumber(row.deposit)}</span>
    },
    {
      label: $t("report.bonus"),
      prop: "bonus",
      width: 120,
      sortable: true,
      cellRenderer: ({ row }) => <span>{formatNumber(row.bonus)}</span>
    },
    {
      label: $t("report.winAmountFine"),
      prop: "winAmountBack",
      width: 120,
      cellRenderer: ({ row }) => <span>{formatNumber(row.winAmountBack)}</span>
    },
    {
      label: $t("report.winAmount"),
      prop: "winAmount",
      width: 110,
      sortable: true,
      hide: true,
      cellRenderer: ({ row }) => <span>{formatNumber(row.winAmount)}</span>
    },
    {
      label: $t("report.money"),
      prop: "money",
      width: 110,
      cellRenderer: ({ row }) => <span>{formatNumber(row.money)}</span>
    },
    {
      label: $t("report.fine"),
      prop: "fine",
      width: 110,
      cellRenderer: ({ row }) => <span>{formatNumber(row.fine)}</span>
    },
    { label: $t("report.dealwith"), prop: "dealwith", slot: "dealwith", width: 200 },
    {
      label: $t("report.dealwithWay"),
      prop: "dealwithWay",
      slot: "dealwithWay",
      width: 240
    },
    {
      label: $t("report.dealwithDept"),
      prop: "dealwithDept",
      slot: "dealwithDept",
      width: 200
    },
    { label: $t("report.operation"), fixed: "right", width: 100, slot: "operation" }
  ];

  function buildParams() {
    const params: Record<string, any> = {
      agencyAccount: searchForm.agencyAccount || undefined,
      agencyID: searchForm.agencyID ? Number(searchForm.agencyID) : undefined,
      tagID: getTagIDByCountry()
    };
    if (Array.isArray(searchForm.date) && searchForm.date.length === 2) {
      params.startDate = dayjs(searchForm.date[0]).format("YYYY-MM-DD");
      params.endDate = dayjs(searchForm.date[1]).format("YYYY-MM-DD");
    }
    return params;
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getRiskReport(buildParams());
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
      latestTime.value = data?.latestTime ?? "";
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.date = [yesterday, yesterday];
    onSearch();
  }

  function handleSelectionChange(rows: RiskItem[]) {
    multipleSelection.value = rows;
  }

  // 單列儲存處理結果
  async function handleSave(row: RiskItem) {
    const { success } = await updateRiskReport({
      id: row.id,
      dealwith: row.dealwith || "",
      dealwithWay: row.dealwithWay || 0,
      dealwithDept: row.dealwithDept || 0
    });
    if (success) {
      message($t("report.updateSuccess"), { type: "success" });
    }
  }

  // 批次刪除
  function handleBatchDelete() {
    const ids = multipleSelection.value.map(item => item.id);
    if (ids.length === 0) {
      message($t("report.pleaseSelectData"), { type: "warning" });
      return;
    }
    ElMessageBox.confirm($t("report.confirmBatchDelete"), "", {
      type: "warning"
    })
      .then(async () => {
        const { success } = await deleteRiskReport(ids.join(","));
        if (success) {
          message($t("report.deleteSuccess"), { type: "success" });
          onSearch();
        }
      })
      .catch(() => {});
  }

  // 手動更新今日風控資料
  async function handleRiskToday() {
    loading.value = true;
    try {
      await calcRiskToday();
      const today = dayjs().format("YYYY-MM-DD");
      searchForm.date = [today, today];
      await onSearch();
    } finally {
      loading.value = false;
    }
  }

  function handleExport() {
    exportExcel(REPORT_EXPORT_URL, buildParams());
  }

  async function loadDropdown() {
    const { data } = await getRiskDropdown();
    dealwithWayOptions.value = objectToOptions(data?.dealwithWay ?? {});
    dealwithDeptOptions.value = objectToOptions(data?.dealwithDept ?? {});
  }

  onMounted(async () => {
    await loadDropdown();
    await onSearch();
  });

  return {
    searchForm,
    loading,
    columns,
    dataList,
    pagination,
    latestTime,
    dealwithWayOptions,
    dealwithDeptOptions,
    onSearch,
    resetForm,
    handleSelectionChange,
    handleSave,
    handleBatchDelete,
    handleRiskToday,
    handleExport
  };
}
