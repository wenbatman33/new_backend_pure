import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { transformI18n as $t } from "@/plugins/i18n";
import {
  getQuizMemberList,
  getWorldCupTeam,
  getWorldCupScheduleList
} from "@/api/activity";
import type { QuizMemberItem, ScheduleOption } from "./types";

// 赛事类型（对应旧 worldcup/components/data.ts matchType）
const matchTypeMap: Record<number, string> = {
  1: $t("activity.quizMatchTypeGroup"),
  2: $t("activity.quizMatchTypeKnockout")
};

// 赛事组别（对应旧 matchGroupType）
const matchGroupMap: Record<number, string> = {
  1: "A",
  2: "B",
  3: "C",
  4: "D",
  5: "E",
  6: "F",
  7: "G",
  8: "H",
  9: $t("activity.quizGroupRound16"),
  10: $t("activity.quizGroupQuarter"),
  11: $t("activity.quizGroupSemi"),
  12: $t("activity.quizGroupThird"),
  13: $t("activity.quizGroupFinal")
};

export function useQuizList() {
  const route = useRoute();
  const searchForm = reactive({
    memberAccount: "",
    awayQuiz: "",
    homeQuiz: "",
    worldCupScheduleId: ""
  });
  const dataList = ref<QuizMemberItem[]>([]);
  const scheduleOptions = ref<ScheduleOption[]>([]);
  const loading = ref(true);

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    { label: "ID", prop: "id", width: 70 },
    {
      label: $t("activity.quizMemberAccount"),
      prop: "memberAccount",
      width: 150,
      cellRenderer: ({ row }) => (
        <a
          href={`/memberDetail/detail/${row.memberId}`}
          target="_blank"
          style="color: var(--el-color-primary)"
        >
          {row.memberAccount}
        </a>
      )
    },
    { label: $t("activity.quizJoinTime"), prop: "createdAt", width: 170 },
    { label: $t("activity.quizAwayScore"), prop: "awayQuiz", width: 120 },
    { label: $t("activity.quizHomeScore"), prop: "homeQuiz", width: 120 },
    { label: $t("activity.quizMatchInfo"), prop: "info", minWidth: 240 }
  ];

  // 依 worldCupScheduleId 取赛程详情
  const scheduleDetailMap = ref<Record<number, any>>({});

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getQuizMemberList({
        memberAccount: searchForm.memberAccount,
        awayQuiz: searchForm.awayQuiz,
        homeQuiz: searchForm.homeQuiz,
        worldCupScheduleId: searchForm.worldCupScheduleId,
        page: pagination.currentPage,
        pageSize: pagination.pageSize
      });
      const list: QuizMemberItem[] = data?.list ?? [];
      // 旧逻辑：依赛程 id 补充 game / eventTime / info
      list.forEach(item => {
        const res = scheduleDetailMap.value[item.worldCupScheduleId];
        if (res) {
          item.game = res.game;
          item.eventTime = res.eventTime;
          item.info = res.info;
        }
      });
      dataList.value = list;
      pagination.total = data?.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    pagination.currentPage = 1;
    onSearch();
  }

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  // 初始化赛事下拉与赛程详情（旧 index.vue onMounted 逻辑）
  async function initSchedule() {
    const teamRes = await getWorldCupTeam();
    const teamList: any[] = teamRes?.data?.list ?? [];
    const findTeam = (id: number) => {
      const t = teamList.find(e => e.id === id);
      return t ? t.team : $t("activity.quizNone");
    };

    const scheduleRes = await getWorldCupScheduleList({ pageSize: 9999 });
    const dataList = scheduleRes?.data?.list ?? [];
    const options: ScheduleOption[] = [];
    dataList.forEach((item: any) => {
      const awayTeam = findTeam(item.awayTeam);
      const homeTeam = findTeam(item.homeTeam);
      const matchType = matchTypeMap[item.matchType] ?? "";
      const matchGroup = matchGroupMap[item.matchGroup] ?? "";
      const game = `${matchType}-${matchGroup} ${awayTeam} VS ${homeTeam}`;
      const info = `${(item.eventTime ?? "")
        .substring(0, 10)
        .replaceAll("-", "/")} ${awayTeam} vs ${homeTeam} ${matchType} ${matchGroup}`;
      scheduleDetailMap.value[item.id] = {
        game,
        eventTime: item.eventTime,
        info
      };
      options.push({ label: `${item.eventTime} ${game}`, value: item.id });
    });
    scheduleOptions.value = options;
  }

  onMounted(async () => {
    await initSchedule();
    // 由路由 query 带入预选赛事
    const worldCupScheduleId = Number(route.query.worldCupScheduleId);
    if (worldCupScheduleId > 0) {
      searchForm.worldCupScheduleId = String(worldCupScheduleId);
    }
    onSearch();
  });

  return {
    searchForm,
    scheduleOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    handleSizeChange,
    handleCurrentChange
  };
}
