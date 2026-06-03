import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElMessageBox } from "element-plus";
import editForm from "../form.vue";
import {
  getDeviceBlackList,
  addDeviceBlackList,
  updateDeviceBlackList,
  deleteDeviceBlackList,
  type DeviceBlackItem
} from "@/api/risk_control";
import type { FormItemProps } from "./types";

export function useDeviceBlacklist() {
  // deviceID 精準查詢、deviceIDPart 模糊查詢
  const searchForm = reactive({
    deviceID: "",
    deviceIDPart: ""
  });
  const dataList = ref<DeviceBlackItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    { label: "ID", prop: "id", width: 90, sortable: true },
    { label: $t("risk_control.deviceID"), prop: "deviceID", width: 260 },
    { label: $t("risk_control.reason"), prop: "reason" },
    { label: $t("risk_control.createdAt"), prop: "createdAt", width: 170, sortable: true },
    { label: $t("risk_control.createBy"), prop: "createUserAccount", width: 120 },
    { label: $t("risk_control.operate"), fixed: "right", width: 160, slot: "operation" }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      // 精準查詢優先：填了 deviceID 就不送 deviceIDPart
      const params: Record<string, any> = {};
      if (searchForm.deviceID) {
        params.deviceID = searchForm.deviceID;
      } else if (searchForm.deviceIDPart) {
        params.deviceIDPart = searchForm.deviceIDPart;
      }
      const { data } = await getDeviceBlackList(params);
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

  /** 新增 / 編輯對話框 */
  function openDialog(mode: "create" | "update" = "create", row?: DeviceBlackItem) {
    const title =
      mode === "update" ? $t("risk_control.edit") : $t("risk_control.add");
    addDialog({
      title: `${title}${$t("risk_control.blacklistDeviceID")}`,
      props: {
        formInline: {
          id: row?.id,
          deviceID: row?.deviceID ?? "",
          reason: row?.reason ?? "",
          mode
        }
      },
      width: "460px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          if (mode === "update") {
            const { success } = await updateDeviceBlackList({
              id: String(curData.id),
              reason: curData.reason
            });
            if (success) {
              message($t("risk_control.editSuccess"), { type: "success" });
              done();
              onSearch();
            }
          } else {
            const { success } = await addDeviceBlackList({
              deviceID: curData.deviceID,
              reason: curData.reason
            });
            if (success) {
              message($t("risk_control.addSuccess"), { type: "success" });
              done();
              onSearch();
            }
          }
        });
      }
    });
  }

  function handleDelete(row: DeviceBlackItem) {
    ElMessageBox.confirm($t("risk_control.doYouConfirmDeletion"), "", {
      type: "warning"
    })
      .then(async () => {
        const { success } = await deleteDeviceBlackList(row.deviceID);
        if (success) {
          message($t("risk_control.deleteSuccess"), { type: "success" });
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
    handleDelete
  };
}
