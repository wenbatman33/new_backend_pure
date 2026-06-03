import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 新增/編輯站內信表單校驗規則 */
export const formRules = reactive(<FormRules>{
  title: [
    { required: true, message: $t("operator.plzInputTitle"), trigger: "blur" }
  ],
  content: [
    { required: true, message: $t("operator.content"), trigger: "blur" }
  ],
  sendAt: [
    { required: true, message: $t("operator.sendTime"), trigger: "change" }
  ]
});
