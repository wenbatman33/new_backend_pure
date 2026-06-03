import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 僅允許正整數 */
function isValidInteger(val: any): boolean {
  const v = String(val ?? "");
  return (
    Boolean(+v) && +v > 0 && !v.includes("e") && Number.isInteger(+v)
  );
}

/** 線路新增/編輯表單校驗規則 */
export const formRules = reactive(<FormRules>{
  payChannelID: [
    {
      required: true,
      message: $t("payment.payChannelIDPhd"),
      trigger: "change"
    }
  ],
  name: [
    {
      required: true,
      message: $t("payment.lineNameTip"),
      trigger: "blur"
    }
  ],
  serviceCode: [
    {
      required: true,
      type: "array",
      message: $t("payment.paymentTip"),
      trigger: "change"
    }
  ],
  weight: [
    {
      required: true,
      message: $t("payment.proportion"),
      trigger: "blur"
    }
  ],
  lowerLimit: [
    {
      required: true,
      trigger: "blur",
      validator: (_rule, value, callback) => {
        if (!value) return callback(new Error($t("payment.lowerLimitTip")));
        if (!isValidInteger(value))
          return callback(new Error($t("payment.onlyPositive")));
        callback();
      }
    }
  ],
  upperLimit: [
    {
      required: true,
      trigger: "blur",
      validator: (_rule, value, callback) => {
        if (!value) return callback(new Error($t("payment.upperLimitTip")));
        if (!isValidInteger(value))
          return callback(new Error($t("payment.onlyPositive")));
        callback();
      }
    }
  ],
  perFee: [
    {
      required: true,
      message: $t("payment.feeTip"),
      trigger: "blur"
    }
  ]
});
