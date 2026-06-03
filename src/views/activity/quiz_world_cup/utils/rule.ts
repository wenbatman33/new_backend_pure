import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 编辑竞猜表单校验规则 */
export const formRules = reactive<FormRules>({
  startTime: [
    {
      required: true,
      message: $t("activity.quizStartTimeRequired"),
      trigger: "change"
    }
  ],
  endTime: [
    {
      required: true,
      message: $t("activity.quizEndTimeRequired"),
      trigger: "change"
    }
  ]
});
