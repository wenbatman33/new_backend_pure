import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElMessageBox } from "element-plus";
import editForm from "../form.vue";
import {
  getStreamingLiveList,
  getStreamingLiveById,
  editStreamingLive,
  deleteStreamingLiveById,
  getStreamingTeam,
  type StreamingLiveItem
} from "@/api/activity";
import type { FormItemProps } from "./types";

// 賽事類型（沿用舊 worldcup data 常數）
const matchType = [
  { label: "小组赛", value: 1 },
  { label: "淘汰赛", value: 2 }
];
const matchGroupType = [
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

export function useStreaming() {
  const searchForm = reactive({
    team: "",
    isLive: 0
  });
  const dataList = ref<StreamingLiveItem[]>([]);
  const loading = ref(true);
  const formRef = ref();
  const teamData = ref<any[]>([]);

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  // 是否直播下拉（含「全部」）
  const isLiveOptions = [
    { label: $t("activity.streamingAll"), value: 0 },
    { label: $t("activity.streamingYes"), value: 1 },
    { label: $t("activity.streamingNo"), value: 2 }
  ];

  const yesNoRender = (text: any) => {
    const v = Number(text);
    if (v === 1) return "Y";
    if (v === 2) return "N";
    return "";
  };

  const columns: TableColumnList = [
    { label: "ID", prop: "id", width: 70 },
    { label: $t("activity.streamingEventTime"), prop: "eventTime", width: 160 },
    { label: $t("activity.streamingEvent"), prop: "game", minWidth: 200 },
    {
      label: $t("activity.streamingIsLiveLabel"),
      prop: "isLiveLabel",
      width: 80,
      cellRenderer: ({ row }) => <span>{yesNoRender(row.isLiveLabel)}</span>
    },
    {
      label: $t("activity.streamingIsShow"),
      prop: "isLive",
      width: 90,
      cellRenderer: ({ row }) => <span>{yesNoRender(row.isLive)}</span>
    },
    {
      label: $t("activity.streamingLink"),
      prop: "link",
      minWidth: 250,
      cellRenderer: ({ row }) => (
        <ul style="text-align:left;padding:0 10px;list-style-type:disc">
          {(Array.isArray(row.link) ? row.link : []).map((str: string) => (
            <li style="margin-top:5px;margin-left:16px">{str}</li>
          ))}
        </ul>
      )
    },
    { label: $t("activity.streamingUpdatedUser"), prop: "updatedUser", width: 120 },
    { label: $t("activity.streamingUpdatedAt"), prop: "updatedAt", width: 160 },
    { label: $t("activity.action"), fixed: "right", width: 150, slot: "operation" }
  ];

  // 與舊 afterFetch 一致：拼出 game / info 顯示字串
  function decorate(list: any[]) {
    return list.map(item => {
      const foundAway = teamData.value.find(e => e.id === item.awayTeam);
      const awayTeam = foundAway ? foundAway.team : "无";
      const foundHome = teamData.value.find(e => e.id === item.homeTeam);
      const homeTeam = foundHome ? foundHome.team : "无";
      const mt = matchType.find(e => e.value === item.matchType);
      const matchTypeLabel = mt ? mt.label : "";
      const mg = matchGroupType.find(e => e.value === item.matchGroup);
      const matchGroupLabel = mg ? mg.label : "";

      item.game = `${matchTypeLabel}-${matchGroupLabel} ${awayTeam} VS ${homeTeam}`;
      item.info = `${(item.eventTime || "")
        .substring(0, 10)
        .replaceAll("-", "/")} ${awayTeam} vs ${homeTeam} ${matchTypeLabel} ${matchGroupLabel}`;
      return item;
    });
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getStreamingLiveList({
        team: searchForm.team,
        isLive: searchForm.isLive
      });
      dataList.value = decorate(data?.list ?? []);
      pagination.total = data?.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.isLive = 0;
    onSearch();
  }

  async function openDialog(row: StreamingLiveItem) {
    const { data: result } = await getStreamingLiveById(row.id);
    const detail = result ?? ({} as any);
    if (!detail.worldCupScheduleId) detail.worldCupScheduleId = row.id;
    const link: string[] = Array.isArray(detail.link) ? detail.link : [];

    addDialog({
      title: $t("activity.streamingEditTitle"),
      props: {
        formInline: {
          info: row.info,
          worldCupScheduleId: detail.worldCupScheduleId,
          link1: link[0] ?? "",
          link2: link[1] ?? "",
          link3: link[2] ?? "",
          link4: link[3] ?? "",
          link5: link[4] ?? "",
          isLiveLabel: detail.isLiveLabel === 1 ? 1 : 2,
          isLive: detail.isLive === 1 ? 1 : 2
        }
      },
      width: "1000px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          const link: string[] = [];
          if (curData.link1) link.push(curData.link1);
          if (curData.link2) link.push(curData.link2);
          if (curData.link3) link.push(curData.link3);
          if (curData.link4) link.push(curData.link4);
          if (curData.link5) link.push(curData.link5);
          const { success } = await editStreamingLive({
            worldCupScheduleId: curData.worldCupScheduleId,
            isLive: curData.isLive,
            isLiveLabel: curData.isLiveLabel,
            link
          });
          if (success) {
            message($t("activity.streamingEditSuccess"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  function handleDelete(row: StreamingLiveItem) {
    ElMessageBox.confirm($t("activity.streamingConfirmDelete"), "", {
      type: "warning"
    })
      .then(async () => {
        const { success } = await deleteStreamingLiveById(row.id);
        if (success) {
          message($t("activity.streamingDeleteSuccess"), { type: "success" });
          onSearch();
        }
      })
      .catch(() => {});
  }

  onMounted(async () => {
    const { data } = await getStreamingTeam();
    teamData.value = data?.list ?? [];
    onSearch();
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
    openDialog,
    handleDelete
  };
}
