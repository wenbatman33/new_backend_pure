import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 公告新增/編輯表單校驗規則 */
export const formRules = reactive(<FormRules>{
  title: [
    {
      required: true,
      message: $t("operator.plzInputAnnouncementTitle"),
      trigger: "blur"
    }
  ],
  start: [
    {
      required: true,
      message: $t("operator.addedTime"),
      trigger: "change"
    }
  ]
});
