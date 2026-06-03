import { ref, reactive, onMounted } from "vue";
import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";
import { getYuebaoList } from "@/api/yuebao";
import type { YuebaoItem, YuebaoTotal } from "./types";

// 状态对应：3 计息中 / 4 已失效 / 5 待领取 / 6 已领取 / 7 未领取
const statusMap: Record<number, { text: string; color: string }> = {
  3: { text: $t("yuebao.statusCalculating"), color: "#FF9224" },
  4: { text: $t("yuebao.statusExpired"), color: "#D0D0D0" },
  5: { text: $t("yuebao.statusPending"), color: "#00E3E3" },
  6: { text: $t("yuebao.statusReceived"), color: "#5C5C5C" },
  7: { text: $t("yuebao.statusUnreceived"), color: "#5C5C5C" }
};

export function useYuebaoApplication() {
  const searchForm = reactive({
    memberAccount: "",
    status: "",
    numero: "",
    id: "",
    // 派发时间
    sendAtStart: "",
    sendAtEnd: "",
    // 申请时间
    createdAtStart: "",
    createdAtEnd: "",
    // 领取时间
    receiveAtStart: "",
    receiveAtEnd: ""
  });

  // 搜寻列日期区间用的中介值（el-date-picker datetimerange）
  const sendRange = ref<[string, string] | []>([]);
  const createdRange = ref<[string, string] | []>([]);
  const receiveRange = ref<[string, string] | []>([]);

  const dataList = ref<YuebaoItem[]>([]);
  const loading = ref(true);
  const total = reactive<YuebaoTotal>({
    count: 0,
    sendTotal: 0,
    reciveTotal: 0,
    giveupTotal: 0
  });

  const statusOptions = [
    { label: $t("yuebao.statusCalculating"), value: 3 },
    { label: $t("yuebao.statusExpired"), value: 4 },
    { label: $t("yuebao.statusPending"), value: 5 },
    { label: $t("yuebao.statusReceived"), value: 6 },
    { label: $t("yuebao.statusUnreceived"), value: 7 }
  ];

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    {
      label: $t("yuebao.serialNo"),
      prop: "id",
      width: 90,
      sortable: true
    },
    {
      label: $t("yuebao.memberAccount"),
      prop: "memberAccount",
      minWidth: 150,
      cellRenderer: ({ row }) => (
        <a
          class="text-primary cursor-pointer"
          onClick={() => handleViewMember(row)}
        >
          {row.memberAccount}
        </a>
      )
    },
    {
      label: $t("yuebao.calcMoney"),
      prop: "calcMoney",
      width: 120,
      cellRenderer: ({ row }) => <span>{commaDecimalFormat(row.calcMoney, 2)}</span>
    },
    {
      label: $t("yuebao.profit"),
      prop: "profit",
      width: 120,
      cellRenderer: ({ row }) => <span>{commaDecimalFormat(row.profit, 2)}</span>
    },
    {
      label: $t("yuebao.status"),
      prop: "status",
      width: 100,
      cellRenderer: ({ row }) => {
        const s = statusMap[row.status];
        return s ? <span style={{ color: s.color }}>{s.text}</span> : <span>{row.status}</span>;
      }
    },
    {
      label: $t("yuebao.createdAt"),
      prop: "createdAt",
      width: 160,
      sortable: true,
      cellRenderer: ({ row }) => <span>{row.createdAt || "-"}</span>
    },
    {
      label: $t("yuebao.numero"),
      prop: "numero",
      width: 110
    },
    {
      label: $t("yuebao.sendAt"),
      prop: "sendAt",
      width: 160,
      sortable: true,
      cellRenderer: ({ row }) => <span>{row.sendAt || "-"}</span>
    },
    {
      label: $t("yuebao.updatedAt"),
      prop: "updatedAt",
      width: 160,
      cellRenderer: ({ row }) => <span>{row.updatedAt || "-"}</span>
    },
    {
      label: $t("yuebao.updatedUser"),
      prop: "updatedUser",
      width: 120,
      cellRenderer: ({ row }) => <span>{row.updatedUser || "-"}</span>
    },
    {
      label: $t("yuebao.action"),
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];

  // 检视会员明细
  function handleViewMember(row: YuebaoItem) {
    window.open("/memberDetail/detail/" + row.memberID);
  }

  // 检视会员资金纪录
  function handleViewWalletLog(row: YuebaoItem) {
    window.open("/memberDetail/walletLog/" + row.memberID);
  }

  function buildParams() {
    // 同步日期区间到各别字段
    const [sStart, sEnd] = sendRange.value as string[];
    const [cStart, cEnd] = createdRange.value as string[];
    const [rStart, rEnd] = receiveRange.value as string[];
    searchForm.sendAtStart = sStart ?? "";
    searchForm.sendAtEnd = sEnd ?? "";
    searchForm.createdAtStart = cStart ?? "";
    searchForm.createdAtEnd = cEnd ?? "";
    searchForm.receiveAtStart = rStart ?? "";
    searchForm.receiveAtEnd = rEnd ?? "";

    const params: Record<string, any> = {
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
      orderItem: 1,
      order: 1
    };
    Object.entries(searchForm).forEach(([k, v]) => {
      if (v !== undefined && v !== "" && v !== null) params[k] = v;
    });
    return params;
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getYuebaoList(buildParams());
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
      total.count = data?.count ?? 0;
      total.sendTotal = data?.sendTotal ?? 0;
      total.reciveTotal = data?.reciveTotal ?? 0;
      total.giveupTotal = data?.giveupTotal ?? 0;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    sendRange.value = [];
    createdRange.value = [];
    receiveRange.value = [];
    pagination.currentPage = 1;
    onSearch();
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    sendRange,
    createdRange,
    receiveRange,
    statusOptions,
    loading,
    columns,
    dataList,
    total,
    pagination,
    onSearch,
    resetForm,
    handleViewWalletLog
  };
}
