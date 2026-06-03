import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElMessageBox, ElSelect, ElOption } from "element-plus";
import editForm from "../form.vue";
import {
  getCloudIpLibraryList,
  createCloudIpLibrary,
  updateCloudIpLibrary,
  deleteCloudIpLibrary,
  rescanCloudIpLibrary,
  rescanAllCloudIpLibrary,
  syncFromSources,
  type CloudIpLibraryItem
} from "@/api/systemManage";
import type { FormItemProps } from "./types";

/** 分類選項 */
export const categoryOptions = [
  { label: $t("systemManage.cloudServer"), value: "雲端伺服器" },
  { label: $t("systemManage.commercialVPN"), value: "商業VPN" },
  { label: "Tor", value: "Tor" }
];

/** 狀態選項 */
export const statusOptions = [
  { label: $t("systemManage.enable"), value: 1 },
  { label: $t("systemManage.disable"), value: 2 }
];

export function useCloudIpLibrary() {
  const searchForm = reactive({
    name: "",
    category: "",
    status: ""
  });
  const dataList = ref<CloudIpLibraryItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  const pagination = reactive({
    total: 0,
    pageSize: 20,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    { label: "ID", prop: "id", width: 80 },
    { label: $t("systemManage.ipRange"), prop: "ipRange", width: 180 },
    { label: $t("systemManage.name"), prop: "name", width: 150 },
    { label: $t("systemManage.category"), prop: "category", width: 120 },
    { label: $t("systemManage.source"), prop: "source", width: 120 },
    { label: $t("systemManage.remark"), prop: "remark", minWidth: 150 },
    {
      label: $t("systemManage.status"),
      prop: "status",
      width: 90,
      cellRenderer: ({ row }) => (
        <span>
          {row.status === 1
            ? $t("systemManage.enable")
            : $t("systemManage.disable")}
        </span>
      )
    },
    { label: $t("systemManage.createdAt"), prop: "createdAt", width: 170 },
    { label: $t("systemManage.updatedAt"), prop: "updatedAt", width: 170 },
    {
      label: $t("systemManage.operate"),
      fixed: "right",
      width: 240,
      slot: "operation"
    }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getCloudIpLibraryList({
        name: searchForm.name,
        category: searchForm.category,
        status: searchForm.status
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

  /** 新增/編輯對話框 */
  function openDialog(title = "add", row?: CloudIpLibraryItem) {
    const isEdit = title === "edit";
    addDialog({
      title: isEdit
        ? $t("systemManage.editCloudIp")
        : $t("systemManage.addCloudIp"),
      props: {
        formInline: {
          id: row?.id,
          ipRange: row?.ipRange ?? "",
          name: row?.name ?? "",
          category: row?.category ?? "",
          source: row?.source ?? "",
          remark: row?.remark ?? "",
          status: row?.status ?? 1
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
          if (isEdit) {
            const { success } = await updateCloudIpLibrary({ ...curData });
            if (success) {
              message($t("systemManage.editSuccess"), { type: "success" });
              done();
              onSearch();
            }
          } else {
            const { success } = await createCloudIpLibrary({ ...curData });
            if (success) {
              message($t("systemManage.createSuccess"), { type: "success" });
              done();
              onSearch();
            }
          }
        });
      }
    });
  }

  /** 刪除 */
  function handleDelete(row: CloudIpLibraryItem) {
    ElMessageBox.confirm($t("systemManage.confirmDeleteRecord"), "", {
      type: "warning"
    })
      .then(async () => {
        const { success } = await deleteCloudIpLibrary({ id: row.id });
        if (success) {
          message($t("systemManage.deleteSuccess"), { type: "success" });
          onSearch();
        }
      })
      .catch(() => {});
  }

  /** 指定 IP 段重掃會員標籤 */
  function handleRescan(row: CloudIpLibraryItem) {
    ElMessageBox.confirm($t("systemManage.confirmRescan"), "", {
      type: "warning"
    })
      .then(async () => {
        const { success, data } = await rescanCloudIpLibrary({
          ipRange: row.ipRange
        });
        if (success) {
          message(
            $t("systemManage.rescanComplete", { count: data?.taggedCount ?? 0 }),
            { type: "success" }
          );
        }
      })
      .catch(() => {});
  }

  /** 全部重掃（含 category 篩選） */
  function handleRescanAll() {
    const selectedCategory = ref<string>("");
    ElMessageBox({
      title: $t("systemManage.rescanAllTag"),
      message: () =>
        h("div", {}, [
          h("p", $t("systemManage.confirmRescanAll")),
          h("div", { style: "margin-top: 8px" }, [
            h("span", $t("systemManage.filterCategory")),
            h(
              ElSelect,
              {
                modelValue: selectedCategory.value,
                "onUpdate:modelValue": (val: string) => {
                  selectedCategory.value = val;
                },
                clearable: true,
                placeholder: $t("systemManage.filterCategoryPlaceholder"),
                style: "width: 180px; margin-left: 8px"
              },
              () =>
                categoryOptions.map(opt =>
                  h(ElOption, {
                    key: opt.value,
                    label: opt.label,
                    value: opt.value
                  })
                )
            )
          ])
        ]),
      showCancelButton: true
    })
      .then(async () => {
        loading.value = true;
        try {
          const params: Record<string, any> = {};
          if (selectedCategory.value) params.category = selectedCategory.value;
          const { success, data } = await rescanAllCloudIpLibrary(params);
          if (success) {
            message(
              $t("systemManage.rescanAllComplete", {
                count: data?.taggedCount ?? 0
              }),
              { type: "success" }
            );
          }
        } finally {
          loading.value = false;
        }
      })
      .catch(() => {});
  }

  /** 從官方來源同步 IP 清單 */
  function handleSync() {
    ElMessageBox.confirm($t("systemManage.confirmSync"), "", {
      type: "warning"
    })
      .then(async () => {
        loading.value = true;
        try {
          const { success, data } = await syncFromSources();
          if (success) {
            message(
              $t("systemManage.syncComplete", {
                count: data?.results?.length ?? 0
              }),
              { type: "success" }
            );
            onSearch();
          }
        } finally {
          loading.value = false;
        }
      })
      .catch(() => {});
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    categoryOptions,
    statusOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    openDialog,
    handleDelete,
    handleRescan,
    handleRescanAll,
    handleSync
  };
}
