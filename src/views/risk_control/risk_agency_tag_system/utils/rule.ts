import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 代理標籤群組表單校驗規則 */
export const formRules = reactive(<FormRules>{
  agencyId: [
    {
      required: true,
      message: $t("risk_control.agencyLine"),
      trigger: "blur"
    }
  ],
  tagId: [
    {
      required: true,
      type: "array",
      message: $t("risk_control.tagID"),
      trigger: "change"
    }
  ]
});
