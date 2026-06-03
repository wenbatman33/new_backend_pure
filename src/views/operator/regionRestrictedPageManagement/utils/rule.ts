import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 地區限制頁面設定表單校驗規則 */
export const formRules = reactive(<FormRules>{
  title: [
    {
      required: true,
      message: $t("operator.pageTitle"),
      trigger: "blur"
    }
  ]
});
