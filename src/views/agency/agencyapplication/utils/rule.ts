import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 代理申請審核表單校驗規則 */
export const auditFormRules = reactive(<FormRules>{
  remark: [
    {
      required: true,
      message: $t("agency.childApplicationForm1"),
      trigger: "blur"
    }
  ],
  agencyAccount: [
    { required: true, message: $t("agency.inputText"), trigger: "blur" }
  ]
});
