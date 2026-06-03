import { h, ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElMessageBox } from "element-plus";
import editForm from "../form.vue";
import {
  getJpushList,
  getJpushDetail,
  addJpushSend,
  addJpushSchedule,
  editJpushSchedule,
  deleteJpushSchedule
} from "@/api/operator";
import type { JpushItem, FormItemProps } from "./types";

/** 狀態：1 已發送 / 2 定時推送已註冊 / 3 已刪除 */
export const statusOptions = [
  { label: $t("operator.jpushStatusSent"), value: 1 },
  { label: $t("operator.jpushStatusScheduled"), value: 2 },
  { label: $t("operator.jpushStatusDeleted"), value: 3 }
];

/**
 * 引導位置類型
 * TODO: 舊碼以 @/views/common/DeepLinkType 元件搭配 deeplink.ts 完整選單渲染，
 * 該元件與 @/utils/dropdown 尚未移植，此處先以簡化版下拉 + 引導 ID 輸入取代。
 */
export const deeplinkTypeOptions = [
  { label: $t("operator.none"), value: 0 },
  { label: $t("operator.inProduct"), value: 1 },
  { label: $t("operator.inProductWeb"), value: 2 },
  { label: $t("operator.openAnotherWindow"), value: 3 },
  { label: $t("operator.needLogin"), value: 4 },
  { label: $t("operator.IndependentActivityPage"), value: 5 },
  { label: $t("operator.enterGame"), value: 6 },
  { label: $t("operator.link"), value: 8 },
  { label: $t("operator.other"), value: 9 }
];

const statusMap: Record<number, string> = statusOptions.reduce((acc, cur) => {
  acc[cur.value] = cur.label;
  return acc;
}, {} as Record<number, string>);

const deeplinkMap: Record<number, string> = deeplinkTypeOptions.reduce((acc, cur) => {
  acc[cur.value] = cur.label;
  return acc;
}, {} as Record<number, string>);

export function useJpush() {
  const searchForm = reactive({
    status: 0,
    sendTimeStart: "",
    sendTimeEnd: "",
    sendTimeRange: [] as string[]
  });
  const dataList = ref<JpushItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    { label: "ID", prop: "id", width: 70, sortable: true },
    { label: $t("operator.jpushColTitle"), prop: "title", minWidth: 160 },
    { label: $t("operator.jpushColContent"), prop: "alert", minWidth: 180 },
    {
      label: $t("operator.jpushColDeeplink"),
      prop: "deeplinkType",
      minWidth: 140,
      cellRenderer: ({ row }) => {
        const base = deeplinkMap[row.deeplinkType] ?? $t("operator.none");
        if (row.deeplinkID) {
          return <span>{base + ":" + row.deeplinkID}</span>;
        }
        return <span>{base}</span>;
      }
    },
    { label: $t("operator.jpushColSendTime"), prop: "sendTime", width: 160, sortable: true },
    {
      label: $t("operator.jpushColStatus"),
      prop: "status",
      width: 130,
      cellRenderer: ({ row }) => <span>{statusMap[row.status] ?? ""}</span>
    },
    { label: $t("operator.jpushColUpdatedAt"), prop: "updatedAt", width: 160, sortable: true },
    { label: $t("operator.jpushColUpdatedUser"), prop: "updatedUser", minWidth: 140 },
    { label: $t("operator.action"), fixed: "right", width: 160, slot: "operation" }
  ];

  async function onSearch() {
    loading.value = true;
    const range = searchForm.sendTimeRange || [];
    const params: Record<string, any> = {
      orderItem: 1,
      order: 1
    };
    if (searchForm.status) params.status = searchForm.status;
    if (range[0]) params.sendTimeStart = range[0];
    if (range[1]) params.sendTimeEnd = range[1];
    try {
      const { data } = await getJpushList(params);
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
    searchForm.sendTimeRange = [];
    onSearch();
  }

  function openDialog(isEdit = false, row?: JpushItem) {
    const defaultData: FormItemProps = {
      startType: 1,
      sendTime: "",
      memberType: 1,
      platform: 1,
      deeplinkType: 0,
      deeplinkPage: "",
      deeplinkID: "",
      title: "",
      content: ""
    };
    const formInline: FormItemProps = isEdit && row
      ? {
          id: row.id,
          startType: 2,
          sendTime: row.sendTime ?? "",
          memberType: 1,
          platform: 1,
          deeplinkType: row.deeplinkType ?? 0,
          deeplinkPage: row.deeplinkPage ?? "",
          deeplinkID: row.deeplinkID ?? "",
          title: row.title ?? "",
          content: row.alert ?? ""
        }
      : defaultData;

    addDialog({
      title: (isEdit ? $t("operator.edit") : $t("operator.add")) + $t("operator.jpushBroadcast"),
      props: { formInline, isEdit },
      width: "800px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          const payload: Record<string, any> = {
            title: curData.title,
            content: curData.content,
            platform: curData.platform,
            deeplinkType: curData.deeplinkType,
            deeplinkPage: curData.deeplinkPage,
            deeplinkID: curData.deeplinkID
          };
          let success = false;
          if (isEdit) {
            // 立即發送時 sendTime 取當下時間
            payload.id = curData.id;
            payload.sendTime =
              Number(curData.startType) === 1
                ? dayjs().add(1, "second").format("YYYY-MM-DD HH:mm:ss")
                : curData.sendTime;
            ({ success } = await editJpushSchedule(payload));
          } else if (Number(curData.startType) === 1) {
            ({ success } = await addJpushSend(payload));
          } else {
            payload.sendTime = curData.sendTime;
            ({ success } = await addJpushSchedule(payload));
          }
          if (success) {
            message(
              (isEdit ? $t("operator.edit") : $t("operator.add")) +
                $t("operator.jpushBroadcast"),
              { type: "success" }
            );
            done();
            onSearch();
          }
        });
      }
    });
  }

  async function handleEdit(row: JpushItem) {
    const { success, data } = await getJpushDetail(row.id);
    if (success && data) {
      openDialog(true, data);
    } else {
      openDialog(true, row);
    }
  }

  function handleDelete(row: JpushItem) {
    ElMessageBox.confirm($t("operator.confirmDelete"), "", {
      type: "warning"
    })
      .then(async () => {
        const { success } = await deleteJpushSchedule(row.id);
        if (success) {
          message($t("operator.deleteSuccess"), { type: "success" });
          onSearch();
        }
      })
      .catch(() => {});
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
    handleEdit,
    handleDelete
  };
}
