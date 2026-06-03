import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 备注编辑表单校验规则 */
export const formRules = reactive(<FormRules>{
  note: [
    {
      required: true,
      message: $t("finance_report.plzEnterRemark"),
      trigger: "blur"
    }
  ]
});
