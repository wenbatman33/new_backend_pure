import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 賽事新增/編輯表單校驗規則 */
export const formRules = reactive(<FormRules>{
  promoEventID: [
    { required: true, message: $t("promotion.activityCode"), trigger: "blur" }
  ],
  promoGameID: [
    { required: true, message: $t("promotion.eventNumber"), trigger: "blur" }
  ],
  note: [
    { required: true, message: $t("promotion.eventDetails"), trigger: "blur" }
  ],
  eventStartTime: [
    { required: true, message: $t("promotion.eventStartTime"), trigger: "change" }
  ],
  eventEndTime: [
    { required: true, message: $t("promotion.eventEndTime"), trigger: "change" }
  ]
});

/** 總積分編輯表單校驗規則 */
export const scoreFormRules = reactive(<FormRules>{
  score: [
    { required: true, message: $t("promotion.totalScore"), trigger: "blur" }
  ]
});
