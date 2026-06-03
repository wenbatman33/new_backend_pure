import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 角色新增/編輯表單校驗規則 */
export const formRules = reactive(<FormRules>{
  roleName: [
    { required: true, message: $t("authSystem.groupName"), trigger: "blur" }
  ],
  note: [
    {
      required: true,
      // 備註長度需介於 6~200
      validator: (_rule, value, callback) => {
        if (!value || value.length < 6 || value.length > 200) {
          callback(new Error($t("authSystem.noteValidate")));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
});
