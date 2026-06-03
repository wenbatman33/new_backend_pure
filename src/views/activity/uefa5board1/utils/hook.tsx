import { ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import {
  getUefa5Board1List,
  updateUefa5Board1,
  getUefa5LeagueScheduleList
} from "@/api/activity";
import type { Uefa5Board1Item } from "./types";

// 聯賽選項
export const leagueList = [
  { label: "英超", value: 3 },
  { label: "西甲", value: 4 },
  { label: "意甲", value: 5 },
  { label: "德甲", value: 6 },
  { label: "法甲", value: 7 },
  { label: "2024UEFA", value: 13 },
  { label: "2025世俱杯", value: 14 }
];

// 組別選項
export const groupList = [
  { label: "A", value: 1 },
  { label: "B", value: 2 },
  { label: "C", value: 3 },
  { label: "D", value: 4 },
  { label: "E", value: 5 },
  { label: "F", value: 6 },
  { label: "G", value: 7 },
  { label: "H", value: 8 },
  { label: "1/8决赛", value: 9 },
  { label: "1/4决赛", value: 10 },
  { label: "半决赛", value: 11 },
  { label: "季军赛", value: 12 },
  { label: "决赛", value: 13 }
];

// 赛事进程選項
export const matchTypeList = [
  { label: $t("activity.uefa5MatchType1"), value: 1 },
  { label: $t("activity.uefa5MatchType2"), value: 2 },
  { label: $t("activity.uefa5MatchType3"), value: 3 },
  { label: $t("activity.uefa5MatchType4"), value: 4 },
  { label: $t("activity.uefa5MatchType5"), value: 5 }
];

function findLabel(list: { label: string; value: number }[], v: number) {
  return list.find(i => i.value === v)?.label ?? "";
}

export function useUefa5Board1() {
  const searchForm = reactive<{
    league: number | string;
    showInactive: boolean;
    team: string;
    year: string;
    matchType: number;
    matchGroup: number[];
  }>({
    league: "",
    showInactive: false,
    team: "",
    year: "",
    matchType: 0,
    matchGroup: []
  });

  // 聯賽下拉（依 league_schedule 動態取得）
  const leagueOptions = ref<{ label: string; value: number | string }[]>([
    { label: $t("activity.all"), value: "" }
  ]);

  const dataList = ref<Uefa5Board1Item[]>([]);
  const loading = ref(true);

  const columns: TableColumnList = [
    {
      label: $t("activity.uefa5Year"),
      prop: "year",
      width: 110,
      slot: "year"
    },
    {
      label: $t("activity.uefa5League"),
      prop: "league",
      width: 150,
      cellRenderer: ({ row }) => <span>{findLabel(leagueList, row.league)}</span>
    },
    {
      label: $t("activity.uefa5MatchProcess"),
      prop: "matchType",
      width: 110,
      cellRenderer: ({ row }) => (
        <span>{findLabel(matchTypeList, row.matchType)}</span>
      )
    },
    {
      label: $t("activity.uefa5MatchGroup"),
      prop: "matchGroup",
      width: 120,
      slot: "matchGroup"
    },
    { label: $t("activity.uefa5Team"), prop: "team", width: 150 },
    {
      label: $t("activity.uefa5Rank"),
      prop: "rank",
      width: 100,
      sortable: true,
      slot: "rank"
    },
    { label: $t("activity.uefa5MatchTimes"), prop: "matchTimes", width: 80, slot: "matchTimes" },
    { label: $t("activity.uefa5Win"), prop: "win", width: 80, slot: "win" },
    { label: $t("activity.uefa5Tie"), prop: "tie", width: 80, slot: "tie" },
    { label: $t("activity.uefa5Lose"), prop: "lose", width: 80, slot: "lose" },
    { label: $t("activity.uefa5Difference"), prop: "difference", width: 80, slot: "difference" },
    { label: $t("activity.uefa5WinPercent"), prop: "winPercent", width: 90 },
    { label: $t("activity.uefa5Score"), prop: "score", width: 80, slot: "score" },
    {
      label: $t("activity.uefa5UpdatedUser"),
      prop: "updatedUser",
      width: 130,
      cellRenderer: ({ row }) => <span>{row.updatedUser || "-"}</span>
    },
    { label: $t("activity.uefa5UpdatedAt"), prop: "updatedAt", width: 160 }
  ];

  // 取得聯賽下拉資料
  async function loadLeagueOptions() {
    const { data } = await getUefa5LeagueScheduleList({});
    const list = (data?.list ?? [])
      .filter(item => searchForm.showInactive || item.isActive === 1)
      .map(item => ({ label: item.name, value: item.league }));
    leagueOptions.value = [{ label: $t("activity.all"), value: "" }, ...list];
  }

  async function onSearch() {
    loading.value = true;
    try {
      const params: Record<string, any> = {
        league: searchForm.league,
        team: searchForm.team,
        year: searchForm.year,
        matchType: searchForm.matchType,
        // multiple select 轉成逗號字串（沿用舊邏輯）
        matchGroup: searchForm.matchGroup.length
          ? searchForm.matchGroup.join(",")
          : undefined
      };
      // 移除空值
      Object.keys(params).forEach(k => {
        if (params[k] === "" || params[k] === undefined || params[k] === null) {
          delete params[k];
        }
      });
      const { data } = await getUefa5Board1List(params);
      dataList.value = data?.list ?? [];
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (formEl) formEl.resetFields();
    searchForm.league = "";
    searchForm.showInactive = false;
    searchForm.team = "";
    searchForm.year = "";
    searchForm.matchType = 0;
    searchForm.matchGroup = [];
    onSearch();
  }

  // 編輯單一儲存格（直接改 dataList 上對應列）
  function modify(value: any, field: keyof Uefa5Board1Item, teamId: number) {
    const target = dataList.value.find(i => i.worldCupTeamId === teamId);
    if (!target) return;
    if (field === "matchGroup") {
      (target as any)[field] = value;
    } else {
      (target as any)[field] = Number(value);
    }
  }

  // 一次儲存全部
  async function updateAllLists() {
    if (!dataList.value[0]) return;
    const tableDataList = dataList.value.map(item => ({
      ...item,
      drawPercent: 0,
      worldCupTeamId: item.worldCupTeamId
    }));
    const league = tableDataList[0].league;
    // 取得完整列表，與當前編輯結果合併（沿用舊行為）
    const { data } = await getUefa5Board1List({ league });
    const list = (data?.list ?? []).map(item => {
      const edited = tableDataList.find(t => t.team === item.team);
      return edited ? edited : item;
    });
    const { success } = await updateUefa5Board1({ league, list });
    if (success) {
      message($t("activity.editSuccess"), { type: "success" });
      onSearch();
    }
  }

  onMounted(() => {
    loadLeagueOptions();
  });

  return {
    searchForm,
    leagueOptions,
    groupList,
    matchTypeList,
    loading,
    columns,
    dataList,
    onSearch,
    resetForm,
    modify,
    updateAllLists,
    loadLeagueOptions
  };
}
