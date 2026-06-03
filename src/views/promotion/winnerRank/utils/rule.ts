import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 排行榜設定表單校驗規則 */
export const formRules = reactive(<FormRules>{
  name: [
    { required: true, message: $t("promotion.rankingName"), trigger: "blur" }
  ],
  cycleType: [
    { required: true, message: $t("promotion.rankingType"), trigger: "change" }
  ],
  startTime: [
    {
      required: true,
      message: $t("promotion.cycleStartTime"),
      trigger: "change"
    }
  ],
  endTime: [
    { required: true, message: $t("promotion.endTime"), trigger: "change" }
  ],
  finalEndTime: [
    { required: true, message: $t("promotion.queryEndTime"), trigger: "change" }
  ],
  rankAmount: [
    { required: true, message: $t("promotion.places"), trigger: "blur" }
  ],
  type: [{ required: true, message: $t("promotion.item"), trigger: "change" }],
  displayStartTime: [
    {
      required: true,
      message: $t("promotion.rankingStartTime"),
      trigger: "change"
    }
  ],
  displayEndTime: [
    {
      required: true,
      message: $t("promotion.rankingEndTime"),
      trigger: "change"
    }
  ]
});
