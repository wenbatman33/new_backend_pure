import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 新增黑名單表單校驗規則 */
export const formRules = reactive(<FormRules>{
  memberAccounts: [
    { required: true, message: $t("vip.memberAccount"), trigger: "blur" }
  ],
  types: [
    { required: true, message: $t("vip.blacklistType"), trigger: "change" }
  ],
  reason: [
    { required: true, message: $t("vip.blacklistReason"), trigger: "blur" }
  ]
});
