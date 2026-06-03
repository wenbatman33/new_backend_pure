import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

// 活動主表單校驗規則
export const formRules = reactive(<FormRules>{
  name: [
    { required: true, message: $t("saba.tableName"), trigger: "blur" }
  ],
  sportId: [
    { required: true, message: $t("saba.searchSportId"), trigger: "change" }
  ],
  start: [
    { required: true, message: $t("saba.tableStart"), trigger: "change" }
  ],
  end: [
    { required: true, message: $t("saba.tableEnd"), trigger: "change" }
  ],
  route: [
    { required: true, message: $t("saba.promotionRouteRule"), trigger: "blur" }
  ]
});
