import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 編輯 logo 表單校驗規則 */
export const formRules = reactive(<FormRules>{
  logoImage: [
    { required: true, message: $t("games.plzUploadLogo"), trigger: "change" }
  ]
});
