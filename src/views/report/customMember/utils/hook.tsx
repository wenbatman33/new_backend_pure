import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElMessageBox } from "element-plus";
import editForm from "../form.vue";
import reportView from "../report.vue";
import {
  getCustomMemberList,
  getCustomMember,
  postCustomMember,
  putCustomMember,
  deleteCustomMemberById,
  getVipSettingList
} from "@/api/report";
import type { FormItemProps } from "./types";

export function useCustomMember() {
  const searchForm = reactive({
    id: "",
    title: ""
  });
  const dataList = ref<any[]>([]);
  const loading = ref(true);
  const formRef = ref();
  // VIP 等級選項（建立/編輯/報表共用）
  const vipSettingList = ref<{ label: string; value: any }[]>([]);

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    { label: "ID", prop: "id", width: 100 },
    { label: $t("report.title"), prop: "title", minWidth: 200 },
    { label: $t("report.description"), prop: "description", minWidth: 160 },
    { label: $t("report.updatedAt"), prop: "updatedAt", width: 180 },
    { label: $t("report.editor"), prop: "editor", width: 120 },
    { label: $t("report.action"), fixed: "right", width: 240, slot: "operation" }
  ];

  function buildParams() {
    const params: Record<string, any> = {};
    if (searchForm.id !== "") params.id = searchForm.id;
    if (searchForm.title !== "") params.title = searchForm.title;
    return params;
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getCustomMemberList(buildParams());
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

  // 取得 VIP 等級選項
  async function loadVipSettingList() {
    const { data } = await getVipSettingList();
    vipSettingList.value = (data?.list ?? []).map((item: any) => ({
      label: `VIP ${item.level}`,
      value: item.level
    }));
  }

  // 建立/編輯/複製 三步驟對話框
  function openDialog(mode: "create" | "edit" | "copy" = "create", record?: any) {
    const titleMap = {
      create: $t("report.add"),
      edit: $t("report.edit"),
      copy: $t("report.copy")
    };
    const base: FormItemProps = {
      id: record?.id,
      title: record?.title ?? "",
      description: record?.description ?? "",
      dateRangeType: record?.start && record?.end ? "2" : "1",
      dateRange:
        record?.start && record?.end ? [record.start, record.end] : null,
      start: record?.start ?? "",
      end: record?.end ?? "",
      requestData: record?.requestData ?? {},
      responseData: record?.responseData ?? {},
      mode
    };
    addDialog({
      title: titleMap[mode],
      props: {
        formInline: base,
        vipSettingList: vipSettingList.value
      },
      width: "80%",
      draggable: true,
      fullscreen: false,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const inst = formRef.value;
        inst.submit(async (payload: any) => {
          if (!payload) return; // 校驗失敗，停在對應步驟
          const api = mode === "edit" ? putCustomMember : postCustomMember;
          const { success } = await api(payload);
          if (success) {
            message($t("report.operationSuccess"), { type: "success" });
            done();
            onSearch();
          }
        });
        void options;
      }
    });
  }

  // 列表「複製/編輯」需先撈完整資料
  async function fetchAndOpen(mode: "edit" | "copy", row: any) {
    const { data } = await getCustomMember({ id: row.id });
    openDialog(mode, data);
  }

  // 報表檢視對話框
  async function openReportDialog(row: any) {
    const { data } = await getCustomMember({ id: row.id });
    addDialog({
      title: $t("report.search"),
      props: {
        record: data,
        vipSettingList: vipSettingList.value
      },
      width: "80%",
      draggable: true,
      hideFooter: true,
      closeOnClickModal: false,
      contentRenderer: () => h(reportView)
    });
  }

  function handleDelete(row: any) {
    ElMessageBox.confirm($t("report.confirmDelete"), "", {
      type: "warning"
    })
      .then(async () => {
        const { success } = await deleteCustomMemberById(row.id);
        if (success) {
          message($t("report.deleteSuccess"), { type: "success" });
          onSearch();
        }
      })
      .catch(() => {});
  }

  onMounted(async () => {
    await loadVipSettingList();
    onSearch();
  });

  return {
    searchForm,
    loading,
    columns,
    dataList,
    pagination,
    vipSettingList,
    onSearch,
    resetForm,
    openDialog,
    fetchAndOpen,
    openReportDialog,
    handleDelete
  };
}
