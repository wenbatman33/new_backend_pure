import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 站台頁面新增/編輯表單校驗規則 */
export const pageFormRules = reactive(<FormRules>{
  name: [{ required: true, message: $t("operator.inputText"), trigger: "blur" }]
});
