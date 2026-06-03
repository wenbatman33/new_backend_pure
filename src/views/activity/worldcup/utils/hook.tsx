import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElMessageBox } from "element-plus";
import editForm from "../form.vue";
import {
  getWorldcupScheduleList,
  getWorldcupScheduleById,
  createWorldcupSchedule,
  editWorldcupSchedule,
  deleteWorldcupScheduleById,
  getWorldcupTeam,
  type WorldcupScheduleItem
} from "@/api/activity";
import type { FormItemProps } from "./types";

/** 狀態：1 未開始 / 2 進行中 / 3 完賽 / 4 取消 */
export const statusType = [
  { label: $t("activity.statusNotStarted"), value: 1 },
  { label: $t("activity.statusOngoing"), value: 2 },
  { label: $t("activity.statusFinished"), value: 3 },
  { label: $t("activity.statusCancelled"), value: 4 }
];

/** 賽事進程：1 小組賽 / 2 淘汰賽 */
export const matchType = [
  { label: $t("activity.matchTypeGroup"), value: 1 },
  { label: $t("activity.matchTypeKnockout"), value: 2 }
];

/** 賽果：勝 / 輸 / 平 */
export const resultType = [
  { label: $t("activity.resultWin"), value: "1" },
  { label: $t("activity.resultLose"), value: "2" },
  { label: $t("activity.resultDraw"), value: "3" }
];

/** 分組 */
export const matchGroupType = [
  { label: "A", value: 1 },
  { label: "B", value: 2 },
  { label: "C", value: 3 },
  { label: "D", value: 4 },
  { label: "E", value: 5 },
  { label: "F", value: 6 },
  { label: "G", value: 7 },
  { label: "H", value: 8 },
  { label: $t("activity.groupRound16"), value: 9 },
  { label: $t("activity.groupQuarter"), value: 10 },
  { label: $t("activity.groupSemi"), value: 11 },
  { label: $t("activity.groupThird"), value: 12 },
  { label: $t("activity.groupFinal"), value: 13 }
];

const statusMap: Record<number, string> = statusType.reduce(
  (acc, cur) => ((acc[cur.value] = cur.label), acc),
  {} as Record<number, string>
);
const matchTypeMap: Record<number, string> = matchType.reduce(
  (acc, cur) => ((acc[cur.value] = cur.label), acc),
  {} as Record<number, string>
);
const matchGroupMap: Record<number, string> = matchGroupType.reduce(
  (acc, cur) => ((acc[cur.value] = cur.label), acc),
  {} as Record<number, string>
);

function defaultFormInline(): FormItemProps {
  return {
    eventTime: "",
    isRed: 2,
    status: 1,
    awayTeam: 0,
    awayScore: "",
    awayResult: "",
    awayDiffer: "",
    awayPoint: "",
    homeTeam: 0,
    homeScore: "",
    homeResult: "",
    homeDiffer: "",
    homePoint: "",
    matchType: 1,
    matchGroup: 1,
    eventId: ""
  };
}

export function useWorldcup() {
  const searchForm = reactive({
    team: "",
    status: 0,
    matchType: 0,
    matchGroup: 0
  });
  const dataList = ref<WorldcupScheduleItem[]>([]);
  const loading = ref(true);
  const formRef = ref();
  /** 隊伍下拉（label/value），id 對 team 名稱 */
  const teamData = ref<Array<{ label: string; value: number | string }>>([]);
  const teamNameMap = ref<Record<string, string>>({});

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const statusOptions = [
    { label: $t("activity.all"), value: 0 },
    ...statusType
  ];
  const matchTypeOptions = [
    { label: $t("activity.all"), value: 0 },
    ...matchType
  ];
  const matchGroupOptions = [
    { label: $t("activity.all"), value: 0 },
    ...matchGroupType
  ];

  const columns: TableColumnList = [
    { label: "ID", prop: "id", width: 70 },
    { label: $t("activity.eventTime"), prop: "eventTime", width: 160 },
    {
      label: $t("activity.matchType"),
      prop: "matchType",
      cellRenderer: ({ row }) => (
        <span>{matchTypeMap[Number(row.matchType)] ?? ""}</span>
      )
    },
    {
      label: $t("activity.matchGroup"),
      prop: "matchGroup",
      cellRenderer: ({ row }) => (
        <span>{matchGroupMap[Number(row.matchGroup)] ?? ""}</span>
      )
    },
    {
      label: $t("activity.awayTeam"),
      prop: "awayTeam",
      cellRenderer: ({ row }) => (
        <span>{teamNameMap.value[String(row.awayTeam)] ?? $t("activity.none")}</span>
      )
    },
    {
      label: $t("activity.homeTeam"),
      prop: "homeTeam",
      cellRenderer: ({ row }) => (
        <span>{teamNameMap.value[String(row.homeTeam)] ?? $t("activity.none")}</span>
      )
    },
    { label: $t("activity.awayScore"), prop: "awayScore", width: 90 },
    { label: $t("activity.homeScore"), prop: "homeScore", width: 90 },
    {
      label: $t("activity.status"),
      prop: "status",
      cellRenderer: ({ row }) => <span>{statusMap[Number(row.status)] ?? ""}</span>
    },
    {
      label: $t("activity.grabRedEnvelope"),
      prop: "isRed",
      width: 90,
      cellRenderer: ({ row }) => (
        <span>{Number(row.isRed) === 1 ? "Y" : Number(row.isRed) === 2 ? "N" : ""}</span>
      )
    },
    { label: $t("activity.lastOperator"), prop: "updatedUser", width: 120 },
    { label: $t("activity.lastUpdatedAt"), prop: "updatedAt", width: 160 },
    { label: $t("activity.action"), fixed: "right", width: 160, slot: "operation" }
  ];

  async function loadTeam() {
    const { success, data } = await getWorldcupTeam();
    if (success) {
      const list = data?.list ?? [];
      teamData.value = list.map((it: any) => ({
        label: it.team,
        value: it.id + ""
      }));
      const map: Record<string, string> = {};
      list.forEach((it: any) => (map[String(it.id)] = it.team));
      teamNameMap.value = map;
    }
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getWorldcupScheduleList({
        team: searchForm.team,
        status: searchForm.status,
        matchType: searchForm.matchType,
        matchGroup: searchForm.matchGroup
      });
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.status = 0;
    searchForm.matchType = 0;
    searchForm.matchGroup = 0;
    onSearch();
  }

  function openDialog(title = $t("activity.add"), row?: FormItemProps) {
    addDialog({
      title: `${title} ${$t("activity.menuWorldcup")}`,
      props: {
        formInline: row ? { ...row } : defaultFormInline(),
        teamData: teamData.value
      },
      width: "960px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async (valid: boolean) => {
          if (!valid) return;
          const isEdit = !!curData.id;
          const fn = isEdit ? editWorldcupSchedule : createWorldcupSchedule;
          const { success } = await fn(curData);
          if (success) {
            message($t(isEdit ? "activity.editSuccess" : "activity.addSuccess"), {
              type: "success"
            });
            done();
            onSearch();
          }
        });
      }
    });
  }

  async function handleEdit(row: WorldcupScheduleItem) {
    const { success, data } = await getWorldcupScheduleById(row.id);
    if (success && data) {
      openDialog($t("activity.edit"), data as unknown as FormItemProps);
    }
  }

  function handleDelete(row: WorldcupScheduleItem) {
    ElMessageBox.confirm($t("activity.confirmDelete"), "", { type: "warning" })
      .then(async () => {
        const { success } = await deleteWorldcupScheduleById(row.id);
        if (success) {
          message($t("activity.deleteSuccess"), { type: "success" });
          onSearch();
        }
      })
      .catch(() => {});
  }

  onMounted(async () => {
    await loadTeam();
    onSearch();
  });

  return {
    searchForm,
    statusOptions,
    matchTypeOptions,
    matchGroupOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    openDialog,
    handleEdit,
    handleDelete
  };
}
