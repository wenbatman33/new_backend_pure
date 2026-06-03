import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 遊戲代理商編輯表單校驗規則 */
export const formRules = reactive(<FormRules>{
  status: [{ required: true, message: $t("games.status"), trigger: "change" }]
});
