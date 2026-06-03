import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";
import type { RankRow } from "./types";

// 後端語系：簡體 -> cs，其餘 -> en（沿用舊邏輯）
export function getSabaLanguage() {
  const locale =
    (typeof window !== "undefined" &&
      window.localStorage.getItem("responsive-locale")) ||
    "";
  // pure-admin locale 存於 responsive-locale，值含 zh / en
  return locale.includes("zh") ? "cs" : "en";
}

// 排序欄位對應（圖表用哪個欄位當數值）
export const sortOptionType: Record<number, keyof RankRow> = {
  1: "BetTurnOver",
  2: "BetWinloss",
  3: "BetTurnOverPercentage",
  4: "BetWinlossPercentage"
};

export function getSortOptions() {
  return [
    { label: $t("saba.sortByOption1"), value: 1 },
    { label: $t("saba.sortByOption2"), value: 2 },
    { label: $t("saba.sortByOption3"), value: 3 },
    { label: $t("saba.sortByOption4"), value: 4 }
  ];
}

// 共用欄位片段
const colRank = (): TableColumnList[number] => ({
  label: $t("saba.colRank"),
  prop: "Rank",
  width: 90,
  cellRenderer: ({ row, index }) => <span>{row.Rank ?? index + 1}</span>
});
const colSport = (): TableColumnList[number] => ({
  label: $t("saba.colSportName"),
  prop: "SportName",
  minWidth: 120
});
const colLeague = (): TableColumnList[number] => ({
  label: $t("saba.colLeagueName"),
  prop: "LeagueName",
  minWidth: 140
});
const colTeam = (): TableColumnList[number] => ({
  label: $t("saba.colTeamName"),
  prop: "TeamName",
  minWidth: 140
});
const colBetType = (): TableColumnList[number] => ({
  label: $t("saba.colBetTypeName"),
  prop: "BetTypeName",
  minWidth: 140
});
const colHome = (): TableColumnList[number] => ({
  label: $t("saba.colHomeName"),
  prop: "HomeName",
  minWidth: 140
});
const colAway = (): TableColumnList[number] => ({
  label: $t("saba.colAwayName"),
  prop: "AwayName",
  minWidth: 140
});
const colPlayerCount = (): TableColumnList[number] => ({
  label: $t("saba.colPlayerCount"),
  prop: "PlayerCount",
  minWidth: 110
});
const colBetCount = (): TableColumnList[number] => ({
  label: $t("saba.colBetCount"),
  prop: "BetCount",
  minWidth: 110
});
const colTurnOver = (): TableColumnList[number] => ({
  label: $t("saba.colBetTurnOver"),
  prop: "BetTurnOver",
  minWidth: 120,
  cellRenderer: ({ row }) => <span>{commaDecimalFormat(row.BetTurnOver)}</span>
});
const colWinloss = (): TableColumnList[number] => ({
  label: $t("saba.colBetWinloss"),
  prop: "BetWinloss",
  minWidth: 120,
  cellRenderer: ({ row }) => <span>{commaDecimalFormat(row.BetWinloss)}</span>
});
const colMargin = (): TableColumnList[number] => ({
  label: $t("saba.colMargin"),
  prop: "Margin",
  minWidth: 110
});
const colTurnOverPct = (): TableColumnList[number] => ({
  label: `${$t("saba.colBetTurnOverPercentage")}(${$t("saba.colBetTurnOverPercentageBySport")})`,
  prop: "BetTurnOverPercentage",
  minWidth: 150
});
const colWinlossPct = (): TableColumnList[number] => ({
  label: $t("saba.colBetWinlossPercentage"),
  prop: "BetWinlossPercentage",
  minWidth: 150
});

// 各分頁的欄位定義
export const columnSets = {
  // tab1_1 站台概況（依日期）
  overview: (): TableColumnList => [
    { label: $t("saba.colDate"), prop: "Date", minWidth: 140 },
    colPlayerCount(),
    colTurnOver(),
    colWinloss(),
    colMargin(),
    { label: $t("saba.colBasketballPlayerCount"), prop: "BasketballPlayerCount", minWidth: 150 },
    { label: $t("saba.colBasketballTurnOver"), prop: "BasketballTurnOver", minWidth: 150 },
    { label: $t("saba.colBasketballWinloss"), prop: "BasketballWinloss", minWidth: 150 },
    { label: $t("saba.colBasketballMargin"), prop: "BasketballMargin", minWidth: 150 },
    { label: $t("saba.colSoccerPlayerCount"), prop: "SoccerPlayerCount", minWidth: 150 },
    { label: $t("saba.colSoccerTurnOver"), prop: "SoccerTurnOver", minWidth: 150 },
    { label: $t("saba.colSoccerWinloss"), prop: "SoccerWinloss", minWidth: 150 },
    { label: $t("saba.colSoccerMargin"), prop: "SoccerMargin", minWidth: 150 }
  ],
  // 近期投注 — 球類排名
  betSport: (): TableColumnList => [
    colRank(),
    colSport(),
    colTurnOver(),
    colWinloss(),
    colTurnOverPct(),
    colWinlossPct()
  ],
  // 近期投注 — 聯賽排名
  betLeague: (): TableColumnList => [
    colRank(),
    colSport(),
    colLeague(),
    colTurnOver(),
    colWinloss(),
    colTurnOverPct(),
    colWinlossPct()
  ],
  // 近期投注 — 球隊排名
  betTeam: (): TableColumnList => [
    colRank(),
    colTeam(),
    colSport(),
    colLeague(),
    colTurnOver(),
    colWinloss(),
    colTurnOverPct(),
    colWinlossPct()
  ],
  // tab1_3 球類排名（含人數/筆數）
  sportFull: (): TableColumnList => [
    colRank(),
    colSport(),
    colPlayerCount(),
    colTurnOver(),
    colWinloss(),
    colBetCount(),
    colMargin(),
    colTurnOverPct(),
    colWinlossPct()
  ],
  // tab1_4 聯賽排名
  leagueFull: (): TableColumnList => [
    colRank(),
    colSport(),
    colLeague(),
    colPlayerCount(),
    colTurnOver(),
    colWinloss(),
    colBetCount(),
    colMargin(),
    colTurnOverPct(),
    colWinlossPct()
  ],
  // tab1_5 聯賽玩法排名
  leagueBetType: (): TableColumnList => [
    colRank(),
    colSport(),
    colLeague(),
    colBetType(),
    colPlayerCount(),
    colWinloss(),
    colBetCount(),
    colTurnOver(),
    colTurnOverPct(),
    colWinlossPct()
  ],
  // tab1_6 賽事排名
  matchFull: (): TableColumnList => [
    colRank(),
    colSport(),
    colLeague(),
    colHome(),
    colAway(),
    colPlayerCount(),
    colWinloss(),
    colBetCount(),
    colTurnOver(),
    colTurnOverPct(),
    colWinlossPct()
  ],
  // tab2 系列（佔比為主）
  poolSport: (): TableColumnList => [
    colRank(),
    colSport(),
    colTurnOverPct(),
    colWinlossPct()
  ],
  poolLeague: (): TableColumnList => [
    colRank(),
    colSport(),
    colLeague(),
    colTurnOverPct(),
    colWinlossPct()
  ],
  poolTeam: (): TableColumnList => [
    colRank(),
    colTeam(),
    colSport(),
    colLeague(),
    colTurnOverPct(),
    colWinlossPct()
  ],
  poolLeagueBetType: (): TableColumnList => [
    colRank(),
    colSport(),
    colLeague(),
    colBetType(),
    colTurnOverPct(),
    colWinlossPct()
  ],
  poolMatch: (): TableColumnList => [
    colRank(),
    colSport(),
    colLeague(),
    colHome(),
    colAway(),
    colTurnOverPct(),
    colWinlossPct()
  ]
};

// 依排序值組出橫向長條圖的 ECharts option
export function buildBarOption(
  data: RankRow[],
  labelProp: keyof RankRow,
  sortBy: number,
  leftPad = 120
) {
  const valueKey = sortOptionType[sortBy] ?? "BetTurnOver";
  return {
    grid: {
      top: 20,
      left: leftPad,
      right: 60,
      bottom: 20,
      containLabel: false
    },
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    xAxis: { type: "value", max: "dataMax" },
    yAxis: {
      type: "category",
      inverse: true,
      data: data.map(item => item[labelProp]),
      axisLabel: {
        interval: 0,
        width: leftPad - 20,
        overflow: "truncate"
      }
    },
    series: [
      {
        type: "bar",
        barWidth: 16,
        data: data.map(item => item[valueKey]),
        label: { show: true, position: "right" }
      }
    ]
  };
}
