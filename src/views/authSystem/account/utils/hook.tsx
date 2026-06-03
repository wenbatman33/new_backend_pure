import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElMessageBox, ElSwitch, ElTag } from "element-plus";
import editForm from "../form.vue";
import passwordForm from "../password.vue";
import {
  getAccountList,
  getDeptList,
  getRoles,
  getTagGroup,
  createAccount,
  updateAccount,
  resetPassword,
  resetOtp,
  batchAddVpnIP,
  batchRemoveVpnIP,
  type AccountItem
} from "@/api/authSystem";
import { hasAuth } from "@/router/utils";
import type {
  FormItemProps,
  PasswordItemProps,
  OptionItem
} from "./types";

export function useAccount() {
  const searchForm = reactive({
    account: "",
    status: 1 as number | "",
    roles: "" as number | "",
    deptID: "" as number | "",
    title: ""
  });

  const dataList = ref<AccountItem[]>([]);
  const loading = ref(true);
  const formRef = ref();
  const deptOptions = ref<OptionItem[]>([]);
  const roleOptions = ref<OptionItem[]>([]);
  const tagOptions = ref<OptionItem[]>([]);
  // 多選列
  const selectedRows = ref<AccountItem[]>([]);

  const statusOptions = [
    { label: $t("authSystem.formInputStatus1"), value: 1 },
    { label: $t("authSystem.formInputStatus2"), value: 2 }
  ];

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  // 切換啟用/停用
  async function onStatusChange(row: AccountItem, val: number) {
    const { success } = await updateAccount({
      adminID: row.adminID,
      name: row.name,
      email: row.email,
      deptID: row.deptID,
      title: row.title,
      vpnIP: row.vpnIP,
      commentCategory: row.commentCategory,
      roleID: row.roles?.length > 0 ? row.roles[0].roleID : 0,
      status: val
    });
    if (success) {
      row.status = val;
      message($t("authSystem.editSuccess"), { type: "success" });
    } else {
      onSearch();
    }
  }

  const columns: TableColumnList = [
    { type: "selection", align: "left", width: 50 },
    { label: $t("authSystem.columnHead1"), prop: "account", minWidth: 140 },
    {
      label: $t("authSystem.columnHead2"),
      prop: "status",
      width: 110,
      cellRenderer: ({ row }) =>
        h(ElSwitch, {
          modelValue: row.status === 1,
          disabled: !hasAuth("__btn_enable_user"),
          activeText: $t("authSystem.enable"),
          inactiveText: $t("authSystem.disable"),
          inlinePrompt: true,
          "onUpdate:modelValue": (checked: boolean) =>
            onStatusChange(row, checked ? 1 : 2)
        })
    },
    {
      label: $t("authSystem.columnHead3"),
      prop: "roles",
      minWidth: 120,
      cellRenderer: ({ row }) => (
        <span>{(row.roles ?? []).map(r => r.roleName).join(", ")}</span>
      )
    },
    {
      label: $t("authSystem.columnHead4"),
      prop: "deptID",
      width: 120,
      cellRenderer: ({ row }) =>
        h(
          ElTag,
          { type: "success" },
          () => deptNameOf(row.deptID)
        )
    },
    { label: $t("authSystem.columnHead5"), prop: "title", width: 120 },
    { label: "VPN IP", prop: "vpnIP", minWidth: 120 },
    { label: $t("authSystem.columnHead6"), prop: "lastLoginAt", width: 170, sortable: true },
    { label: $t("authSystem.columnHead7"), prop: "updatedAt", width: 170, sortable: true },
    {
      label: $t("authSystem.columnHeadAction"),
      fixed: "right",
      width: 220,
      slot: "operation"
    }
  ];

  function deptNameOf(deptID: number) {
    const item = deptOptions.value.find(o => o.value === deptID);
    return item ? String(item.label) : String(deptID ?? "");
  }

  async function onSearch() {
    loading.value = true;
    try {
      // 組查詢條件（roleID 沿用舊欄位映射）
      const params: Record<string, any> = {};
      Object.entries({
        account: searchForm.account,
        status: searchForm.status,
        roleID: searchForm.roles,
        deptID: searchForm.deptID,
        title: searchForm.title
      }).forEach(([k, v]) => {
        if (v !== undefined && v !== "") params[k] = v;
      });
      const { data } = await getAccountList(params);
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? dataList.value.length;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.status = 1;
    onSearch();
  }

  function handleSelectionChange(rows: AccountItem[]) {
    selectedRows.value = rows;
  }

  // 新增/編輯帳號
  function openDialog(isUpdate = false, row?: AccountItem) {
    const fnRole =
      row?.roles && row.roles.length > 0 ? Number(row.roles[0].roleID) : "";
    addDialog({
      title: isUpdate
        ? $t("authSystem.editAccount")
        : $t("authSystem.addAccount"),
      props: {
        formInline: {
          adminID: row?.adminID,
          account: row?.account ?? "",
          password: "",
          password2: "",
          name: row?.name ?? "",
          email: row?.email ?? "",
          deptID: row?.deptID ?? "",
          title: row?.title ?? "",
          vpnIP: row?.vpnIP ?? "",
          commentCategory: row?.commentCategory ?? "",
          status: row?.status ?? 2,
          fnRole,
          tagID: row?.tagID ?? "",
          isUpdate
        },
        deptList: deptOptions.value,
        roleList: roleOptions.value,
        tagList: tagOptions.value
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
          let res;
          if (isUpdate) {
            res = await updateAccount({
              adminID: curData.adminID,
              name: curData.name,
              email: curData.email || "",
              deptID: Number(curData.deptID) || 0,
              title: curData.title,
              vpnIP: curData.vpnIP,
              commentCategory: curData.commentCategory,
              status: curData.status,
              roleID: Number(curData.fnRole) || 0,
              tagID: curData.tagID === "" ? null : curData.tagID
            });
          } else {
            res = await createAccount({
              account: curData.account,
              name: curData.name,
              password: curData.password,
              email: curData.email || "",
              status: 2,
              deptID: Number(curData.deptID) || 0,
              title: curData.title,
              vpnIP: curData.vpnIP,
              commentCategory: curData.commentCategory,
              roleID: Number(curData.fnRole) || 0,
              tagID: curData.tagID === "" ? null : curData.tagID
            });
          }
          if (res?.success) {
            message($t("authSystem.editSuccess"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  // 修改密碼
  function openPasswordDialog(row: AccountItem) {
    addDialog({
      title: $t("authSystem.handlePassword"),
      props: {
        formInline: {
          adminID: row.adminID,
          account: row.account,
          newpassword: "",
          password2: ""
        }
      },
      width: "500px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(passwordForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as PasswordItemProps;
        FormRef.validate(async valid => {
          if (!valid) return;
          if (curData.newpassword !== curData.password2) {
            message($t("authSystem.passwordValidate"), { type: "warning" });
            return;
          }
          const { success } = await resetPassword({
            adminID: curData.adminID,
            password: curData.newpassword
          });
          if (success) {
            message($t("authSystem.editSuccess"), { type: "success" });
            done();
          }
        });
      }
    });
  }

  // 重置 OTP
  function handleOtp(row: AccountItem) {
    ElMessageBox.confirm($t("authSystem.columnAction4"), "", {
      type: "warning"
    })
      .then(async () => {
        const { success } = await resetOtp(row.adminID);
        message(
          success ? $t("authSystem.resetOtpSuccess") : $t("authSystem.resetOtpFail"),
          { type: success ? "success" : "error" }
        );
        if (success) onSearch();
      })
      .catch(() => {});
  }

  // 批次新增 / 移除 VPN IP
  function openVpnIPDialog(type: "add" | "remove") {
    if (selectedRows.value.length <= 0) {
      message($t("authSystem.selectUserTip"), { type: "warning" });
      return;
    }
    const vpnIps = ref("");
    const adminUserIDs = selectedRows.value
      .map(r => r.adminID)
      .filter(Boolean)
      .join(",");
    addDialog({
      title:
        type === "add"
          ? $t("authSystem.tableToolBar3")
          : $t("authSystem.tableToolBar2"),
      width: "30%",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h("div", { class: "mt-2" }, [
          h("input", {
            class: "el-input__inner",
            style:
              "border:1px solid var(--el-border-color);border-radius:4px;height:32px;padding:0 11px;width:100%",
            placeholder: "IP",
            onInput: (e: any) => (vpnIps.value = e.target.value)
          })
        ]),
      beforeSure: async done => {
        const payload = { adminUserIDs, vpnIps: vpnIps.value };
        const { success } =
          type === "add"
            ? await batchAddVpnIP(payload)
            : await batchRemoveVpnIP(payload);
        if (success) {
          message($t("authSystem.editSuccess"), { type: "success" });
          done();
          onSearch();
        }
      }
    });
  }

  async function loadOptions() {
    const [deptRes, roleRes, tagRes] = await Promise.all([
      getDeptList(),
      getRoles({}),
      getTagGroup()
    ]);
    deptOptions.value = (deptRes?.data?.list ?? []).map(d => ({
      label: d.deptName,
      value: d.deptID
    }));
    roleOptions.value = (roleRes?.data?.list ?? []).map(r => ({
      label: r.roleName,
      value: r.roleID
    }));
    tagOptions.value = (tagRes?.data?.list ?? []).map(t => ({
      label: t.name,
      value: t.id
    }));
  }

  onMounted(async () => {
    await loadOptions();
    onSearch();
  });

  return {
    searchForm,
    statusOptions,
    roleOptions,
    deptOptions,
    loading,
    columns,
    dataList,
    pagination,
    selectedRows,
    onSearch,
    resetForm,
    handleSelectionChange,
    openDialog,
    openPasswordDialog,
    openVpnIPDialog,
    handleOtp
  };
}
