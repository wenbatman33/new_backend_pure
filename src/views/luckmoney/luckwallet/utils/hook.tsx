import { h, ref, reactive, onMounted, computed } from "vue";
import dayjs from "dayjs";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";
import {
  getOperationReport,
  getSettlementPeopleList
} from "@/api/luckmoney";
import type { OperationReportItem, SearchFormProps } from "./types";
import settlementPeopleTable from "../components/settlementPeopleTable.vue";

/** 数值渲染：空值显示 "-"，否则千分位 */
function fmt(text: any, decimal = 0) {
  return text === "" || text === undefined || text === null
    ? "-"
    : commaDecimalFormat(Number(text), decimal);
}

/** 负值红字 */
function renderNumber(text: any, decimal = 0, suffix = "") {
  const str = fmt(text, decimal) + suffix;
  return Number(text) < 0 ? (
    <span style="color:#F00">{str}</span>
  ) : (
    <span>{str}</span>
  );
}

export function useLuckwallet() {
  const searchForm = reactive<SearchFormProps>({
    reportType: "d",
    reportDateStart: dayjs().startOf("month").format("YYYY-MM-DD HH:mm:ss"),
    reportDateEnd: dayjs().endOf("month").format("YYYY-MM-DD HH:mm:ss"),
    agencyAccount: "",
    queryMemberMoney: false
  });

  const loading = ref(true);
  const dataList = ref<OperationReportItem[]>([]);
  const totalData = ref<Partial<OperationReportItem>>({});
  const lastUpdatedAt = ref("");
  /** 实际套用查询时的 reportType（用于转出清单查询） */
  const appliedReportType = ref<"d" | "w" | "m">("d");

  const reportTypeOptions = [
    { label: $t("luckmoney.dailyReport"), value: "d" },
    { label: $t("luckmoney.weeklyReport"), value: "w" },
    { label: $t("luckmoney.monthlyReport"), value: "m" }
  ];

  const title = computed(
    () => `${$t("luckmoney.lastUpdate")}：${lastUpdatedAt.value || ""}`
  );

  const columns: TableColumnList = [
    {
      label: $t("luckmoney.date"),
      prop: "reportDate",
      width: 180,
      sortable: true
    },
    {
      label: $t("luckmoney.xinliMoneyFlow"),
      prop: "betAmount",
      align: "right",
      sortable: true,
      cellRenderer: ({ row }) => renderNumber(row.betAmount, 2)
    },
    {
      label: $t("luckmoney.companyProfit"),
      prop: "winAmount",
      align: "right",
      sortable: true,
      cellRenderer: ({ row }) => renderNumber(row.winAmount, 2)
    },
    {
      label: $t("luckmoney.killNumber"),
      prop: "killNum",
      align: "right",
      sortable: true,
      cellRenderer: ({ row }) => renderNumber(row.killNum, 2, "%")
    },
    {
      label: $t("luckmoney.xinliDistributionAmount"),
      prop: "totalBonus",
      align: "right",
      sortable: true,
      cellRenderer: ({ row }) => renderNumber(row.totalBonus)
    },
    {
      label: $t("luckmoney.discountAmount"),
      prop: "promotion",
      align: "right",
      sortable: true,
      cellRenderer: ({ row }) => renderNumber(row.promotion)
    },
    {
      label: $t("luckmoney.manualIncreaseAmount"),
      prop: "manual",
      align: "right",
      width: 160,
      sortable: true,
      cellRenderer: ({ row }) => renderNumber(row.manual)
    },
    {
      label: $t("luckmoney.centerWalletTransfer"),
      prop: "recharge",
      align: "right",
      sortable: true,
      cellRenderer: ({ row }) => renderNumber(row.recharge)
    },
    {
      label: $t("luckmoney.transferOutToCenterWallet"),
      prop: "settlement",
      align: "right",
      sortable: true,
      cellRenderer: ({ row }) => renderNumber(row.settlement)
    },
    {
      label: $t("luckmoney.transferOutPeople"),
      prop: "settlementPeople",
      align: "right",
      slot: "settlementPeople"
    },
    {
      label: $t("luckmoney.discountDistributedNorepeatPeople"),
      prop: "promotionPeople",
      align: "right",
      width: 170,
      sortable: true,
      cellRenderer: ({ row }) => renderNumber(row.promotionPeople)
    },
    {
      label: $t("luckmoney.useXinliPeople"),
      prop: "betPeople",
      align: "right",
      sortable: true,
      cellRenderer: ({ row }) => renderNumber(row.betPeople)
    },
    {
      label: $t("luckmoney.memberXinliMoney"),
      prop: "money",
      align: "right",
      sortable: true,
      cellRenderer: ({ row }) => renderNumber(row.money)
    }
  ];

  /** 合计行（pure-table show-summary 用） */
  function summaryMethod({ columns: cols }) {
    return cols.map((col, idx) => {
      if (idx === 0) return $t("luckmoney.total");
      const key = col.property;
      if (key && totalData.value[key] !== undefined) {
        return fmt(totalData.value[key]);
      }
      return "";
    });
  }

  /** 切换日期类型时，依类型对齐起讫时间 */
  function onReportTypeChange(val: "d" | "w" | "m") {
    const start = dayjs(searchForm.reportDateStart);
    const end = dayjs(searchForm.reportDateEnd);
    if (val === "w") {
      searchForm.reportDateStart = start
        .startOf("week")
        .format("YYYY-MM-DD HH:mm:ss");
      searchForm.reportDateEnd = end.endOf("week").format("YYYY-MM-DD HH:mm:ss");
    } else if (val === "m") {
      searchForm.reportDateStart = start
        .startOf("month")
        .format("YYYY-MM-DD HH:mm:ss");
      searchForm.reportDateEnd = end
        .endOf("month")
        .format("YYYY-MM-DD HH:mm:ss");
    }
  }

  async function onSearch() {
    loading.value = true;
    try {
      const params = {
        reportDateStart: searchForm.reportDateStart,
        reportDateEnd: searchForm.reportDateEnd,
        reportType: searchForm.reportType,
        agencyAccount: searchForm.agencyAccount,
        queryMemberMoney: searchForm.queryMemberMoney ? 1 : 0
      };
      const { data } = await getOperationReport(params);
      dataList.value = data?.list ?? [];
      totalData.value = data?.total ?? {};
      lastUpdatedAt.value = data?.updatedAt ?? "";
      appliedReportType.value = searchForm.reportType;
    } finally {
      loading.value = false;
    }
  }

  function resetForm() {
    searchForm.reportType = "d";
    searchForm.reportDateStart = dayjs()
      .startOf("month")
      .format("YYYY-MM-DD HH:mm:ss");
    searchForm.reportDateEnd = dayjs()
      .endOf("month")
      .format("YYYY-MM-DD HH:mm:ss");
    searchForm.agencyAccount = "";
    searchForm.queryMemberMoney = false;
    onSearch();
  }

  /** 点开转出清单 */
  function openSettlementPeople(row: OperationReportItem) {
    addDialog({
      title: $t("luckmoney.transferOutList"),
      width: "900px",
      draggable: true,
      hideFooter: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(settlementPeopleTable, {
          reportDate: row.qSettlementPeopleDate ?? row.reportDate,
          reportType: appliedReportType.value
        })
    });
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    reportTypeOptions,
    loading,
    columns,
    dataList,
    pagination: null,
    title,
    summaryMethod,
    onReportTypeChange,
    onSearch,
    resetForm,
    openSettlementPeople
  };
}

export { getSettlementPeopleList };
