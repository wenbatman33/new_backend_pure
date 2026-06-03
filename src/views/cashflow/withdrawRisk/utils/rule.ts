import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 審核查詢對話框表單校驗規則（會員 ID 或 會員帳號 擇一即可，這裡標示帳號為主要欄位） */
export const auditFormRules = reactive(<FormRules>{
  memberAccount: [
    { required: false, message: $t("cashflow.memberAC"), trigger: "blur" }
  ]
});
