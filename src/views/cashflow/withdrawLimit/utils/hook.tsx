import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import {
  ElInput,
  ElSelect,
  ElOption
} from "element-plus";
import descForm from "../desc.vue";
import {
  getPaymentLimitConfig,
  updatePaymentLimitConfig,
  getUsdtRateConfig,
  updateUsdtRateConfig
} from "@/api/cashflow";
import type {
  PaymentConfig,
  UsdtRateItem,
  DynamicPaymentConfig,
  DescFormItemProps
} from "./types";

/** USDT 匯率調整方式選項 */
const adjustmentTypeOptions = () => [
  { label: $t("cashflow.realTimeThreePartyExchangeRate"), value: 0 },
  { label: $t("cashflow.realTimeThreePartyExchangeRatePlusProfit"), value: 1 },
  { label: $t("cashflow.realTimeThreePartyExchangeRatePlusProfitAmount"), value: 3 },
  { label: $t("cashflow.customExchangeRate"), value: 2 }
];

const scaleOptions = [0, 1, 2, 3, 4, 5, 6].map(v => ({ label: v, value: v }));

export function useWithdrawLimit() {
  const loading = ref(false);
  const descFormRef = ref();

  /** 存提款設定主物件 */
  const limitData = reactive<PaymentConfig>({
    dynamicConfigs: [],
    depositTimeoutMinutes: 0,
    depositProcessLimit: 0,
    autoPayoutEnable: false,
    depositRemarkShow: false,
    autoPayoutDayTotalAmount: 0,
    autoPayoutAmountMax: 0,
    skipPayingThird: false,
    defaultWithdrawTimesLimit: 5,
    defaultWithdrawAmountLimit: 200000,
    defaultSingleWithdrawAmountLimit: 20000
  });

  /** 提現渠道開關列表（與 limitData.dynamicConfigs 同步） */
  const channelList = ref<DynamicPaymentConfig[]>([]);
  /** USDT 存款匯率列表 */
  const depositRateList = ref<UsdtRateItem[]>([]);
  /** USDT 提款匯率列表 */
  const withdrawalRateList = ref<UsdtRateItem[]>([]);

  // ====== 數值欄位輸入渲染 ======
  const numberCell = (row: any, prop: string) =>
    h(ElInput, {
      modelValue: row[prop],
      type: "number",
      size: "small",
      "onUpdate:modelValue": (val: string) => (row[prop] = val)
    });

  // ====== 提現渠道開關表格欄位 ======
  const channelColumns: TableColumnList = [
    { label: $t("cashflow.type"), prop: "serviceName", width: 120 },
    {
      label: $t("cashflow.withdrawMin"),
      prop: "min",
      cellRenderer: ({ row }) => numberCell(row, "min")
    },
    {
      label: $t("cashflow.withdrawMax"),
      prop: "max",
      cellRenderer: ({ row }) => numberCell(row, "max")
    },
    {
      label: $t("cashflow.agencyMin"),
      prop: "minAgency",
      cellRenderer: ({ row }) => numberCell(row, "minAgency")
    },
    {
      label: $t("cashflow.agencyMax"),
      prop: "maxAgency",
      cellRenderer: ({ row }) => numberCell(row, "maxAgency")
    },
    {
      label: $t("cashflow.maxAddressCount"),
      prop: "maxAddressCount",
      cellRenderer: ({ row }) => numberCell(row, "maxAddressCount")
    },
    // TODO: 舊版使用 UploadFile 上傳 icon（pure 未移植 UploadFile），暫以文字輸入 icon URL
    {
      label: $t("cashflow.icon"),
      prop: "icon",
      cellRenderer: ({ row }) =>
        h(ElInput, {
          modelValue: row.icon,
          size: "small",
          placeholder: "icon URL",
          "onUpdate:modelValue": (val: string) => (row.icon = val)
        })
    },
    { label: $t("cashflow.desc"), slot: "descOperation", width: 90 },
    { label: $t("cashflow.showOrHidden"), slot: "available", width: 90 },
    { label: $t("cashflow.whetherToMaintain"), slot: "maintain", width: 90 }
  ];

  // ====== USDT 匯率表格欄位 ======
  const usdtColumns = (type: "BUY" | "SELL"): TableColumnList => [
    {
      label: "",
      width: 70,
      cellRenderer: () => <span>{type}</span>
    },
    { label: $t("cashflow.currency"), prop: "displayName", width: 110 },
    {
      label: $t("cashflow.adjustmentType"),
      prop: "type",
      width: 170,
      cellRenderer: ({ row }) =>
        h(
          ElSelect,
          {
            modelValue: row.type,
            size: "small",
            "onUpdate:modelValue": (val: number) => (row.type = val)
          },
          () =>
            adjustmentTypeOptions().map(opt =>
              h(ElOption, { key: opt.value, label: opt.label, value: opt.value })
            )
        )
    },
    {
      label: $t("cashflow.realTimeThreePartyExchangeRatePlusProfit"),
      prop: "percentageMultiplier",
      cellRenderer: ({ row }) => numberCell(row, "percentageMultiplier")
    },
    {
      label: $t("cashflow.realTimeThreePartyExchangeRatePlusProfitAmount"),
      prop: "addendRate",
      cellRenderer: ({ row }) => numberCell(row, "addendRate")
    },
    {
      label: $t("cashflow.customExchangeRate"),
      prop: "customRate",
      cellRenderer: ({ row }) => numberCell(row, "customRate")
    },
    {
      label: $t("cashflow.decimalPlaces"),
      prop: "scale",
      width: 100,
      cellRenderer: ({ row }) =>
        h(
          ElSelect,
          {
            modelValue: row.scale,
            size: "small",
            "onUpdate:modelValue": (val: number) => (row.scale = val)
          },
          () =>
            scaleOptions.map(opt =>
              h(ElOption, { key: opt.value, label: opt.label, value: opt.value })
            )
        )
    },
    { label: $t("cashflow.exchangeRateReference"), prop: "publicRate" },
    { label: $t("cashflow.adjustedExchangeRate"), prop: "finalRate" }
  ];

  const depositRateColumns = usdtColumns("BUY");
  const withdrawalRateColumns = usdtColumns("SELL");

  // ====== 資料載入 ======
  async function getChannelData() {
    const { success, data } = await getPaymentLimitConfig();
    if (success && data) {
      Object.assign(limitData, data);
      channelList.value = data.dynamicConfigs ?? [];
    }
  }

  async function getUsdtData() {
    const { success, data } = await getUsdtRateConfig();
    if (success && data) {
      depositRateList.value = data.deposit ?? [];
      withdrawalRateList.value = data.withdrawal ?? [];
    }
  }

  function convertToNumber() {
    limitData.depositTimeoutMinutes = Number(limitData.depositTimeoutMinutes);
    limitData.depositProcessLimit = Number(limitData.depositProcessLimit);
    limitData.autoPayoutAmountMax = Number(limitData.autoPayoutAmountMax);
    limitData.autoPayoutDayTotalAmount = Number(limitData.autoPayoutDayTotalAmount);
    limitData.defaultWithdrawTimesLimit = Number(limitData.defaultWithdrawTimesLimit);
    limitData.defaultWithdrawAmountLimit = Number(limitData.defaultWithdrawAmountLimit);
    limitData.defaultSingleWithdrawAmountLimit = Number(
      limitData.defaultSingleWithdrawAmountLimit
    );
  }

  // ====== 儲存：存提款設定 + 渠道開關 ======
  async function handleChannelSubmit() {
    loading.value = true;
    try {
      convertToNumber();
      if (
        limitData.autoPayoutEnable &&
        (Number(limitData.depositProcessLimit) <= 0 ||
          Number(limitData.autoPayoutAmountMax) <= 0)
      ) {
        message($t("cashflow.autoPayoutLimitError"), { type: "error" });
        return;
      }
      limitData.dynamicConfigs = channelList.value;
      const { success } = await updatePaymentLimitConfig(limitData);
      if (success) {
        message($t("cashflow.updateSuccess"), { type: "success" });
        await getChannelData();
      }
    } catch (e) {
      message($t("cashflow.updateFailed"), { type: "error" });
    } finally {
      loading.value = false;
    }
  }

  // ====== 儲存：USDT 匯率設定 ======
  async function handleUsdtSubmit() {
    loading.value = true;
    try {
      const { success } = await updateUsdtRateConfig({
        deposit: depositRateList.value,
        withdrawal: withdrawalRateList.value
      });
      if (success) {
        message($t("cashflow.updateSuccess"), { type: "success" });
        await getUsdtData();
      }
    } catch (e) {
      message($t("cashflow.updateFailed"), { type: "error" });
    } finally {
      loading.value = false;
    }
  }

  // ====== 更新說明與連結對話框 ======
  function openDescDialog(row: DynamicPaymentConfig) {
    addDialog({
      title: $t("cashflow.edit") + $t("cashflow.desc"),
      props: {
        formInline: {
          serviceCode: row.serviceCode,
          docTitle: row.docTitle ?? "",
          docURL: row.docURL ?? "",
          downloadTitle: row.downloadTitle ?? "",
          downloadURL: row.downloadURL ?? ""
        }
      },
      width: "500px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(descForm, { ref: descFormRef }),
      beforeSure: (done, { options }) => {
        const FormRef = descFormRef.value.getRef();
        const curData = options.props.formInline as DescFormItemProps;
        FormRef.validate((valid: boolean) => {
          if (!valid) return;
          // 同步回對應渠道列（最終隨「儲存」一併送出）
          const target = channelList.value.find(
            item => item.serviceCode === curData.serviceCode
          );
          if (target) {
            target.docTitle = curData.docTitle;
            target.docURL = curData.docURL;
            target.downloadTitle = curData.downloadTitle;
            target.downloadURL = curData.downloadURL;
          }
          done();
        });
      }
    });
  }

  onMounted(async () => {
    loading.value = true;
    try {
      await getChannelData();
      await getUsdtData();
    } catch (e) {
      message($t("cashflow.loadFailed"), { type: "error" });
    } finally {
      loading.value = false;
    }
  });

  return {
    loading,
    limitData,
    channelList,
    depositRateList,
    withdrawalRateList,
    channelColumns,
    depositRateColumns,
    withdrawalRateColumns,
    handleChannelSubmit,
    handleUsdtSubmit,
    openDescDialog
  };
}
