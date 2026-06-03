import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

// 審核名單內，若選擇不同意則原因必填（於 hook 內額外校驗），此處放基本表單規則佔位
export const reviewRules = reactive(<FormRules>{
  reason: [
    { required: true, message: $t("member.noPassNeedReason"), trigger: "blur" }
  ]
});
