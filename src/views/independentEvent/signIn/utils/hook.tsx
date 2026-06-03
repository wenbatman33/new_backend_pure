import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import editForm from "../form.vue";
import {
  getPromotionGroupList,
  getPromotionGroup,
  updatePromotionGroup,
  updatePromotionGroupStatus,
  type PromotionGroupItem
} from "@/api/independentEvent";
import type { FormItemProps } from "./types";

export function useSignIn() {
  const searchForm = reactive({
    name: "",
    code: "",
    status: "",
    startTime: "",
    endTime: "",
    internalName: ""
  });
  const dataList = ref<PromotionGroupItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const statusOptions = [
    { label: $t("independentEvent.enable"), value: 1 },
    { label: $t("independentEvent.disable"), value: 0 }
  ];

  const columns: TableColumnList = [
    { label: $t("independentEvent.id"), prop: "id", width: 90 },
    { label: $t("independentEvent.name"), prop: "name", minWidth: 160 },
    {
      label: $t("independentEvent.internalName"),
      prop: "internalName",
      minWidth: 160
    },
    {
      label: $t("independentEvent.status"),
      prop: "status",
      width: 110,
      cellRenderer: ({ row }) =>
        row.status === 1 ? (
          <span style="color: rgb(100, 225, 225)">
            {$t("independentEvent.enable")}
          </span>
        ) : (
          <span style="color: #999">{$t("independentEvent.disable")}</span>
        )
    },
    { label: $t("independentEvent.code"), prop: "code", width: 120 },
    { label: $t("independentEvent.startTime"), prop: "startTime", width: 170 },
    { label: $t("independentEvent.endTime"), prop: "endTime", width: 170 },
    { label: $t("independentEvent.updatedAt"), prop: "updatedAt", width: 170 },
    {
      label: $t("independentEvent.updatedUser"),
      prop: "updatedUser",
      width: 120
    },
    {
      label: $t("independentEvent.operation"),
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getPromotionGroupList({
        name: searchForm.name,
        code: searchForm.code,
        status: searchForm.status,
        startTime: searchForm.startTime,
        endTime: searchForm.endTime,
        internalName: searchForm.internalName
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
    onSearch();
  }

  /**
   * 新增 / 編輯簽到活動。
   * TODO: 舊模組為 Step1~Step5 多步驟精靈（遊戲群組、標籤、投放、條件模板等），
   * 牽涉 dropdown / launchedList / gamegroup / tag 等尚未移植的 API 與 @/utils/dropdown。
   * 此處先以基本資料表單呈現，完整精靈待依賴移植後補。
   */
  function openDialog(title = "add", row?: FormItemProps) {
    addDialog({
      title:
        title === "add"
          ? $t("independentEvent.add")
          : $t("independentEvent.edit"),
      props: {
        formInline: {
          code: row?.code ?? "",
          name: row?.name ?? "",
          internalName: row?.internalName ?? "",
          status: row?.status ?? 1,
          startTime: row?.startTime ?? "",
          endTime: row?.endTime ?? ""
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
          const { success } = await updatePromotionGroup({
            code: curData.code,
            name: curData.name,
            internalName: curData.internalName,
            status: curData.status,
            startTime: curData.startTime,
            endTime: curData.endTime
          });
          if (success) {
            message($t("independentEvent.operateSuccess"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  /** 編輯：先取明細再開啟對話框 */
  async function handleEdit(row: PromotionGroupItem) {
    const { data } = await getPromotionGroup(row.code);
    openDialog("edit", { ...row, ...(data ?? {}) });
  }

  /** 切換啟用 / 停用 */
  async function handleStatus(row: PromotionGroupItem) {
    const { success } = await updatePromotionGroupStatus({
      code: [row.code],
      status: row.status === 1 ? 2 : 1
    });
    if (success) {
      message($t("independentEvent.operateSuccess"), { type: "success" });
      onSearch();
    }
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
    handleStatus
  };
}
