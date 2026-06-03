import { ref, reactive, onMounted } from "vue";
import { transformI18n as $t } from "@/plugins/i18n";
import { getAuthLogs } from "@/api/authSystem";
import type { AuthLogItem, AuthLogSubData } from "./types";

export function useAuthLog() {
  const searchForm = reactive({
    startDate: "",
    endDate: "",
    account: ""
  });
  const dataList = ref<AuthLogItem[]>([]);
  const loading = ref(true);

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  // 操作類型代碼 → 文案（沿用舊 routes.system.authLogs.actions）
  const actionFormat = (action: number) =>
    $t(`authSystem.action_${action}`);

  // 子資料明細格式化：欄位變更 或 VPN IP 變更
  const subDataFormat = (item: AuthLogSubData) => {
    if (item.column) {
      return `${$t(`authSystem.column_${item.column}`)}： ${item?.oldValue} → ${item?.newValue}`;
    }
    if (item.vpn_ip) {
      return `${item?.admin_user_account} Vpn IP ${$t("authSystem.batchChanges")} → ： ${item?.vpn_ip}`;
    }
    return "";
  };

  const columns: TableColumnList = [
    { label: $t("authSystem.account"), prop: "account", width: 150 },
    {
      label: $t("authSystem.operate"),
      prop: "action",
      width: 130,
      cellRenderer: ({ row }) => <span>{actionFormat(row.action)}</span>
    },
    { label: $t("authSystem.target"), prop: "target", minWidth: 300, align: "left" },
    { label: $t("authSystem.time"), prop: "time", width: 170 },
    {
      label: $t("authSystem.content"),
      prop: "sub_data",
      align: "left",
      cellRenderer: ({ row }) => (
        <div>
          {(row.sub_data ?? []).map((r: AuthLogSubData, i: number) => (
            <p key={i} class="auth-log-content-row">
              {subDataFormat(r)}
            </p>
          ))}
        </div>
      )
    }
  ];

  // 過濾空值（沿用舊 beforeFetch 行為）
  function buildParams() {
    const params: Record<string, any> = {};
    Object.keys(searchForm).forEach(key => {
      const val = (searchForm as any)[key];
      if (val !== undefined && val !== "") params[key] = val;
    });
    return params;
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getAuthLogs(buildParams());
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
    resetForm
  };
}
