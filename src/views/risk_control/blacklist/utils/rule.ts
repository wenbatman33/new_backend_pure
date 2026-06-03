import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 新增/編輯 IP 黑名單表單校驗規則 */
export const formRules = reactive(<FormRules>{
  ip: [{ required: true, message: $t("risk_control.ipRequired"), trigger: "blur" }],
  reason: [
    { required: true, message: $t("risk_control.reasonRequired"), trigger: "blur" }
  ]
});
