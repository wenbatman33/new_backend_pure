import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 廣播表單校驗規則 */
export const formRules = reactive(<FormRules>{
  title: [{ required: true, message: $t("operator.plzInputTitle"), trigger: "blur" }],
  time: [
    { required: true, message: $t("operator.broadcastDuration"), trigger: "change" }
  ],
  displayType: [
    { required: true, message: $t("operator.showMethod"), trigger: "change" }
  ]
});
