import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 竞猜新增/編輯表單校驗規則 */
export const formRules = reactive(<FormRules>{
  startTime: [
    { required: true, message: $t("activity.quizStartTime"), trigger: "change" }
  ],
  endTime: [
    { required: true, message: $t("activity.quizEndTime"), trigger: "change" }
  ]
});
