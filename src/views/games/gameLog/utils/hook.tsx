import { h, ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { isObject, isString, isArray } from "@/utils/is";
import { changeRedColorForNegative } from "@/utils/number";
import { findByValue } from "@/utils/options";
import { checkVDSerialIncludes } from "@/utils/country";
import { exportExcel } from "@/utils/report";
import {
  getGameLogList,
  getGameLogGroupList,
  getGameLogGameList,
  getGameLogDetailLink
} from "@/api/games";
import type { GameLogItem } from "./types";
import detailContent from "../detail.vue";

// betItem 欄位中文對照（原 @/utils/betItem 未移植，於此就地內建）
const betItemLabel = (key: string): string => {
  const k = $t(`games.betItem_${key}`);
  // 若 i18n 未配置該 key，transformI18n 會回傳原 key 字串，退回原始欄位名
  return k && k !== `games.betItem_${key}` ? k : key;
};

// 解析後端 betItem JSON 字串為陣列
const parseBetItem = (str: any): any[] => {
  if (!str) return [];
  try {
    let data = JSON.parse(str);
    if (isString(data)) data = JSON.parse(data);
    if (data === null) return [];
    if (isObject(data)) return [data];
    if (isArray(data)) return [...data];
    return data;
  } catch {
    return [];
  }
};

// 注單狀態選項
const betLogStatusOptions = [
  { label: $t("games.settled"), value: 1 },
  { label: $t("games.unsettled"), value: 2 },
  { label: $t("games.cancelText"), value: 3 },
  { label: $t("games.fail"), value: 4 }
];

// 是否強制要求注單號（依站台 VD 序號）
const checkBetIdRequired = !checkVDSerialIncludes(["t030", "t004"]);

// 排序欄位對應 [會員帳號1 投注額2 輸贏4 結算金額5 賠率6 廠商投注時間7 本地投注時間8 廠商結算時間9 平台結算時間10]
const sortColumnMapping: Record<string, number> = {
  memberAccount: 1,
  totalBetAmount: 2,
  winAmount: 4,
  settlementAmount: 5,
  odds: 6,
  betTime: 7,
  betTimeLocal: 8,
  settlementTime: 9,
  settlementTimeLocal: 10
};
const orderByMapping: Record<string, number> = { ascending: 1, descending: 2 };

export function useGameLog() {
  const searchForm = reactive({
    memberAccount: "",
    gameGroupID: "" as number | string,
    gameListID: "" as number | string,
    betId: "",
    betLogStatus: "" as number | string,
    keyword: "",
    timeType: "settlementTime",
    settlementTimeStart: dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
    settlementTimeEnd: dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss"),
    betTimeStart: "",
    betTimeEnd: ""
  });

  const dataList = ref<GameLogItem[]>([]);
  const totalData = ref<Record<string, any>>({});
  const loading = ref(false);
  // 廠商 / 遊戲下拉（TODO: @/utils/dropdown 與 gameDropdown store 未移植，先以 API 載入）
  const gameGroupOptions = ref<{ label: string; value: number }[]>([]);
  const gameListOptions = ref<{ label: string; value: number }[]>([]);
  // 排序狀態
  const sortState = ref<{ field?: string; order?: string }>({});

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    {
      label: $t("games.gameOriginalBettingID"),
      prop: "betID",
      width: 180,
      fixed: "left",
      cellRenderer: ({ row }) => (
        <a class="cursor-pointer text-primary" onClick={() => openDetail(row)}>
          {row.betID}
        </a>
      )
    },
    {
      label: $t("games.memberAccount"),
      prop: "memberAccount",
      width: 120,
      sortable: "custom",
      cellRenderer: ({ row }) => (
        <a
          class="cursor-pointer text-primary"
          onClick={() => handleViewMember(row)}
        >
          {row.memberAccount}
        </a>
      )
    },
    { label: $t("games.group"), prop: "gameGroup", width: 170 },
    { label: $t("games.gameName"), prop: "gameListName", width: 90 },
    {
      label: $t("games.eventData"),
      prop: "gameTypeID",
      width: 220,
      cellRenderer: ({ row }) => renderEventData(row)
    },
    {
      label: $t("games.bettingContent"),
      prop: "bettingContent",
      width: 240,
      cellRenderer: ({ row }) => renderBettingContent(row)
    },
    { label: $t("games.oddsStyle"), prop: "oddsStyle", width: 100 },
    {
      label: $t("games.sport"),
      prop: "sport",
      width: 100,
      cellRenderer: ({ row }) => <span>{row.betItem?.[0]?.sportsname ?? ""}</span>
    },
    {
      label: $t("games.league"),
      prop: "league",
      width: 120,
      cellRenderer: ({ row }) => (
        <span>{row.betItem?.[0]?.competitionName ?? ""}</span>
      )
    },
    {
      label: $t("games.team"),
      prop: "team",
      width: 120,
      cellRenderer: ({ row }) => <span>{row.betItem?.[0]?.eventName ?? ""}</span>
    },
    { label: $t("games.betItem_playName"), prop: "betTypeDesc", width: 180 },
    { label: $t("games.betItem_betOption"), prop: "betOption", width: 220 },
    { label: $t("games.betItem_gameResult"), prop: "gameResult", width: 100 },
    { label: $t("games.betItem_roundNo"), prop: "roundNo", width: 100 },
    { label: $t("games.betItem_tableCode"), prop: "tableCode", width: 100 },
    {
      label: $t("games.betItem_deviceType"),
      prop: "deviceType",
      width: 150,
      cellRenderer: ({ row }) => <span>{row.betItem?.[0]?.deviceType ?? ""}</span>
    },
    { label: $t("games.betItem_platformName"), prop: "platformName", width: 150 },
    {
      label: $t("games.betItem_resultUrl"),
      prop: "resultUrl",
      width: 150,
      cellRenderer: ({ row }) =>
        row.resultUrl ? (
          <a href={row.resultUrl} target="_blank" class="text-primary">
            {$t("games.betItem_resultUrl")}
          </a>
        ) : (
          <span></span>
        )
    },
    { label: $t("games.odds"), prop: "odds", width: 100 },
    {
      label: $t("games.isLive"),
      prop: "isLive",
      width: 80,
      cellRenderer: ({ row }) => {
        const v = row.betItem?.[0]?.isLive;
        return (
          <span>
            {v === true ? $t("games.yes") : v === false ? $t("games.no") : ""}
          </span>
        );
      }
    },
    {
      label: $t("games.isComboBet"),
      prop: "betSingleCombo",
      width: 80,
      cellRenderer: ({ row }) => (
        <span>
          {Number(row.betSingleCombo) > 1
            ? $t("games.yes")
            : row.betSingleCombo
              ? $t("games.no")
              : ""}
        </span>
      )
    },
    {
      label: $t("games.preSettle"),
      prop: "preSettle",
      width: 80,
      cellRenderer: ({ row }) => {
        const v = row.betItem?.[0]?.preSettle;
        return (
          <span>
            {v === true ? $t("games.yes") : v === false ? $t("games.no") : ""}
          </span>
        );
      }
    },
    {
      label: $t("games.betAmount"),
      prop: "totalBetAmount",
      width: 120,
      sortable: "custom",
      cellRenderer: ({ row }) =>
        h("span", { innerHTML: changeRedColorForNegative(row.totalBetAmount) })
    },
    {
      label: $t("games.generallyEffectiveFlow"),
      prop: "backendBetAmount",
      width: 120,
      cellRenderer: ({ row }) =>
        h("span", { innerHTML: changeRedColorForNegative(row.backendBetAmount) })
    },
    {
      label: $t("games.effectiveFlowOfActivities"),
      prop: "eventTurnover",
      width: 120,
      cellRenderer: ({ row }) =>
        h("span", { innerHTML: changeRedColorForNegative(row.eventTurnover) })
    },
    {
      label: $t("games.effectiveFlowOfWaterAgainstWater"),
      prop: "returnBetAmount",
      width: 120,
      cellRenderer: ({ row }) =>
        h("span", { innerHTML: changeRedColorForNegative(row.returnBetAmount) })
    },
    {
      label: $t("games.membersWinOrLose"),
      prop: "winAmount",
      width: 120,
      sortable: "custom",
      cellRenderer: ({ row }) =>
        h("span", { innerHTML: changeRedColorForNegative(row.winAmount) })
    },
    {
      label: $t("games.settlementAmount"),
      prop: "settlementAmount",
      width: 120,
      sortable: "custom",
      cellRenderer: ({ row }) =>
        h("span", { innerHTML: changeRedColorForNegative(row.settlementAmount) })
    },
    {
      label: $t("games.platformBettingTime"),
      prop: "betTimeLocal",
      width: 180,
      sortable: "custom"
    },
    {
      label: $t("games.platformSettlementTime"),
      prop: "settlementTimeLocal",
      width: 180,
      sortable: "custom"
    },
    {
      label: $t("games.manufacturerBettingTime"),
      prop: "betTime",
      width: 180,
      sortable: "custom"
    },
    {
      label: $t("games.manufacturerSettlementTime"),
      prop: "settlementTime",
      width: 180,
      sortable: "custom"
    },
    {
      label: $t("games.bettingRecordStatus"),
      prop: "betLogStatus",
      width: 120,
      cellRenderer: ({ row }) => (
        <span>{findByValue(betLogStatusOptions, row.betLogStatus)}</span>
      )
    }
  ];

  // 賽事資料渲染
  function renderEventData(row: GameLogItem) {
    if (Number(row.betSingleCombo) > 1) {
      return (
        <div class="text-right">
          <div style="color:blue">{$t("games.comboBet")}</div>
          {(row.betSingleComboIntro ?? []).map((intro: any) => (
            <div key={intro.betOptionID}>
              {$t("games.comboBetIntro", {
                0: intro.comboMatchesCount,
                1: intro.comboBetsCount,
                2: intro.totalComboBetsCount
              })}
            </div>
          ))}
        </div>
      );
    }
    if (row.gameTypeID === 1 || row.gameTypeID === 4) {
      const item = row.betItem?.[0] ?? {};
      return (
        <div class="text-right">
          {item.sportsname && <div style="color:blue">{item.sportsname}</div>}
          {item.competitionName && (
            <div style="color:#01005e">{item.competitionName}</div>
          )}
          {row.eventDateTime && <div>{row.eventDateTime}</div>}
          {row.eventID && <div>{row.eventID}</div>}
          {item.homeTeamName && item.awayTeamName && (
            <div>
              {item.homeTeamName} -vs- {item.awayTeamName}
            </div>
          )}
        </div>
      );
    }
    return <span></span>;
  }

  // 投注內容渲染（精簡版：列出 betItem 主要欄位）
  function renderBettingContent(row: GameLogItem) {
    const items = row.betItem ?? [];
    if (!items.length) return <span></span>;
    const fields = [
      "playName",
      "eventName",
      "betOption",
      "gameResult",
      "detail",
      "IP",
      "deviceType",
      "platformID",
      "tableCode",
      "tableName",
      "betMode",
      "ticketPlanNo",
      "betModel",
      "betOptionID",
      "gameRoom",
      "gameFlag",
      "tableNo"
    ];
    return (
      <div class="text-left">
        {items.map((bi: any, idx: number) => (
          <div
            key={idx}
            class={items.length > 1 ? "mb-2 border border-solid" : ""}
          >
            {fields
              .filter(f => bi?.[f] !== undefined && bi?.[f] !== null && bi?.[f] !== "")
              .map(f => (
                <div key={f}>
                  {betItemLabel(f)} | {String(bi[f])}
                </div>
              ))}
          </div>
        ))}
      </div>
    );
  }

  // 跳轉會員明細
  function handleViewMember(row: GameLogItem) {
    window.open("/memberDetail/detail/" + row.memberID);
  }

  // 組查詢參數
  function buildParams() {
    const params: Record<string, any> = {
      memberAccount: searchForm.memberAccount,
      gameGroupID: searchForm.gameGroupID,
      gameListID: searchForm.gameListID,
      betId: searchForm.betId,
      betLogStatus: searchForm.betLogStatus,
      keyword: searchForm.keyword,
      page: pagination.currentPage,
      pageSize: pagination.pageSize
    };
    if (searchForm.timeType === "settlementTime") {
      params.settlementTimeStart = searchForm.settlementTimeStart;
      params.settlementTimeEnd = searchForm.settlementTimeEnd;
    } else {
      params.betTimeStart = searchForm.betTimeStart;
      params.betTimeEnd = searchForm.betTimeEnd;
    }
    if (sortState.value.order) params.orderParam = orderByMapping[sortState.value.order];
    if (sortState.value.field)
      params.order = sortColumnMapping[sortState.value.field];
    if (!params.gameListID) params.allGame = true;
    // 移除空值
    Object.keys(params).forEach(k => {
      if (params[k] === undefined || params[k] === "" || params[k] === null) {
        delete params[k];
      }
    });
    return params;
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getGameLogList(buildParams());
      const list = (data?.list ?? []).map((item: any) => {
        item.showDetail = false;
        item.betItem = parseBetItem(item.betItem);
        return item;
      });
      dataList.value = list;
      totalData.value = data?.total ?? {};
      // total 可能為物件（合計列）或數字（總筆數）
      pagination.total =
        typeof data?.total === "number"
          ? data.total
          : (data?.totalCount ?? list.length);
    } finally {
      loading.value = false;
    }
  }

  // 排序變更
  function handleSortChange({ prop, order }: { prop: string; order: string }) {
    sortState.value = { field: prop, order };
    onSearch();
  }

  function resetForm(formEl) {
    if (formEl) formEl.resetFields();
    searchForm.memberAccount = "";
    searchForm.gameGroupID = "";
    searchForm.gameListID = "";
    searchForm.betId = "";
    searchForm.betLogStatus = "";
    searchForm.keyword = "";
    searchForm.timeType = "settlementTime";
    searchForm.settlementTimeStart = dayjs()
      .startOf("day")
      .format("YYYY-MM-DD HH:mm:ss");
    searchForm.settlementTimeEnd = dayjs()
      .endOf("day")
      .format("YYYY-MM-DD HH:mm:ss");
    searchForm.betTimeStart = "";
    searchForm.betTimeEnd = "";
    pagination.currentPage = 1;
    onSearch();
  }

  // 開啟單筆原始資料詳情
  function openDetail(row: GameLogItem) {
    addDialog({
      title: $t("games.gameOriginalBettingID") + "：" + row.betID,
      width: "700px",
      draggable: true,
      closeOnClickModal: false,
      hideFooter: true,
      contentRenderer: () => h(detailContent, { row })
    });
  }

  // 廠商結果頁連結
  async function showDetailLink(row: GameLogItem) {
    const { data } = await getGameLogDetailLink({
      gameGroup: row.gameGroupID,
      betId: row.betID
    });
    if (data?.resultLink) window.open(data.resultLink, "_blank");
  }

  // 匯出
  function handleExport() {
    exportExcel("/backend/bettinglog/record/export", {
      ...buildParams(),
      pageSize: 5000,
      page: 1
    });
  }

  // 切換時間類型，互換已填時間
  function handleTimeTypeChange() {
    if (searchForm.timeType === "settlementTime") {
      searchForm.settlementTimeStart = searchForm.betTimeStart;
      searchForm.settlementTimeEnd = searchForm.betTimeEnd;
      searchForm.betTimeStart = "";
      searchForm.betTimeEnd = "";
    } else {
      searchForm.betTimeStart = searchForm.settlementTimeStart;
      searchForm.betTimeEnd = searchForm.settlementTimeEnd;
      searchForm.settlementTimeStart = "";
      searchForm.settlementTimeEnd = "";
    }
  }

  // 載入廠商 / 遊戲下拉
  async function loadDropdowns() {
    try {
      const groupRes = await getGameLogGroupList({});
      gameGroupOptions.value = (groupRes.data?.list ?? groupRes.data ?? []).map(
        (g: any) => ({ label: g.label ?? g.name, value: g.value ?? g.id })
      );
      const gameRes = await getGameLogGameList({});
      gameListOptions.value = (gameRes.data?.list ?? gameRes.data ?? []).map(
        (g: any) => ({ label: g.label ?? g.name, value: g.value ?? g.id })
      );
    } catch {
      gameGroupOptions.value = [];
      gameListOptions.value = [];
    }
  }

  onMounted(() => {
    loadDropdowns();
    onSearch();
  });

  return {
    searchForm,
    loading,
    columns,
    dataList,
    totalData,
    pagination,
    gameGroupOptions,
    gameListOptions,
    betLogStatusOptions,
    checkBetIdRequired,
    onSearch,
    resetForm,
    handleSortChange,
    handleExport,
    handleTimeTypeChange,
    showDetailLink
  };
}
