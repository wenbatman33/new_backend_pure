import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElMessageBox, ElSwitch, ElTag } from "element-plus";
import { hasAuth } from "@/router/utils";
import { arrayToOptions } from "@/utils/options";
import editForm from "../form.vue";
import {
  getFnList,
  setFn,
  updateFn,
  deleteFn,
  getRoles,
  getFnRoleList,
  getFunctionHide,
  postFunctionHide,
  deleteFunctionHide,
  postFunctionRoleHide,
  deleteFunctionRoleHide,
  type FunctionItem
} from "@/api/authSystem";
import type { FormItemProps, FnRow } from "./types";

export function useAuth() {
  const searchForm = reactive({
    fnID: "",
    fnName: "",
    fnKey: ""
  });
  const dataList = ref<FnRow[]>([]);
  const loading = ref(true);
  const formRef = ref();
  // 角色列表（給隱藏權限彈窗使用）
  const roleList = ref<any[]>([]);

  const columns: TableColumnList = [
    { label: "ID", prop: "fnID", width: 100 },
    {
      label: $t("authSystem.fnName") + "(CN)",
      prop: "fnName",
      align: "left",
      hide: () => !hasAuth("__col_funName_CN")
    },
    {
      label: $t("authSystem.fnName") + "(EN)",
      prop: "displayFnName",
      align: "left",
      hide: () => !hasAuth("__col_funName_EN")
    },
    { label: $t("authSystem.fnKey"), prop: "fnKey", width: 180 },
    { label: $t("authSystem.createdAt"), prop: "createdAt", width: 180 },
    { label: $t("authSystem.updatedAt"), prop: "updatedAt", width: 180 },
    {
      label: $t("authSystem.roleList"),
      prop: "roleList",
      width: 110,
      slot: "roleList"
    },
    {
      label: $t("authSystem.hidePermissions"),
      prop: "hide",
      width: 120,
      hide: () => !hasAuth("__btn_auth_show"),
      cellRenderer: ({ row }) =>
        h(ElSwitch, {
          modelValue: row.hide === 2,
          activeText: $t("authSystem.hidden"),
          inactiveText: $t("authSystem.show"),
          inlinePrompt: true,
          "onUpdate:modelValue": (val: boolean) => {
            row.hide = val ? 2 : 1;
            row.hide === 1
              ? deleteFunctionHide({ funcID: row.fnID })
              : postFunctionHide({ funcID: row.fnID });
          }
        })
    },
    { label: $t("authSystem.operation"), fixed: "right", width: 200, slot: "operation" }
  ];

  /** 取得樹狀功能列表（pageSize 設大值取全量，無分頁） */
  async function onSearch() {
    loading.value = true;
    try {
      const params: Record<string, any> = { pageSize: 1000 };
      if (searchForm.fnID) params.fnID = searchForm.fnID;
      if (searchForm.fnName) params.fnName = searchForm.fnName;
      if (searchForm.fnKey) params.fnKey = searchForm.fnKey;
      const { data } = await getFnList(params);
      const list = (data ?? []) as FnRow[];
      dataList.value = list.sort((a, b) => (a.fnName > b.fnName ? 1 : -1));
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }

  /** 組出上層功能下拉選項（攤平樹、去掉 children） */
  async function buildParentOptions() {
    const { data } = await getFnList({ pageSize: 1000 });
    const flat = (data ?? []).map((item: FnRow) => {
      const { children, ...rest } = item;
      return rest;
    });
    return arrayToOptions(flat, "fnID", ["fnName", "fnKey"]);
  }

  async function openDialog(isUpdate = false, row?: FnRow) {
    const parentOptions = await buildParentOptions();
    addDialog({
      title: isUpdate
        ? $t("authSystem.editPermissions")
        : $t("authSystem.addPermissions"),
      props: {
        formInline: {
          fnID: row?.fnID,
          fnName: row?.fnName ?? "",
          displayFnName: row?.displayFnName ?? "",
          fnKey: row?.fnKey ?? "",
          parentID: row?.parentID || undefined,
          parentOptions,
          showCN: hasAuth("__col_funName_CN"),
          showEN: hasAuth("__col_funName_EN"),
          isUpdate
        }
      },
      width: "520px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async (valid: boolean) => {
          if (!valid) return;
          const payload: FunctionItem = {
            fnName: curData.fnName,
            displayFnName: curData.displayFnName,
            fnKey: curData.fnKey,
            parentID: curData.parentID
          };
          if (isUpdate) {
            payload.fnID = Number(curData.fnID);
            const { success } = await updateFn(payload);
            if (success) {
              message($t("authSystem.editPermissions"), { type: "success" });
              done();
              onSearch();
            }
          } else {
            const { success } = await setFn(payload);
            if (success) {
              message($t("authSystem.addPermissions"), { type: "success" });
              done();
              onSearch();
            }
          }
        });
      }
    });
  }

  function handleDelete(row: FnRow) {
    ElMessageBox.confirm($t("authSystem.deleteCheck"), "", { type: "warning" })
      .then(async () => {
        const { success } = await deleteFn(row.fnID);
        if (success) {
          message($t("authSystem.delete"), { type: "success" });
          onSearch();
        }
      })
      .catch(() => {});
  }

  /** 檢視某功能所屬角色群組 */
  async function openRoleDialog(row: FnRow) {
    const { data } = await getFnRoleList(row.fnID);
    const group: string[] = data?.list ?? [];
    addDialog({
      title: $t("authSystem.checkGroup"),
      width: "600px",
      draggable: true,
      hideFooter: true,
      contentRenderer: () =>
        h(
          "div",
          { class: "flex flex-wrap gap-2 p-2" },
          group.length
            ? group.map((tag, idx) => h(ElTag, { key: idx }, () => tag))
            : [h("span", $t("authSystem.noData"))]
        )
    });
  }

  onMounted(async () => {
    onSearch();
    // 預載角色列表，供隱藏權限彈窗下拉使用
    const { data } = await getRoles({});
    roleList.value = data?.list ?? [];
  });

  return {
    searchForm,
    loading,
    columns,
    dataList,
    roleList,
    onSearch,
    resetForm,
    openDialog,
    openRoleDialog,
    handleDelete,
    // 以下提供給隱藏權限彈窗
    getFunctionHide,
    deleteFunctionHide,
    postFunctionRoleHide,
    deleteFunctionRoleHide
  };
}
