import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 廣告新增/編輯表單校驗規則 */
export const formRules = reactive(<FormRules>{
  title: [
    { required: true, message: $t("operator.plzInputAdTitle"), trigger: "blur" }
  ],
  bannerCategoryID: [
    {
      required: true,
      message: $t("operator.plzInputAdClassification"),
      trigger: "change"
    }
  ],
  language: [
    { required: true, message: $t("operator.language"), trigger: "change" }
  ],
  start: [
    { required: true, message: $t("operator.addedTime"), trigger: "change" }
  ]
});
