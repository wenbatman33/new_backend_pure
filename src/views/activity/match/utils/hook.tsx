import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElMessageBox } from "element-plus";
import editForm from "../form.vue";
import {
  getMatchScheduleList,
  getMatchScheduleById,
  createMatchSchedule,
  editMatchSchedule,
  deleteMatchScheduleById,
  getMatchLeagueScheduleList,
  getMatchTeamList,
  type MatchScheduleItem
} from "@/api/activity";
import { matchType, matchGroup, leagueList } from "./enums";
import type { FormItemProps } from "./types";

export function useMatch() {
  const searchForm = reactive({
    league: "",
    showInactive: false,
    redPacket: "",
    eventTimeStart: "",
    eventTimeEnd: "",
    matchType: "",
    matchGroup: ""
  });
  const dataList = ref<MatchScheduleItem[]>([]);
  const loading = ref(true);
  const formRef = ref();
  // 联赛下拉（搜寻列 + 表单共用）
  const leagueOptions = ref<Array<{ label: string; value: any }>>([]);

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const findLabel = (arr: any[], v: any) =>
    arr.find(item => item.value == v)?.label ?? "";

  const columns: TableColumnList = [
    { label: "ID", prop: "id", width: 70 },
    { label: $t("activity.matchEventTime"), prop: "eventTime", sortable: true, width: 160 },
    {
      label: $t("activity.matchLeague"),
      prop: "league",
      cellRenderer: ({ row }) => <span>{findLabel(leagueList, row.league)}</span>
    },
    {
      label: $t("activity.matchEventProgress"),
      prop: "matchType",
      cellRenderer: ({ row }) => <span>{findLabel(matchType, row.matchType)}</span>
    },
    {
      label: $t("activity.matchGroupLabel"),
      prop: "matchGroup",
      width: 80,
      cellRenderer: ({ row }) => <span>{findLabel(matchGroup, row.matchGroup)}</span>
    },
    { label: $t("activity.matchAwayTeam"), prop: "awayTeamName" },
    { label: $t("activity.matchHomeTeam"), prop: "homeTeamName" },
    {
      label: $t("activity.matchRedPacket"),
      prop: "redPacket",
      width: 110,
      cellRenderer: ({ row }) => <span>{Number(row.redPacket) === 1 ? "Y" : "N"}</span>
    },
    { label: $t("activity.matchRedPacketStartTime"), prop: "redPacketStartTime", sortable: true, width: 160 },
    { label: $t("activity.matchRedPacketEndTime"), prop: "redPacketEndTime", sortable: true, width: 160 },
    { label: $t("activity.matchRemark"), prop: "remark" },
    { label: $t("activity.matchUpdatedUser"), prop: "updatedUser", width: 120 },
    { label: $t("activity.matchUpdatedAt"), prop: "updatedAt", sortable: true, width: 160 },
    { label: $t("activity.action"), fixed: "right", width: 120, slot: "operation" }
  ];

  // 取得联赛下拉（依 showInactive 过滤）
  async function fetchLeagueOptions(showInactive = false) {
    const { data } = await getMatchLeagueScheduleList({});
    const list = (data?.list ?? [])
      .filter((item: any) => showInactive || item.isActive === 1)
      .map((item: any) => ({ label: item.name, value: item.league }));
    leagueOptions.value = [{ label: $t("activity.all"), value: "" }, ...list];
  }

  // 依联赛取得队伍下拉
  async function fetchTeamOptions(league: number | string) {
    const { data } = await getMatchTeamList({ league });
    return (data?.list ?? []).map((item: any) => ({
      label: item.team,
      value: item.id + ""
    }));
  }

  async function onSearch() {
    loading.value = true;
    try {
      const params: any = {
        league: searchForm.league,
        matchType: searchForm.matchType,
        matchGroup: searchForm.matchGroup,
        eventTimeStart: searchForm.eventTimeStart,
        eventTimeEnd: searchForm.eventTimeEnd
      };
      if (searchForm.redPacket !== "") params.redPacket = searchForm.redPacket;
      const { data } = await getMatchScheduleList(params);
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.redPacket = "";
    searchForm.showInactive = false;
    onSearch();
  }

  async function openDialog(title = $t("activity.add"), row?: MatchScheduleItem) {
    let formInline: FormItemProps = {
      eventTime: "",
      league: 2,
      awayTeam: 0,
      homeTeam: 0,
      redPacket: 0,
      remark: ""
    };
    // 编辑时取明细
    if (row?.id) {
      const { data } = await getMatchScheduleById(row.id);
      formInline = { ...formInline, ...data, id: row.id };
    }
    const teamOptions = ref(await fetchTeamOptions(formInline.league || 2));

    addDialog({
      title: `${title} ${$t("activity.matchSchedule")}`,
      props: {
        formInline,
        teamOptions: teamOptions.value,
        leagueOptions: leagueOptions.value,
        onLeagueChange: async (league: number | string) => {
          teamOptions.value = await fetchTeamOptions(league);
        }
      },
      width: "1000px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async (valid: boolean) => {
          if (!valid) return;
          const payload: any = { ...curData };
          const fn = row?.id ? editMatchSchedule : createMatchSchedule;
          if (row?.id) payload.id = row.id;
          const { success } = await fn(payload);
          if (success) {
            message($t("activity.handleSuccess"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  function handleDelete(row: MatchScheduleItem) {
    ElMessageBox.confirm($t("activity.confirmDelete"), "", {
      type: "warning"
    })
      .then(async () => {
        const { success } = await deleteMatchScheduleById(row.id);
        if (success) {
          message($t("activity.deleteSuccess"), { type: "success" });
          onSearch();
        }
      })
      .catch(() => {});
  }

  // TODO: 战情文章/赛事竞猜 跳转其他模组 (matchNews / quiz 尚未移植)，先以提示替代
  function handleCreateNews() {
    message($t("activity.notMigrated"), { type: "warning" });
  }
  function handleCreateQuiz() {
    message($t("activity.notMigrated"), { type: "warning" });
  }

  onMounted(async () => {
    await fetchLeagueOptions();
    onSearch();
  });

  return {
    searchForm,
    matchType,
    matchGroup,
    leagueOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    openDialog,
    handleDelete,
    handleCreateNews,
    handleCreateQuiz
  };
}
