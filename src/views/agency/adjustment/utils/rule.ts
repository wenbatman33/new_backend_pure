import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 新增上下分申請單表單校驗規則 */
export const adjustFormRules = reactive(<FormRules>{
  subject: [{ required: true, message: $t("agency.name"), trigger: "blur" }],
  type: [
    {
      required: true,
      message: $t("agency.transactionType"),
      trigger: "change"
    }
  ],
  turnoverTimes: [
    {
      required: true,
      message: $t("agency.pleaseEnterANumberAbove0"),
      trigger: "blur"
    }
  ]
});
