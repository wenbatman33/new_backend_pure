import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { exportExcel } from "@/utils/report";
import editForm from "../form.vue";
import {
  getQuizList,
  editQuizStatus,
  editQuiz,
  type QuizListItem
} from "@/api/activity";
import type { FormItemProps, QuizItem } from "./types";

/** 联赛清單（靜態資料，沿用舊 match 模組 leagueList） */
export const leagueList = [
  { label: "2022_world_cup", value: 1 },
  { label: "NBA", value: 2 },
  { label: "英超", value: 3 },
  { label: "西甲", value: 4 },
  { label: "意甲", value: 5 },
  { label: "德甲", value: 6 },
  { label: "法甲", value: 7 },
  { label: "欧冠", value: 8 },
  { label: "中超", value: 9 },
  { label: "CBA", value: 10 },
  { label: "KBL", value: 11 },
  { label: "2023FIFA", value: 12 },
  { label: "2024UEFA", value: 13 },
  { label: "2025世俱杯", value: 14 },
  { label: "2026FIFA_WC", value: 15 }
];

export function useQuiz() {
  const searchForm = reactive({
    status: "",
    startTime: "",
    endTime: ""
  });
  const dataList = ref<QuizItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const statusOptions = [
    { label: $t("activity.show"), value: "1" },
    { label: $t("activity.hide"), value: "0" }
  ];

  const columns: TableColumnList = [
    { label: "ID", prop: "id", width: 70 },
    { label: $t("activity.eventTime"), prop: "eventTime", width: 160 },
    { label: $t("activity.matchInfo"), prop: "info", minWidth: 180 },
    {
      label: $t("activity.league"),
      prop: "league",
      width: 120,
      cellRenderer: ({ row }) => {
        const found = leagueList.find(el => el.value === row.league);
        return <span>{found ? found.label : ""}</span>;
      }
    },
    {
      label: $t("activity.isShow"),
      prop: "status",
      width: 90,
      cellRenderer: ({ row }) => <span>{Number(row.status) === 1 ? "Y" : "N"}</span>
    },
    { label: $t("activity.quizStartTime"), prop: "startTime", width: 160 },
    { label: $t("activity.quizEndTime"), prop: "endTime", width: 160 },
    {
      label: $t("activity.quizMember"),
      prop: "quizMember",
      width: 100,
      cellRenderer: ({ row }) => (
        <el-link
          type="primary"
          onClick={() => exportExcel("/backend/match/quiz/csv", { id: row.id })}
        >
          {row.quizMember}
        </el-link>
      )
    },
    { label: $t("activity.lastOperator"), prop: "updatedUser", width: 120 },
    { label: $t("activity.lastUpdateTime"), prop: "updatedAt", width: 160 },
    { label: $t("activity.action"), fixed: "right", width: 160, slot: "operation" }
  ];

  /** 移除空查詢條件 */
  function buildSearch() {
    const search: Record<string, any> = {};
    Object.keys(searchForm).forEach(key => {
      const v = (searchForm as any)[key];
      if (v !== undefined && v !== "") search[key] = v;
    });
    return search;
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getQuizList(buildSearch());
      const list: QuizListItem[] = data?.list ?? [];
      dataList.value = list.map(item => ({
        ...item,
        info: `${item.awayTeamName} VS ${item.homeTeamName}`
      })) as QuizItem[];
      pagination.total = data?.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.status = "";
    searchForm.startTime = "";
    searchForm.endTime = "";
    onSearch();
  }

  /** 切換顯示/隱藏 */
  async function handleUpdateStatus(row: QuizItem, status: number) {
    const { success } = await editQuizStatus({ id: row.id, status });
    if (success) {
      message($t("activity.operationSuccess"), { type: "success" });
      onSearch();
    }
  }

  function openDialog(row: QuizItem) {
    const found = leagueList.find(el => el.value === row.league);
    const leagueName = found ? found.label : "";
    const info = `${row.eventTime} ${row.awayTeamName} VS ${row.homeTeamName}`;
    addDialog({
      title: $t("activity.editQuiz"),
      props: {
        mode: "edit",
        formInline: {
          id: row.id,
          quizId: row.id,
          info,
          leagueName,
          eventTime: row.eventTime,
          startTime: row.startTime ?? "",
          endTime: row.endTime ?? "",
          status: Number(row.status) || 0
        }
      },
      width: "640px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          const payload = {
            id: curData.quizId,
            startTime: curData.startTime,
            endTime: curData.endTime,
            status: curData.status
          };
          const { success } = await editQuiz(payload);
          if (success) {
            message($t("activity.operationSuccess"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    statusOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    openDialog,
    handleUpdateStatus
  };
}
