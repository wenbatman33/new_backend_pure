import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 手动重算表单校验规则 */
export const formRules = reactive(<FormRules>{
  startTime: [
    { required: true, message: $t("report.startDate"), trigger: "change" }
  ],
  endTime: [
    { required: true, message: $t("report.endDate"), trigger: "change" }
  ]
});
