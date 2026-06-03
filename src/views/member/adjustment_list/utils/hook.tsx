import { ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { transformI18n as $t } from "@/plugins/i18n";
import {
  getMemberAdjustmentList,
  type MemberAdjustmentItem
} from "@/api/member";
import type { SearchFormProps } from "./types";

// 調整原因選項（沿用舊 risk_control 命名空間 key）
export const adjustReasonOptions = [
  { value: 1, label: $t("member.adjustReasonDistributeRedEnvelops") },
  { value: 2, label: $t("member.adjustReasonDeductIllegalProfits") },
  { value: 3, label: $t("member.adjustReasonInnerMemberTestNumber") },
  { value: 4, label: $t("member.adjustReasonFinanceSpecialDeposit") },
  { value: 5, label: $t("member.adjustReasonMarketingSpecialDeposit") },
  { value: 6, label: $t("member.adjustReasonTransferSpecialDeposit") },
  { value: 7, label: $t("member.adjustReasonRiskViolationBetDeduct") },
  { value: 8, label: $t("member.adjustReasonRickControlEedEnvelopsDistribute") },
  { value: 9, label: $t("member.adjustReasonGameWalletNegativeNumber") },
  { value: 10, label: $t("member.adjustReasonManufactorPayoutError") },
  { value: 11, label: $t("member.adjustReasonCloseProduct") },
  { value: 12, label: $t("member.adjustReasonTestMemberDeposit") },
  { value: 13, label: $t("member.adjustReasonOfflineEventPayout") },
  { value: 14, label: $t("member.adjustReasonOnlineEventDeposit") },
  { value: 15, label: $t("member.adjustReasonThirdPartyDepositError") }
];

// 交易狀態色彩對照
const statusMapping = [
  { value: 1, label: $t("member.adjustmentStatus1"), color: "#00EC00" },
  { value: 2, label: $t("member.adjustmentStatus2"), color: "#FF0000" },
  { value: 3, label: $t("member.adjustmentStatus3"), color: "#FFD306" },
  { value: 4, label: $t("member.adjustmentStatus4"), color: "#FF0000" }
];

export function useAdjustmentList() {
  const searchForm = reactive<SearchFormProps>({
    memberName: "",
    reason: "",
    status: "",
    adjustmentType: "",
    transactionID: "",
    updateUser: "",
    amountTimes: "",
    verifyDateStart: "",
    verifyDateEnd: ""
  });
  // 交易時間區間（el-date-picker datetimerange）
  const dateRange = ref<[Date, Date] | null>(null);

  const dataList = ref<MemberAdjustmentItem[]>([]);
  const loading = ref(true);

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  // 跳轉會員明細
  const handleAccount = (memberID: number | string) => {
    window.open("/memberDetail/detail/" + memberID);
  };

  const statusOptions = [
    { label: $t("member.pass"), value: 1 },
    { label: $t("member.refuse"), value: 2 }
  ];

  const adjustmentTypeOptions = [
    { label: $t("member.highScore"), value: 1 },
    { label: $t("member.lowerScore"), value: 2 }
  ];

  const columns: TableColumnList = [
    { label: $t("member.applyId"), prop: "adjustmentID", width: 100, sortable: true },
    { label: $t("member.tradeId"), prop: "transactionID", width: 200 },
    {
      label: $t("member.memberName2"),
      prop: "memberName",
      width: 180,
      cellRenderer: ({ row }) => (
        <a
          href="javascript:void(0)"
          onClick={() => handleAccount(row.memberID)}
        >
          {row.memberName}
        </a>
      )
    },
    { label: "ID", prop: "id", width: 100, sortable: true },
    { label: $t("member.applyFormName"), prop: "subject", width: 180 },
    {
      label: $t("member.adjustmentReason"),
      prop: "reason",
      width: 180,
      cellRenderer: ({ row }) =>
        adjustReasonOptions.find(item => item.value === row.reason)?.label ??
        row.reason
    },
    { label: $t("member.explain"), prop: "description", width: 150 },
    {
      label: $t("member.amount"),
      prop: "amount",
      width: 180,
      cellRenderer: ({ row }) => {
        try {
          return row.amount.toLocaleString();
        } catch {
          return row.amount;
        }
      }
    },
    { label: $t("member.VipSection11"), prop: "amountTimes", width: 100 },
    {
      label: $t("member.scoreUpAndDown"),
      prop: "adjustmentType",
      width: 120,
      cellRenderer: ({ row }) =>
        row.adjustmentType === 1 ? (
          <span style="color: #FF0000">{$t("member.highScore")}</span>
        ) : (
          <span>{$t("member.lowerScore")}</span>
        )
    },
    {
      label: $t("member.tradeStatus"),
      prop: "status",
      width: 120,
      cellRenderer: ({ row }) => {
        const target =
          statusMapping.find(item => item.value === row.status) ||
          statusMapping[2];
        return <span style={`color: ${target.color}`}>{target.label}</span>;
      }
    },
    {
      label: $t("member.specifyGameTypeAndManufacturer"),
      prop: "adjustmentLimit",
      width: 180,
      cellRenderer: ({ row }) => {
        const list = row.adjustmentLimit ?? [];
        return list
          .map((item: any) => {
            let text = item.gameTypeName;
            text += item.gameGroupName ? "/" + item.gameGroupName : "";
            return text;
          })
          .join(",");
      }
    },
    { label: $t("member.tradeTime"), prop: "createdAt", width: 180, sortable: true },
    { label: $t("member.VipSection12"), prop: "verifyAt", width: 180, sortable: true },
    { label: $t("member.depositSection11"), prop: "updateUser", width: 180 },
    { label: $t("member.frontDeskInstructions"), prop: "feDescription", width: 140 }
  ];

  // 組查詢參數（去掉空值）
  function buildParams() {
    const params: Record<string, any> = {
      page: pagination.currentPage,
      pageSize: pagination.pageSize
    };
    Object.keys(searchForm).forEach(key => {
      const val = (searchForm as any)[key];
      if (val !== undefined && val !== "" && val !== null) {
        params[key] = val;
      }
    });
    return params;
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getMemberAdjustmentList(buildParams());
      const list = data?.list ?? [];
      // 後端若 adjustmentLimit 為空，改用 luckMoneyGameList
      list.forEach((item: any) => {
        if (!item.adjustmentLimit || item.adjustmentLimit.length === 0) {
          item.adjustmentLimit = item.luckMoneyGameList ?? [];
        }
      });
      dataList.value = list;
      pagination.total = data?.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  // 處理日期區間變更
  function onDateChange(val: [Date, Date] | null) {
    if (!val) {
      searchForm.verifyDateStart = "";
      searchForm.verifyDateEnd = "";
      return;
    }
    searchForm.verifyDateStart = dayjs(val[0]).format("YYYY-MM-DD HH:mm");
    searchForm.verifyDateEnd = dayjs(val[1]).format("YYYY-MM-DD HH:mm");
  }

  function resetForm(formEl) {
    if (formEl) formEl.resetFields();
    dateRange.value = null;
    searchForm.verifyDateStart = "";
    searchForm.verifyDateEnd = "";
    pagination.currentPage = 1;
    onSearch();
  }

  // 匯出（取大量資料，前端匯出 xlsx）
  // TODO: pure 專案匯出工具與舊 jsonToSheetXlsx 不同，這裡先取全量資料供後續接 export 工具
  async function handleExport() {
    loading.value = true;
    try {
      const params = buildParams();
      params.page = 1;
      params.pageSize = 5000;
      const { data } = await getMemberAdjustmentList(params);
      return data?.list ?? [];
    } finally {
      loading.value = false;
    }
  }

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    dateRange,
    loading,
    columns,
    dataList,
    pagination,
    adjustReasonOptions,
    statusOptions,
    adjustmentTypeOptions,
    onSearch,
    onDateChange,
    resetForm,
    handleExport,
    handleSizeChange,
    handleCurrentChange
  };
}
