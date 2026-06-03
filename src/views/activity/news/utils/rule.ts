import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 新聞表單校驗規則 */
export const formRules = reactive(<FormRules>{
  title: [{ required: true, message: $t("activity.title"), trigger: "blur" }],
  startTime: [
    { required: true, message: $t("activity.releaseDate"), trigger: "change" }
  ],
  endTime: [
    { required: true, message: $t("activity.expirationDate"), trigger: "change" }
  ],
  category: [
    { required: true, message: $t("activity.category"), trigger: "change" }
  ],
  status: [
    { required: true, message: $t("activity.status"), trigger: "change" }
  ],
  context: [{ required: true, message: $t("activity.context"), trigger: "blur" }]
});
