import { ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { ElInput } from "element-plus";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import { exportExcel } from "@/utils/report";
import {
  getChannelSingleChannelDepositReport,
  putChannelSingleChannelDepositNote,
  getSearchCheckbox,
  type SingleReachedReportItem
} from "@/api/finance_report";
import type { SearchFormProps } from "./types";

// 0~23 時段下拉選項
const hoursOption = Array.from({ length: 24 }, (_, i) =>
  String(i).padStart(2, "0")
).map(i => ({ value: i, label: i }));

export function useSingleReachedReport() {
  const searchForm = reactive<SearchFormProps>({
    reportDateStart: dayjs().format("YYYY-MM-DD"),
    reportDateEnd: dayjs().format("YYYY-MM-DD"),
    reportHourStart: "00",
    reportHourEnd: "00",
    payChannelServiceID: 0
  });

  const dataList = ref<SingleReachedReportItem[]>([]);
  const loading = ref(true);
  // 線路下拉選項（含全部）
  const channelOptions = ref<Array<{ label: string; value: number }>>([
    { label: $t("finance_report.all"), value: 0 }
  ]);

  // 統計資訊
  const stat = reactive({
    updatedAt: "",
    totalAmount: 0,
    totalDepositNum: 0
  });

  // 備註儲存格編輯：失焦時送出
  function handleNoteBlur(row: SingleReachedReportItem) {
    putChannelSingleChannelDepositNote({
      id: String(row.id ?? ""),
      note: row.note ?? ""
    });
  }

  const columns: TableColumnList = [
    { label: $t("finance_report.date"), prop: "reportDate", width: 120 },
    {
      label: $t("finance_report.hours"),
      prop: "reportHour",
      width: 100,
      headerRenderer: () => (
        <span>
          {$t("finance_report.hours")}
          <span style="margin-left:4px;color:var(--el-text-color-secondary)">
            ({$t("finance_report.reportHourTitleHelp")})
          </span>
        </span>
      )
    },
    {
      label: $t("finance_report.totalAmount"),
      prop: "amount",
      width: 140,
      cellRenderer: ({ row }) => (
        <span>{Number(row.amount || 0).toLocaleString()}</span>
      )
    },
    {
      label: $t("finance_report.piecesOf"),
      prop: "depositNum",
      cellRenderer: ({ row }) => (
        <span>{Number(row.depositNum || 0).toLocaleString()}</span>
      )
    },
    {
      label: $t("finance_report.remark"),
      prop: "note",
      cellRenderer: ({ row }) => (
        <ElInput
          v-model={row.note}
          size="small"
          onBlur={() => handleNoteBlur(row)}
        />
      )
    }
  ];

  // 合計列（pure-table summary 用）
  function getSummaries() {
    return [
      $t("finance_report.total"),
      "-",
      stat.totalAmount?.toLocaleString() || 0,
      stat.totalDepositNum?.toLocaleString() || 0,
      "-"
    ];
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getChannelSingleChannelDepositReport({
        reportDateStart: dayjs(searchForm.reportDateStart).format("YYYY-MM-DD"),
        reportDateEnd: dayjs(searchForm.reportDateEnd).format("YYYY-MM-DD"),
        reportHourStart: searchForm.reportHourStart,
        reportHourEnd: searchForm.reportHourEnd,
        payChannelServiceID: searchForm.payChannelServiceID
      });
      dataList.value = data?.list ?? [];
      stat.totalAmount = data?.totalAmount ?? 0;
      stat.totalDepositNum = data?.totalDepositNum ?? 0;
      stat.updatedAt = data?.updatedAt ?? "";
    } finally {
      loading.value = false;
    }
  }

  // 載入線路搜尋下拉
  async function loadChannelOptions() {
    const { data } = await getSearchCheckbox();
    const opts = (data?.list ?? []).map(item => ({
      label: item.name,
      value: item.id
    }));
    channelOptions.value = [
      { label: $t("finance_report.all"), value: 0 },
      ...opts
    ];
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.reportDateStart = dayjs().format("YYYY-MM-DD");
    searchForm.reportDateEnd = dayjs().format("YYYY-MM-DD");
    searchForm.reportHourStart = "00";
    searchForm.reportHourEnd = "00";
    searchForm.payChannelServiceID = 0;
    onSearch();
  }

  // 匯出 Excel（沿用舊 endpoint 帶查詢條件導出）
  function handleExport() {
    exportExcel(
      "/backend/report/channel/single_channel_deposit",
      {
        reportDateStart: dayjs(searchForm.reportDateStart).format("YYYY-MM-DD"),
        reportDateEnd: dayjs(searchForm.reportDateEnd).format("YYYY-MM-DD"),
        reportHourStart: searchForm.reportHourStart,
        reportHourEnd: searchForm.reportHourEnd,
        payChannelServiceID: searchForm.payChannelServiceID
      },
      `${$t("finance_report.singleLineDepositForm")}.xlsx`
    );
    message($t("finance_report.exportexcel"), { type: "success" });
  }

  onMounted(async () => {
    await loadChannelOptions();
    onSearch();
  });

  return {
    searchForm,
    hoursOption,
    channelOptions,
    loading,
    columns,
    dataList,
    stat,
    getSummaries,
    onSearch,
    resetForm,
    handleExport
  };
}
