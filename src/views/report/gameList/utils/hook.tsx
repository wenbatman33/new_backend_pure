import { computed, h, onMounted, reactive, ref } from "vue";
import dayjs from "dayjs";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";
import { exportExcel } from "@/utils/report";
import {
  getReportLgGameList,
  getGameDropdownList,
  reportLgGameListExportUrl
} from "@/api/report";
import betPeopleDialog from "../betPeopleDialog.vue";
import type { OptionItem, BetPeopleRecord } from "./types";

// 排序欄位對應後端代碼
const sortMapping: Record<string, number> = {
  betAmount: 1,
  winAmount: 2,
  betCount: 3,
  betPeople: 4
};

export function useGameList() {
  const todayEnd = dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss");

  const searchForm = reactive({
    start: todayEnd,
    end: todayEnd,
    memberAccount: "",
    agencyAccount: "",
    gameGroupId: "" as string | number | "",
    gameListId: "" as string | number | "",
    gameTypeId: "" as string | number | ""
  });

  const dataList = ref<any[]>([]);
  const loading = ref(true);

  // 下拉資料
  const gameGroupOptions = ref<OptionItem[]>([]);
  const gameTypeOptions = ref<OptionItem[]>([]);
  const gameListOptions = ref<OptionItem[]>([]);
  // 是否顯示維護中廠商（status != 1）
  const showMaintainGameGroup = ref(false);

  // [1:開啟,2:關閉,3:維護中,4:隱藏,5:未上架]
  const filteredGameGroupOptions = computed(() =>
    showMaintainGameGroup.value
      ? gameGroupOptions.value
      : gameGroupOptions.value.filter(item => item.status === 1)
  );

  // 表尾合計
  const totalData = reactive({
    betAmount: 0,
    winAmount: 0,
    betPeople: 0,
    betCount: 0
  });

  // 紀錄目前送出查詢的參數（含排序），供匯出 / 彈窗沿用
  const searchParams = ref<Record<string, any>>({});
  // 排序狀態
  const sortState = ref<{ order?: number; orderBy?: string }>({});

  const columns: TableColumnList = [
    { label: $t("report.gameListId"), prop: "gameListId" },
    { label: $t("report.gameListName"), prop: "gameListName" },
    { label: $t("report.gameManufacturers"), prop: "gameGroupName" },
    { label: $t("report.gameType"), prop: "gameTypeName" },
    {
      label: $t("report.betAmount"),
      prop: "betAmount",
      sortable: "custom",
      cellRenderer: ({ row }) => <span>{commaDecimalFormat(row.betAmount, 2)}</span>
    },
    {
      label: $t("report.winAmount"),
      prop: "winAmount",
      sortable: "custom",
      cellRenderer: ({ row }) => (
        <span style={Number(row.winAmount) < 0 ? "color:red" : ""}>
          {commaDecimalFormat(row.winAmount, 2)}
        </span>
      )
    },
    {
      label: $t("report.betPeople"),
      prop: "betPeople",
      sortable: "custom",
      cellRenderer: ({ row }) => (
        <a
          href="javascript:void(0)"
          style="color:#1890ff;cursor:pointer"
          onClick={() => openBetPeopleDialog(row)}
        >
          {row.betPeople}
        </a>
      )
    },
    {
      label: $t("report.betCount"),
      prop: "betCount",
      sortable: "custom",
      cellRenderer: ({ row }) => <span>{commaDecimalFormat(row.betCount)}</span>
    }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const params: Record<string, any> = {
        start: searchForm.start,
        end: searchForm.end,
        memberAccount: searchForm.memberAccount,
        agencyAccount: searchForm.agencyAccount,
        gameGroupId: searchForm.gameGroupId,
        gameListId: searchForm.gameListId,
        gameTypeId: searchForm.gameTypeId,
        ...sortState.value
      };
      searchParams.value = params;
      const { data } = await getReportLgGameList(params);
      dataList.value = data?.list ?? [];
      totalData.betAmount = data?.betAmount ?? 0;
      totalData.winAmount = data?.winAmount ?? 0;
      totalData.betCount = data?.betCount ?? 0;
      totalData.betPeople = data?.betPeople ?? 0;
    } finally {
      loading.value = false;
    }
  }

  // pure-table 排序事件
  function onSortChange({ prop, order }: { prop: string; order: string }) {
    if (prop && sortMapping[prop]) {
      sortState.value = {
        order: sortMapping[prop],
        orderBy: order === "ascending" ? "ASC" : "DESC"
      };
    } else {
      sortState.value = {};
    }
    onSearch();
  }

  // 表尾合計列
  function summaryMethod() {
    return [
      $t("report.total"),
      "",
      "",
      "",
      commaDecimalFormat(totalData.betAmount, 2),
      commaDecimalFormat(totalData.winAmount, 2),
      String(totalData.betPeople ?? 0),
      commaDecimalFormat(totalData.betCount)
    ];
  }

  function resetForm() {
    searchForm.start = todayEnd;
    searchForm.end = todayEnd;
    searchForm.memberAccount = "";
    searchForm.agencyAccount = "";
    searchForm.gameGroupId = "";
    searchForm.gameListId = "";
    searchForm.gameTypeId = "";
    sortState.value = {};
    onSearch();
  }

  function handleExport() {
    exportExcel(reportLgGameListExportUrl, searchParams.value);
  }

  // 開啟投注人數會員明細彈窗
  function openBetPeopleDialog(row: any) {
    const record: BetPeopleRecord = {
      gameListId: row.gameListId,
      gameListName: row.gameListName,
      gameGroupName: row.gameGroupName,
      gameTypeName: row.gameTypeName,
      gameTypeID: row.gameTypeID,
      gameGroupID: row.gameGroupID,
      start: searchForm.start,
      end: searchForm.end
    };
    addDialog({
      title: `${record.gameTypeName || ""} - ${record.gameGroupName || ""} - ${
        record.gameListName || ""
      }`,
      props: { record },
      width: "80%",
      draggable: true,
      hideFooter: true,
      closeOnClickModal: false,
      contentRenderer: () => h(betPeopleDialog, { record })
    });
  }

  onMounted(async () => {
    onSearch();
    const { data } = await getGameDropdownList();
    gameGroupOptions.value = (data?.gameGroup ?? []).map((item: any) => ({
      label: item.name,
      value: item.id,
      status: item.status
    }));
    gameTypeOptions.value = (data?.gameType ?? []).map((item: any) => ({
      label: item.name,
      value: item.id
    }));
    gameListOptions.value = (data?.gameList ?? []).map((item: any) => ({
      label: item.displayName,
      value: item.id
    }));
  });

  return {
    searchForm,
    dataList,
    loading,
    columns,
    gameTypeOptions,
    gameListOptions,
    filteredGameGroupOptions,
    showMaintainGameGroup,
    onSearch,
    onSortChange,
    summaryMethod,
    resetForm,
    handleExport
  };
}
