import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

// 編輯表單校驗規則
export const formRules = reactive<FormRules>({
  displayName: [
    {
      required: true,
      message: $t("systemManage.smsVendorDisplayNameTip"),
      trigger: "blur"
    }
  ]
});
