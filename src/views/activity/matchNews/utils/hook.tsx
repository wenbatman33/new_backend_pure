import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElMessageBox, ElImage } from "element-plus";
import { findByValue } from "@/utils/options";
import { getImagPath } from "@/utils/imgUrl";
import editForm from "../form.vue";
import {
  getMatchNewsList,
  getMatchNewsById,
  deleteMatchNewsById,
  editMatchNewsStatusById,
  createMatchNews,
  editMatchNews,
  getMatchTeamList,
  getMatchLeagueScheduleList
} from "@/api/activity";
import type { FormItemProps } from "./types";

const imagePath = getImagPath();

/** 聯賽靜態清單（沿用舊 views/activity/match/components/data.ts 之 leagueList） */
const leagueList = [
  { label: "2022_world_cup", value: 1 },
  { label: "NBA", value: 2 },
  { label: "英超", value: 3 },
  { label: "西甲", value: 4 },
  { label: "意甲", value: 5 },
  { label: "德甲", value: 6 },
  { label: "法甲", value: 7 },
  { label: "歐冠", value: 8 },
  { label: "中超", value: 9 },
  { label: "CBA", value: 10 },
  { label: "KBL", value: 11 },
  { label: "2023FIFA", value: 12 },
  { label: "2024UEFA", value: 13 },
  { label: "2025世俱杯", value: 14 },
  { label: "2026FIFA_WC", value: 15 }
];

export function useMatchNews() {
  const searchForm = reactive({
    league: "",
    showInactive: false,
    status: ""
  });
  const dataList = ref<any[]>([]);
  const loading = ref(true);
  const formRef = ref();
  /** 球隊清單（編輯時將 awayId/homeId 轉名稱用） */
  const teamData = ref<any[]>([]);
  /** 聯賽下拉（依賽程清單動態取得） */
  const leagueOptions = ref<{ label: string; value: any }[]>([]);

  const statusOptions = [
    { label: $t("activity.matchNewsShow"), value: 1 },
    { label: $t("activity.matchNewsHide"), value: 2 }
  ];

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    { label: "ID", prop: "id", width: 90 },
    { label: $t("activity.matchNewsEventTime"), prop: "eventTime", width: 170 },
    { label: $t("activity.matchNewsMatch"), prop: "info", minWidth: 140 },
    {
      label: $t("activity.matchNewsLeague"),
      prop: "league",
      width: 120,
      cellRenderer: ({ row }) => <span>{findByValue(leagueList, row.league)}</span>
    },
    {
      label: $t("activity.matchNewsAwayPc"),
      prop: "awayPc",
      width: 130,
      cellRenderer: ({ row }) => renderImage(row.awayPc)
    },
    {
      label: $t("activity.matchNewsAwayH5"),
      prop: "awayH5",
      width: 130,
      cellRenderer: ({ row }) => renderImage(row.awayH5)
    },
    {
      label: $t("activity.matchNewsHomePc"),
      prop: "homePc",
      width: 130,
      cellRenderer: ({ row }) => renderImage(row.homePc)
    },
    {
      label: $t("activity.matchNewsHomeH5"),
      prop: "homeH5",
      width: 130,
      cellRenderer: ({ row }) => renderImage(row.homeH5)
    },
    {
      label: $t("activity.matchNewsStatus"),
      prop: "status",
      width: 100,
      cellRenderer: ({ row }) => {
        const s = Number(row.status);
        return <span>{s === 1 ? "Y" : s === 2 ? "N" : ""}</span>;
      }
    },
    { label: $t("activity.matchNewsUpdatedUser"), prop: "updatedUser", minWidth: 120 },
    { label: $t("activity.matchNewsUpdatedAt"), prop: "updatedAt", width: 170 },
    {
      label: $t("activity.action"),
      fixed: "right",
      width: 220,
      slot: "operation"
    }
  ];

  function renderImage(filename: string) {
    if (!filename) return <span>--</span>;
    return h(ElImage, {
      src: imagePath + filename,
      style: "width:60px;height:60px;border-radius:4px",
      fit: "contain",
      previewSrcList: [imagePath + filename],
      previewTeleported: true
    });
  }

  async function onSearch() {
    loading.value = true;
    try {
      const params: any = {
        league: searchForm.league,
        showInactive: searchForm.showInactive
      };
      // 舊邏輯：status 為空字串時不送
      if (searchForm.status !== "") params.status = searchForm.status;
      const { data } = await getMatchNewsList(params);
      const list = (data?.list ?? []).map((item: any) => {
        item.info = `${item.awayTeamName} VS ${item.homeTeamName}`;
        return item;
      });
      dataList.value = list;
      pagination.total = data?.total ?? list.length;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.league = "";
    searchForm.showInactive = false;
    searchForm.status = "";
    onSearch();
  }

  /** 取聯賽下拉選項（依賽程清單） */
  async function loadLeagueOptions() {
    const { data } = await getMatchLeagueScheduleList({});
    const list = (data?.list ?? [])
      .filter((item: any) => searchForm.showInactive || item.isActive === 1)
      .map((item: any) => ({ label: item.name, value: item.league }));
    leagueOptions.value = [{ label: $t("activity.all"), value: "" }, ...list];
  }

  /** 取球隊清單 */
  async function loadTeamData() {
    const { data } = await getMatchTeamList();
    teamData.value = data?.list ?? [];
  }

  /** 顯示/隱藏切換 */
  async function handleUpdateStatus(row: any) {
    const { success } = await editMatchNewsStatusById(row.id);
    if (success) {
      message($t("activity.matchNewsStatusSuccess"), { type: "success" });
      onSearch();
    }
  }

  /** 開啟編輯對話框 */
  async function openDialog(row: any) {
    const { data } = await getMatchNewsById(row.id);
    const result: any = data ?? {};

    const foundAway = teamData.value.find(t => t.id === row.awayId);
    const foundHome = teamData.value.find(t => t.id === row.homeId);
    const awayTeam = foundAway ? foundAway.team : "无";
    const homeTeam = foundHome ? foundHome.team : "无";
    const leagueName = findByValue(leagueList, row.league) || "";

    const formInline: FormItemProps = {
      id: result.id,
      matchScheduleId: result.matchScheduleId ?? row.id,
      eventTime: row.eventTime,
      league: row.league,
      leagueName,
      homeTeam,
      awayTeam,
      homeScore: result.homeScore,
      awayScore: result.awayScore,
      homePc: result.homePc,
      homeH5: result.homeH5,
      awayPc: result.awayPc,
      awayH5: result.awayH5,
      homeExplain: result.homeExplain,
      awayExplain: result.awayExplain,
      recommend: result.recommend,
      matchExplain: result.matchExplain
    };

    addDialog({
      title: $t("activity.matchNewsEditTitle"),
      props: { formInline, isEdit: true },
      width: "800px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async (valid: boolean) => {
          if (!valid) return;
          const payload = { ...curData, matchScheduleId: curData.matchScheduleId };
          const { success } = await editMatchNews(payload);
          if (success) {
            message($t("activity.matchNewsEditSuccess"), { type: "success" });
            done();
            onSearch();
          } else {
            message($t("activity.matchNewsEditFail"), { type: "error" });
          }
        });
      }
    });
  }

  /** 刪除 */
  function handleDelete(row: any) {
    ElMessageBox.confirm($t("activity.matchNewsConfirmDelete"), "", {
      type: "warning"
    })
      .then(async () => {
        const { success } = await deleteMatchNewsById(row.id);
        if (success) {
          message($t("activity.matchNewsDeleteSuccess"), { type: "success" });
          onSearch();
        }
      })
      .catch(() => {});
  }

  onMounted(async () => {
    await Promise.all([loadTeamData(), loadLeagueOptions()]);
    onSearch();
  });

  return {
    searchForm,
    leagueOptions,
    statusOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    openDialog,
    handleUpdateStatus,
    handleDelete,
    loadLeagueOptions
  };
}

// createMatchNews 於新增流程使用；目前舊後台新增入口在賽程頁觸發，本模組列表頁僅編輯/刪除/狀態。
// 保留 import 供後續擴充，避免 tree-shaking 報未使用而拿掉 api。
void createMatchNews;
