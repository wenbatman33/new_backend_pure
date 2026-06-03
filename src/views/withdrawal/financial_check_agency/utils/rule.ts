import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 退回 / 通過彈窗校驗規則（退回需選原因） */
export const formRules = reactive(<FormRules>{
  rejectID: [
    {
      required: true,
      message: $t("withdrawal.fcaReasonRequired"),
      trigger: "change"
    }
  ],
  note: [
    {
      required: true,
      message: $t("withdrawal.fcaNoteRequired"),
      trigger: "blur"
    }
  ]
});
