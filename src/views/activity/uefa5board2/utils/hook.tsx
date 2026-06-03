import { ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import {
  getUefa5Board2List,
  updateUefa5Board2,
  getLeagueScheduleList
} from "@/api/activity";
import type { Uefa5Board2Row, LeagueOption } from "./types";

// 聯賽靜態對照（舊 data.ts 的 leagueList，供表格 league 欄位顯示備援）
const leagueLabelMap: Record<number, string> = {
  3: $t("activity.uefa5board2League3"),
  4: $t("activity.uefa5board2League4"),
  5: $t("activity.uefa5board2League5"),
  6: $t("activity.uefa5board2League6"),
  7: $t("activity.uefa5board2League7")
};

export function useUefa5Board2() {
  const searchForm = reactive({
    league: "" as number | string,
    showInactive: false,
    team: ""
  });

  const dataList = ref<Uefa5Board2Row[]>([]);
  const leagueOptions = ref<LeagueOption[]>([]);
  const loading = ref(false);

  // 此頁不分頁（一次撈完整聯賽球隊），保留 pagination 物件僅供 pure-table 顯示總筆數
  const pagination = reactive({
    total: 0,
    pageSize: 100,
    currentPage: 1,
    background: true
  });

  // 可編輯欄位渲染：input 直接寫回 row
  function editableCell(prop: keyof Uefa5Board2Row, width = "60px") {
    return ({ row }) => (
      <el-input
        modelValue={String(row[prop] ?? 0)}
        size="small"
        style={{ width }}
        onInput={(val: string) => {
          row[prop] = Number(val);
        }}
      />
    );
  }

  const columns: TableColumnList = [
    {
      label: $t("activity.uefa5board2League"),
      prop: "league",
      width: 120,
      cellRenderer: ({ row }) => (
        <span>{leagueLabelMap[row.league] ?? row.league}</span>
      )
    },
    { label: $t("activity.uefa5board2Team"), prop: "team", width: 140 },
    {
      label: $t("activity.uefa5board2Rank"),
      prop: "rank",
      width: 90,
      sortable: true,
      cellRenderer: editableCell("rank", "70px")
    },
    {
      label: $t("activity.uefa5board2MatchTimes"),
      prop: "matchTimes",
      width: 80,
      cellRenderer: editableCell("matchTimes")
    },
    {
      label: $t("activity.uefa5board2Over"),
      prop: "over",
      width: 80,
      cellRenderer: editableCell("over")
    },
    {
      label: $t("activity.uefa5board2Draw"),
      prop: "draw",
      width: 80,
      cellRenderer: editableCell("draw")
    },
    {
      label: $t("activity.uefa5board2Under"),
      prop: "under",
      width: 80,
      cellRenderer: editableCell("under")
    },
    {
      label: $t("activity.uefa5board2OverPercent"),
      prop: "overPercent",
      width: 100,
      sortable: true
    },
    {
      label: $t("activity.uefa5board2DrawPercent"),
      prop: "drawPercent",
      width: 90
    },
    {
      label: $t("activity.uefa5board2UnderPercent"),
      prop: "underPercent",
      width: 90
    },
    {
      label: $t("activity.uefa5board2UpdatedUser"),
      prop: "updatedUser",
      width: 130,
      cellRenderer: ({ row }) => <span>{row.updatedUser || "-"}</span>
    },
    {
      label: $t("activity.uefa5board2UpdatedAt"),
      prop: "updatedAt",
      width: 160
    }
  ];

  // 取得聯賽下拉（沿用舊 getLeagueScheduleList，依 showInactive 過濾）
  async function loadLeagueOptions() {
    const { data } = await getLeagueScheduleList({});
    const list = (data?.list ?? [])
      .filter(item => searchForm.showInactive || item.isActive === 1)
      .map(item => ({ label: item.name, value: item.league }));
    leagueOptions.value = [{ label: $t("activity.uefa5board2All"), value: "" }, ...list];
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getUefa5Board2List({
        league: searchForm.league,
        team: searchForm.team
      });
      dataList.value = data?.list ?? [];
      pagination.total = dataList.value.length;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.league = "";
    searchForm.showInactive = false;
    searchForm.team = "";
    onSearch();
  }

  // 全部儲存：把整張表的可編輯欄位送回後端
  async function updateAllLists() {
    if (!dataList.value[0]) return;
    const list = dataList.value.map(item => ({
      worldCupTeamId: item.worldCupTeamId,
      rank: item.rank,
      matchTimes: item.matchTimes,
      over: item.over,
      under: item.under,
      draw: item.draw
    }));
    const { success } = await updateUefa5Board2({
      league: dataList.value[0].league,
      list
    });
    if (success) {
      message($t("activity.uefa5board2EditSuccess"), { type: "success" });
      onSearch();
    }
  }

  onMounted(async () => {
    await loadLeagueOptions();
    await onSearch();
  });

  return {
    searchForm,
    leagueOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    loadLeagueOptions,
    updateAllLists
  };
}
