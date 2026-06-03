import { ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import {
  getUpdateBetAmount,
  getRefund,
  getRefundReviewList,
  postRefundReviewReject,
  postRefundReviewPass
} from "@/api/vip";
import type { StepFormProps, SearchFormProps, ReviewItem } from "./types";

// 贈金類型對應
const typeMap: Record<number, string> = {
  1: $t("vip.monthlyGift"),
  2: $t("vip.promotion"),
  3: $t("vip.anniversary"),
  // 4 為返水，需附加 gameGroupName，於 cellRenderer 處理
  5: $t("vip.birthdayGift"),
  6: $t("vip.weeklyGift")
};

export function useVipManualReplenishmentWater() {
  const today = dayjs().format("YYYY-MM-DD");

  // 步驟一表單（補額外流水）
  const stepOneFormData = reactive<StepFormProps>({
    memberIds: "",
    isDiff: true,
    runJobDate: today
  });

  // 步驟二表單（補水）
  const stepTwoFormData = reactive<StepFormProps>({
    memberIds: "",
    isDiff: true,
    runJobDate: today
  });

  // 步驟三搜尋表單
  const searchForm = reactive<SearchFormProps>({
    memberID: undefined,
    memberAccount: undefined
  });

  const dataList = ref<ReviewItem[]>([]);
  const loading = ref(false);
  const buttonLoading = ref(false);
  // 已勾選的列 id
  const selectedIds = ref<number[]>([]);

  // 是否計算差額下拉選項
  const diffOptions = [
    { label: $t("vip.yes"), value: true },
    { label: $t("vip.no"), value: false }
  ];

  const columns: TableColumnList = [
    { type: "selection", width: 55, align: "left" },
    { label: $t("vip.member"), prop: "memberID" },
    { label: $t("vip.memberAccount"), prop: "memberAccount" },
    { label: $t("vip.giftMoney"), prop: "gift" },
    {
      label: $t("vip.giftType"),
      prop: "type",
      cellRenderer: ({ row }) => {
        if (row.type === 4) {
          return (
            <span>
              {$t("vip.rebate")}（{row.gameGroupName}）
            </span>
          );
        }
        return <span>{typeMap[row.type] ?? row.type}</span>;
      }
    },
    { label: $t("vip.counterfeitManufacturerName"), prop: "gameGroupName" },
    { label: $t("vip.billingCycle"), prop: "peroid" },
    { label: $t("vip.releaseTime"), prop: "createdAt" },
    { label: $t("vip.expiration"), prop: "expiredAt" }
  ];

  // 取得審核列表（不帶搜尋條件）
  async function getTableData() {
    searchForm.memberID = undefined;
    searchForm.memberAccount = undefined;
    loading.value = true;
    try {
      const { data } = await getRefundReviewList(null);
      dataList.value = data?.list ?? [];
    } finally {
      loading.value = false;
    }
  }

  // 步驟一/二 執行
  async function handleStep(step: "one" | "two") {
    buttonLoading.value = true;
    try {
      step === "one"
        ? await getUpdateBetAmount({ ...stepOneFormData })
        : await getRefund({ ...stepTwoFormData });
      initStep(step);
      getTableData();
      message($t("vip.executionSucceed"), { type: "success" });
    } catch {
      message($t("vip.executionFailed"), { type: "error" });
    } finally {
      buttonLoading.value = false;
    }
  }

  function initStep(step: "one" | "two") {
    if (step === "one") {
      stepOneFormData.memberIds = "";
      stepOneFormData.isDiff = true;
    } else {
      stepTwoFormData.memberIds = "";
      stepTwoFormData.isDiff = true;
    }
  }

  // 步驟三搜尋
  async function onSearch() {
    loading.value = true;
    selectedIds.value = [];
    try {
      const { data } = await getRefundReviewList({
        memberID: searchForm.memberID || undefined,
        memberAccount: searchForm.memberAccount || undefined
      });
      dataList.value = data?.list ?? [];
    } finally {
      loading.value = false;
    }
  }

  function resetForm() {
    searchForm.memberID = undefined;
    searchForm.memberAccount = undefined;
    selectedIds.value = [];
    getTableData();
  }

  // 表格勾選變更
  function handleSelectionChange(rows: ReviewItem[]) {
    selectedIds.value = rows.map(r => r.id);
  }

  // 通過 / 拒絕
  async function handlePassOrReject(
    status: "passAll" | "pass" | "rejectAll" | "reject"
  ) {
    buttonLoading.value = true;
    try {
      switch (status) {
        case "passAll":
          await postRefundReviewPass({ IDs: [] });
          break;
        case "pass":
          await postRefundReviewPass({ IDs: selectedIds.value });
          break;
        case "rejectAll":
          await postRefundReviewReject({ IDs: [] });
          break;
        case "reject":
          await postRefundReviewReject({ IDs: selectedIds.value });
          break;
      }
      message($t("vip.executionSucceed"), { type: "success" });
      getTableData();
    } catch {
      message($t("vip.executionFailed"), { type: "error" });
    } finally {
      buttonLoading.value = false;
      selectedIds.value = [];
    }
  }

  // 步驟二禁用未來日期
  function disabledDate(current: Date) {
    return dayjs(current).isAfter(dayjs().endOf("day"));
  }

  onMounted(() => {
    getTableData();
  });

  return {
    stepOneFormData,
    stepTwoFormData,
    searchForm,
    dataList,
    loading,
    buttonLoading,
    selectedIds,
    diffOptions,
    columns,
    handleStep,
    onSearch,
    resetForm,
    handleSelectionChange,
    handlePassOrReject,
    disabledDate
  };
}
