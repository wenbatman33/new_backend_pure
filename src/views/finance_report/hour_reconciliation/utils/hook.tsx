import { ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import {
  getHourReconciliationList,
  setHourReconciliationNote,
  getPayChannel4Report
} from "@/api/finance_report";
import type { ReconciliationRow, ShiftTable, SearchFormProps } from "./types";

// 千分位格式化（保留兩位）
function toAmount(val: any): string {
  try {
    return Number(val || "0").toLocaleString("zh-CN", {
      maximumFractionDigits: 2
    });
  } catch (e) {
    return val;
  }
}

// 依時段計算合計列
function buildSummary(list: ReconciliationRow[]) {
  const sum = (key: keyof ReconciliationRow) =>
    list.reduce((prev, next) => prev + Number(next[key] || 0), 0);
  return {
    payChannelSn: $t("finance_report.total"),
    startingSystemBalance: toAmount(sum("startingSystemBalance")),
    depositAmount: toAmount(sum("depositAmount")),
    payoutAmount: toAmount(sum("payoutAmount")),
    payoutNum: sum("payoutNum"),
    settlementUAmount: toAmount(sum("settlementUAmount")),
    settlementUNum: sum("settlementUNum"),
    frozenAmount: toAmount(sum("frozenAmount")),
    endingSystemBalance: toAmount(sum("endingSystemBalance")),
    endingChannelBalance: toAmount(sum("endingChannelBalance")),
    endingBalanceDiff: toAmount(sum("endingBalanceDiff"))
  } as ReconciliationRow;
}

export function useHourReconciliation() {
  // 依目前小時決定預設班別
  const getDefaultShift = () => {
    const hour = dayjs().hour();
    if (hour >= 8 && hour <= 16) return 2;
    if (hour >= 17) return 3;
    return 1;
  };

  const searchForm = reactive<SearchFormProps>({
    reportDateStart: dayjs().format("YYYY-MM-DD"),
    reportDateEnd: dayjs().format("YYYY-MM-DD"),
    shift: getDefaultShift(),
    payChannelName: "",
    payChannelSn: "",
    balanceDiff: 0,
    balanceChange: 0
  });
  // el-date-picker 綁定用
  const reportDate = ref<string>(dayjs().format("YYYY-MM-DD"));

  const loading = ref(true);
  // 多時段表：每個元素 { title, list }
  const shiftTables = ref<{ title: string; list: ReconciliationRow[] }[]>([]);
  const payChannels = ref<{ label: string; value: string }[]>([]);

  const shiftOptions = [
    { label: $t("finance_report.morningShift"), value: 1 },
    { label: $t("finance_report.middleShift"), value: 2 },
    { label: $t("finance_report.nightShift"), value: 3 }
  ];
  const balanceDiffOptions = [
    { label: $t("finance_report.all"), value: 0 },
    { label: $t("finance_report.yes"), value: 1 },
    { label: $t("finance_report.no"), value: 2 }
  ];
  const balanceChangeOptions = [
    { label: $t("finance_report.all"), value: 0 },
    { label: $t("finance_report.collectOnBehalfOf"), value: 1 },
    { label: $t("finance_report.supplyAp"), value: 2 },
    { label: $t("finance_report.issuedAmountNotZero"), value: 3 }
  ];

  // 金額欄位渲染
  const amountRender = (key: keyof ReconciliationRow) => ({ row }: any) => (
    <span>{toAmount(row[key])}</span>
  );

  const columns: TableColumnList = [
    { label: $t("finance_report.freezeBalance"), prop: "payChannelSn" },
    { label: $t("finance_report.businessName"), prop: "payChannelName" },
    { label: "serviceCode", prop: "serviceCode" },
    {
      label: $t("finance_report.systemBalanceStartingTime"),
      prop: "startingSystemBalance",
      cellRenderer: amountRender("startingSystemBalance")
    },
    {
      label: $t("finance_report.collectionAmount"),
      prop: "depositAmount",
      cellRenderer: amountRender("depositAmount")
    },
    {
      label: $t("finance_report.paymentAmount"),
      prop: "payoutAmount",
      cellRenderer: amountRender("payoutAmount")
    },
    {
      label: $t("finance_report.numberOfPayments"),
      prop: "payoutNum",
      width: 80
    },
    {
      label: $t("finance_report.amountIssued"),
      prop: "settlementUAmount",
      cellRenderer: amountRender("settlementUAmount")
    },
    {
      label: $t("finance_report.numberOfPensIssued"),
      prop: "settlementUNum",
      width: 80
    },
    {
      label: $t("finance_report.merchantNumberFrozen"),
      prop: "frozenAmount",
      cellRenderer: amountRender("frozenAmount")
    },
    {
      label: $t("finance_report.systemBalanceEndTime"),
      prop: "endingSystemBalance",
      cellRenderer: amountRender("endingSystemBalance")
    },
    {
      label: $t("finance_report.threePartyBalanceEndTime"),
      prop: "endingChannelBalance",
      cellRenderer: amountRender("endingChannelBalance")
    },
    {
      label: $t("finance_report.difference"),
      prop: "endingBalanceDiff",
      cellRenderer: amountRender("endingBalanceDiff")
    },
    { label: $t("finance_report.remark"), prop: "note", slot: "note" }
  ];

  // 班別 → 時段參數轉換
  function shiftConverter(params: Record<string, any>) {
    if (params.shift === 1) {
      params.reportHourStart = 8;
      params.reportHourEnd = 15;
    } else if (params.shift === 2) {
      params.reportHourStart = 16;
      params.reportHourEnd = 23;
    } else if (params.shift === 3) {
      params.reportHourStart = 0;
      params.reportHourEnd = 7;
    }
    return params;
  }

  async function onSearch() {
    loading.value = true;
    try {
      const date = dayjs(reportDate.value).format("YYYY-MM-DD");
      searchForm.reportDateStart = date;
      searchForm.reportDateEnd = date;
      const params = shiftConverter({ ...searchForm });
      const { data } = await getHourReconciliationList(params);
      // 後端回傳 list 為以時段名稱為 key 的物件
      const grouped = (data?.list ?? {}) as Record<string, ShiftTable>;
      shiftTables.value = Object.keys(grouped).map(key => ({
        title: key,
        list: grouped[key]?.list ?? []
      }));
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    reportDate.value = dayjs().format("YYYY-MM-DD");
    searchForm.shift = getDefaultShift();
    searchForm.payChannelName = "";
    searchForm.payChannelSn = "";
    searchForm.balanceDiff = 0;
    searchForm.balanceChange = 0;
    onSearch();
  }

  // 備註即時儲存
  async function handleNote(row: ReconciliationRow) {
    const { success } = await setHourReconciliationNote({
      id: row.id || 0,
      note: row.note || ""
    });
    if (success) {
      message($t("finance_report.noteSaved"), { type: "success" });
    }
  }

  onMounted(async () => {
    const { data } = await getPayChannel4Report();
    payChannels.value = (data?.list ?? []).map((item: any) => ({
      label: item.name,
      value: item.id
    }));
    onSearch();
  });

  return {
    searchForm,
    reportDate,
    loading,
    columns,
    shiftTables,
    payChannels,
    shiftOptions,
    balanceDiffOptions,
    balanceChangeOptions,
    buildSummary,
    getSummaries,
    onSearch,
    resetForm,
    handleNote
  };
}
