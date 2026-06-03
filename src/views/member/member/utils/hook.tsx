import { ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";
import {
  getMemberList,
  resetMemberSMS,
  getMemberVipSettingList,
  type MemberItem
} from "@/api/member";
import type { SearchFormProps } from "./types";

// 狀態色：0 空 / 1 啟用 / 2 停用 / 3 鎖定
const SUCCESS = "#52c41a";
const ERROR = "#f5222d";
const WARNING = "#faad14";

export function useMember() {
  const searchForm = reactive<SearchFormProps>({
    id: "",
    account: "",
    name: "",
    phone: "",
    email: "",
    vip_level: "",
    status: "",
    deposit_limit: "",
    withdraw_limit: "",
    created_at_start: "",
    created_at_end: "",
    registerArea: "",
    registerIp: "",
    topAgencyID: "",
    recommenderAccount: "",
    loginDeviceID: ""
  });

  const dataList = ref<MemberItem[]>([]);
  const loading = ref(true);
  const vipOptions = ref<{ label: string; value: number }[]>([]);

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const statusOptions = [
    { label: $t("member.firstDeposit1"), value: "" },
    { label: $t("member.enable"), value: 1 },
    { label: $t("member.disable"), value: 2 },
    { label: $t("member.lock"), value: 3 }
  ];

  const limitOptions = [
    { label: $t("member.firstDeposit1"), value: "" },
    { label: $t("member.enable"), value: 1 },
    { label: $t("member.disable"), value: 2 }
  ];

  // status -> 文案/顏色
  const statusMapping: { text: string; color: string }[] = [
    { text: "", color: "#000" },
    { text: $t("member.enable"), color: SUCCESS },
    { text: $t("member.disable"), color: ERROR },
    { text: $t("member.lock"), color: WARNING }
  ];

  function fmtMoney(v: any) {
    try {
      return commaDecimalFormat(v, 2);
    } catch {
      return v;
    }
  }

  const columns: TableColumnList = [
    { label: "ID", prop: "id", width: 70, fixed: "left" },
    {
      label: $t("member.account"),
      prop: "account",
      width: 130,
      slot: "account"
    },
    { label: $t("member.name"), prop: "name", width: 120 },
    { label: $t("member.phone"), prop: "phone", width: 130 },
    {
      label: $t("member.money"),
      prop: "money",
      width: 150,
      cellRenderer: ({ row }) => <span>{fmtMoney(row.money)}</span>
    },
    {
      label: $t("member.vipLevel"),
      prop: "vipLevel",
      width: 90
    },
    {
      label: $t("member.currentStatus"),
      prop: "current_status",
      width: 90,
      cellRenderer: ({ row }) => (
        <span style={{ color: row.current_status ? SUCCESS : ERROR }}>
          {row.current_status ? $t("member.online") : $t("member.offline")}
        </span>
      )
    },
    {
      label: $t("member.depositLimit"),
      prop: "deposit_limit",
      width: 100,
      cellRenderer: ({ row }) => {
        const m = statusMapping[row.deposit_limit] ?? statusMapping[0];
        return <span style={{ color: m.color }}>{m.text}</span>;
      }
    },
    {
      label: $t("member.withdrawLimit"),
      prop: "withdraw_limit",
      width: 100,
      cellRenderer: ({ row }) => {
        const m = statusMapping[row.withdraw_limit] ?? statusMapping[0];
        return <span style={{ color: m.color }}>{m.text}</span>;
      }
    },
    {
      label: $t("member.loginStatus"),
      prop: "status",
      width: 90,
      cellRenderer: ({ row }) => {
        const m = statusMapping[row.status] ?? statusMapping[0];
        return <span style={{ color: m.color }}>{m.text}</span>;
      }
    },
    { label: $t("member.createdAt"), prop: "created_at", width: 170 },
    { label: $t("member.lastLoginAt"), prop: "last_login_at", width: 170 },
    {
      label: $t("member.registerIp"),
      prop: "register_ip",
      width: 180,
      cellRenderer: ({ row }) => (
        <span>{`${row.register_ip ?? ""} (${row.register_area ?? ""})`}</span>
      )
    },
    {
      label: $t("member.lastLoginIp"),
      prop: "last_login_ip",
      width: 180,
      cellRenderer: ({ row }) => (
        <span>{`${row.last_login_ip ?? ""} (${row.last_login_area ?? ""})`}</span>
      )
    },
    { label: $t("member.topAgencyID"), prop: "topAgencyID", width: 120 },
    { label: $t("member.agencyId"), prop: "agency_id", width: 120 },
    {
      label: $t("member.recommenderAccount"),
      prop: "recommenderAccount",
      width: 130
    },
    { label: $t("member.paymentGroups"), prop: "payment_groups", width: 120 },
    { label: $t("member.bankcardGroups"), prop: "bankcard_groups", width: 120 },
    {
      label: $t("member.operation"),
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];

  function buildParams() {
    const search: Record<string, any> = {};
    Object.keys(searchForm).forEach(key => {
      const v = (searchForm as any)[key];
      if (v !== undefined && v !== "" && v !== null) {
        search[key] = v;
      }
    });
    search.page = pagination.currentPage;
    search.pageSize = pagination.pageSize;
    return search;
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getMemberList(buildParams());
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    pagination.currentPage = 1;
    onSearch();
  }

  // 查看會員明細：開新分頁（沿用舊行為）
  function handleView(row: MemberItem) {
    window.open(`/memberDetail/detail/${row.id}`);
  }

  async function handleResetSMS(row: MemberItem) {
    const { success } = await resetMemberSMS({ id: row.id });
    if (success) {
      message(`${$t("member.resetSMSSuccess")}: ${row.name}(ID:${row.id})`, {
        type: "success"
      });
    }
  }

  // TODO(dropdown 未移植)：以下批次操作（登入/出入款/標籤/支付組/新增會員）原舊碼以
  // ant-design Dropdown+Menu+多個 BasicModal 實作，pure 版需另立 form.vue 對話框逐一補。
  // 先以提示佔位，避免阻塞列表頁渲染與驗證。
  function handleBatchTodo() {
    message($t("member.batchTodoTip"), { type: "warning" });
  }

  async function loadVipOptions() {
    try {
      const { data } = await getMemberVipSettingList();
      const list = (data?.list ?? []) as any[];
      vipOptions.value = list.map(el => ({
        label: `VIP${el.level}`,
        value: el.level
      }));
    } catch {
      vipOptions.value = [];
    }
  }

  onMounted(() => {
    loadVipOptions();
    onSearch();
  });

  return {
    searchForm,
    loading,
    columns,
    dataList,
    pagination,
    vipOptions,
    statusOptions,
    limitOptions,
    onSearch,
    resetForm,
    handleView,
    handleResetSMS,
    handleBatchTodo
  };
}
