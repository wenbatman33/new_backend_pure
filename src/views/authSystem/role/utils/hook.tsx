import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElSwitch } from "element-plus";
import editForm from "../form.vue";
import authForm from "../authForm.vue";
import accountForm from "../accountForm.vue";
import hideGroupForm from "../hideGroupForm.vue";
import amountLimitForm from "../amountLimitForm.vue";
import bulkAddForm from "../bulkAddForm.vue";
import { hasAuth } from "@/router/utils";
import {
  getRoles,
  addRole,
  updateRole,
  setRoleFns,
  postRoleHide,
  deleteRoleHide
} from "@/api/authSystem";
import type { RoleFormItemProps } from "./types";

export function useRole() {
  const searchForm = reactive({
    roleName: "",
    note: "",
    status: undefined as number | undefined
  });
  const dataList = ref<any[]>([]);
  const loading = ref(true);
  const formRef = ref();
  const dialogFormRef = ref();

  const statusOptions = [
    { label: $t("authSystem.enable"), value: 1 },
    { label: $t("authSystem.disable"), value: 2 }
  ];

  /** 切換角色啟用狀態 */
  async function onStatusChange(row) {
    const newStatus = row.status === 1 ? 2 : 1;
    const { success } = await updateRole({
      roleID: row.roleID,
      roleName: row.roleName,
      note: row.note,
      status: newStatus
    });
    if (success) {
      row.status = newStatus;
      message($t("authSystem.statusMsg1"), { type: "success" });
    } else {
      message($t("authSystem.statusMsg2"), { type: "error" });
    }
  }

  /** 切換隱藏群組 */
  async function onHideChange(row) {
    const willHide = row.hide !== 2; // 目前非隱藏 → 改為隱藏
    if (willHide) {
      await postRoleHide({ roleID: row.roleID });
      row.hide = 2;
    } else {
      await deleteRoleHide({ roleID: row.roleID });
      row.hide = 1;
    }
  }

  const columns: TableColumnList = [
    { label: $t("authSystem.groupName"), prop: "roleName", width: 140 },
    {
      label: $t("authSystem.status"),
      prop: "status",
      width: 120,
      cellRenderer: ({ row }) =>
        h(ElSwitch, {
          modelValue: row.status === 1,
          activeText: $t("authSystem.enable"),
          inactiveText: $t("authSystem.disable"),
          inlinePrompt: true,
          disabled: !hasAuth("__btn_enable_group"),
          "onUpdate:modelValue": () => onStatusChange(row)
        })
    },
    { label: $t("authSystem.updatedAt"), prop: "updatedAt", width: 180 },
    {
      label: $t("authSystem.authList"),
      prop: "authList",
      width: 100,
      slot: "authList"
    },
    {
      label: $t("authSystem.menuList"),
      prop: "menuList",
      width: 100,
      slot: "menuList"
    },
    {
      label: $t("authSystem.hasAuths"),
      prop: "hasAuths",
      width: 120,
      slot: "hasAuths"
    },
    { label: $t("authSystem.remark"), prop: "note", minWidth: 160 },
    { label: $t("authSystem.activeUsers"), prop: "activeUsers", width: 90 },
    { label: $t("authSystem.totalUsers"), prop: "totalUsers", width: 90 },
    {
      label: $t("authSystem.hideGroup"),
      prop: "hide",
      width: 110,
      hide: () => !hasAuth("__btn_role_show"),
      cellRenderer: ({ row }) =>
        h(ElSwitch, {
          modelValue: row.hide === 2,
          activeText: $t("authSystem.hidden"),
          inactiveText: $t("authSystem.show"),
          inlinePrompt: true,
          "onUpdate:modelValue": () => onHideChange(row)
        })
    },
    {
      label: $t("authSystem.operate"),
      fixed: "right",
      width: 90,
      slot: "operation"
    }
  ];

  async function onSearch() {
    loading.value = true;
    try {
      // 舊邏輯：pageSize=1000 一次撈全部
      const { data } = await getRoles({
        roleName: searchForm.roleName,
        note: searchForm.note,
        status: searchForm.status,
        pageSize: 1000
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

  /** 新增 / 編輯角色 */
  function openDialog(title: "add" | "edit" = "add", row?: any) {
    addDialog({
      title:
        title === "add"
          ? $t("authSystem.addGroup")
          : $t("authSystem.editGroup"),
      props: {
        formInline: {
          roleID: row?.roleID,
          roleName: row?.roleName ?? "",
          note: row?.note ?? "",
          status: row?.status ?? 1,
          financeWithdrawalBeep: !!row?.financeWithdrawalBeep,
          riskWithdrawalBeep: !!row?.riskWithdrawalBeep
        }
      },
      width: "520px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: dialogFormRef }),
      beforeSure: (done, { options }) => {
        const FormRef = dialogFormRef.value.getRef();
        const curData = options.props.formInline as RoleFormItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          const payload = {
            roleName: curData.roleName,
            note: curData.note,
            status: curData.status,
            financeWithdrawalBeep: curData.financeWithdrawalBeep,
            riskWithdrawalBeep: curData.riskWithdrawalBeep
          };
          const { success } =
            title === "add"
              ? await addRole(payload)
              : await updateRole({ ...payload, roleID: curData.roleID });
          if (success) {
            message($t("authSystem.editSuccess"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  /** 設定功能權限 / 選單權限 */
  function openAuthDialog(row, type: "authList" | "menuList") {
    addDialog({
      title: `${$t("authSystem.auth")} - ${row.roleName}`,
      props: { record: row, type },
      width: "1100px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(authForm, { ref: dialogFormRef }),
      beforeSure: async done => {
        const fnIDs = dialogFormRef.value.getSubmitFnIDs();
        const { success } = await setRoleFns({ roleID: row.roleID, fnIDs });
        if (success) {
          message($t("authSystem.editSuccess"), { type: "success" });
          done();
          onSearch();
        }
      }
    });
  }

  /** 檢視角色帳號 */
  function openAccountDialog(row) {
    addDialog({
      title: $t("authSystem.viewAccount"),
      props: { record: row },
      width: "600px",
      hideFooter: true,
      contentRenderer: () => h(accountForm)
    });
  }

  /** 隱藏群組設定 */
  function openHideGroupDialog() {
    addDialog({
      title: $t("authSystem.hideGroup"),
      props: { roleList: dataList.value },
      width: "760px",
      hideFooter: true,
      contentRenderer: () => h(hideGroupForm)
    });
  }

  /** 群組額度上限 */
  function openAmountLimitDialog() {
    addDialog({
      title: $t("authSystem.amountLimit"),
      width: "760px",
      hideFooter: true,
      contentRenderer: () => h(amountLimitForm)
    });
  }

  /** 批次編輯權限 */
  function openBulkDialog() {
    addDialog({
      title: $t("authSystem.bulkEdit"),
      width: "1000px",
      draggable: true,
      contentRenderer: () => h(bulkAddForm, { ref: dialogFormRef }),
      footerButtons: [
        {
          label: $t("authSystem.delText"),
          type: "primary",
          btnClick: () => {
            dialogFormRef.value.showConfirm(2);
          }
        },
        {
          label: $t("authSystem.add"),
          type: "primary",
          btnClick: () => {
            dialogFormRef.value.showConfirm(1);
          }
        }
      ]
    });
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
    formRef,
    onSearch,
    resetForm,
    openDialog,
    openAuthDialog,
    openAccountDialog,
    openHideGroupDialog,
    openAmountLimitDialog,
    openBulkDialog
  };
}
