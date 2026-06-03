import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 聯賽編輯表單校驗規則 */
export const formRules = reactive(<FormRules>{
  name: [
    {
      required: true,
      message: $t("promotion.pleaseEnterLeagueName"),
      trigger: "blur"
    }
  ]
});

/** 關鍵字編輯表單校驗規則 */
export const keywordRules = reactive(<FormRules>{
  keyword: [
    {
      required: true,
      message: $t("promotion.pleaseEnterKeyWords"),
      trigger: "blur"
    }
  ]
});
