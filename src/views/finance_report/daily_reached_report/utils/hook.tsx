import { ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import {
  getChannelDepositReport,
  getSearchCheckbox,
  getServiceDropdown
} from "@/api/finance_report";
import type { OptionItem, SearchFormProps } from "./types";

// 0~23 時段下拉
const hoursOption: OptionItem[] = Array.from({ length: 24 }, (_, i) => {
  const v = String(i).padStart(2, "0");
  return { value: v, label: v };
});

export function useDailyReachedReport() {
  const today = dayjs().format("YYYY-MM-DD");

  const searchForm = reactive<SearchFormProps>({
    reportDateStart: today,
    reportHourStart: "00",
    reportDateEnd: today,
    reportHourEnd: "00",
    payChannelServiceID: "",
    serviceCode: ""
  });

  const loading = ref(false);
  const dataList = ref<any[]>([]);
  const updatedAt = ref("");

  // 動態欄位（依後端回傳的線路產生分組欄位）
  const columns = ref<TableColumnList>([]);
  // 線路下拉
  const serviceCodeOptions = ref<OptionItem[]>([
    { label: $t("finance_report.all"), value: "" }
  ]);
  // 商戶號（線路 id）下拉
  const payChannelOptions = ref<OptionItem[]>([]);

  // 分頁（報表單頁顯示全部）
  const pagination = reactive({
    total: 0,
    pageSize: 9999,
    currentPage: 1,
    background: true,
    hideOnSinglePage: true
  });

  // 依線路清單組裝動態欄位
  function buildColumns(channelList: string[]) {
    const base: TableColumnList = [
      { label: $t("finance_report.date"), prop: "date", width: 120 },
      { label: $t("finance_report.hours"), prop: "time", width: 90 }
    ];
    const dynamic: TableColumnList = channelList.map(name => ({
      label: name,
      headerAlign: "center",
      children: [
        { label: $t("finance_report.totalAmount"), prop: `${name}_amount`, minWidth: 110 },
        { label: $t("finance_report.piecesOf"), prop: `${name}_count`, minWidth: 90 }
      ]
    }));
    columns.value = [...base, ...dynamic];
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getChannelDepositReport({
        reportDateStart: dayjs(searchForm.reportDateStart).format("YYYY-MM-DD"),
        reportDateEnd: dayjs(searchForm.reportDateEnd).format("YYYY-MM-DD"),
        reportHourStart: searchForm.reportHourStart,
        reportHourEnd: searchForm.reportHourEnd,
        payChannelServiceID: searchForm.payChannelServiceID,
        serviceCode: searchForm.serviceCode
      });

      // 線路清單（含 TOTAL）
      const channelObject = data?.channels || {};
      let channelList: string[] = [];
      channelList = channelList.concat(Object.values(channelObject) as string[]);
      channelList = channelList.concat("TOTAL");
      buildColumns(channelList);

      // 列資料：把金額/筆數做千分位
      const reportObject = data?.list || {};
      const reportList: any[] = Object.values(reportObject);
      reportList.forEach(report => {
        channelList.forEach(channelName => {
          const amount = Number(report[`${channelName}_amount`]) || 0;
          const count = Number(report[`${channelName}_count`]) || 0;
          report[`${channelName}_amount`] = amount.toLocaleString();
          report[`${channelName}_count`] = count.toLocaleString();
        });
      });

      dataList.value = reportList;
      pagination.total = reportList.length;
      updatedAt.value = data?.updatedAt || "";
    } finally {
      loading.value = false;
    }
  }

  // 手動更新（重新拉取）
  function manualUpdate() {
    onSearch();
  }

  // 匯出 CSV（client 端，依目前表格資料）
  function handleExport() {
    if (!dataList.value.length) {
      message($t("finance_report.noData"), { type: "warning" });
      return;
    }
    const flatCols: { label: string; prop: string }[] = [];
    columns.value.forEach((col: any) => {
      if (col.children?.length) {
        col.children.forEach((c: any) =>
          flatCols.push({ label: `${col.label}-${c.label}`, prop: c.prop })
        );
      } else if (col.prop) {
        flatCols.push({ label: col.label, prop: col.prop });
      }
    });
    const header = flatCols.map(c => c.label).join(",");
    const rows = dataList.value.map(row =>
      flatCols
        .map(c => `"${String(row[c.prop] ?? "").replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = "﻿" + [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${$t("finance_report.menuDailyReachedReport")}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  // 載入下拉資料
  async function loadDropdowns() {
    try {
      const { data } = await getServiceDropdown();
      const serviceCode = (data?.serviceCode || []) as Record<string, string>[];
      serviceCodeOptions.value = [
        { label: $t("finance_report.all"), value: "" },
        ...serviceCode.map(element => {
          const key = Object.keys(element)[0];
          return { label: `${element[key]}`, value: `${key}` };
        })
      ];
    } catch {
      // 下拉失敗不阻塞頁面
    }
    try {
      const { data } = await getSearchCheckbox();
      payChannelOptions.value = (data?.list || []).map((item: any) => ({
        label: item.name,
        value: item.id
      }));
    } catch {
      // 略
    }
  }

  onMounted(async () => {
    await loadDropdowns();
    onSearch();
  });

  return {
    searchForm,
    loading,
    columns,
    dataList,
    pagination,
    updatedAt,
    hoursOption,
    serviceCodeOptions,
    payChannelOptions,
    onSearch,
    manualUpdate,
    handleExport
  };
}
