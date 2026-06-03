import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 聯賽設定表單校驗規則 */
export const formRules = reactive(<FormRules>{
  name: [
    {
      required: true,
      message: $t("activity.pleaseChoiceLeague"),
      trigger: "blur"
    }
  ],
  league: [
    {
      required: true,
      message: $t("activity.pleaseEnterLeagueID"),
      trigger: "blur"
    }
  ]
});
