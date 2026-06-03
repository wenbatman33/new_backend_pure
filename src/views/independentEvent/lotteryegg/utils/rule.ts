import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

// 彩蛋活動表單校驗規則
export const formRules = reactive(<FormRules>{
  name: [
    {
      required: true,
      message: $t("independentEvent.lotteryeggName"),
      trigger: "blur"
    }
  ],
  promotionCode: [
    {
      required: true,
      message: $t("independentEvent.lotteryeggPromotionCode"),
      trigger: "blur"
    }
  ],
  startTime: [
    {
      required: true,
      message: $t("independentEvent.lotteryeggStartTime"),
      trigger: "change"
    }
  ],
  eventTurnover: [
    {
      required: true,
      message: $t("independentEvent.lotteryeggEventTurnover"),
      trigger: "blur"
    }
  ],
  memberMax: [
    {
      required: true,
      message: $t("independentEvent.lotteryeggMemberMax"),
      trigger: "blur"
    }
  ]
});
