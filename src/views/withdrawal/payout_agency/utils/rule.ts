import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

// 出款轉成功/失敗對話框校驗規則
export const formRules = reactive(<FormRules>{
  status: [
    {
      required: true,
      message: $t("withdrawal.payoutStatusRequired"),
      trigger: "change"
    }
  ],
  reason: [
    {
      required: true,
      message: $t("withdrawal.payoutReasonRequired"),
      trigger: "blur"
    }
  ]
});
