import { h, ref, reactive, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { ElMessageBox } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";
import editForm from "../form.vue";
import {
  getAgencyWithdrawalDetail,
  getPayoutInfo,
  postWithdrawalCallback,
  postWithdrawalPay,
  payoutToFail,
  payoutToSuccess,
  getPayoutBankCardList,
  getPayoutPayChannel,
  getPayoutUsdtList
} from "@/api/withdrawal";
import type {
  PayoutItem,
  PayoutInfo,
  WithdrawalData,
  BankcardItem,
  PayChannelItem,
  UsdtItem,
  FormItemProps
} from "./types";

// 數字格式化（千分位）
function toLocaleString(value?: string | number) {
  try {
    return Number(value || "0").toLocaleString();
  } catch (e) {
    return value;
  }
}

export function usePayoutAgency() {
  const route = useRoute();
  const formRef = ref();

  const loading = ref(false);
  const splitAmount = ref(0);

  const withdrawalData = ref<WithdrawalData>({});
  const payoutData = ref<PayoutInfo>({});
  const payoutList = ref<PayoutItem[]>([]);
  const bankcardList = ref<BankcardItem[]>([]);
  const payChannelList = ref<PayChannelItem[]>([]);
  const usdtList = ref<UsdtItem[]>([]);

  // 訂單編號（路由參數 sn）
  const orderSn = computed(() => String(route.params?.sn ?? ""));

  // 預計出款金額
  const withdrawalAmount = computed(() => payoutData.value.payAmount || 0);

  // 已分配出款總額（排除已失敗 status.key === 2）
  const payoutAmount = computed(() => {
    let total = 0;
    (payoutList.value || []).forEach(el => {
      if (el.status?.key != 2) total += el.amount || 0;
    });
    return total;
  });

  // 出款方式：1 銀行卡 / 2 三方 / 3 USDT
  const payTypes = computed(() => [
    { key: 1, value: $t("withdrawal.payoutTypeBank") },
    { key: 2, value: $t("withdrawal.payoutTypeThird") },
    { key: 3, value: $t("withdrawal.payoutTypeUsdt") }
  ]);

  // 描述列表（提款主資料）
  const descColumns = computed(() => [
    {
      label: $t("withdrawal.payoutWithdrawNumber"),
      value: withdrawalData.value.id ?? "-"
    },
    {
      label: $t("withdrawal.payoutApplyTime"),
      value: withdrawalData.value.createdAt ?? "-"
    },
    {
      label: $t("withdrawal.payoutWithdrawAmount"),
      value: toLocaleString(withdrawalData.value.amount)
    },
    {
      label: $t("withdrawal.payoutStatusLabel"),
      value: withdrawalData.value.statusStr ?? "-"
    },
    {
      label: $t("withdrawal.payoutAgencyAccount"),
      value: withdrawalData.value.agencyAccount ?? "-"
    },
    {
      label: $t("withdrawal.payoutBankName"),
      value: withdrawalData.value.bankName ?? "-"
    },
    {
      label: $t("withdrawal.payoutBankAccount"),
      value: withdrawalData.value.bankcard ?? "-"
    },
    {
      label: $t("withdrawal.payoutThirdBank"),
      value: withdrawalData.value.thirdID ?? "-"
    }
  ]);

  // 取得提款主資料
  async function getWithdrawalDataAction() {
    const { success, data } = await getAgencyWithdrawalDetail({
      id: orderSn.value
    });
    if (success) withdrawalData.value = data || {};
  }

  // 取得出款資訊（合併既有清單）
  async function getPayoutDataAction() {
    loading.value = true;
    try {
      const { success, data } = await getPayoutInfo({ orderSn: orderSn.value });
      if (!success) return;
      payoutData.value = data || {};
      const list = payoutList.value || [];
      const newList = data?.payouts || [];
      for (let i = 0; i < newList.length; i++) {
        const newItem = newList[i];
        let exists = false;
        for (let j = 0; j < list.length; j++) {
          if (list[j].id === newItem.id) {
            exists = true;
            list.splice(j, 1, newItem);
            break;
          }
        }
        if (!exists) list.push(newItem);
      }
      payoutList.value = [...list];
    } finally {
      loading.value = false;
    }
  }

  // 取得銀行卡清單
  async function getBankcardDataAction() {
    const { success, data } = await getPayoutBankCardList({
      type: 1,
      status: 1
    });
    if (success) bankcardList.value = data?.list || [];
  }

  // 取得 USDT 清單
  async function getUsdtDataAction() {
    const { success, data } = await getPayoutUsdtList({ type: 0, status: 1 });
    if (success) usdtList.value = data?.list || [];
  }

  // 取得三方通道清單
  async function getPayChannelDataAction() {
    const { success, data } = await getPayoutPayChannel({ supplyAp: true });
    if (success) payChannelList.value = data?.list || [];
  }

  // ===== 顯示值解析 =====
  function getPayTypeValue(key?: number | string) {
    const t = payTypes.value.find(p => p.key == key);
    return t ? t.value : "";
  }
  function getBankcardValue(id?: number | string) {
    const b = bankcardList.value.find(x => x.ID == id);
    return b ? b.cardNo : "";
  }
  function getPayChannelValue(id?: number | string) {
    const c = payChannelList.value.find(x => x.id == id);
    return c ? `${c.name} ${c.sn}` : "";
  }
  function getUSDTValue(id?: number | string) {
    const u = usdtList.value.find(x => x.id == id);
    return u ? `${u.name} ${u.address}` : "";
  }

  // ===== 拆單 / 編輯 =====
  // 拆單
  function handleSplit() {
    const amount = splitAmount.value || 0;
    if (amount <= 0) return message($t("withdrawal.payoutErrSplitGtZero"), { type: "error" });
    if (amount % 10 === 0) return message($t("withdrawal.payoutErrSplitNotTen"), { type: "error" });
    if (amount > withdrawalAmount.value)
      return message($t("withdrawal.payoutErrSplitGtTotal"), { type: "error" });
    if (payoutList.value.length > 0)
      return message($t("withdrawal.payoutErrAlreadySplit"), { type: "error" });

    let id = 0;
    let remain = withdrawalAmount.value;
    const list: PayoutItem[] = [];
    while (remain > 100 && remain > amount) {
      list.push({ id, amount: Math.floor(Math.random() * (amount - 100)) + 100 });
      id += 1;
      remain -= list[id - 1].amount || 0;
    }
    list.push({ id, amount: remain });
    if ((list[id].amount || 0) < 100) {
      const item = list.pop();
      const min = Math.min(...list.map(x => x.amount || 0));
      const minIndex = list.findIndex(x => (x.amount || 0) === min);
      list[minIndex].amount = (list[minIndex].amount || 0) + (item?.amount || 0);
    }
    payoutList.value = list;
  }

  // 新增一筆出款
  function handleCreate() {
    let latestId = -1;
    payoutList.value.forEach(el => {
      const id = el.id !== undefined ? el.id : -1;
      if (id > latestId) latestId = id;
    });
    payoutList.value.push({
      id: latestId + 1,
      amount: withdrawalData.value?.amount
    });
  }

  // 拆單金額輸入
  function handleUpdateSplitAmount(val: number | string) {
    splitAmount.value = Math.abs(Math.floor(Number(val) || 0));
  }

  // 刪除一筆
  function handleDelete(index: number) {
    payoutList.value.splice(index, 1);
  }

  // 計算三方手續費
  function calcThirdFee(record: PayoutItem) {
    const ch = payChannelList.value.find(x => x.id === record?.payID?.key);
    const amount = record?.amount || 0;
    const apFee = ch?.apFee || 0;
    const apPerFee = ch?.apPerFee || 0;
    return amount * (apFee / 1000) + apPerFee;
  }

  // 金額輸入
  function handleUpdateAmount(index: number, val: number | string) {
    const amount = Math.abs(Math.floor(Number(val) || 0));
    const row = payoutList.value[index];
    row.amount = amount;
    row.fee = row?.payType?.key === 2 ? calcThirdFee(row) : 0;
  }

  // 通用欄位輸入（fee / otherAmount / exchangeRate）
  function handleUpdateColumn(index: number, val: number | string, column: keyof PayoutItem) {
    const value = Math.abs(Math.floor(Number(val) || 0));
    (payoutList.value[index] as any)[column] = value;
  }

  // 變更出款方式
  function handleUpdatePayType(index: number, key: number) {
    const row = payoutList.value[index];
    row.payType = { key };
    row.payID = undefined;
    row.fee = undefined;
  }

  // 變更出款帳號
  function handleUpdatePayID(index: number, key: number) {
    const row = payoutList.value[index];
    row.payID = { key };
    row.fee = row?.payType?.key === 2 ? calcThirdFee(row) : 0;
  }

  // ===== 出款 =====
  async function handlePay(record: PayoutItem) {
    const data: any = {
      orderSN: orderSn.value,
      type: record?.payType?.key,
      id: record?.payID?.key,
      amount: record?.amount,
      fee: record.fee
    };
    if (data.type === 3) {
      data.otherAmount = record?.otherAmount;
      data.exchangeRate = record?.exchangeRate;
    }
    const { success } = await postWithdrawalPay(data);
    if (success) getPayoutDataAction();
  }

  // 點擊出款前的校驗
  function handleCheckPay(record: PayoutItem) {
    const amount = record?.amount || 0;
    if (amount <= 0) return message($t("withdrawal.payoutErrAmount"), { type: "error" });
    const payType = record?.payType?.key || 0;
    if (payType <= 0) return message($t("withdrawal.payoutErrPayType"), { type: "error" });
    const payID = record?.payID?.key || 0;
    if (payID <= 0) return message($t("withdrawal.payoutErrPayID"), { type: "error" });
    const otherAmount = record?.otherAmount || 0;
    if (otherAmount <= 0 && payType === 3)
      return message($t("withdrawal.payoutErrOtherAmount"), { type: "error" });
    const exchangeRate = record?.exchangeRate || 0;
    if (exchangeRate <= 0 && payType === 3)
      return message($t("withdrawal.payoutErrExchangeRate"), { type: "error" });
    if (payoutAmount.value > withdrawalAmount.value)
      return message($t("withdrawal.payoutErrTotalExceed"), { type: "error" });

    const diff = withdrawalAmount.value - payoutAmount.value;
    if (diff < 100 && diff > 0) {
      ElMessageBox.confirm(
        `${$t("withdrawal.payoutConfirmWithdraw")}：${withdrawalAmount.value}，${$t(
          "withdrawal.payoutConfirmPayout"
        )}：${payoutAmount.value}，${$t("withdrawal.payoutConfirmContinue")}`,
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
    const { success } = await postWithdrawalCallback({ id: record.id });
    if (success) {
      message(`${record.id} ${$t("withdrawal.payoutCallbackSuccess")}`, { type: "success" });
    } else {
      message(`${record.id} ${$t("withdrawal.payoutCallbackFail")}`, { type: "warning" });
    }
    getPayoutDataAction();
  }

  // 出款轉成功/失敗對話框
  function handleEdit(record: PayoutItem) {
    addDialog({
      title: $t("withdrawal.payoutEditTitle"),
      props: {
        formInline: {
          status: "",
          reason: ""
        }
      },
      width: "420px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async (valid: boolean) => {
          if (!valid) return;
          const params = { id: record.id as number, reason: curData.reason };
          let res: any;
          // 1 轉失敗 / 2 轉成功
          if (curData.status === 1) res = await payoutToFail(params);
          else if (curData.status === 2) res = await payoutToSuccess(params);
          if (res?.success) {
            message($t("withdrawal.payoutEditTitle"), { type: "success" });
            done();
            getPayoutDataAction();
          }
        });
      }
    });
  }

  onMounted(() => {
    getWithdrawalDataAction();
    getPayoutDataAction();
    getBankcardDataAction();
    getPayChannelDataAction();
    getUsdtDataAction();
  });

  return {
    loading,
    orderSn,
    splitAmount,
    withdrawalData,
    payoutList,
    bankcardList,
    payChannelList,
    usdtList,
    payTypes,
    descColumns,
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
    handleEdit,
    getPayoutData: getPayoutDataAction
  };
}
