import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 導覽管理表單校驗規則 */
export const formRules = reactive(<FormRules>{
  lobbyType: [
    { required: true, message: $t("operator.type"), trigger: "change" }
  ],
  sort: [{ required: true, message: $t("operator.sort"), trigger: "blur" }]
});
