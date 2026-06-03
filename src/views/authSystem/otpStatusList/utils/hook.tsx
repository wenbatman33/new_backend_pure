import { ref, reactive, onMounted } from "vue";
import { ElSwitch } from "element-plus";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import { hasAuth } from "@/router/utils";
import { getOtpStatusList, putOtpStatusModify } from "@/api/authSystem";
import type { OtpStatusItem } from "./types";

export function useOtpStatusList() {
  const searchForm = reactive({
    fnID: "",
    fnName: "",
    fnKey: ""
  });
  const dataList = ref<OtpStatusItem[]>([]);
  const loading = ref(true);

  // 切換單筆 OTP 狀態（1 啟用 / 2 停用）
  async function handleChange(row: OtpStatusItem, checked: boolean) {
    const status = checked ? 1 : 2;
    const { success } = await putOtpStatusModify({
      fnID: row.fnID,
      status
    });
    if (success) {
      row.otpStatus = status;
      message($t("authSystem.executionSucceed"), { type: "success" });
    } else {
      // 還原 UI 狀態
      row.otpStatus = checked ? 2 : 1;
    }
  }

  const columns: TableColumnList = [
    { label: "ID", prop: "fnID", width: 100 },
    {
      label: $t("authSystem.fnName") + "(CN)",
      prop: "fnName",
      align: "left",
      minWidth: 160
    },
    {
      label: $t("authSystem.fnName") + "(EN)",
      prop: "displayFnName",
      align: "left",
      minWidth: 160
    },
    { label: $t("authSystem.fnKey"), prop: "fnKey", minWidth: 160 },
    {
      label: $t("authSystem.updatedAt"),
      prop: "updatedAt",
      minWidth: 180,
      sortable: true
    },
    {
      label: $t("authSystem.otpCheck"),
      prop: "otpStatus",
      width: 120,
      hide: !hasAuth("__btn_otp_funckey_edit"),
      cellRenderer: ({ row }) => (
        <ElSwitch
          modelValue={row.otpStatus === 1}
          activeText={$t("authSystem.enable")}
          inactiveText={$t("authSystem.disable")}
          inlinePrompt
          onChange={(val: boolean) => handleChange(row, val)}
        />
      )
    }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getOtpStatusList({
        fnID: searchForm.fnID,
        fnName: searchForm.fnName,
        fnKey: searchForm.fnKey
      });
      dataList.value = data?.list ?? [];
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    loading,
    columns,
    dataList,
    onSearch,
    resetForm
  };
}
