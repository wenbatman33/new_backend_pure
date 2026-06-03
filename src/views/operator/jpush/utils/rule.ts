import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 廣播新增/編輯表單校驗規則 */
export const formRules = reactive(<FormRules>{
  title: [
    { required: true, message: $t("operator.jpushTitlePlaceholder"), trigger: "blur" }
  ],
  content: [
    { required: true, message: $t("operator.jpushContentPlaceholder"), trigger: "blur" }
  ],
  deeplinkType: [
    { required: true, message: $t("operator.openMethod"), trigger: "change" }
  ]
});
