import { h, ref, reactive, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { ElMessageBox } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";
import editForm from "../form.vue";
import {
  getPayoutMemberInfo,
  getPayoutInfo,
  getPayoutWithdrawHistory,
  postPayoutPay,
  postPayoutCallback,
  payoutToFail,
  payoutToSuccess,
  getPayoutBankCardList,
  getPayoutUsdtList,
  getPayoutPayChannel
} from "@/api/withdrawal";
import type { PayoutItem, FormItemProps } from "./types";

export function usePayout() {
  const route = useRoute();
  const formRef = ref();
  const loading = ref(true);

  // 提款單號（路由參數 :sn）
  const orderSn = computed(() => String(route.params?.sn ?? ""));

  // 出款方式選項（1 銀行卡 2 商戶號 3 USDT）
  const payTypes = computed(() => [
    { key: 1, value: $t("withdrawal.payoutPayTypeBank") },
    { key: 2, value: $t("withdrawal.payoutPayTypeMerchant") },
    { key: 3, value: $t("withdrawal.payoutPayTypeUsdt") }
  ]);

  const state = reactive<{
    splitAmount: number;
    withdrawalData: any;
    payoutData: any;
    payoutList: PayoutItem[];
    bankcardList: any[];
    payChannelList: any[];
    usdtList: any[];
  }>({
    splitAmount: 0,
    withdrawalData: {},
    payoutData: {},
    payoutList: [],
    bankcardList: [],
    payChannelList: [],
    usdtList: []
  });

  // 提款歷史紀錄表格
  const historyList = ref<any[]>([]);
  const historyColumns: TableColumnList = [
    { label: $t("withdrawal.payoutHistoryTime"), prop: "createdAt", width: 180 },
    { label: $t("withdrawal.payoutHistoryName"), prop: "name", width: 150 },
    { label: $t("withdrawal.payoutHistoryAddress"), prop: "address" }
  ];

  // 預計出款金額
  const withdrawalAmount = computed(() => state.payoutData.payAmount || 0);

  // 目前已分配出款金額（排除失敗 status.key === 2）
  const payoutAmount = computed(() => {
    let total = 0;
    (state.payoutList || []).forEach(el => {
      if (el.status?.key !== 2) total += el.amount || 0;
    });
    return total;
  });

  const toLocaleString = (value?: string | number) => {
    try {
      return Number(value || "0").toLocaleString();
    } catch {
      return value;
    }
  };

  // 依 key/id 取得顯示名稱
  const getPayTypeValue = (key?: number) =>
    payTypes.value.find(p => p.key === key)?.value || "";
  const getBankcardValue = (id?: number) =>
    state.bankcardList.find(b => b.ID == id)?.cardNo || "";
  const getPayChannelValue = (id?: number) => {
    const c = state.payChannelList.find(p => p.id == id);
    return c ? `${c.name} ${c.sn}` : "";
  };
  const getUSDTValue = (id?: number) => {
    const u = state.usdtList.find(p => p.id == id);
    return u ? `${u.name} ${u.address}` : "";
  };

  // 出款單表格欄位
  const columns: TableColumnList = [
    { label: "", prop: "delete", width: 50, slot: "delete" },
    { label: $t("withdrawal.payoutSendId"), prop: "send_id", width: 150 },
    { label: $t("withdrawal.payoutAmount"), prop: "amount", width: 130, slot: "amount" },
    { label: $t("withdrawal.payoutPayType"), prop: "payType", width: 130, slot: "payType" },
    { label: $t("withdrawal.payoutPayId"), prop: "payID", width: 170, slot: "payID" },
    { label: $t("withdrawal.payoutFee"), prop: "fee", width: 110, slot: "fee" },
    { label: $t("withdrawal.payoutOtherAmount"), prop: "otherAmount", width: 110, slot: "otherAmount" },
    { label: $t("withdrawal.payoutExchangeRate"), prop: "exchangeRate", width: 110, slot: "exchangeRate" },
    { label: $t("withdrawal.payoutStatus"), prop: "status", width: 130, slot: "status" },
    {
      label: $t("withdrawal.payoutUpdatedAt"),
      prop: "updatedAt",
      width: 160,
      cellRenderer: ({ row }) =>
        h("span", null, row.updatedAt ? String(row.updatedAt) : "-")
    },
    { label: $t("withdrawal.payoutThirdSn"), prop: "thirdSn" },
    { label: $t("withdrawal.payoutEditor"), prop: "editorName", width: 100 }
  ];

  // 載入會員/提款資訊
  async function getWithdrawalData() {
    const { data } = await getPayoutMemberInfo({ id: orderSn.value });
    state.withdrawalData = data || {};
  }

  // 載入出款單資料（合併新資料、保留本地編輯中的列）
  async function getPayoutData() {
    const { data } = await getPayoutInfo({ orderSn: orderSn.value });
    state.payoutData = data || {};
    const payoutList = state.payoutList || [];
    const newList = data?.payouts || [];
    for (const newItem of newList) {
      const idx = payoutList.findIndex(p => p.id === newItem.id);
      if (idx >= 0) payoutList.splice(idx, 1, newItem);
      else payoutList.push(newItem);
    }
    state.payoutList = [...payoutList];
  }

  async function getHistoryData() {
    const { data } = await getPayoutWithdrawHistory({ id: orderSn.value });
    historyList.value = data?.list ?? (Array.isArray(data) ? data : []);
  }

  async function getBankcardData() {
    const { data } = await getPayoutBankCardList({ type: 1, status: 1 });
    state.bankcardList = data?.list || [];
  }

  async function getUsdtData() {
    const { data } = await getPayoutUsdtList({ type: 0, status: 1 });
    state.usdtList = data?.list || [];
  }

  async function getPayChannelData() {
    const { data } = await getPayoutPayChannel({ supplyAp: true, status: 1 });
    state.payChannelList = data?.list || [];
  }

  // 拆分金額
  async function handleSplit() {
    const splitAmount = state.splitAmount || 0;
    if (splitAmount <= 0) {
      message($t("withdrawal.payoutSplitGtZero"), { type: "error" });
      return;
    }
    if (splitAmount % 10 === 0) {
      message($t("withdrawal.payoutSplitNotMultiple10"), { type: "error" });
      return;
    }
    if (splitAmount > withdrawalAmount.value) {
      message($t("withdrawal.payoutSplitOverAmount"), { type: "error" });
      return;
    }
    if (state.payoutList.length > 0) {
      message($t("withdrawal.payoutSplitListNotEmpty"), { type: "error" });
      return;
    }

    let id = 0;
    let remainAmount = withdrawalAmount.value;
    const list: PayoutItem[] = [];
    while (remainAmount > 100 && remainAmount > splitAmount) {
      const amount = Math.floor(Math.random() * (splitAmount - 100)) + 100;
      list.push({ id, amount });
      id += 1;
      remainAmount -= amount;
    }
    list.push({ id, amount: remainAmount });

    if (list[id].amount! < 100) {
      const item = list.pop();
      const min = Math.min(...list.map(i => i.amount || 0));
      const minIndex = list.findIndex(i => i.amount === min);
      list[minIndex].amount = (list[minIndex].amount || 0) + (item?.amount || 0);
    }
    state.payoutList = list;
  }

  // 新增一列出款單
  function handleCreate() {
    let latestId = -1;
    (state.payoutList || []).forEach(el => {
      const id = el.id ?? -1;
      if (id > latestId) latestId = id;
    });
    state.payoutList.push({
      id: latestId + 1,
      amount: state.withdrawalData?.amount
    });
  }

  function handleUpdateSplitAmount(value: number | string) {
    state.splitAmount = Math.abs(Math.floor(Number(value)));
  }

  function handleDelete(index: number) {
    state.payoutList.splice(index, 1);
  }

  // 計算三方手續費
  function calcFee(record: PayoutItem) {
    if (record?.payType?.key === 2) {
      const channel = state.payChannelList.find(c => c.id === record?.payID?.key);
      const amount = record?.amount || 0;
      const apFee = channel?.apFee || 0;
      const apPerFee = channel?.apPerFee || 0;
      return amount * (apFee / 1000) + apPerFee;
    }
    return 0;
  }

  function handleUpdateAmount(index: number, value: number | string) {
    const amount = Math.abs(Math.floor(Number(value)));
    state.payoutList[index].amount = amount;
    state.payoutList[index].fee = calcFee(state.payoutList[index]);
  }

  function handleUpdateColumn(
    index: number,
    value: number | string,
    column: "fee" | "otherAmount" | "exchangeRate"
  ) {
    state.payoutList[index][column] = Math.abs(Math.floor(Number(value)));
  }

  function handleUpdatePayType(index: number, key?: number) {
    state.payoutList[index].payType = { key };
    state.payoutList[index].payID = undefined;
    state.payoutList[index].fee = undefined;
  }

  function handleUpdatePayID(index: number, key?: number) {
    state.payoutList[index].payID = { key };
    state.payoutList[index].fee = calcFee(state.payoutList[index]);
  }

  // 送出出款
  async function handlePay(record: PayoutItem) {
    const params: any = {
      orderSN: orderSn.value,
      type: record?.payType?.key,
      id: record?.payID?.key,
      amount: record?.amount,
      fee: record.fee
    };
    if (params.type === 3) {
      params.otherAmount = record?.otherAmount;
      params.exchangeRate = record?.exchangeRate;
    }
    const { success } = await postPayoutPay(params);
    if (success) getPayoutData();
  }

  // 出款前校驗
  function handleCheckPay(record: PayoutItem) {
    const amount = record?.amount || 0;
    if (amount <= 0) {
      message($t("withdrawal.payoutCheckAmount"), { type: "error" });
      return;
    }
    const payType = record?.payType?.key || 0;
    if (payType <= 0) {
      message($t("withdrawal.payoutCheckPayType"), { type: "error" });
      return;
    }
    const payID = record?.payID?.key || 0;
    if (payID <= 0) {
      message($t("withdrawal.payoutCheckPayId"), { type: "error" });
      return;
    }
    if ((record?.otherAmount || 0) <= 0 && payType === 3) {
      message($t("withdrawal.payoutCheckOtherAmount"), { type: "error" });
      return;
    }
    if ((record?.exchangeRate || 0) <= 0 && payType === 3) {
      message($t("withdrawal.payoutCheckExchangeRate"), { type: "error" });
      return;
    }
    if (payoutAmount.value > withdrawalAmount.value) {
      message($t("withdrawal.payoutCheckOverTotal"), { type: "error" });
      return;
    }
    const diff = withdrawalAmount.value - payoutAmount.value;
    if (diff < 100 && diff > 0) {
      ElMessageBox.confirm(
        `${$t("withdrawal.payoutConfirmEst")}：${withdrawalAmount.value}，${$t(
          "withdrawal.payoutConfirmTotal"
        )}：${payoutAmount.value}，${$t("withdrawal.payoutConfirmRemain")}`,
        $t("withdrawal.payoutConfirmTitle"),
        { type: "warning" }
      )
        .then(() => handlePay(record))
        .catch(() => {});
    } else {
      handlePay(record);
    }
  }

  // 查詢三方回調
  async function handleCallback(record: PayoutItem) {
    const { success } = await postPayoutCallback({ id: record.id });
    if (success) {
      message(`${record.id} ${$t("withdrawal.payoutCallbackOk")}`, { type: "success" });
    } else {
      message(`${record.id} ${$t("withdrawal.payoutCallbackFail")}`, { type: "warning" });
    }
    getPayoutData();
  }

  // 編輯出款中狀態（轉成功/轉失敗）
  function handleEdit(record: PayoutItem) {
    addDialog({
      title: $t("withdrawal.payoutEditTitle"),
      props: {
        formInline: { status: undefined, reason: "" }
      },
      width: "460px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async (valid: boolean) => {
          if (!valid) return;
          const payload = { id: record.id!, reason: curData.reason };
          // status 1 轉失敗 2 轉成功（沿用舊邏輯）
          const { success } =
            curData.status === 1
              ? await payoutToFail(payload)
              : await payoutToSuccess(payload);
          if (success) {
            message($t("withdrawal.payoutEditOk"), { type: "success" });
            done();
            getPayoutData();
          }
        });
      }
    });
  }

  onMounted(async () => {
    loading.value = true;
    try {
      await Promise.all([
        getWithdrawalData(),
        getPayoutData(),
        getHistoryData(),
        getBankcardData(),
        getPayChannelData(),
        getUsdtData()
      ]);
    } finally {
      loading.value = false;
    }
  });

  return {
    loading,
    state,
    orderSn,
    payTypes,
    columns,
    historyColumns,
    historyList,
    withdrawalAmount,
    payoutAmount,
    toLocaleString,
    getPayTypeValue,
    getBankcardValue,
    getPayChannelValue,
    getUSDTValue,
    handleSplit,
    handleCreate,
    handleUpdateSplitAmount,
    handleDelete,
    handleUpdateAmount,
    handleUpdateColumn,
    handleUpdatePayType,
    handleUpdatePayID,
    handleCheckPay,
    handleCallback,
    handleEdit
  };
}
