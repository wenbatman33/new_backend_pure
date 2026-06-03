import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

// 新增提款表單校驗規則
export const formRules = reactive<FormRules>({
  amount: [
    { required: true, message: $t("agency.withdrawalData1"), trigger: "blur" }
  ],
  existsID: [
    {
      required: true,
      message: $t("agency.withdrawalData8"),
      trigger: "change"
    }
  ]
});
