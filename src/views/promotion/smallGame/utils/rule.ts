import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

// 編輯表單校驗規則
export const formRules = reactive<FormRules>({
  internalName: [
    { required: true, message: $t("promotion.plzEnterInternalName"), trigger: "blur" }
  ],
  name: [
    { required: true, message: $t("promotion.plzEnterListingName"), trigger: "blur" }
  ]
});
