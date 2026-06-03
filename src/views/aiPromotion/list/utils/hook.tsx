import { ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";
import { getPromotionList, promotionStatus } from "@/api/aiPromotion";
import type { PromotionItem } from "./types";

// 優惠模板類型對應
const promotionCondTypesMap: Record<number, string> = {
  1: $t("aiPromotion.depositCond"),
  2: $t("aiPromotion.betCond"),
  3: $t("aiPromotion.turnoverCond"),
  5: $t("aiPromotion.negativeCond"),
  6: $t("aiPromotion.positiveCond"),
  7: $t("aiPromotion.withdrawalCond"),
  8: $t("aiPromotion.negativeNegativeCond"),
  9: $t("aiPromotion.negativePositiveCond")
};

// 自由度對應
const freedomMap: Record<number, string> = {
  1: $t("aiPromotion.backgroundMechanism"),
  2: $t("aiPromotion.independentMechanism"),
  3: $t("aiPromotion.designatedDeposit")
};

export function usePromotionList() {
  const searchForm = reactive({
    ID: "",
    name: "",
    status: "",
    online: "",
    startTime: "",
    endTime: "",
    walletType: "",
    eventCode: "",
    freedom: "",
    internalName: ""
  });
  const dataList = ref<PromotionItem[]>([]);
  const loading = ref(true);

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  // 狀態下拉
  const statusOptions = [
    { label: $t("aiPromotion.enable"), value: 1 },
    { label: $t("aiPromotion.disable"), value: 2 }
  ];

  // 類型下拉（銷售/代理）
  const onlineOptions = [
    { label: $t("aiPromotion.sales"), value: 1 },
    { label: $t("aiPromotion.agency"), value: 2 }
  ];

  // 自由度下拉
  const freedomOptions = [
    { label: $t("aiPromotion.backgroundMechanism"), value: 1 },
    { label: $t("aiPromotion.independentMechanism"), value: 2 },
    { label: $t("aiPromotion.designatedDeposit"), value: 3 }
  ];

  // 錢包類型下拉
  const walletTypeOptions = [
    { label: $t("aiPromotion.centerWallet"), value: 1 },
    { label: $t("aiPromotion.luckyMoney"), value: 2 }
  ];

  const columns: TableColumnList = [
    { label: $t("aiPromotion.id"), prop: "ID", width: 70, sortable: true },
    {
      label: $t("aiPromotion.cond"),
      prop: "promotionCondTypes",
      minWidth: 120,
      cellRenderer: ({ row }) => (
        <div>
          {(row.promotionCondTypes ?? []).map((item: number) => (
            <div key={item}>{promotionCondTypesMap[item] ?? item}</div>
          ))}
        </div>
      )
    },
    { label: $t("aiPromotion.name"), prop: "name", minWidth: 160 },
    {
      label: $t("aiPromotion.internalName"),
      prop: "internalName",
      minWidth: 160
    },
    {
      label: $t("aiPromotion.status"),
      prop: "status",
      width: 90,
      cellRenderer: ({ row }) => (
        <span style={{ color: row.status === 1 ? "#01a29d" : "#979797" }}>
          {row.status === 1 ? $t("aiPromotion.enable") : $t("aiPromotion.disable")}
        </span>
      )
    },
    { label: $t("aiPromotion.start"), prop: "startTime", width: 160, sortable: true },
    { label: $t("aiPromotion.end"), prop: "endTime", width: 160, sortable: true },
    {
      label: $t("aiPromotion.updatedAt"),
      prop: "updatedAt",
      width: 160,
      sortable: true
    },
    {
      label: $t("aiPromotion.freedom"),
      prop: "freedom",
      width: 150,
      cellRenderer: ({ row }) => <span>{freedomMap[row.freedom] ?? ""}</span>
    },
    { label: $t("aiPromotion.code"), prop: "code", width: 120 },
    {
      label: $t("aiPromotion.type"),
      prop: "online",
      width: 120,
      cellRenderer: ({ row }) => (
        <span>
          {row.online === 1 ? $t("aiPromotion.sales") : $t("aiPromotion.agency")}
        </span>
      )
    },
    { label: $t("aiPromotion.updatedUser"), prop: "updatedUser", width: 120 },
    { label: $t("aiPromotion.action"), fixed: "right", width: 120, slot: "operation" }
  ];

  // 移除空值
  function buildParams() {
    const params: Record<string, any> = {
      page: pagination.currentPage,
      pageSize: pagination.pageSize
    };
    Object.entries(searchForm).forEach(([k, v]) => {
      if (v !== "" && v !== undefined && v !== null) params[k] = v;
    });
    // 沿用舊邏輯：online 未指定時帶 "1,2"
    if (!(params.online === 1 || params.online === 2 || params.online === "1" || params.online === "2")) {
      params.online = "1,2";
    }
    return params;
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getPromotionList(buildParams());
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

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  // 切換啟用/停用
  function handleStatus(row: PromotionItem) {
    ElMessageBox.confirm(
      row.status === 1
        ? $t("aiPromotion.confirmDisable")
        : $t("aiPromotion.confirmEnable"),
      "",
      { type: "warning" }
    )
      .then(async () => {
        const { success } = await promotionStatus({ ID: row.ID });
        if (success) {
          message($t("aiPromotion.operateSuccess"), { type: "success" });
          onSearch();
        }
      })
      .catch(() => {});
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    statusOptions,
    onlineOptions,
    freedomOptions,
    walletTypeOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    handleSizeChange,
    handleCurrentChange,
    handleStatus
  };
}
