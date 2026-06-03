import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 網址群組表單校驗規則 */
export const formRules = reactive(<FormRules>{
  name: [{ required: true, message: $t("operator.name"), trigger: "blur" }],
  status: [
    { required: true, message: $t("operator.status"), trigger: "change" }
  ],
  keyword: [
    { required: true, message: $t("operator.keyword"), trigger: "change" }
  ]
});
