import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 編輯串流表單校驗規則 */
export const formRules = reactive(<FormRules>{
  isLiveLabel: [
    { required: true, message: $t("activity.streamingIsLiveLabel"), trigger: "change" }
  ],
  isLive: [
    { required: true, message: $t("activity.streamingIsShow"), trigger: "change" }
  ]
});
