import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 新增遊戲群組表單校驗規則 */
export const formRules = reactive(<FormRules>{
  gameGroupID: [
    { required: true, message: $t("vip.group"), trigger: "change" }
  ]
});
