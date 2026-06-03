import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 雲端 IP 庫新增/編輯表單校驗規則 */
export const formRules = reactive(<FormRules>{
  ipRange: [
    {
      required: true,
      message: $t("systemManage.ipRangePlaceholder"),
      trigger: "blur"
    }
  ],
  name: [
    {
      required: true,
      message: $t("systemManage.enterName"),
      trigger: "blur"
    }
  ],
  category: [
    {
      required: true,
      message: $t("systemManage.selectCategory"),
      trigger: "change"
    }
  ]
});
