import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 優惠分類表單校驗規則 */
export const formRules = reactive(<FormRules>{
  promotionTypeID: [
    { required: true, message: $t("promotion.categoryId"), trigger: "blur" }
  ],
  locale: [{ required: true, message: $t("promotion.locale"), trigger: "blur" }],
  typeName: [
    { required: true, message: $t("promotion.typeName"), trigger: "blur" }
  ]
});
