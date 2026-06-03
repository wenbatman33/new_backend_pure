import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElMessageBox, ElTag } from "element-plus";
import editForm from "../form.vue";
import scoreForm from "../scoreForm.vue";
import idManage from "../idManage.vue";
import {
  getPromotionEventList,
  addPromotionEvent,
  editPromotionEvent,
  editPromotionEventScore,
  deletePromotionEvent
} from "@/api/promotion";
import type { EventItem, FormItemProps, ScoreFormItemProps } from "./types";

export function usePromotionEventList() {
  const searchForm = reactive({
    eventID: "",
    promoEventID: "",
    promoGameID: "",
    eventStartTime: "",
    eventEndTime: ""
  });
  const dataList = ref<EventItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    { label: $t("promotion.activityCode"), prop: "promoEventID", width: 110 },
    { label: $t("promotion.eventNumber"), prop: "promoGameID", width: 90 },
    { label: $t("promotion.eventDetails"), prop: "note" },
    {
      label: $t("promotion.matchTime"),
      prop: "eventTime",
      width: 200,
      cellRenderer: ({ row }) => (
        <span>
          {row.eventStartTime} - {row.eventEndTime}
        </span>
      )
    },
    {
      label: $t("promotion.vendorEventID"),
      prop: "eventID",
      cellRenderer: ({ row }) => (
        <div>
          {(row.eventID ?? []).map(item =>
            h(
              ElTag,
              { class: "mr-1 mb-1" },
              () => `${item.game_display_name}/${item.game_event_id}`
            )
          )}
        </div>
      )
    },
    { label: $t("promotion.totalScore"), prop: "score", width: 90 },
    {
      label: $t("promotion.status"),
      prop: "status",
      width: 90,
      cellRenderer: ({ row }) =>
        row.status === 1 ? (
          <span style="color:#00BB00">{$t("promotion.enable")}</span>
        ) : (
          <span style="color:#F00">{$t("promotion.disable")}</span>
        )
    },
    { label: $t("promotion.lastUpdate"), prop: "updatedAt", width: 160 },
    { label: $t("promotion.executor"), prop: "updatedUser", width: 110 },
    { label: $t("promotion.operate"), fixed: "right", width: 320, slot: "operation" }
  ];

  function buildParams() {
    const params: Record<string, string> = {};
    Object.entries(searchForm).forEach(([k, v]) => {
      if (v !== undefined && v !== "") params[k] = String(v);
    });
    return params;
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getPromotionEventList(buildParams());
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.eventStartTime = "";
    searchForm.eventEndTime = "";
    onSearch();
  }

  /** 新增 / 編輯賽事 */
  function openDialog(isEdit = false, row?: EventItem) {
    addDialog({
      title: (isEdit ? $t("promotion.edit") : $t("promotion.add")) + $t("promotion.event"),
      props: {
        formInline: {
          promoEventID: row?.promoEventID ?? "",
          promoGameID: row?.promoGameID ?? "",
          note: row?.note ?? "",
          status: row?.status ?? 1,
          eventStartTime: row?.eventStartTime ?? "",
          eventEndTime: row?.eventEndTime ?? ""
        }
      },
      width: "800px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          const { success } = isEdit
            ? await editPromotionEvent({ ...curData, id: row!.id })
            : await addPromotionEvent({ ...curData });
          if (success) {
            message($t("promotion.eventSuccessful"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  /** 編輯總積分 */
  function openScoreDialog(row: EventItem) {
    addDialog({
      title: $t("promotion.editTotalScore"),
      props: {
        formInline: {
          promoEventID: row.promoEventID,
          promoGameID: row.promoGameID,
          score: row.score
        }
      },
      width: "500px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(scoreForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as ScoreFormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          const { success } = await editPromotionEventScore({
            ...curData,
            id: row.id
          });
          if (success) {
            message($t("promotion.editTotalScoreSuccessful"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  /** 管理賽事 ID */
  function openIdDialog(row: EventItem) {
    addDialog({
      title: $t("promotion.manageEventID"),
      props: { record: row },
      width: "1000px",
      draggable: true,
      closeOnClickModal: false,
      hideFooter: true,
      contentRenderer: () => h(idManage, { record: row }),
      closeCallBack: () => onSearch()
    });
  }

  function handleDelete(row: EventItem) {
    ElMessageBox.confirm($t("promotion.confirmDeleteEvent"), "", {
      type: "warning"
    })
      .then(async () => {
        const { success } = await deletePromotionEvent(row.id);
        if (success) {
          message($t("promotion.deleteEvent"), { type: "success" });
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
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    openDialog,
    openScoreDialog,
    openIdDialog,
    handleDelete
  };
}
