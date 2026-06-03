import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import editForm from "../form.vue";
import {
  GetTaskList,
  GetTaskDetail,
  CreateTask,
  EditTask,
  type TaskItem
} from "@/api/independentEvent";
import type { FormItemProps } from "./types";

// 任務型別文案對應
const typeMap: Record<number, string> = {
  1: $t("independentEvent.refreshedDaily"),
  2: $t("independentEvent.refreshedWeek"),
  3: $t("independentEvent.customize")
};

export function useMissionCenter() {
  const searchForm = reactive({
    id: "",
    name: "",
    type: "",
    status: "",
    internalName: "",
    startTime: "",
    endTime: ""
  });
  const dataList = ref<TaskItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  // 任務型別下拉（含全部）
  const typeOptions = [
    { label: $t("independentEvent.refreshedDaily"), value: "1" },
    { label: $t("independentEvent.refreshedWeek"), value: "2" },
    { label: $t("independentEvent.customize"), value: "3" }
  ];

  // 狀態下拉
  const statusOptions = [
    { label: $t("independentEvent.disable"), value: "0" },
    { label: $t("independentEvent.enable"), value: "1" }
  ];

  const columns: TableColumnList = [
    { label: $t("independentEvent.id"), prop: "id", width: 70 },
    {
      label: $t("independentEvent.taskName"),
      prop: "name",
      cellRenderer: ({ row }) => (
        <el-link type="primary" onClick={() => openDialog("Watch", row)}>
          {row.name}
        </el-link>
      )
    },
    { label: $t("independentEvent.internalName"), prop: "internalName" },
    {
      label: $t("independentEvent.status"),
      prop: "status",
      width: 100,
      cellRenderer: ({ row }) => (
        <span>
          {Number(row.status) === 1
            ? $t("independentEvent.enable")
            : $t("independentEvent.disable")}
        </span>
      )
    },
    {
      label: $t("independentEvent.type"),
      prop: "type",
      width: 120,
      cellRenderer: ({ row }) => <span>{typeMap[row.type] ?? row.type}</span>
    },
    { label: $t("independentEvent.start"), prop: "startTime", width: 170 },
    { label: $t("independentEvent.end"), prop: "endTime", width: 170 },
    { label: $t("independentEvent.updatedAt"), prop: "updatedAt", width: 170 },
    { label: $t("independentEvent.executor"), prop: "updatedUser", width: 140 },
    {
      label: $t("independentEvent.action"),
      fixed: "right",
      width: 230,
      slot: "operation"
    }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await GetTaskList({
        id: searchForm.id,
        name: searchForm.name,
        type: searchForm.type,
        status: searchForm.status,
        internalName: searchForm.internalName,
        startTime: searchForm.startTime,
        endTime: searchForm.endTime
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
    Object.assign(searchForm, {
      id: "",
      name: "",
      type: "",
      status: "",
      internalName: "",
      startTime: "",
      endTime: ""
    });
    onSearch();
  }

  // 開啟新增 / 編輯 / 檢視對話框
  async function openDialog(
    mode: "Create" | "Edit" | "Watch" = "Create",
    row?: TaskItem
  ) {
    let detail: Partial<FormItemProps> = {};
    if (row?.id && mode !== "Create") {
      const { data } = await GetTaskDetail({ id: row.id });
      detail = data ?? {};
    }
    const titleKey =
      mode === "Create"
        ? "independentEvent.addNewTask"
        : mode === "Edit"
          ? "independentEvent.editTask"
          : "independentEvent.watchTask";

    addDialog({
      title: $t(titleKey),
      props: {
        formInline: {
          mode,
          id: detail.id,
          name: detail.name ?? "",
          internalName: detail.internalName ?? "",
          type: detail.type ?? 1,
          week: detail.week,
          activeReset: detail.activeReset ?? false,
          receiveDay: detail.receiveDay,
          startTime: detail.startTime ?? "",
          endTime: detail.endTime ?? "",
          status: detail.status ?? 1
        }
      },
      width: "900px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      // 檢視模式隱藏確定鈕
      hideFooter: mode === "Watch",
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async (valid: boolean) => {
          if (!valid) return;
          const payload = { ...curData };
          const { success } =
            mode === "Create"
              ? await CreateTask(payload)
              : await EditTask(payload);
          if (success) {
            message($t("independentEvent.operateSuccess"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  // 啟用 / 停用切換（沿用舊邏輯：取明細 → 反轉 status → EditTask）
  async function handleStatus(row: TaskItem) {
    const { data } = await GetTaskDetail({ id: row.id });
    const detail = { ...(data ?? {}), status: Number(!row.status) };
    const { success } = await EditTask(detail);
    if (success) {
      message($t("independentEvent.operateSuccess"), { type: "success" });
      onSearch();
    }
  }

  // 複製：以該筆資料開新增對話框
  function handleCopy(row: TaskItem) {
    openDialog("Create", row);
  }

  // 修改紀錄（舊碼此功能尚未開放）
  function handleLog() {
    message($t("independentEvent.featureNotOpen"), { type: "warning" });
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    typeOptions,
    statusOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    openDialog,
    handleStatus,
    handleCopy,
    handleLog
  };
}
