import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 更新說明與連結表單校驗規則 */
export const descFormRules = reactive(<FormRules>{
  docTitle: [
    { required: true, message: $t("cashflow.docTitle"), trigger: "blur" }
  ]
});
