import { h, ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { exportExcel } from "@/utils/report";
import detailView from "../detail.vue";
import {
  getPageLogView,
  getBannerOptions,
  type BannerClickListResult
} from "@/api/report";
import type { BannerClickRow } from "./types";

export function useBannerClick() {
  const searchForm = reactive<{
    bannerTitle: string;
    bannerID: string;
    date: [string, string] | [];
  }>({
    bannerTitle: "",
    bannerID: "",
    date: []
  });

  const dataList = ref<BannerClickRow[]>([]);
  const summary = ref<Record<string, any>>({});
  const loading = ref(true);
  // 最後一次送出的查詢條件（供匯出使用）
  const lastParams = ref<Record<string, any>>({});
  // 廣告名稱下拉選項
  const bannerOptions = ref<{ label: string; value: string }[]>([]);

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  // 是否帶了廣告查詢條件（帶了就沒有「詳細」按鈕，因已是細項）
  function hasBannerFilter() {
    return !!(searchForm.bannerID || searchForm.bannerTitle);
  }

  const columns: TableColumnList = [
    { label: $t("report.date"), prop: "date" },
    { label: $t("report.clickTotal"), prop: "clickTotal" },
    { label: $t("report.clickGuest"), prop: "clickGuest" },
    { label: $t("report.clickMember"), prop: "clickMember" },
    { label: $t("report.countMember"), prop: "countMember" },
    {
      label: $t("report.operate"),
      fixed: "right",
      width: 140,
      slot: "operation"
    }
  ];

  // pure-table 合計列
  function getSummaries({ columns: cols }) {
    return cols.map((col, idx) => {
      if (idx === 0) return $t("report.total");
      return summary.value?.[col.property] ?? "";
    });
  }

  function buildParams() {
    const params: Record<string, any> = {};
    if (searchForm.bannerTitle) params.bannerTitle = searchForm.bannerTitle;
    if (searchForm.bannerID) params.bannerID = searchForm.bannerID;
    if (searchForm.date && searchForm.date.length === 2) {
      params.startDate = dayjs(searchForm.date[0]).format("YYYY-MM-DD");
      params.endDate = dayjs(searchForm.date[1]).format("YYYY-MM-DD");
    }
    return params;
  }

  async function onSearch() {
    loading.value = true;
    try {
      const params = buildParams();
      lastParams.value = params;
      const { data } = await getPageLogView(params);
      dataList.value = data?.list ?? [];
      summary.value = data?.summary ?? {};
      pagination.total = data?.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.date = [];
    onSearch();
  }

  async function loadBannerOptions() {
    try {
      const { data } = await getBannerOptions();
      const list = data?.list ?? [];
      bannerOptions.value = list.map((v: any) => ({
        label: v.title,
        value: v.title
      }));
    } catch {
      bannerOptions.value = [];
    }
  }

  // 開啟單日詳細記錄對話框
  function openDetail(row: BannerClickRow) {
    addDialog({
      title: $t("report.detail"),
      width: "80%",
      draggable: true,
      hideFooter: true,
      contentRenderer: () => h(detailView, { date: row.date })
    });
  }

  function handleExport() {
    exportExcel("/backend/report/page/log/view/export", lastParams.value);
  }

  onMounted(() => {
    loadBannerOptions();
    onSearch();
  });

  return {
    searchForm,
    bannerOptions,
    loading,
    columns,
    dataList,
    pagination,
    getSummaries,
    hasBannerFilter,
    onSearch,
    resetForm,
    openDetail,
    handleExport
  };
}

export type { BannerClickListResult };
