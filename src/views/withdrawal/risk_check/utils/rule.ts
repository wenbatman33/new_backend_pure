import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 風控審核表單校驗規則 */
export const formRules = reactive<FormRules>({
  rejectID: [
    {
      required: true,
      message: $t("withdrawal.riskCheckRejectReasonRequired"),
      trigger: "change"
    }
  ],
  note: [
    {
      required: true,
      message: $t("withdrawal.riskCheckNoteRequired"),
      trigger: "blur"
    }
  ]
});
