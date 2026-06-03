import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 新增/編輯功能權限表單校驗規則 */
export const formRules = reactive(<FormRules>{
  fnName: [
    { required: true, message: $t("authSystem.fnName"), trigger: "blur" }
  ],
  fnKey: [
    {
      required: true,
      trigger: "change",
      validator: (_rule, value, callback) => {
        if (!value) {
          callback(new Error($t("authSystem.fnKeyRequired")));
        } else if (value.length < 4 || value.length > 100) {
          callback(new Error($t("authSystem.fnKeyLengthValidate")));
        } else {
          callback();
        }
      }
    }
  ]
});
