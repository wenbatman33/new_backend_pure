import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 戰情文章編輯表單校驗規則 */
export const formRules = reactive(<FormRules>{
  homeScore: [
    { required: true, message: $t("activity.matchNewsHomeScoreTip"), trigger: "blur" }
  ],
  awayScore: [
    { required: true, message: $t("activity.matchNewsAwayScoreTip"), trigger: "blur" }
  ]
});
