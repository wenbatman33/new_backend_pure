import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 編輯備註表單校驗規則 */
export const formRules = reactive(<FormRules>{
  note: [
    {
      required: true,
      message: $t("finance_report.plzEnterRemark"),
      trigger: "blur"
    }
  ]
});
