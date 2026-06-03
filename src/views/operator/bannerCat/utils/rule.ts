import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 廣告分類表單校驗規則 */
export const formRules = reactive(<FormRules>{
  name: [
    {
      required: true,
      message: $t("operator.plzInputCategoryName"),
      trigger: "blur"
    }
  ]
});
