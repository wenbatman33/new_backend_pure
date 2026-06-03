import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElMessageBox } from "element-plus";
import editForm from "../form.vue";
import contentPanel from "../content.vue";
import {
  getPageList,
  createPage,
  editPage,
  deletePage,
  type PageListItem
} from "@/api/operator";
import type { PageFormItemProps } from "./types";

export function usePageList() {
  const searchForm = reactive({
    name: "",
    status: ""
  });
  const dataList = ref<PageListItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const statusOptions = [
    { label: $t("operator.noShow"), value: 0 },
    { label: $t("operator.show"), value: 1 }
  ];

  const columns: TableColumnList = [
    { label: "ID", prop: "id", width: 70 },
    { label: $t("operator.name"), prop: "name", width: 200 },
    {
      label: "code",
      prop: "code",
      cellRenderer: ({ row }) => <span>{row.code || "-"}</span>
    },
    {
      label: $t("operator.hiddenYesOrNo"),
      prop: "status",
      width: 100,
      cellRenderer: ({ row }) => (
        <span>{row.status ? $t("operator.show") : $t("operator.noShow")}</span>
      )
    },
    {
      label: $t("operator.content"),
      prop: "content",
      cellRenderer: ({ row }) => (
        <span>{(row.content ?? "").replaceAll(",", " \\ ")}</span>
      )
    },
    {
      label: $t("operator.lastUpdate"),
      prop: "updatedAt",
      width: 160,
      cellRenderer: ({ row }) => <span>{row.updatedAt || "-"}</span>
    },
    {
      label: $t("operator.finalExecutor"),
      prop: "updatedUser",
      width: 200,
      cellRenderer: ({ row }) => <span>{row.updatedUser || "-"}</span>
    },
    { label: $t("operator.operate"), fixed: "right", width: 240, slot: "operation" }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getPageList({
        name: searchForm.name,
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

  /** 新增 / 編輯 頁面 */
  function openPageDialog(type: "new" | "edit", row?: PageListItem) {
    const isEdit = type === "edit";
    addDialog({
      title: $t("operator.pageEdit"),
      props: {
        formInline: {
          id: isEdit ? row?.id : undefined,
          name: isEdit ? (row?.name ?? "") : "",
          status: isEdit ? (row?.status ?? 0) : 0,
          code: isEdit ? (row?.code ?? "") : ""
        }
      },
      width: "600px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as PageFormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          const payload = {
            name: curData.name,
            status: curData.status,
            code: curData.code
          };
          const { success } = isEdit
            ? await editPage({ id: curData.id, ...payload })
            : await createPage(payload);
          if (success) {
            message($t("operator.editSuccess"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  /** 開啟頁面內容管理彈窗 */
  function openContentDialog(row: PageListItem) {
    addDialog({
      title: `${$t("operator.sitePageManagement")} \\ ${$t("operator.newNameContent")}`,
      props: { pageId: row.id, pageName: row.name },
      width: "92%",
      fullscreen: false,
      draggable: true,
      hideFooter: true,
      closeOnClickModal: false,
      contentRenderer: () => h(contentPanel, { pageId: row.id, pageName: row.name })
    });
  }

  function handleDelete(row: PageListItem) {
    ElMessageBox.confirm($t("operator.deleteWarningMessage"), $t("operator.systemHint"), {
      type: "warning"
    })
      .then(async () => {
        const { success } = await deletePage(row.id);
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
    openPageDialog,
    openContentDialog,
    handleDelete
  };
}
