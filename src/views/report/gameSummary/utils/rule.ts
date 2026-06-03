import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 手动补流水表单校验规则 */
export const reCalcRules = reactive(<FormRules>{
  module: [
    { required: true, message: $t("report.gameVendor"), trigger: "change" }
  ]
});

/** 厂商流水帐设定表单校验规则 */
export const bettingLogRules = reactive(<FormRules>{
  gameGroupID: [
    { required: true, message: $t("report.gameVendor"), trigger: "change" }
  ],
  timeColumn: [
    { required: true, message: $t("report.bettingLogColumn"), trigger: "change" }
  ],
  statusFilter: [
    { required: true, message: $t("report.recordStatus"), trigger: "change" }
  ]
});
