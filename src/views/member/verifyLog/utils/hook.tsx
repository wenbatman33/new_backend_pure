import { h, ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import {
  getVerifyLogList,
  getVerifyLogDetail,
  getVerifyLogOperate
} from "@/api/member";
import DetailContent from "../detailModal.vue";
import OperateLogContent from "../operateLog.vue";

// 操作行为映射：依 actType / actBehav 转中文文案
function getOperationBehavior(actType: number, actBehav: number): string {
  switch (actType) {
    case 1002:
      return $t("member.opLoginTwoFactor");
    case 1011:
      return $t("member.opBindPhone");
    case 2001:
      return $t("member.opForgotAccountPassword");
    case 200:
      switch (actBehav) {
        case 1:
          return $t("member.opChangePassword");
        case 2:
          return $t("member.opAddWithdrawAddress");
        case 3:
          return $t("member.opAddTradingPassword");
        case 4:
          return $t("member.opChangeTradingPassword");
        case 5:
          return $t("member.opForgotTradingPassword");
        default:
          return "-";
      }
    default:
      return "-";
  }
}

export function useVerifyLog() {
  const yesterday = dayjs()
    .subtract(1, "day")
    .startOf("day")
    .format("YYYY-MM-DD HH:mm");

  const searchForm = reactive({
    account: "",
    target: "",
    type: 0,
    // 时间范围（el-date-picker 双值），默认昨日 00:00 起
    timeRange: [yesterday, ""] as [string, string]
  });

  const dataList = ref<any[]>([]);
  const loading = ref(true);

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const typeOptions = [
    { label: $t("member.all"), value: 0 },
    { label: $t("member.newsletter"), value: 1 },
    { label: "Email", value: 2 }
  ];

  const columns: TableColumnList = [
    { label: "ID", prop: "id", width: 150 },
    {
      label: $t("member.type"),
      prop: "type",
      width: 100,
      cellRenderer: ({ row }) => (
        <span>{row.type === 1 ? $t("member.newsletter") : "Email"}</span>
      )
    },
    {
      label: $t("member.operationBehavior"),
      prop: "operationBehavior",
      width: 160,
      cellRenderer: ({ row }) => (
        <span>{getOperationBehavior(row.actType, row.actBehav)}</span>
      )
    },
    {
      label: $t("member.memberAccount"),
      prop: "account",
      width: 180,
      cellRenderer: ({ row }) =>
        row.account !== "0" ? (
          <a
            href={`/memberDetail/detail/?account=${row.account}`}
            target="_blank"
            style="color: var(--el-color-primary)"
          >
            {row.account}
          </a>
        ) : (
          <span>{row.account}</span>
        )
    },
    { label: $t("member.phoneNumberOrEmail"), prop: "target", width: 180 },
    { label: $t("member.sendTime"), prop: "created_date", width: 180 },
    { label: "Response", prop: "response", minWidth: 180 },
    {
      label: $t("member.operate"),
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];

  function buildParams() {
    const params: Record<string, any> = {
      account: searchForm.account,
      target: searchForm.target,
      type: searchForm.type
    };
    const [start, end] = searchForm.timeRange || [];
    if (start) params.startTime = start;
    if (end) params.endTime = end;
    // 移除空值
    Object.keys(params).forEach(key => {
      if (params[key] === "" || params[key] === undefined) delete params[key];
    });
    return params;
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getVerifyLogList(buildParams());
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.type = 0;
    searchForm.timeRange = [yesterday, ""];
    onSearch();
  }

  // 查看验证信息
  async function handleView(row) {
    const { success, data } = await getVerifyLogDetail(row.id);
    if (!success) return;
    addDialog({
      title: $t("member.verificationInfo"),
      width: "600px",
      draggable: true,
      hideFooter: true,
      contentRenderer: () =>
        h(DetailContent, {
          detail: {
            verifyData: data?.verifyData ?? "",
            code: data?.code ?? "",
            context: data?.context ?? ""
          }
        })
    });
  }

  // 操作记录
  function handleRecord(row) {
    addDialog({
      title: $t("member.handleRecord"),
      width: "1000px",
      draggable: true,
      hideFooter: true,
      contentRenderer: () => h(OperateLogContent, { logId: row.id })
    });
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    typeOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    handleView,
    handleRecord
  };
}

// 操作记录弹窗内部用
export function useOperateLog(logId: number) {
  const dataList = ref<any[]>([]);
  const loading = ref(true);

  const columns: TableColumnList = [
    { label: $t("member.time"), prop: "createdAt", width: 180 },
    { label: $t("member.operator"), prop: "adminAccount", width: 120 },
    { label: $t("member.operate"), prop: "action", width: 120 },
    {
      label: $t("member.content"),
      prop: "status",
      width: 120,
      cellRenderer: ({ row }) => (
        <span>
          {row.status === 1
            ? $t("member.otpVerifySuccess")
            : $t("member.otpVerifyError")}
        </span>
      )
    },
    { label: $t("member.instructionManual"), prop: "note", minWidth: 150 }
  ];

  async function loadData() {
    loading.value = true;
    try {
      const { data } = await getVerifyLogOperate({ id: logId });
      dataList.value = data?.list ?? [];
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    loadData();
  });

  return { dataList, loading, columns };
}
