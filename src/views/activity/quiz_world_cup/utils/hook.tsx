import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import editForm from "../form.vue";
import {
  getWorldCupQuizList,
  getWorldCupQuizById,
  editWorldCupQuiz,
  editWorldCupQuizStatus,
  getWorldCupTeam,
  getWorldCupScheduleList,
  type WorldCupQuizItem
} from "@/api/activity";
import type { FormItemProps } from "./types";

// 赛事类型：1 小组赛 / 2 淘汰赛
const matchType = [
  { label: $t("activity.quizMatchGroupStage"), value: 1 },
  { label: $t("activity.quizMatchKnockout"), value: 2 }
];
// 赛事分组 A~H
const matchGroupType = [
  { label: "A", value: 1 },
  { label: "B", value: 2 },
  { label: "C", value: 3 },
  { label: "D", value: 4 },
  { label: "E", value: 5 },
  { label: "F", value: 6 },
  { label: "G", value: 7 },
  { label: "H", value: 8 }
];

export function useQuizWorldCup() {
  const searchForm = reactive({
    team: "",
    isLive: 0
  });
  const dataList = ref<WorldCupQuizItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  // 队伍 / 赛程对照表
  const teamData = ref<any[]>([]);
  const scheduleData = ref<any[]>([]);

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  // 是否显示选项：0 全部 / 1 是 / 2 否
  const isLiveOptions = [
    { label: $t("activity.quizAll"), value: 0 },
    { label: $t("activity.quizYes"), value: 1 },
    { label: $t("activity.quizNo"), value: 2 }
  ];

  const getScheduleById = (id: number) => {
    const found = scheduleData.value.find(el => el.id === id);
    return found ? found : {};
  };

  const columns: TableColumnList = [
    { label: "ID", prop: "id", width: 70 },
    { label: $t("activity.quizEventTime"), prop: "eventTime", width: 160 },
    { label: $t("activity.quizGame"), prop: "game", minWidth: 220 },
    {
      label: $t("activity.quizIsShow"),
      prop: "status",
      width: 90,
      cellRenderer: ({ row }) => {
        const s = Number(row.status);
        return <span>{s === 1 ? "Y" : s === 2 ? "N" : ""}</span>;
      }
    },
    { label: $t("activity.quizStartTime"), prop: "startTime", width: 160 },
    { label: $t("activity.quizEndTime"), prop: "endTime", width: 160 },
    {
      label: $t("activity.quizMemberCnt"),
      prop: "worldCupQuizMemberCnt",
      width: 110,
      cellRenderer: ({ row }) =>
        h(
          "a",
          {
            href:
              "/activity/quizList?worldCupScheduleId=" +
              row.worldCupScheduleId,
            target: "_blank",
            style: "color: var(--el-color-primary)"
          },
          row.worldCupQuizMemberCnt
        )
    },
    { label: $t("activity.quizUpdatedUser"), prop: "updatedUser", width: 120 },
    { label: $t("activity.quizUpdatedAt"), prop: "updatedAt", width: 160 },
    {
      label: $t("activity.quizAction"),
      fixed: "right",
      width: 200,
      slot: "operation"
    }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getWorldCupQuizList({
        team: searchForm.team,
        isLive: searchForm.isLive
      });
      const rawList = data?.list ?? [];
      // 沿用舊邏輯：用赛程对照补上 game / eventTime / info
      dataList.value = rawList.map((item: any) => {
        const res: any = getScheduleById(item.worldCupScheduleId);
        return {
          ...item,
          game: res.game,
          eventTime: res.eventTime,
          info: res.info
        };
      });
      pagination.total = data?.total ?? dataList.value.length;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }

  // 显示 / 隐藏 切换
  async function handleUpdateStatus(row: WorldCupQuizItem, status: number) {
    const { success } = await editWorldCupQuizStatus({ id: row.id, status });
    if (success) {
      message($t("activity.quizUpdateSuccess"), { type: "success" });
      onSearch();
    }
  }

  // 编辑竞猜（仅可修改竞猜开始/结束时间）
  async function handleOpenEditModal(row: WorldCupQuizItem) {
    const { data } = await getWorldCupQuizById(row.id);
    const result: any = data ?? {};
    if (!result.worldCupScheduleId) result.worldCupScheduleId = row.id;
    addDialog({
      title: $t("activity.quizEditTitle"),
      props: {
        formInline: {
          id: result.id ?? row.id,
          info: (row as any).info ?? "",
          startTime: result.startTime ?? "",
          endTime: result.endTime ?? ""
        }
      },
      width: "600px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          const { success } = await editWorldCupQuiz({
            id: curData.id,
            startTime: curData.startTime,
            endTime: curData.endTime
          });
          if (success) {
            message($t("activity.quizUpdateSuccess"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  // 載入队伍与赛程对照（沿用旧 onMounted 逻辑）
  async function loadSchedule() {
    const { data: teamRes } = await getWorldCupTeam();
    teamData.value = teamRes?.list ?? [];

    const { data: scheduleRes } = await getWorldCupScheduleList({
      pageSize: 9999
    });
    const list = scheduleRes?.list ?? [];
    scheduleData.value = list.map((item: any) => {
      const foundAway = teamData.value.find(el => el.id === item.awayTeam);
      const awayTeam = foundAway ? foundAway.team : "无";
      const foundHome = teamData.value.find(el => el.id === item.homeTeam);
      const homeTeam = foundHome ? foundHome.team : "无";
      const foundMatchType = matchType.find(el => el.value === item.matchType);
      const mType = foundMatchType ? foundMatchType.label : "";
      const foundMatchGroup = matchGroupType.find(
        el => el.value === item.matchGroup
      );
      const mGroup = foundMatchGroup ? foundMatchGroup.label : "";
      const eventTime = item.eventTime ?? "";
      return {
        ...item,
        awayTeam,
        homeTeam,
        matchType: mType,
        matchGroup: mGroup,
        game: `${mType}-${mGroup} ${awayTeam} VS  ${homeTeam}`,
        info: `${eventTime
          .substring(0, 10)
          .replaceAll("-", "/")} ${awayTeam} vs ${homeTeam} ${mType} ${mGroup}`
      };
    });
  }

  onMounted(async () => {
    await loadSchedule();
    await onSearch();
  });

  return {
    searchForm,
    isLiveOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    handleUpdateStatus,
    handleOpenEditModal
  };
}
