import { reactive, ref, onMounted, toRaw } from "vue";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";
import {
  getPromotionList,
  getPromotionDropdown,
  deletePromotion,
  promotionStatus,
  type PromotionItem,
  type DropdownItem
} from "@/api/promotion";
import type { SearchFormProps } from "./types";

// 優惠條件類型對照（沿用舊碼數字 → 文案）
const condTypeMap: Record<number, string> = {
  1: $t("promotion.depositCond"),
  2: $t("promotion.betCond"),
  3: $t("promotion.turnoverCond"),
  5: $t("promotion.negativeCond"),
  6: $t("promotion.positiveCond"),
  7: $t("promotion.withdrawalCond"),
  8: $t("promotion.negativeNegativeCond"),
  9: $t("promotion.negativePositiveCond")
};

export function usePromotionList() {
  const searchForm = reactive<SearchFormProps>({
    ID: "",
    name: "",
    promotionCondType: "",
    status: "",
    activity: "",
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

  // 下拉選單（由 getPromotionDropdown 帶回）
  const dropdown = reactive({
    status: [] as { label: string; value: string }[],
    promotionCondType: [] as { label: string; value: string }[],
    activity: [] as { label: string; value: string }[]
  });

  // 線上/線下選項（靜態）
  const onlineOptions = [
    { label: $t("promotion.sales"), value: 1 },
    { label: $t("promotion.agency"), value: 2 }
  ];
  // 錢包類型選項（靜態）
  const walletTypeOptions = [
    { label: $t("promotion.centerWallet"), value: 1 },
    { label: $t("promotion.luckyMoney"), value: 2 }
  ];
  // 機制選項（靜態）
  const freedomOptions = [
    { label: $t("promotion.backgroundMechanism"), value: 1 },
    { label: $t("promotion.independentMechanism"), value: 2 },
    { label: $t("promotion.designatedDeposit"), value: 3 }
  ];

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    { label: $t("promotion.id"), prop: "ID", width: 70, sortable: true },
    {
      label: $t("promotion.cond"),
      prop: "promotionCondTypes",
      minWidth: 110,
      cellRenderer: ({ row }) => (
        <div>
          {(row.promotionCondTypes ?? []).map((item: number) => (
            <p style="margin:0">{condTypeMap[item] ?? item}</p>
          ))}
        </div>
      )
    },
    { label: $t("promotion.name"), prop: "name", minWidth: 140 },
    {
      label: $t("promotion.internalName"),
      prop: "internalName",
      minWidth: 140
    },
    {
      label: $t("promotion.status"),
      prop: "status",
      width: 80,
      cellRenderer: ({ row }) => (
        <span style={{ color: row.status === 1 ? "#01a29d" : "#979797" }}>
          {row.status === 1 ? $t("promotion.enable") : $t("promotion.disable")}
        </span>
      )
    },
    { label: $t("promotion.start"), prop: "startTime", width: 160, sortable: true },
    { label: $t("promotion.end"), prop: "endTime", width: 160, sortable: true },
    {
      label: $t("promotion.updatedAt"),
      prop: "updatedAt",
      width: 160,
      sortable: true
    },
    {
      label: $t("promotion.freedom"),
      prop: "freedom",
      width: 130,
      cellRenderer: ({ row }) => {
        const map: Record<number, string> = {
          1: $t("promotion.backgroundMechanism"),
          2: $t("promotion.independentMechanism"),
          3: $t("promotion.designatedDeposit")
        };
        return <span>{map[row.freedom] ?? ""}</span>;
      }
    },
    { label: $t("promotion.code"), prop: "code", width: 110 },
    {
      label: $t("promotion.type"),
      prop: "online",
      width: 120,
      cellRenderer: ({ row }) => (
        <span>
          {row.online === 1 ? $t("promotion.sales") : $t("promotion.agency")}
        </span>
      )
    },
    { label: $t("promotion.updatedUser"), prop: "updatedUser", width: 110 },
    { label: $t("promotion.action"), fixed: "right", width: 180, slot: "operation" }
  ];

  // 去除空查詢值
  function removeEmptyQuery(obj: Record<string, any>) {
    const result: Record<string, any> = {};
    Object.keys(obj).forEach(key => {
      const v = obj[key];
      if (v !== "" && v !== undefined && v !== null) result[key] = v;
    });
    return result;
  }

  async function onSearch() {
    loading.value = true;
    try {
      const params = removeEmptyQuery(toRaw(searchForm));
      // 舊碼 beforeFetch：未指定 online 時預設帶 1,2
      if (!(params.online === 1 || params.online === 2)) {
        params.online = "1,2";
      }
      const { data } = await getPromotionList(params);
      dataList.value = data?.list ?? [];
      pagination.total = data?.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    Object.assign(searchForm, {
      ID: "",
      name: "",
      promotionCondType: "",
      status: "",
      activity: "",
      online: "",
      startTime: "",
      endTime: "",
      walletType: "",
      eventCode: "",
      freedom: "",
      internalName: ""
    });
    onSearch();
  }

  // 載入下拉選單
  async function fetchDropdown() {
    try {
      const { data } = await getPromotionDropdown();
      const toOpts = (arr: DropdownItem[] = []) =>
        arr.map(item => ({
          label: Object.values(item)[0] as string,
          value: Object.keys(item)[0] as string
        }));
      dropdown.status = toOpts(data?.status);
      dropdown.promotionCondType = toOpts(data?.promotionCondType);
      dropdown.activity = toOpts(data?.activity);
    } catch (e) {
      console.log("fetch dropdown error", e);
    }
  }

  // 啟用/停用切換
  async function handleStatus(row: PromotionItem) {
    const { success } = await promotionStatus({ ID: row.ID });
    if (success) {
      message($t("promotion.operateSuccess"), { type: "success" });
      onSearch();
    }
  }

  // 刪除
  function handleDelete(row: PromotionItem) {
    ElMessageBox.confirm($t("promotion.confirmDel"), "", { type: "warning" })
      .then(async () => {
        const { success } = await deletePromotion({ ID: row.ID });
        if (success) {
          message($t("promotion.completeDel"), { type: "success" });
          onSearch();
        }
      })
      .catch(() => {});
  }

  // 開新視窗（批次/申請列表）
  function openWindow(url: string) {
    window.open(url, "_blank");
  }

  // TODO: 新增/編輯/條件設定/複製/模板 等流程依賴舊 PromotionModal（88KB 多步驟表單），
  // 後續以 pure-admin addDialog 多步驟方式單獨遷移。此處先以提示佔位。
  function notImplemented() {
    message($t("promotion.featureMigrating"), { type: "warning" });
  }

  onMounted(() => {
    fetchDropdown();
    onSearch();
  });

  return {
    searchForm,
    dropdown,
    onlineOptions,
    walletTypeOptions,
    freedomOptions,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    handleStatus,
    handleDelete,
    openWindow,
    notImplemented
  };
}
