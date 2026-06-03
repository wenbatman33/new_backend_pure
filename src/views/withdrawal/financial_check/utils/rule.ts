import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 退回對話框校驗規則：退回原因 + 備註 必填 */
export const rejectRules = reactive(<FormRules>{
  rejectID: [
    { required: true, message: $t("withdrawal.rejectReason"), trigger: "change" }
  ],
  note: [{ required: true, message: $t("withdrawal.note"), trigger: "blur" }]
});

/** 送風控對話框校驗規則：備註必填 */
export const submitRiskRules = reactive(<FormRules>{
  note: [{ required: true, message: $t("withdrawal.note"), trigger: "blur" }]
});

/** 通過對話框校驗規則（備註非必填，留空物件） */
export const passRules = reactive(<FormRules>{});
