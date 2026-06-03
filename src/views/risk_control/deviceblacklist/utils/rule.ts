import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 裝置黑名單表單校驗規則 */
export const formRules = reactive(<FormRules>{
  deviceID: [
    { required: true, message: $t("risk_control.deviceID"), trigger: "blur" }
  ],
  reason: [
    { required: true, message: $t("risk_control.reason"), trigger: "blur" }
  ]
});
