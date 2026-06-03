import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElTag } from "element-plus";
import forceLogoutForm from "../form.vue";
import {
  getUserOnlineadmins,
  postUserKickadminuser,
  type OnlineUserItem
} from "@/api/authSystem";

export function useOnlineUserManagement() {
  // 此頁查詢條件為前端過濾（舊後端 onlineadmins 不帶查詢參數）
  const searchForm = reactive({
    account: "",
    roleID: "",
    deptID: ""
  });
  const dataList = ref<OnlineUserItem[]>([]);
  const allList = ref<OnlineUserItem[]>([]);
  const loading = ref(true);
  const formRef = ref();

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    { label: $t("authSystem.userAccount"), prop: "account", minWidth: 200 },
    {
      label: $t("authSystem.onlineStatus"),
      prop: "online",
      width: 130,
      cellRenderer: () =>
        h(ElTag, { type: "success" }, () => $t("authSystem.online"))
    },
    {
      label: $t("authSystem.accountStatus"),
      prop: "status",
      width: 130,
      cellRenderer: ({ row }) =>
        h(
          ElTag,
          { type: row.status === 1 ? "success" : "info" },
          () => (row.status === 1 ? $t("authSystem.enable") : $t("authSystem.disable"))
        )
    },
    { label: $t("authSystem.group"), prop: "roleName", width: 150 },
    { label: $t("authSystem.dept"), prop: "deptName", width: 150 },
    { label: $t("authSystem.lastLoginTime"), prop: "lastLoginAt", minWidth: 170 },
    {
      label: $t("authSystem.action"),
      fixed: "right",
      width: 140,
      slot: "operation"
    }
  ];

  function applyFilter() {
    let list = allList.value;
    if (searchForm.account) {
      list = list.filter(v =>
        String(v.account ?? "").includes(searchForm.account)
      );
    }
    dataList.value = list;
    pagination.total = list.length;
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getUserOnlineadmins();
      allList.value = data?.list ?? [];
      applyFilter();
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }

  // 強制登出（踢出）確認對話框
  function openForceLogout(row: OnlineUserItem) {
    addDialog({
      title: $t("authSystem.forceLogout"),
      props: {
        detail: {
          account: row.account,
          roleName: row.roleName,
          deptName: row.deptName,
          adminID: row.adminID
        }
      },
      width: "400px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(forceLogoutForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const curData = options.props.detail as OnlineUserItem;
        (async () => {
          const { success } = await postUserKickadminuser({
            adminID: curData.adminID
          });
          if (success) {
            message($t("authSystem.forceLogout"), { type: "success" });
            done();
            onSearch();
          }
        })();
      }
    });
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
    openForceLogout
  };
}
