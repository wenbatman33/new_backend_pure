import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 赛程新增/编辑表单校验规则 */
export const formRules = reactive(<FormRules>{
  eventTime: [
    { required: true, message: $t("activity.matchEventTime"), trigger: "change" }
  ],
  league: [
    { required: true, message: $t("activity.matchLeague"), trigger: "change" }
  ],
  awayTeam: [
    { required: true, message: $t("activity.matchAwayTeam"), trigger: "change" }
  ],
  homeTeam: [
    { required: true, message: $t("activity.matchHomeTeam"), trigger: "change" }
  ]
});
