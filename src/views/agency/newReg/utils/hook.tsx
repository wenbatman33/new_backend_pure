import { h, ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";
import {
  getAgencyNewRegList,
  type AgencyNewRegRow,
  type AgencyNewRegListResult
} from "@/api/agency";
import detailDialog from "../detail.vue";
import type { SearchFormProps } from "./types";

// 負數顯示紅色
function renderNegative(text: any) {
  const n = Number(text);
  const str = isNaN(n) ? text : n.toLocaleString();
  return n < 0
    ? h("span", { style: "color:#F0453A" }, str)
    : h("span", null, str);
}

export function useAgencyNewReg() {
  const searchForm = reactive<SearchFormProps>({
    agencyID: "",
    agencyAccount: "",
    giveOffer: 3,
    startTime: dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
    endTime: dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss"),
    getChildAgencyData: false
  });
  // 日期區間（el-date-picker 綁定用，雙向同步 startTime/endTime）
  const dateRange = ref<[Date, Date]>([
    dayjs().startOf("day").toDate(),
    dayjs().endOf("day").toDate()
  ]);

  const dataList = ref<AgencyNewRegRow[]>([]);
  // 合計列
  const summaryRow = ref<Record<string, any>>({});
  const loading = ref(true);
  // 主頁最後一次查詢參數（供明細彈窗沿用）
  const lastParams = ref<Record<string, any>>({});
  const searchDate = ref("");

  const giveOfferOptions = [
    { label: $t("agency.giveOfferAll"), value: 3 },
    { label: $t("agency.giveOfferYes"), value: 1 },
    { label: $t("agency.giveOfferNo"), value: 2 }
  ];

  const moneyRender = (prop: string) => ({ row }) =>
    h("span", null, commaDecimalFormat(row[prop]));

  // 可點擊鑽取的數字欄
  const linkRender = (prop: string, type: number) => ({ row }) =>
    h(
      "a",
      {
        href: "#",
        style: "color:var(--el-color-primary)",
        onClick: (e: Event) => {
          e.preventDefault();
          openDetail(row, type);
        }
      },
      String(row[prop] ?? "")
    );

  const columns: TableColumnList = [
    { label: $t("agency.agencyID"), prop: "agencyID" },
    { label: $t("agency.agencyAccount"), prop: "agencyAccount" },
    {
      label: $t("agency.newRegMemberCount"),
      prop: "regMemberCount",
      cellRenderer: linkRender("regMemberCount", 1)
    },
    {
      label: $t("agency.firstDepositCount"),
      prop: "firstDepositCount",
      cellRenderer: linkRender("firstDepositCount", 2)
    },
    {
      label: $t("agency.transferMember"),
      prop: "transferMember",
      cellRenderer: moneyRender("transferMember")
    },
    {
      label: $t("agency.rechargeAmount"),
      prop: "rechargeAmount",
      cellRenderer: moneyRender("rechargeAmount")
    },
    {
      label: $t("agency.withdrawAmount"),
      prop: "withdrawAmount",
      cellRenderer: moneyRender("withdrawAmount")
    },
    {
      label: $t("agency.distContinueDepositCount"),
      prop: "distContinueDepositCount"
    },
    { label: $t("agency.distWithdrawCount"), prop: "distWithdrawCount" },
    {
      label: $t("agency.betAmount"),
      prop: "betAmount",
      cellRenderer: moneyRender("betAmount")
    },
    {
      label: $t("agency.platformCharge"),
      prop: "platformCharge",
      cellRenderer: moneyRender("platformCharge")
    },
    {
      label: $t("agency.totalBonus"),
      prop: "totalBonus",
      cellRenderer: moneyRender("totalBonus")
    },
    {
      label: $t("agency.totalCharge"),
      prop: "totalCharge",
      cellRenderer: moneyRender("totalCharge")
    },
    {
      label: $t("agency.totalWinAmount"),
      prop: "totalWinAmount",
      cellRenderer: ({ row }) => renderNegative(row.totalWinAmount)
    },
    {
      label: $t("agency.netProfit"),
      prop: "netProfit",
      cellRenderer: ({ row }) => renderNegative(row.netProfit)
    },
    {
      label: $t("agency.playerCount"),
      prop: "playerCount",
      cellRenderer: moneyRender("playerCount")
    },
    {
      label: $t("agency.activeMemberCount"),
      prop: "activeMemberCount",
      cellRenderer: linkRender("activeMemberCount", 3)
    }
  ];

  function syncDateRange() {
    if (Array.isArray(dateRange.value) && dateRange.value.length === 2) {
      searchForm.startTime = dayjs(dateRange.value[0]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      searchForm.endTime = dayjs(dateRange.value[1]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
    }
  }

  async function onSearch() {
    syncDateRange();
    loading.value = true;
    const params: Record<string, any> = {
      agencyAccount: searchForm.agencyAccount,
      giveOffer: searchForm.giveOffer,
      startTime: searchForm.startTime,
      endTime: searchForm.endTime,
      getChildAgencyData: searchForm.getChildAgencyData ? 1 : 2
    };
    if (searchForm.agencyID) params.agencyID = searchForm.agencyID;
    lastParams.value = params;
    searchDate.value =
      dayjs(searchForm.startTime).format("YYYY-MM-DD") +
      " - " +
      dayjs(searchForm.endTime).format("YYYY-MM-DD");
    try {
      const { data } = await getAgencyNewRegList(params);
      const result = (data ?? {}) as AgencyNewRegListResult;
      dataList.value = result.list ?? [];
      summaryRow.value = (result.subTotal && result.subTotal[0]) || {};
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (formEl) formEl.resetFields();
    searchForm.agencyID = "";
    searchForm.agencyAccount = "";
    searchForm.giveOffer = 3;
    searchForm.getChildAgencyData = false;
    dateRange.value = [
      dayjs().startOf("day").toDate(),
      dayjs().endOf("day").toDate()
    ];
    onSearch();
  }

  // pure-table summary-method：產生合計列
  function getSummaries(param) {
    const { columns: cols } = param;
    const sums: string[] = [];
    cols.forEach((col, index) => {
      if (index === 0) {
        sums[index] = $t("agency.total");
        return;
      }
      const prop = col.property;
      const val = summaryRow.value[prop];
      sums[index] = val === undefined || val === null ? "" : String(val);
    });
    return sums;
  }

  // 開啟明細彈窗（type: 1 註冊 / 2 首儲 / 3 活躍）
  function openDetail(record: Record<string, any>, type: number) {
    addDialog({
      title: `${$t("agency.newRegDetailTitle")}${searchDate.value}`,
      width: "90%",
      fullscreen: true,
      hideFooter: true,
      props: {
        type,
        record,
        searchDate: searchDate.value,
        postParams: lastParams.value
      },
      contentRenderer: () =>
        h(detailDialog, {
          type,
          record,
          postParams: lastParams.value
        })
    });
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    dateRange,
    giveOfferOptions,
    loading,
    columns,
    dataList,
    pagination: reactive({
      total: 0,
      pageSize: 10,
      currentPage: 1,
      background: true
    }),
    onSearch,
    resetForm,
    getSummaries,
    openDetail
  };
}
