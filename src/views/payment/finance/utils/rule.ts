import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

// 顯示項目表單校驗規則
export const formRules = reactive<FormRules>({
  name: [
    {
      required: true,
      message: $t("payment.namePlaceHolder"),
      trigger: "blur"
    }
  ],
  currency: [
    {
      required: true,
      message: $t("payment.currencyRequired"),
      trigger: "change"
    }
  ],
  nums: [
    {
      required: true,
      message: $t("payment.routeNumRequired"),
      trigger: "blur"
    },
    {
      pattern: /^\d+$/,
      message: $t("payment.routeNumValidate"),
      trigger: "blur"
    }
  ]
});
