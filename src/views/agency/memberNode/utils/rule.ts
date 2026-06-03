import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 換線備註表單校驗規則 */
export const formRules = reactive(<FormRules>{
  remark: [
    { required: true, message: $t("agency.memberNodeRemarkTip"), trigger: "blur" },
    { min: 0, max: 40, message: $t("agency.memberNodeRemarkLimit"), trigger: "blur" }
  ]
});
