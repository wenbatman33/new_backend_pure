import { h, ref, reactive, onMounted } from "vue";
import { http } from "@/utils/http";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";
import { countryCheck } from "@/utils/country";
import {
  getVipGiftList,
  addVipBirthGift,
  getVipRefundTrial
} from "@/api/vip";
import previewForm from "../preview.vue";
import type { FormItemProps } from "./types";

/** 領取狀態 */
function renderStatus(row: any) {
  if (row.account === "合计") return "-";
  return row.status === 1 ? (
    <span style="color: #00BB00">{$t("vip.received")}</span>
  ) : (
    <span style="color: red">{$t("vip.unaccalimed")}</span>
  );
}

/** VIP 狀態 */
function renderVipStatus(row: any) {
  if (row.account === "合计") return "-";
  switch (row.vipStatus) {
    case 1:
      return $t("vip.promotion");
    case 2:
      return $t("vip.maintain");
    case 3:
      return $t("vip.demotion");
    default:
      return $t("vip.keep");
  }
}

/** 禮金類型 */
function renderType(row: any) {
  if (row.account === "合计") return "-";
  switch (row.type) {
    case 1:
      return $t("vip.monthlyGift");
    case 2:
      return $t("vip.promotion");
    case 3:
      return $t("vip.anniversary");
    case 4:
      return `${$t("vip.rebate")}（${row.gameGroupName ?? ""}）`;
    case 5:
      return $t("vip.birthdayGift");
    case 6:
      return $t("vip.weeklyGift");
    default:
      return "";
  }
}

export function useVipList() {
  const searchForm = reactive({
    startTime: "",
    endTime: "",
    takenStartTime: "",
    takenEndTime: "",
    account: "",
    vipLevel: "",
    status: "",
    vipStatus: "",
    type: "",
    gameGroupID: ""
  });

  const dataList = ref<any[]>([]);
  const loading = ref(true);
  const totalGift = ref<number | string>("");

  // 是否為越南站（VN 不顯示生日禮金新增表單）
  const isVN = countryCheck("VN");

  // 下拉選項
  const vipLevelOptions = ref<any[]>([]);
  const gameGroupOptions = ref<any[]>([]);

  const statusOptions = [
    { label: $t("vip.all"), value: -1 },
    { label: $t("vip.received"), value: 1 },
    { label: $t("vip.unaccalimed"), value: 2 }
  ];

  const vipStatusOptions = [
    { label: $t("vip.promotion"), value: 1 },
    { label: $t("vip.maintain"), value: 2 },
    { label: $t("vip.demotion"), value: 3 },
    { label: $t("vip.keep"), value: 4 }
  ];

  const typeOptions = [
    { label: $t("vip.monthlyGift"), value: 1 },
    { label: $t("vip.promotion"), value: 2 },
    { label: $t("vip.anniversary"), value: 3 },
    { label: $t("vip.rebate"), value: 4 },
    { label: $t("vip.birthdayGift"), value: 5 },
    { label: $t("vip.weeklyGift"), value: 6 },
    { label: $t("vip.dailyGift"), value: 7 }
  ];

  // 生日禮金新增表單
  const giftForm = reactive({
    time: "",
    account: "",
    gift: ""
  });
  const giftFormRef = ref();

  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    {
      label: $t("vip.memberAccount"),
      prop: "account",
      width: 150,
      slot: "account"
    },
    { label: $t("vip.vipLevel"), prop: "vipLevel", width: 80 },
    {
      label: $t("vip.vipStatus"),
      prop: "vipStatus",
      width: 100,
      cellRenderer: ({ row }) => <span>{renderVipStatus(row)}</span>
    },
    {
      label: $t("vip.giftMoney"),
      prop: "gift",
      align: "right",
      width: 120,
      cellRenderer: ({ row }) => (
        <span>
          {Number(row.gift) ? commaDecimalFormat(row.gift, 2) : row.gift}
        </span>
      )
    },
    {
      label: $t("vip.giftType"),
      prop: "type",
      width: 120,
      cellRenderer: ({ row }) => <span>{renderType(row)}</span>
    },
    {
      label: $t("vip.counterfeitManufacturerName"),
      prop: "gameGroupName",
      width: 120
    },
    { label: $t("vip.billingCycle"), prop: "peroid", width: 120 },
    { label: $t("vip.releaseTime"), prop: "createdAt", width: 180, sortable: true },
    { label: $t("vip.expiration"), prop: "expiredAt", width: 180 },
    {
      label: $t("vip.collectionStatus"),
      prop: "status",
      width: 120,
      cellRenderer: ({ row }) => h("span", {}, [renderStatus(row)])
    }
  ];

  /** 組查詢參數（過濾 undefined / -1） */
  function buildParams() {
    const params: Record<string, any> = {};
    Object.keys(searchForm).forEach(key => {
      const v = (searchForm as any)[key];
      if (v !== undefined && v !== "" && v !== -1) {
        params[key] = v;
      }
    });
    return params;
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { success, data } = await getVipGiftList(buildParams());
      if (success) {
        dataList.value = data?.list ?? data ?? [];
        totalGift.value = data?.totalGift ?? "";
        pagination.total = data?.total ?? dataList.value.length;
      }
    } finally {
      loading.value = false;
    }
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    Object.keys(searchForm).forEach(k => ((searchForm as any)[k] = ""));
    onSearch();
  }

  /** 合計列（pure-table summary-method） */
  function summaryMethod() {
    const sums: string[] = [];
    columns.forEach((col: any, index) => {
      if (index === 0) {
        sums[index] = $t("vip.total");
      } else if (col.prop === "gift") {
        sums[index] = String(totalGift.value ?? "");
      } else {
        sums[index] = "-";
      }
    });
    return sums;
  }

  /** 新增生日禮金 */
  async function handleAddGift() {
    if (!giftFormRef.value) return;
    giftFormRef.value.validate(async (valid: boolean) => {
      if (!valid) return;
      const { success } = await addVipBirthGift({
        time: giftForm.time,
        account: giftForm.account,
        gift: giftForm.gift
      });
      if (success) {
        message($t("vip.addBirthdayGift"), { type: "success" });
        giftForm.time = "";
        giftForm.account = "";
        giftForm.gift = "";
        onSearch();
      }
    });
  }

  /** 開啟「預估反水試算」對話框 */
  function openPreview() {
    addDialog({
      title: $t("vip.preCheckRebate"),
      props: {
        formInline: {
          account: "",
          peroid: ""
        }
      },
      width: "600px",
      draggable: true,
      closeOnClickModal: false,
      hideFooter: true,
      contentRenderer: () => h(previewForm)
    });
  }

  /** 跳轉會員明細 */
  function accountHandleView(row: any) {
    if (!row.memberId) return;
    window.open(`/memberDetail/detail/${row.memberId}`);
  }

  /** 載入下拉選項 */
  async function loadOptions() {
    // VIP 等級選項（會員 VIP 設定）
    try {
      const res: any = await http.request(
        "get",
        "/backend/member/vip/setting/list"
      );
      const list = res?.data?.list ?? res?.list ?? [];
      vipLevelOptions.value = list.map((el: any) => ({
        label: `VIP${el.level}`,
        value: el.level
      }));
    } catch (e) {
      vipLevelOptions.value = [];
    }
    // 遊戲廠商下拉
    try {
      const res: any = await http.request("get", "/backend/game/dropdown/list");
      const gameGroup = res?.data?.gameGroup ?? res?.gameGroup ?? [];
      gameGroupOptions.value = gameGroup.map((item: any) => ({
        label: item.displayName,
        value: item.id
      }));
    } catch (e) {
      gameGroupOptions.value = [];
    }
  }

  onMounted(() => {
    loadOptions();
    onSearch();
  });

  return {
    searchForm,
    isVN,
    loading,
    columns,
    dataList,
    pagination,
    giftForm,
    giftFormRef,
    vipLevelOptions,
    gameGroupOptions,
    statusOptions,
    vipStatusOptions,
    typeOptions,
    onSearch,
    resetForm,
    summaryMethod,
    handleAddGift,
    openPreview,
    accountHandleView
  };
}
