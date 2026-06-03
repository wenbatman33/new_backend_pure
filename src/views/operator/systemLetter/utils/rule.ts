import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 系統站內信設定表單校驗規則 */
export const formRules = reactive(<FormRules>{
  startTime: [
    { required: true, message: $t("operator.sendTime"), trigger: "change" }
  ],
  endTime: [
    { required: true, message: $t("operator.sendTime"), trigger: "change" }
  ],
  title: [
    { required: true, message: $t("operator.plzInputTitle"), trigger: "blur" }
  ],
  content: [
    { required: true, message: $t("operator.content"), trigger: "blur" }
  ]
});
