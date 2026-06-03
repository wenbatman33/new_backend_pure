import { ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";
import { exportExcel } from "@/utils/report";
import { getAgencyWalletLogReport, AgencyWalletLogReportUrl } from "@/api/agency";
import type { WalletLogItem } from "./types";

// 出入款类型对应（depoWithType）
const depoWithTypeMap: Record<number, { text: string; color: string }> = {
  1: { text: $t("agency.walletLogIncrease"), color: "#00BB00" },
  2: { text: $t("agency.walletLogDecrease"), color: "#F00" }
};

// 调整用途对应（adjUseType）
const adjUseTypeMap: Record<number, string> = {
  1: $t("agency.walletLogAdjUse1"),
  2: $t("agency.walletLogAdjUse2"),
  6: $t("agency.walletLogAdjUse6"),
  7: $t("agency.walletLogAdjUse7"),
  9: $t("agency.walletLogAdjUse9"),
  10: $t("agency.walletLogAdjUse10"),
  14: $t("agency.walletLogAdjUse14"),
  16: $t("agency.walletLogAdjUse16"),
  17: $t("agency.walletLogAdjUse17"),
  18: $t("agency.walletLogAdjUse18"),
  51: $t("agency.walletLogAdjUse51"),
  52: $t("agency.walletLogAdjUse52"),
  53: $t("agency.walletLogAdjUse53")
};

export function useWalletLog() {
  const searchForm = reactive({
    agencyID: "",
    agencyAccount: "",
    exactlyMatching: 2,
    startTime: dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
    endTime: dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss"),
    depoWithType: 0,
    adjUseType: 0
  });

  const dataList = ref<WalletLogItem[]>([]);
  const loading = ref(true);
  const totalAdjustMoney = ref<number | string>(0);

  const pagination = reactive({
    total: 0,
    pageSize: 20,
    currentPage: 1,
    background: true
  });

  // 出入款类型下拉
  const depoWithTypeOptions = [
    { label: $t("agency.walletLogAll"), value: 0 },
    { label: $t("agency.walletLogIncrease"), value: 1 },
    { label: $t("agency.walletLogDecrease"), value: 2 }
  ];

  // 调整用途下拉
  const adjUseTypeOptions = [
    { label: $t("agency.walletLogAll"), value: 0 },
    { label: $t("agency.walletLogAdjUse1"), value: 1 },
    { label: $t("agency.walletLogAdjUse2"), value: 2 },
    { label: $t("agency.walletLogAdjUse6"), value: 6 },
    { label: $t("agency.walletLogAdjUse7"), value: 7 },
    { label: $t("agency.walletLogAdjUse9"), value: 9 },
    { label: $t("agency.walletLogAdjUse10"), value: 10 },
    { label: $t("agency.walletLogAdjUse14"), value: 14 },
    { label: $t("agency.walletLogAdjUse16"), value: 16 },
    { label: $t("agency.walletLogAdjUse17"), value: 17 },
    { label: $t("agency.walletLogAdjUse18"), value: 18 },
    { label: $t("agency.walletLogAdjUse51"), value: 51 },
    { label: $t("agency.walletLogAdjUse52"), value: 52 },
    { label: $t("agency.walletLogAdjUse53"), value: 53 }
  ];

  // 完全符合 / 模糊
  const exactlyMatchingOptions = [
    { label: $t("agency.walletLogExactMatch"), value: 1 },
    { label: $t("agency.walletLogFuzzyMatch"), value: 2 }
  ];

  const columns: TableColumnList = [
    { label: $t("agency.walletLogColDate"), prop: "date", width: 160 },
    { label: "ID", prop: "agencyID", width: 80 },
    { label: $t("agency.walletLogColAccount"), prop: "agencyAccount", width: 120 },
    {
      label: $t("agency.walletLogColType"),
      prop: "depoWithType",
      width: 100,
      cellRenderer: ({ row }) => {
        const m = depoWithTypeMap[row.depoWithType as number];
        return m ? <span style={{ color: m.color }}>{m.text}</span> : <span>-</span>;
      }
    },
    {
      label: $t("agency.walletLogColUse"),
      prop: "adjUseType",
      width: 120,
      cellRenderer: ({ row }) => (
        <span>{adjUseTypeMap[row.adjUseType as number] ?? "-"}</span>
      )
    },
    {
      label: $t("agency.walletLogColAdjustMoney"),
      prop: "adjustMoney",
      width: 120,
      align: "right",
      cellRenderer: ({ row }) => {
        const text = commaDecimalFormat(row.adjustMoney as number, 2);
        return Number(row.adjustMoney) < 0 ? (
          <span style={{ color: "#F00" }}>{text}</span>
        ) : (
          <span>{text}</span>
        );
      }
    },
    {
      label: $t("agency.walletLogColAfterMoney"),
      prop: "afterMoney",
      width: 120,
      align: "right",
      cellRenderer: ({ row }) => (
        <span>{commaDecimalFormat(row.afterMoney as number, 2)}</span>
      )
    },
    { label: $t("agency.walletLogColRemark"), prop: "remark", minWidth: 200 }
  ];

  // 表格底部合计行
  function summaryMethod() {
    return [
      $t("agency.walletLogTotal"),
      "-",
      "-",
      "-",
      "-",
      commaDecimalFormat(totalAdjustMoney.value as number, 2),
      "-",
      "-"
    ];
  }

  function buildParams() {
    return {
      agencyID: searchForm.agencyID,
      agencyAccount: searchForm.agencyAccount,
      exactlyMatching: searchForm.exactlyMatching,
      startTime: searchForm.startTime,
      endTime: searchForm.endTime,
      depoWithType: searchForm.depoWithType,
      adjUseType: searchForm.adjUseType,
      page: pagination.currentPage,
      pageSize: pagination.pageSize
    };
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getAgencyWalletLogReport(buildParams());
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
      totalAdjustMoney.value = data?.totalAdjustMoney ?? 0;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.startTime = dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss");
    searchForm.endTime = dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss");
    pagination.currentPage = 1;
    onSearch();
  }

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  // 汇出 Excel（沿用旧 endpoint）
  function handleExport() {
    exportExcel(AgencyWalletLogReportUrl, buildParams(), "AgencyWalletLog.csv");
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    depoWithTypeOptions,
    adjUseTypeOptions,
    exactlyMatchingOptions,
    loading,
    columns,
    dataList,
    pagination,
    summaryMethod,
    onSearch,
    resetForm,
    handleSizeChange,
    handleCurrentChange,
    handleExport
  };
}
