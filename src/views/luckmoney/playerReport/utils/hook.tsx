import { ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { transformI18n as $t } from "@/plugins/i18n";
import { formatNumber } from "@/utils/number";
import {
  getReportWinner,
  lmGetGroups,
  type PlayerReportRow
} from "@/api/luckmoney";
import type { SearchFormProps } from "./types";

// 排序欄位對應後端 order 值
const sortMapping: Record<string, number> = {
  killNum: 1,
  betCnt: 2,
  betAmount: 3,
  profit: 4,
  agencyID: 6,
  withdraw: 8,
  bonus: 9,
  depositAmount: 10,
  withdrawalAmount: 11
};

// 判斷空物件
function isObjEmpty(obj: any) {
  if (!obj) return true;
  return Object.keys(obj).length === 0;
}

export function usePlayerReport() {
  const searchForm = reactive<SearchFormProps>({
    reportStart: dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
    reportEnd: dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss"),
    agencyID: "",
    promotionID: "",
    promotionFiltType: false,
    memberAccount: "",
    gameAccount: "",
    gameGroupIDs: []
  });

  // 日期區間用陣列綁定 el-date-picker（datetimerange）
  const dateRange = ref<[Date, Date] | null>([
    dayjs().startOf("day").toDate(),
    dayjs().endOf("day").toDate()
  ]);

  const dataList = ref<PlayerReportRow[]>([]);
  const loading = ref(true);
  const gameGroupList = ref<{ label: string; value: number }[]>([]);

  // 排序狀態
  const sortState = reactive<{ order: number | string; orderParam: number | string }>({
    order: "",
    orderParam: ""
  });

  const pagination = reactive({
    total: 0,
    pageSize: 20,
    currentPage: 1,
    background: true
  });

  // 金額渲染：千分位 + 負數紅字
  const amountRender = (text: any, red = false) => {
    const val = formatNumber(text, true);
    if (red && Number(text) <= 0) {
      return <span style="color: red">{val}</span>;
    }
    return <span>{val}</span>;
  };

  const columns: TableColumnList = [
    { label: $t("luckmoney.agencyId"), prop: "agencyID", width: 110, sortable: "custom" },
    { label: $t("luckmoney.memberId"), prop: "memberID", width: 110 },
    {
      label: $t("luckmoney.memberAccount"),
      prop: "memberAccount",
      width: 120,
      cellRenderer: ({ row }) => (
        <a
          href="#"
          style="color: #ff647c"
          onClick={(e: Event) => {
            e.preventDefault();
            window.open("/memberDetail/detail/" + row.memberID);
          }}
        >
          {row.memberAccount}
        </a>
      )
    },
    { label: $t("luckmoney.betNumber"), prop: "betCnt", width: 110, sortable: "custom" },
    {
      label: $t("luckmoney.betAmount"),
      prop: "betAmount",
      width: 150,
      align: "right",
      sortable: "custom",
      cellRenderer: ({ row }) => amountRender(row.betAmount)
    },
    {
      label: $t("luckmoney.killNumber"),
      prop: "killNum",
      width: 110,
      sortable: "custom",
      cellRenderer: ({ row }) => (
        <span style={Number(row.killNum) > 0 ? "" : "color: red"}>{row.killNum}%</span>
      )
    },
    {
      label: $t("luckmoney.companyProfit"),
      prop: "profit",
      width: 150,
      align: "right",
      sortable: "custom",
      cellRenderer: ({ row }) => amountRender(row.profit, true)
    },
    {
      label: $t("luckmoney.rechargeAmount"),
      prop: "deposit",
      width: 140,
      align: "right",
      cellRenderer: ({ row }) => amountRender(row.deposit)
    },
    {
      label: $t("luckmoney.withdrawalAmount"),
      prop: "withdraw",
      width: 140,
      align: "right",
      sortable: "custom",
      cellRenderer: ({ row }) => amountRender(row.withdraw)
    },
    {
      label: $t("luckmoney.receiveXinliMoney"),
      prop: "bonus",
      width: 140,
      align: "right",
      sortable: "custom",
      cellRenderer: ({ row }) => amountRender(row.bonus)
    },
    {
      label: $t("luckmoney.memberDepositAmount"),
      prop: "depositAmount",
      width: 150,
      align: "right",
      sortable: "custom",
      cellRenderer: ({ row }) => amountRender(row.depositAmount)
    },
    {
      label: $t("luckmoney.memberWithdrawalAmount"),
      prop: "withdrawalAmount",
      width: 160,
      align: "right",
      sortable: "custom",
      cellRenderer: ({ row }) => amountRender(row.withdrawalAmount)
    },
    {
      label: $t("luckmoney.eventName"),
      prop: "promotionList",
      width: 250,
      cellRenderer: ({ row }) => {
        if (isObjEmpty(row.promotionList)) return <span>-</span>;
        return (
          <div>
            {Object.values(row.promotionList).map((item: any) => (
              <div>{`${item.id},${item.name}`}</div>
            ))}
          </div>
        );
      }
    }
  ];

  // 同步日期區間到搜尋表單
  function syncDateRange() {
    if (dateRange.value && dateRange.value.length === 2) {
      searchForm.reportStart = dayjs(dateRange.value[0]).format("YYYY-MM-DD HH:mm:ss");
      searchForm.reportEnd = dayjs(dateRange.value[1]).format("YYYY-MM-DD HH:mm:ss");
    }
  }

  // 組合查詢參數（過濾空值）
  function buildParams(extra: Record<string, any> = {}) {
    syncDateRange();
    const source: Record<string, any> = {
      reportStart: searchForm.reportStart,
      reportEnd: searchForm.reportEnd,
      agencyID: searchForm.agencyID,
      promotionID: searchForm.promotionID,
      promotionFiltType: searchForm.promotionFiltType ? 2 : 1,
      memberAccount: searchForm.memberAccount,
      gameAccount: searchForm.gameAccount
    };
    const params: Record<string, any> = {};
    for (const key in source) {
      if (source[key] !== undefined && source[key] !== "") {
        params[key] = source[key];
      }
    }
    if (searchForm.gameGroupIDs && searchForm.gameGroupIDs.length) {
      params.gameGroupIDs = [...searchForm.gameGroupIDs].join(",");
    }
    if (sortState.orderParam) {
      params.order = sortState.order;
      params.orderParam = sortState.orderParam;
    }
    return { ...params, ...extra };
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getReportWinner(buildParams());
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  // 表頭排序變更
  function onSortChange({ prop, order }: { prop: string; order: string | null }) {
    const mapped = sortMapping[prop];
    if (mapped === undefined) return;
    if (sortState.order === mapped) {
      if (order === "ascending") sortState.orderParam = 1;
      else if (order === "descending") sortState.orderParam = 2;
      else sortState.orderParam = "";
    } else {
      sortState.order = mapped;
      sortState.orderParam = order === "descending" ? 2 : 1;
    }
    onSearch();
  }

  function resetForm() {
    searchForm.agencyID = "";
    searchForm.promotionID = "";
    searchForm.promotionFiltType = false;
    searchForm.memberAccount = "";
    searchForm.gameAccount = "";
    searchForm.gameGroupIDs = [];
    dateRange.value = [
      dayjs().startOf("day").toDate(),
      dayjs().endOf("day").toDate()
    ];
    sortState.order = "";
    sortState.orderParam = "";
    onSearch();
  }

  // 匯出（取全部資料）
  async function handleExport() {
    const { data } = await getReportWinner(buildParams({ all: 1 }));
    const list = (data?.list ?? []).map((item: any) => {
      const names: string[] = [];
      Object.values(item.promotionList || {}).forEach((p: any) => {
        names.push(`${p.id},${p.name}`);
      });
      return { ...item, promotionList: names.join("|") };
    });
    // TODO: 舊碼用 @/components/Excel 的 jsonToSheetXlsx（pure 未移植）。
    // 此處改用瀏覽器原生方式輸出 CSV，避免引入未移植元件。
    if (!list.length) return;
    const headers = Object.keys(list[0]);
    const rows = list.map((r: any) =>
      headers.map(h => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "新币玩家报表.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function loadGameGroups() {
    const { data } = await lmGetGroups();
    gameGroupList.value = (data?.list ?? []).map((item: any) => ({
      label: item.name,
      value: item.ID
    }));
  }

  onMounted(() => {
    loadGameGroups();
    onSearch();
  });

  return {
    searchForm,
    dateRange,
    loading,
    columns,
    dataList,
    pagination,
    gameGroupList,
    onSearch,
    onSortChange,
    resetForm,
    handleExport
  };
}
