import { ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { transformI18n as $t } from "@/plugins/i18n";
import { isArray } from "@/utils/is";
import { arrayToOptions } from "@/utils/options";
import { exportExcel } from "@/utils/report";
import {
  getReportLeagueWin,
  getDropdownSport,
  getDropdownBettingLog
} from "@/api/report";
import type { SearchFormProps, LeagueWinRow } from "./types";

export function useLeagueWinReport() {
  // 搜尋條件（多選欄位以陣列保存，送出前 join(";")）
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
    betLogStatus: ""
  });

  // 日期區間（el-date-picker daterange）
  const dateRange = ref<[Date, Date] | []>([]);

  const dataList = ref<LeagueWinRow[]>([]);
  const loading = ref(false);

  // 各下拉選項
  const gameGroupOptions = ref<{ label: string; value: any }[]>([]);
  const sportOptions = ref<{ label: string; value: string }[]>([]);
  const leagueOptions = ref<{ label: string; value: string }[]>([]);
  const teamOptions = ref<{ label: string; value: string }[]>([]);
  const betTypeOptions = ref<{ label: string; value: string }[]>([]);

  // 主客場選項
  const teamTypeOptions = [
    { label: $t("report.homeTeam"), value: 1 },
    { label: $t("report.awayTeam"), value: 2 }
  ];

  // 注單狀態選項
  const betLogStatusOptions = [
    { label: $t("report.betLogStatus1"), value: 1 },
    { label: $t("report.betLogStatus2"), value: 2 },
    { label: $t("report.betLogStatus3"), value: 3 },
    { label: $t("report.betLogStatus4"), value: 4 }
  ];

  const columns: TableColumnList = [
    {
      label: $t("report.leagueName"),
      prop: "title",
      align: "left",
      cellRenderer: ({ row }) => (
        <span>{row.title ? row.title : row.gameGroupName}</span>
      )
    },
    {
      label: $t("report.numberOfBetsText"),
      prop: "numberOfBetsText",
      width: 180,
      // level <= 2 可下鑽至聯賽投注紀錄
      cellRenderer: ({ row }) =>
        row.level <= 2 ? (
          <a
            href="#"
            onClick={(e: Event) => {
              e.preventDefault();
              handleLeagueBetRecord(row);
            }}
          >
            {row.numberOfBetsText}
          </a>
        ) : (
          <span>{row.numberOfBetsText}</span>
        )
    },
    {
      label: $t("report.totalBetAmountText"),
      prop: "totalBetAmountText",
      width: 180
    },
    {
      label: $t("report.totalWinAmountText"),
      prop: "totalWinAmountText",
      width: 180,
      cellRenderer: ({ row }) => (
        <span style={row.totalWinAmount < 0 ? { color: "red" } : {}}>
          {row.totalWinAmountText}
        </span>
      )
    }
  ];

  // 由 dateRange 同步出 startTime / endTime
  function syncDateRange() {
    if (isArray(dateRange.value) && dateRange.value.length === 2) {
      searchForm.startTime = dayjs(dateRange.value[0]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      searchForm.endTime = dayjs(dateRange.value[1]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
    } else {
      searchForm.startTime = "";
      searchForm.endTime = "";
    }
  }

  // 組查詢參數（多選 join ";"，主客場拆 team -> homeTeam/awayTeam，去空值）
  function buildParams() {
    syncDateRange();
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
      betLogStatus: searchForm.betLogStatus
    };
    const teamStr = isArray(searchForm.team) ? searchForm.team.join(";") : "";
    if (searchForm.teamType === 2) {
      arg.awayTeam = teamStr;
    } else {
      arg.homeTeam = teamStr;
    }
    Object.keys(arg).forEach(key => {
      if (arg[key] === "" || arg[key] === null || arg[key] === undefined) {
        delete arg[key];
      }
    });
    return arg;
  }

  // 遞迴整理樹狀資料：補 level / sport / league，刪空 children
  function normalizeTree(
    list: LeagueWinRow[],
    level = 0,
    gameGroupID = "",
    sport = "",
    league = ""
  ) {
    list.forEach(item => {
      if (gameGroupID) {
        item.gameGroupID = gameGroupID;
      }
      item.level = level;
      item.sport = sport ? sport : level === 1 ? item.title : "";
      item.league = league ? league : level === 2 ? item.title : "";
      if (item.children && item.children.length === 0) {
        delete item.children;
      }
      if (item.children && item.children.length > 0) {
        normalizeTree(
          item.children,
          level + 1,
          item.gameGroupID,
          item.sport,
          item.league
        );
      }
    });
  }

  async function onSearch() {
    loading.value = true;
    try {
      const params = buildParams();
      const { data } = await getReportLeagueWin(params);
      const list = data?.list ?? [];
      normalizeTree(list);
      dataList.value = list;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (formEl) formEl.resetFields();
    dateRange.value = [];
    searchForm.startTime = "";
    searchForm.endTime = "";
    searchForm.order = "1";
    searchForm.gameGroupID = [];
    searchForm.sport = [];
    searchForm.league = [];
    searchForm.team = [];
    searchForm.teamType = 1;
    searchForm.betType = [];
    searchForm.betLogStatus = "";
    leagueOptions.value = [];
    teamOptions.value = [];
    betTypeOptions.value = [];
  }

  // 取運動下拉（含 gameGroup）
  async function loadSportDropdown() {
    const { data } = await getDropdownSport();
    gameGroupOptions.value = arrayToOptions(data?.gameGroup ?? [], "id", "name");
  }

  // 取注單聯動下拉（sport/league/team/betType），依日期、時間類型與已選 sport 過濾
  async function loadBettingLogDropdown() {
    syncDateRange();
    if (!searchForm.startTime || !searchForm.endTime) {
      return;
    }
    const params: Record<string, any> = {
      startTime: searchForm.startTime,
      endTime: searchForm.endTime,
      timeType: searchForm.order,
      sport: isArray(searchForm.sport) ? searchForm.sport.join(";") : ""
    };
    if (params.sport === "") {
      delete params.sport;
    }
    const { data } = await getDropdownBettingLog(params);
    const toOpts = (arr: string[] = []) =>
      arr.map(item => ({ label: item, value: item }));
    sportOptions.value = toOpts(data?.sport);
    leagueOptions.value = toOpts(data?.league);
    teamOptions.value = toOpts(data?.team);
    betTypeOptions.value = toOpts(data?.betType);
  }

  function handleExport() {
    exportExcel(
      "/backend/bettinglog/report/league/win/export",
      buildParams(),
      `bettinglog_${dayjs().format("YYYYMMDDHHmmss")}.zip`
    );
  }

  // 下鑽：開新分頁至聯賽投注紀錄
  function handleLeagueBetRecord(row: LeagueWinRow) {
    window.open(
      `/games/leagueBetRecord?gameGroupID=${row.gameGroupID}&startTime=${searchForm.startTime}&endTime=${searchForm.endTime}&sport=${row.sport}&league=${row.league}&order=${searchForm.order}`,
      "_blank"
    );
  }

  onMounted(() => {
    loadSportDropdown();
  });

  return {
    searchForm,
    dateRange,
    loading,
    columns,
    dataList,
    gameGroupOptions,
    sportOptions,
    leagueOptions,
    teamOptions,
    betTypeOptions,
    teamTypeOptions,
    betLogStatusOptions,
    onSearch,
    resetForm,
    handleExport,
    loadBettingLogDropdown
  };
}
