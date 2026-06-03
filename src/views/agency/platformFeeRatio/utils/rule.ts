import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 平台費率編輯表單校驗規則 */
export const formRules = reactive(<FormRules>{
  platformFeeRatio: [
    {
      required: true,
      message: $t("agency.plzEnterPlatformFee"),
      trigger: "blur"
    }
  ]
});
