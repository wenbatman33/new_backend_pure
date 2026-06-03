import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 社群設定表單校驗規則 */
export const formRules = reactive(<FormRules>{
  order: [
    { required: true, message: $t("operator.order"), trigger: "blur" }
  ],
  name: [{ required: true, message: $t("operator.name"), trigger: "blur" }],
  openWay: [
    { required: true, message: $t("operator.openWay"), trigger: "change" }
  ],
  show: [{ required: true, message: $t("operator.show"), trigger: "change" }]
});
