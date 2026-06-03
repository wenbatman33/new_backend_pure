import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 郵件廠商編輯表單校驗規則 */
export const formRules = reactive(<FormRules>{
  name: [{ required: true, message: $t("systemManage.name"), trigger: "blur" }],
  domain: [
    { required: true, message: $t("systemManage.domain"), trigger: "blur" }
  ],
  key: [{ required: true, message: $t("systemManage.key"), trigger: "blur" }],
  from: [{ required: true, message: $t("systemManage.from"), trigger: "blur" }],
  subject: [
    { required: true, message: $t("systemManage.subject"), trigger: "blur" }
  ],
  templet: [
    { required: true, message: $t("systemManage.templet"), trigger: "blur" }
  ]
});
