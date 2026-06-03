import { ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { transformI18n as $t } from "@/plugins/i18n";
import { isArray } from "@/utils/is";
import { arrayToOptions } from "@/utils/options";
import { exportDownload } from "@/utils/report";
import {
  getLeagueBetList,
  getLeagueDropdownSport,
  getLeagueDropdownBettingLog
} from "@/api/games";
import type { LeagueBetItem, SearchFormProps } from "./types";

// betItem 欄位中文對照（原 /@/utils/betItem，pure 專案未移植，直接內嵌常用對照）
const betItemLabelMap: Record<string, string> = {
  gameResult: $t("games.betItemGameResult"),
  eventID: $t("games.betItemEventID"),
  eventName: $t("games.betItemEventName"),
  eventTime: $t("games.betItemEventTime"),
  competitionName: $t("games.betItemCompetitionName"),
  homeTeamName: $t("games.betItemHomeTeamName"),
  awayTeamName: $t("games.betItemAwayTeamName"),
  period: $t("games.betItemPeriod"),
  handicap: $t("games.betItemHandicap"),
  odds: $t("games.betItemOdds"),
  oddsType: $t("games.betItemOddsType"),
  betOption: $t("games.betItemBetOption"),
  betSingleCombo: $t("games.betItemBetSingleCombo")
};

function findBetItemLabel(key: string) {
  return betItemLabelMap[key] ?? key;
}

// 解析後端 betItem JSON 字串為陣列（原 getBetItem 行為）
function parseBetItem(str: string): Record<string, any>[] {
  if (!str) return [];
  try {
    let jsonData = JSON.parse(str);
    if (typeof jsonData === "string") jsonData = JSON.parse(jsonData);
    if (jsonData === null) return [];
    if (isArray(jsonData)) return [...jsonData];
    if (typeof jsonData === "object") return [jsonData];
    return jsonData;
  } catch {
    return [];
  }
}

export function useLeagueBetRecord() {
  const searchForm = reactive<SearchFormProps>({
    startTime: "",
    endTime: "",
    order: "1",
    gameGroupID: [],
    sport: [],
    league: [],
    team: [],
    teamType: 1,
    betType: [],
    isLive: "",
    isComboBet: "",
    betLogStatus: "",
    minBetAmount: "",
    maxBetAmount: ""
  });

  // 日期區間（el-date-picker 雙向綁定）
  const dateRange = ref<[string, string] | []>([]);

  // 是否展開全部投注明細
  const ifShowDetail = ref(false);

  const dataList = ref<LeagueBetItem[]>([]);
  const loading = ref(false);
  const searchParams = ref<Record<string, any>>({});

  // 合計資料
  const summary = reactive({
    betAmountText: "",
    winAmountText: ""
  });

  // 下拉選項
  const gameGroupOptions = ref<{ label: string; value: any }[]>([]);
  const sportOptions = ref<{ label: string; value: any }[]>([]);
  const leagueOptions = ref<{ label: string; value: any }[]>([]);
  const teamOptions = ref<{ label: string; value: any }[]>([]);
  const betTypeOptions = ref<{ label: string; value: any }[]>([]);

  const teamTypeOptions = [
    { label: $t("games.leagueHomeTeam"), value: 1 },
    { label: $t("games.leagueAwayTeam"), value: 2 }
  ];
  const orderOptions = [
    { label: $t("games.leagueSettlementTime"), value: "1" },
    { label: $t("games.leagueBettingTime"), value: "2" },
    { label: $t("games.leagueCompetingTime"), value: "3" }
  ];
  const isLiveOptions = [
    { label: $t("games.leagueLive"), value: 1 },
    { label: $t("games.leagueNoLive"), value: 0 }
  ];
  const isComboBetOptions = [
    { label: $t("games.leagueCombo"), value: 1 },
    { label: $t("games.leagueNoCombo"), value: 0 }
  ];
  const betLogStatusOptions = [
    { label: $t("games.leagueBetLogStatus1"), value: 1 },
    { label: $t("games.leagueBetLogStatus2"), value: 2 },
    { label: $t("games.leagueBetLogStatus3"), value: 3 },
    { label: $t("games.leagueBetLogStatus4"), value: 4 }
  ];

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    { label: $t("games.leagueBetID"), prop: "betID", width: 180 },
    {
      label: $t("games.leagueMemberAccount"),
      prop: "memberAccount",
      width: 150,
      cellRenderer: ({ row }) => (
        <a
          href={`/memberDetail/detail/${row.memberID}`}
          target="_blank"
          style="color: var(--el-color-primary)"
        >
          {row.memberAccount}
        </a>
      )
    },
    { label: $t("games.leagueGameGroup"), prop: "gameGroupName", width: 120 },
    { label: $t("games.leagueSport"), prop: "sport", width: 100 },
    { label: $t("games.leagueCompetitionName"), prop: "league", width: 120 },
    { label: $t("games.leagueHomeTeam"), prop: "homeTeam", width: 120 },
    { label: $t("games.leagueAwayTeam"), prop: "awayTeam", width: 120 },
    { label: $t("games.leagueEventTime"), prop: "eventTime", width: 180 },
    { label: $t("games.leagueBetType"), prop: "betType", width: 100 },
    { label: $t("games.leagueBetOption"), prop: "betOption", width: 120 },
    { label: $t("games.leagueOddsStyle"), prop: "oddsStyle", width: 100 },
    { label: $t("games.leagueOdds"), prop: "odds", width: 100 },
    {
      label: $t("games.leagueIsLive"),
      prop: "isLive",
      width: 80,
      cellRenderer: ({ row }) => (
        <span>
          {row.isLive === 1
            ? $t("games.commonYes")
            : row.isLive === 0
              ? $t("games.commonNo")
              : ""}
        </span>
      )
    },
    {
      label: $t("games.leagueIsComboBet"),
      prop: "betSingleCombo",
      width: 80,
      cellRenderer: ({ row }) => (
        <span>
          {Number(row.betSingleCombo) > 1
            ? $t("games.commonYes")
            : row.betSingleCombo
              ? $t("games.commonNo")
              : ""}
        </span>
      )
    },
    {
      label: $t("games.leagueBetItem"),
      prop: "betItem",
      width: 240,
      slot: "betItem"
    },
    { label: $t("games.leagueBetAmount"), prop: "betAmountText", width: 120 },
    { label: $t("games.leagueWinAmount"), prop: "winAmountText", width: 120 },
    { label: $t("games.leagueBetTime"), prop: "betTime", width: 180 },
    {
      label: $t("games.leagueSettlementTime"),
      prop: "settlementTime",
      width: 180
    }
  ];

  // 組裝送出參數（沿用舊 beforeFetch 邏輯）
  function buildParams() {
    const arg: Record<string, any> = {
      startTime: searchForm.startTime,
      endTime: searchForm.endTime,
      order: searchForm.order,
      gameGroupID: isArray(searchForm.gameGroupID)
        ? searchForm.gameGroupID.join(";")
        : "",
      sport: isArray(searchForm.sport) ? searchForm.sport.join(";") : "",
      league: isArray(searchForm.league) ? searchForm.league.join(";") : "",
      betType: isArray(searchForm.betType) ? searchForm.betType.join(";") : "",
      isLive: searchForm.isLive,
      isComboBet: searchForm.isComboBet,
      betLogStatus: searchForm.betLogStatus,
      minBetAmount: searchForm.minBetAmount,
      maxBetAmount: searchForm.maxBetAmount
    };
    // teamType 決定 team 落到 homeTeam 或 awayTeam
    const team = isArray(searchForm.team) ? searchForm.team.join(";") : "";
    if (searchForm.teamType === 2) {
      arg.awayTeam = team;
    } else {
      arg.homeTeam = team;
    }
    // 去除空值
    Object.keys(arg).forEach(key => {
      if (arg[key] === "" || arg[key] === null || arg[key] === undefined) {
        delete arg[key];
      }
    });
    return arg;
  }

  async function onSearch() {
    if (!searchForm.startTime || !searchForm.endTime) {
      return;
    }
    loading.value = true;
    try {
      const arg = buildParams();
      searchParams.value = arg;
      const { data } = await getLeagueBetList(arg);
      const list = (data?.list ?? []).map((item: LeagueBetItem) => {
        item.showDetail = false;
        item.betItemList = parseBetItem(item.betItem as unknown as string);
        return item;
      });
      dataList.value = list;
      // 後端 total 為合計物件（含金額），筆數以 list 長度為準
      pagination.total = list.length;
      summary.betAmountText = data?.total?.totalBetAmountText ?? "";
      summary.winAmountText = data?.total?.totalWinAmountText ?? "";
    } finally {
      loading.value = false;
    }
  }

  // 同步日期區間到 searchForm
  function onDateChange(val: [string, string] | null) {
    if (val && val.length === 2) {
      searchForm.startTime = val[0];
      searchForm.endTime = val[1];
    } else {
      searchForm.startTime = "";
      searchForm.endTime = "";
    }
    loadBettingLogDropdown();
  }

  // 取得運動種類（game group）下拉
  async function loadSportDropdown() {
    const { data } = await getLeagueDropdownSport();
    gameGroupOptions.value = arrayToOptions(data?.gameGroup ?? [], "id", "name");
  }

  // 依日期/運動種類取得 betting log 相關下拉
  async function loadBettingLogDropdown() {
    if (!searchForm.startTime || !searchForm.endTime) return;
    const params: Record<string, any> = {
      startTime: searchForm.startTime,
      endTime: searchForm.endTime,
      timeType: searchForm.order
    };
    if (isArray(searchForm.sport) && searchForm.sport.length > 0) {
      params.sport = searchForm.sport.join(";");
    }
    const { data } = await getLeagueDropdownBettingLog(params);
    const toOpts = (arr: string[] = []) =>
      arr.map(item => ({ label: item, value: item }));
    sportOptions.value = toOpts(data?.sport);
    leagueOptions.value = toOpts(data?.league);
    teamOptions.value = toOpts(data?.team);
    betTypeOptions.value = toOpts(data?.betType);
  }

  function resetForm() {
    searchForm.gameGroupID = [];
    searchForm.sport = [];
    searchForm.league = [];
    searchForm.team = [];
    searchForm.betType = [];
    searchForm.teamType = 1;
    searchForm.isLive = "";
    searchForm.isComboBet = "";
    searchForm.betLogStatus = "";
    searchForm.minBetAmount = "";
    searchForm.maxBetAmount = "";
    searchForm.order = "1";
    searchForm.startTime = "";
    searchForm.endTime = "";
    dateRange.value = [];
  }

  function handleExport() {
    exportDownload(
      "/backend/bettinglog/league/bet/list/export",
      searchParams.value,
      `leagueBetRecord${dayjs().format("YYYYMMDDHHmmss")}.zip`
    );
  }

  onMounted(() => {
    searchForm.order = "1";
    loadSportDropdown();
  });

  return {
    searchForm,
    dateRange,
    ifShowDetail,
    loading,
    columns,
    dataList,
    pagination,
    summary,
    gameGroupOptions,
    sportOptions,
    leagueOptions,
    teamOptions,
    betTypeOptions,
    teamTypeOptions,
    orderOptions,
    isLiveOptions,
    isComboBetOptions,
    betLogStatusOptions,
    findBetItemLabel,
    onSearch,
    onDateChange,
    loadBettingLogDropdown,
    resetForm,
    handleExport
  };
}
