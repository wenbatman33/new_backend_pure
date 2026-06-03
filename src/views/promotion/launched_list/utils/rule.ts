import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 新增/編輯優惠上架表單校驗規則 */
export const formRules = reactive(<FormRules>{
  name: [
    { required: true, message: $t("promotion.plzEnterListingName"), trigger: "blur" }
  ],
  type: [
    { required: true, message: $t("promotion.pleaseSelectType"), trigger: "change" }
  ],
  device: [
    { required: true, message: $t("promotion.pleaseSelectDevice"), trigger: "change" }
  ],
  startTime: [
    { required: true, message: $t("promotion.startTime"), trigger: "change" }
  ]
});
