import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 狀態切換確認：備註必填 */
export const checkFormRules = reactive<FormRules>({
  comment: [
    {
      required: true,
      message: $t("member.addNewNote"),
      trigger: "blur"
    }
  ]
});
