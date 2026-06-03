import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 推薦上架時間設定表單校驗規則 */
export const formRules = reactive(<FormRules>{
  recommendStartTime: [
    {
      required: true,
      message: $t("operator.recommendedReleaseTimeSettings"),
      trigger: "change"
    }
  ],
  recommendItem: [
    {
      required: true,
      message: $t("operator.projectRecommendations"),
      trigger: "change"
    }
  ]
});
