import { ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";
import { getRegistList, type RegistListResult } from "@/api/member";
import type { RegistItem } from "./types";

export function useRegistList() {
  // 預設起訖日期皆為今日
  const today = dayjs().format("YYYY-MM-DD");
  const searchForm = reactive({
    start: today,
    end: today
  });

  const dataList = ref<RegistItem[]>([]);
  const loading = ref(true);

  const columns: TableColumnList = [
    { label: $t("member.memberID"), prop: "memberID" },
    { label: $t("member.memberAccount"), prop: "account" },
    { label: $t("member.currency"), prop: "currency" },
    {
      label: $t("member.money2"),
      prop: "money",
      cellRenderer: ({ row }) => {
        try {
          return <span>{commaDecimalFormat(row.money, 2)}</span>;
        } catch (e) {
          return <span>{row.money}</span>;
        }
      }
    },
    { label: $t("member.phone"), prop: "phone" },
    { label: $t("member.email"), prop: "email" },
    { label: $t("member.previousAgencyID"), prop: "agencyID" },
    { label: $t("member.createdAt"), prop: "createdAt" },
    { label: $t("member.lastLoginAt"), prop: "lastLoginAt" }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getRegistList({
        start: searchForm.start,
        end: searchForm.end
      });
      dataList.value = (data?.list ?? []) as RegistItem[];
    } finally {
      loading.value = false;
    }
  }

  // 日期區間變更（[start, end] 兩個 YYYY-MM-DD 字串）
  function onDateChange(val: [string, string] | null) {
    if (val && val.length === 2) {
      searchForm.start = val[0];
      searchForm.end = val[1];
    } else {
      searchForm.start = "";
      searchForm.end = "";
    }
  }

  // 匯出目前表格資料為 CSV（pure 專案未內建 xlsx，改以 CSV 下載）
  function handleExport() {
    if (!dataList.value.length) {
      message($t("member.exportNoData"), { type: "warning" });
      return;
    }
    const headers = columns.map(c => c.label as string);
    const keys = columns.map(c => c.prop as string);
    const rows = dataList.value.map(row =>
      keys
        .map(k => {
          const v = (row as Record<string, any>)[k];
          const s = v == null ? "" : String(v);
          // CSV 轉義：含逗號/引號/換行則加引號
          return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
        })
        .join(",")
    );
    const csv = "﻿" + [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "MemberRegistList.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    loading,
    columns,
    dataList,
    onSearch,
    onDateChange,
    handleExport
  };
}
