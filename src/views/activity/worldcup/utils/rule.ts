import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 世界盃賽程表單校驗規則 */
export const formRules = reactive(<FormRules>{
  eventTime: [
    { required: true, message: $t("activity.eventTime"), trigger: "change" }
  ],
  status: [
    { required: true, message: $t("activity.status"), trigger: "change" }
  ],
  awayTeam: [
    { required: true, message: $t("activity.awayTeam"), trigger: "change" }
  ],
  homeTeam: [
    { required: true, message: $t("activity.homeTeam"), trigger: "change" }
  ],
  matchGroup: [
    { required: true, message: $t("activity.matchGroup"), trigger: "change" }
  ]
});
