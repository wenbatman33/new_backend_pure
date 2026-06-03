import { ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { useRoute } from "vue-router";
import { transformI18n as $t } from "@/plugins/i18n";
import { tableCustomRender } from "@/utils/number";
import {
  getLmGameLogList,
  getLmGameLogGroups,
  type LmGameLogItem,
  type LmGameLogTotal
} from "@/api/games";
import type { SearchFormProps, GameGroupOption } from "./types";

/** 排序欄位 → 後端代碼（1.會員帳號 2.投注額 4.輸贏 5.結算金額 6.賠率） */
const sortColumnMapping: Record<string, number> = {
  memberAccount: 1,
  totalBetAmount: 2,
  winAmount: 4,
  settlementAmount: 5,
  odds: 6
};
/** Element Plus 排序方向 → 後端代碼 */
const orderByMapping: Record<string, number> = {
  ascending: 1,
  descending: 2
};

/** 投注紀錄狀態 */
const betLogStatusMap: Record<number, string> = {
  1: $t("games.success"),
  2: $t("games.toBeConfirmed"),
  3: $t("games.cancel"),
  4: $t("games.fail")
};

/** 盤口類型 */
const oddsTypeMap: Record<number, string> = {
  1: $t("games.nonSports"),
  2: $t("games.hongKongHandicap"),
  3: $t("games.europeanHandicap"),
  4: $t("games.malayHandicap"),
  5: $t("games.indianHandicap"),
  6: $t("games.chinaHandicap"),
  7: $t("games.indonesianHandicap"),
  8: $t("games.americanHandicap"),
  9: $t("games.specialHandicap")
};

const amountRender = (row: any, prop: string) => (
  <span>{tableCustomRender(row[prop], 2)}</span>
);

export function useLmGameLog() {
  const route = useRoute();

  const searchForm = reactive<SearchFormProps>({
    memberAccount: "",
    memberID: "",
    gameGroupID: "",
    betId: "",
    gameAccount: "",
    settlementTimeStart: "",
    settlementTimeEnd: "",
    bettleTimeStart: "",
    bettleTimeEnd: "",
    field: "",
    orderParam: ""
  });

  const dataList = ref<LmGameLogItem[]>([]);
  const totalData = ref<LmGameLogTotal>({} as LmGameLogTotal);
  const gameGroupList = ref<GameGroupOption[]>([]);
  const loading = ref(false);

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    { label: $t("games.memberID"), prop: "memberID", width: 90 },
    {
      label: $t("games.memberAccount"),
      prop: "memberAccount",
      width: 120,
      sortable: "custom"
    },
    { label: $t("games.gameAccount"), prop: "gameAccount", width: 120 },
    { label: $t("games.gameName"), prop: "gameListName", width: 100 },
    {
      label: $t("games.gameOriginalBettingID"),
      prop: "betID",
      width: 180
    },
    {
      label: $t("games.betAmount"),
      prop: "totalBetAmount",
      width: 120,
      sortable: "custom",
      cellRenderer: ({ row }) => amountRender(row, "totalBetAmount")
    },
    {
      label: $t("games.generallyEffectiveFlow"),
      prop: "backendBetAmount",
      width: 130,
      cellRenderer: ({ row }) => amountRender(row, "backendBetAmount")
    },
    {
      label: $t("games.effectiveFlowOfActivities"),
      prop: "eventTurnover",
      width: 130,
      cellRenderer: ({ row }) => amountRender(row, "eventTurnover")
    },
    {
      label: $t("games.effectiveFlowOfWaterAgainstWater"),
      prop: "returnBetAmount",
      width: 150,
      cellRenderer: ({ row }) => amountRender(row, "returnBetAmount")
    },
    {
      label: $t("games.membersWinOrLose"),
      prop: "winAmount",
      width: 120,
      sortable: "custom",
      cellRenderer: ({ row }) => amountRender(row, "winAmount")
    },
    {
      label: $t("games.settlementAmount"),
      prop: "settlementAmount",
      width: 120,
      sortable: "custom",
      cellRenderer: ({ row }) => amountRender(row, "settlementAmount")
    },
    {
      label: $t("games.platformBettingTime"),
      prop: "betTimeLocal",
      width: 170
    },
    {
      label: $t("games.platformSettlementTime"),
      prop: "settlementTimeLocal",
      width: 170
    },
    {
      label: $t("games.manufacturerBettingTime"),
      prop: "betTime",
      width: 170
    },
    {
      label: $t("games.manufacturerSettlementTime"),
      prop: "settlementTime",
      width: 170
    },
    {
      label: $t("games.bettingRecordStatus"),
      prop: "betLogStatus",
      width: 120,
      cellRenderer: ({ row }) => (
        <span>{betLogStatusMap[row.betLogStatus] ?? ""}</span>
      )
    },
    {
      label: $t("games.odds"),
      prop: "odds",
      width: 100,
      sortable: "custom"
    },
    {
      label: $t("games.handicap"),
      prop: "oddsType",
      width: 130,
      cellRenderer: ({ row }) => (
        <span>{oddsTypeMap[Number(row.oddsType)] ?? ""}</span>
      )
    },
    {
      label: $t("games.jsonEncodedRawData"),
      prop: "response",
      width: 180,
      hide: true
    },
    {
      label: $t("games.bettingItems"),
      prop: "betItem",
      width: 180,
      showOverflowTooltip: true
    }
  ];

  /** 組查詢參數：清掉空值、補 allGame */
  function buildParams() {
    const params: Record<string, any> = {};
    Object.keys(searchForm).forEach(key => {
      const v = (searchForm as any)[key];
      if (v !== undefined && v !== "") {
        params[key] = v;
      }
    });
    params.allGame = true;
    return params;
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { success, data } = await getLmGameLogList(buildParams());
      if (success) {
        dataList.value = data?.list ?? [];
        totalData.value = data?.total ?? ({} as LmGameLogTotal);
        pagination.total = data?.total?.count ?? dataList.value.length;
      }
    } finally {
      loading.value = false;
    }
  }

  /** 表頭排序變更（sortable: custom） */
  function onSortChange({ prop, order }: { prop: string; order: string }) {
    if (order && sortColumnMapping[prop]) {
      searchForm.field = sortColumnMapping[prop];
      searchForm.orderParam = orderByMapping[order];
    } else {
      searchForm.field = "";
      searchForm.orderParam = "";
    }
    onSearch();
  }

  function resetForm(formEl: any) {
    if (formEl) formEl.resetFields();
    Object.keys(searchForm).forEach(
      k => ((searchForm as any)[k] = "")
    );
    initDefaultTime();
  }

  /** 合計列：第一欄顯示「合計」，金額欄取 totalData */
  function summaryMethod() {
    const sums: string[] = [];
    columns.forEach((col: any, index) => {
      if (index === 0) {
        sums[index] = $t("games.total");
      } else if (
        totalData.value &&
        col.prop &&
        totalData.value[col.prop] !== undefined
      ) {
        sums[index] = tableCustomRender(totalData.value[col.prop], 2);
      } else {
        sums[index] = "-";
      }
    });
    return sums;
  }

  /** 預設帶近 30 天結算時間 */
  function initDefaultTime() {
    searchForm.settlementTimeStart = dayjs()
      .subtract(30, "day")
      .startOf("day")
      .format("YYYY-MM-DD HH:mm:ss");
    searchForm.settlementTimeEnd = dayjs()
      .endOf("day")
      .format("YYYY-MM-DD HH:mm:ss");
  }

  async function loadGroups() {
    const { success, data } = await getLmGameLogGroups();
    if (success) {
      gameGroupList.value = (data?.list ?? []).map((item: any) => ({
        label: item.name,
        value: item.ID
      }));
    }
  }

  onMounted(() => {
    const q = route.query;
    if (q.gameGroupID) {
      searchForm.memberAccount = (q.memberAccount as string) || "";
      searchForm.settlementTimeStart = (q.start as string) || "";
      searchForm.settlementTimeEnd = (q.end as string) || "";
      searchForm.gameGroupID = Number(q.gameGroupID);
      onSearch();
    } else {
      initDefaultTime();
    }
    loadGroups();
  });

  return {
    searchForm,
    gameGroupList,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    onSortChange,
    resetForm,
    summaryMethod
  };
}
