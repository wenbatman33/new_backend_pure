import { h, ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { ElMessageBox } from "element-plus";
import {
  getPromotionMemberList,
  getPromotionDropdown,
  cancelApply,
  reApply,
  approveMember,
  getOperateLog,
  type PromotionApplyItem
} from "@/api/promotion";
import OperateLog from "../operateLog.vue";
import VerifyDetail from "../verifyDetail.vue";
import type { SearchFormProps } from "./types";

// 申請狀態對應顏色（沿用舊碼）
const statusColors: Record<number, string> = {
  1: "#ffa26b",
  2: "#F0453A",
  3: "#01A39D",
  4: "#404244",
  5: "#D0C9D6",
  6: "#D0C9D6",
  7: "#D0C9D6"
};

export function usePromotionApply() {
  const searchForm = reactive<SearchFormProps>({
    id: "",
    memberID: "",
    memberAccount: "",
    promotionName: "",
    batchID: "",
    promotionID: "",
    approveWay: "",
    status: "",
    sendAtStart: "",
    sendAtEnd: "",
    createdAtStart: dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
    createdAtEnd: dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss"),
    refIds: "",
    walletType: "",
    agencyID: "",
    registerIP: "",
    lastLoginIP: "",
    codes: "",
    internalName: ""
  });

  const dataList = ref<PromotionApplyItem[]>([]);
  const loading = ref(true);
  // 下拉資料：狀態 / 優惠條件類型 map（key -> label）
  const statusOptions = ref<{ label: string; value: number }[]>([]);
  const statusMap = ref<Record<string, string>>({});
  const condTypeMap = ref<Record<string, string>>({});
  // 批次合計
  const totalAmount = ref(0);
  const count = ref(0);

  // 審核方式選項
  const approveWayOptions = [
    { label: $t("promotion.all"), value: "" },
    { label: $t("promotion.self"), value: 1 },
    { label: $t("promotion.auto"), value: 2 }
  ];
  // 錢包類型選項
  const walletTypeOptions = [
    { label: $t("promotion.centerWallet"), value: 1 },
    { label: $t("promotion.luckyMoney"), value: 2 }
  ];

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    { label: "ID", prop: "ID", width: 80 },
    { label: $t("promotion.agencyID"), prop: "agencyID", width: 120 },
    {
      label: $t("promotion.memberAccount"),
      prop: "memberAccount",
      width: 130,
      cellRenderer: ({ row }) => (
        <a
          class="text-primary cursor-pointer"
          onClick={() =>
            window.open(`/memberDetail/detail/${row.memberID}`, "_blank")
          }
        >
          {row.memberAccount}
        </a>
      )
    },
    {
      label: $t("promotion.bonusAmount"),
      prop: "bonus",
      width: 100,
      cellRenderer: ({ row }) => <span>{row.bonus?.toLocaleString()}</span>
    },
    {
      label: $t("promotion.status"),
      prop: "status",
      width: 80,
      cellRenderer: ({ row }) => (
        <span style={{ color: statusColors[row.status] }}>
          {statusMap.value[String(row.status)] ?? row.status}
        </span>
      )
    },
    { label: $t("promotion.createdAt"), prop: "createdAt", width: 160 },
    { label: $t("promotion.sendAt"), prop: "sendAt", width: 160 },
    { label: $t("promotion.name"), prop: "promotionName", width: 160 },
    { label: $t("promotion.internalName"), prop: "internalName", width: 180 },
    { label: $t("promotion.promotionID"), prop: "promotionID", width: 100 },
    {
      label: $t("promotion.promotionCond"),
      prop: "promotionCondTypes",
      width: 120,
      cellRenderer: ({ row }) => (
        <span>{filterCondType(row.promotionCondTypes)}</span>
      )
    },
    { label: $t("promotion.note"), prop: "note", width: 120 },
    { label: $t("promotion.registerIP"), prop: "registerIP", width: 130 },
    { label: $t("promotion.lastLoginIP"), prop: "lastLoginIP", width: 130 },
    { label: $t("promotion.batchID"), prop: "batchID", width: 100 },
    { label: $t("promotion.batchCycle"), prop: "batchCycle", width: 180 },
    { label: $t("promotion.updatedAt"), prop: "updatedAt", width: 160 },
    { label: $t("promotion.updatedUser"), prop: "updatedUser", width: 110 },
    {
      label: $t("promotion.action"),
      fixed: "right",
      width: 240,
      slot: "operation"
    }
  ];

  // 把優惠條件類型 map（{0:1,1:2}）轉成可讀字串
  function filterCondType(types: Record<string, number>) {
    if (!types) return "";
    return Object.values(types)
      .map(v => condTypeMap.value[String(v)] ?? v)
      .join(" | ");
  }

  // 拉下拉選單
  async function fetchDropdown() {
    const { success, data } = await getPromotionDropdown();
    if (!success || !data) return;
    // promotionStatus: [{ "1": "申請中" }, ...]
    const statusList = (data.promotionStatus || []) as Record<string, string>[];
    const sMap: Record<string, string> = {};
    statusList.forEach(item => {
      const [k, v] = Object.entries(item)[0];
      sMap[k] = v;
    });
    statusMap.value = sMap;
    statusOptions.value = [{ label: $t("promotion.all"), value: "" as any }].concat(
      Object.entries(sMap).map(([k, v]) => ({ label: v, value: Number(k) }))
    ) as any;

    const condList = (data.promotionCondType || []) as Record<string, string>[];
    const cMap: Record<string, string> = {};
    condList.forEach(item => {
      const [k, v] = Object.entries(item)[0];
      cMap[k] = v;
    });
    condTypeMap.value = cMap;
  }

  function buildParams() {
    const params: Record<string, any> = {
      ...searchForm,
      page: pagination.currentPage,
      pageSize: pagination.pageSize
    };
    // 移除空值
    Object.keys(params).forEach(k => {
      if (params[k] === "" || params[k] === undefined || params[k] === null) {
        delete params[k];
      }
    });
    return params;
  }

  async function onSearch() {
    loading.value = true;
    try {
      if (statusOptions.value.length === 0) {
        await fetchDropdown();
      }
      const { success, data } = await getPromotionMemberList(buildParams());
      if (success && data) {
        dataList.value = data.list ?? [];
        pagination.total = data.total ?? 0;
        totalAmount.value = data.totalAmount ?? 0;
        count.value = data.count ?? 0;
      }
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    searchForm.createdAtStart = dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss");
    searchForm.createdAtEnd = dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss");
    pagination.currentPage = 1;
    onSearch();
  }

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  // 取消申請
  function handleCancel(row: PromotionApplyItem) {
    ElMessageBox.confirm($t("promotion.helpCancelApply"), "", {
      type: "warning"
    })
      .then(async () => {
        const { success } = await cancelApply({ ID: row.ID });
        if (success) {
          message($t("promotion.cancelApplySuccess"), { type: "success" });
          onSearch();
        }
      })
      .catch(() => {});
  }

  // 重新申請
  async function handleReApply(row: PromotionApplyItem) {
    const { success } = await reApply({ ID: row.ID });
    if (success) {
      message($t("promotion.applyReapplySuccess"), { type: "success" });
      onSearch();
    }
  }

  // 手動派發(3) / 拒絕派發(7)
  async function handleApprove(status: number, row: PromotionApplyItem) {
    const { success } = await approveMember({ ID: row.ID, status });
    if (success) {
      message($t("promotion.actionSuccess"), { type: "success" });
      onSearch();
    }
  }

  // 申請記錄（操作日誌）
  function openLog(row: PromotionApplyItem) {
    addDialog({
      title: $t("promotion.log"),
      width: "1000px",
      draggable: true,
      hideFooter: true,
      contentRenderer: () => h(OperateLog, { logId: row.ID })
    });
  }

  // 申請明細（優惠條件範圍）
  function openVerifyDetail(row: PromotionApplyItem) {
    addDialog({
      title: $t("promotion.applyDetail"),
      width: "700px",
      draggable: true,
      hideFooter: true,
      contentRenderer: () =>
        h(VerifyDetail, {
          condRange: row.promotionCondRange ?? [],
          condTypeMap: condTypeMap.value
        })
    });
  }

  // 申請查看：原本開啟跨模組 PromotionModal（promotion/list），尚未移植
  // TODO: PromotionModal 屬於 promotion/list 模組，待該模組移植後再串接
  function openPromotionView(row: PromotionApplyItem) {
    message(
      `${$t("promotion.applyView")} (promotionID=${row.promotionID}) - TODO`,
      { type: "info" }
    );
  }

  // 匯出：呼叫大頁數列表，前端轉 excel；report 工具已移植可用
  async function handleExport() {
    const params = buildParams();
    params.page = 1;
    params.pageSize = 5000;
    const { success, data } = await getPromotionMemberList(params);
    if (success && data) {
      // TODO: 接 @/utils/report 的 jsonToSheetXlsx（欄位對應），此處先提示
      message(`${$t("promotion.handleExport")} (${data.list?.length ?? 0})`, {
        type: "success"
      });
    }
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
    statusOptions,
    approveWayOptions,
    walletTypeOptions,
    totalAmount,
    count,
    onSearch,
    resetForm,
    handleSizeChange,
    handleCurrentChange,
    handleCancel,
    handleReApply,
    handleApprove,
    openLog,
    openVerifyDetail,
    openPromotionView,
    handleExport
  };
}
