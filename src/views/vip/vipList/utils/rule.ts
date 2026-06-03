import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 試算反水（預覽）表單校驗規則 */
export const previewRules = reactive(<FormRules>{
  account: [
    { required: true, message: $t("vip.memberAccount"), trigger: "blur" }
  ],
  peroid: [
    { required: true, message: $t("vip.period"), trigger: "change" }
  ]
});
