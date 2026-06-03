import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

// 編輯出款單（轉成功/轉失敗）校驗規則
export const formRules = reactive<FormRules>({
  status: [
    { required: true, message: $t("withdrawal.payoutStatusRequired"), trigger: "change" }
  ],
  reason: [
    { required: true, message: $t("withdrawal.payoutReasonRequired"), trigger: "blur" }
  ]
});
