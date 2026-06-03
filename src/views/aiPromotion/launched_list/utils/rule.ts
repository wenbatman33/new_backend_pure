import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

// 優惠上架表單校驗規則
export const formRules = reactive(<FormRules>{
  name: [
    {
      required: true,
      message: $t("aiPromotion.plzEnterListingName"),
      trigger: "blur"
    }
  ],
  type: [
    {
      required: true,
      type: "array",
      message: $t("aiPromotion.plzSelectType"),
      trigger: "change"
    }
  ],
  startTime: [
    {
      required: true,
      message: $t("aiPromotion.plzSelectStartTime"),
      trigger: "change"
    }
  ]
});
