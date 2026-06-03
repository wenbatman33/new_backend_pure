import { ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { ElInput } from "element-plus";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";
import {
  getDayReconciliationList,
  setDayReconciliationNote,
  getReportPayChannelOptions,
  type DayReconciliationItem
} from "@/api/finance_report";

export function useDayReconciliation() {
  const searchForm = reactive({
    // 報表日期（單日，起訖相同）
    reportDate: dayjs().format("YYYY-MM-DD"),
    payChannelName: "",
    payChannelSn: "",
    balanceDiff: 0, // 是否有差異：0 全部 / 1 有 / 2 無
    balanceChange: 0 // 是否有異常異動：0 全部 / 1 代收 / 2 代付 / 3 已發金額不為0
  });

  const dataList = ref<DayReconciliationItem[]>([]);
  const loading = ref(true);
  // 商戶號下拉選項（來自 /backend/pay/pay_channel/4report）
  const payChannelOptions = ref<{ label: string; value: string | number }[]>(
    []
  );
  // 統計合計（後端回傳的 total* 欄位）
  const totalData = reactive<Record<string, any>>({});

  // 差異/異動下拉選項
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

  // 金額格式化欄位通用渲染
  const moneyRender = (prop: keyof DayReconciliationItem) => ({ row }) =>
    commaDecimalFormat(row[prop] as number, 2);

  const columns: TableColumnList = [
    { label: $t("finance_report.merchantNumber"), prop: "payChannelSn" },
    { label: $t("finance_report.businessName"), prop: "payChannelName" },
    { label: $t("finance_report.paymentMethod"), prop: "serviceName" },
    { label: "serviceCode", prop: "serviceCode" },
    {
      label: $t("finance_report.systemBalanceStartingTime"),
      prop: "startingSystemBalance",
      cellRenderer: moneyRender("startingSystemBalance")
    },
    {
      label: $t("finance_report.collectionAmount"),
      prop: "depositAmount",
      cellRenderer: moneyRender("depositAmount")
    },
    {
      label: $t("finance_report.paymentAmount"),
      prop: "payoutAmount",
      cellRenderer: moneyRender("payoutAmount")
    },
    {
      label: $t("finance_report.numberOfPayments"),
      prop: "payoutNum",
      width: 90
    },
    {
      label: $t("finance_report.amountIssued"),
      prop: "settlementUAmount",
      cellRenderer: moneyRender("settlementUAmount")
    },
    {
      label: $t("finance_report.numberOfPensIssued"),
      prop: "settlementUNum",
      width: 90
    },
    {
      label: $t("finance_report.merchantNumberFrozen"),
      prop: "frozenAmount",
      cellRenderer: moneyRender("frozenAmount")
    },
    {
      label: $t("finance_report.systemBalanceEndTime"),
      prop: "endingSystemBalance",
      cellRenderer: moneyRender("endingSystemBalance")
    },
    {
      label: $t("finance_report.threePartyBalanceEndTime"),
      prop: "endingChannelBalance",
      cellRenderer: moneyRender("endingChannelBalance")
    },
    {
      label: $t("finance_report.difference"),
      prop: "endingBalanceDiff",
      // 差異為負數時標紅
      cellRenderer: ({ row }) => {
        const v = row.endingBalanceDiff as number;
        const txt = commaDecimalFormat(v, 2);
        return v < 0 ? <span style="color:#F56C6C">{txt}</span> : <span>{txt}</span>;
      }
    },
    {
      label: $t("finance_report.remark"),
      prop: "note",
      width: 180,
      // 備註可直接編輯，失焦時送出
      cellRenderer: ({ row }) => (
        <ElInput
          v-model={row.note}
          size="small"
          placeholder={$t("finance_report.remark")}
          onChange={(val: string) => handleNote(row, val)}
        />
      )
    }
  ];

  // 合計列：對應後端 total* 欄位
  function summaryMethod({ columns: cols }) {
    return cols.map((col, index) => {
      if (index === 0) return $t("finance_report.total");
      const map: Record<string, string> = {
        startingSystemBalance: "totalStartingSystemBalance",
        depositAmount: "totalDepositAmount",
        payoutAmount: "totalPayoutAmount",
        payoutNum: "totalPayoutNum",
        settlementUAmount: "totalSettlementUAmount",
        settlementUNum: "totalSettlementNum",
        frozenAmount: "totalFrozenAmount",
        endingSystemBalance: "totalEndingSystemBalance",
        endingChannelBalance: "totalEndingChannelBalance",
        endingBalanceDiff: "totalEndingBalanceDiff"
      };
      const key = map[col.property];
      if (!key) return "";
      const val = totalData[key];
      if (val === undefined || val === null) return "";
      // 筆數類不格式化小數
      return col.property === "payoutNum" || col.property === "settlementUNum"
        ? val
        : commaDecimalFormat(val, 2);
    });
  }

  async function onSearch() {
    loading.value = true;
    try {
      const day = searchForm.reportDate
        ? dayjs(searchForm.reportDate).format("YYYY-MM-DD")
        : dayjs().format("YYYY-MM-DD");
      const { data } = await getDayReconciliationList({
        reportDateStart: day,
        reportDateEnd: day,
        payChannelName: searchForm.payChannelName,
        payChannelSn: searchForm.payChannelSn,
        balanceDiff: searchForm.balanceDiff,
        balanceChange: searchForm.balanceChange
      });
      dataList.value = data?.list ?? [];
      // 將後端 total* 欄位存入合計列
      Object.keys(data ?? {}).forEach(k => {
        if (k !== "list" && k !== "count" && k !== "updatedAt") {
          totalData[k] = (data as any)[k];
        }
      });
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.reportDate = dayjs().format("YYYY-MM-DD");
    searchForm.payChannelName = "";
    searchForm.payChannelSn = "";
    searchForm.balanceDiff = 0;
    searchForm.balanceChange = 0;
    onSearch();
  }

  // 變更備註
  async function handleNote(row: DayReconciliationItem, val: string) {
    const { success } = await setDayReconciliationNote({
      id: row.id ?? 0,
      note: val ?? ""
    });
    if (success) {
      message($t("finance_report.remark"), { type: "success" });
    }
  }

  // 載入商戶號下拉
  async function loadPayChannelOptions() {
    const { data } = await getReportPayChannelOptions();
    payChannelOptions.value = (data?.list ?? []).map((item: any) => ({
      label: item.name,
      value: item.id
    }));
  }

  onMounted(() => {
    loadPayChannelOptions();
    onSearch();
  });

  return {
    searchForm,
    loading,
    columns,
    dataList,
    payChannelOptions,
    balanceDiffOptions,
    balanceChangeOptions,
    summaryMethod,
    onSearch,
    resetForm
  };
}
