import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

// 新增入金明細表單校驗規則
export const formRules = reactive(<FormRules>{
  useType: [
    { required: true, message: $t("dashboard.formUseType"), trigger: "change" }
  ],
  createdAt: [
    {
      required: true,
      message: $t("dashboard.formCreatedAt"),
      trigger: "change"
    }
  ],
  adjustMoney: [
    {
      required: true,
      message: $t("dashboard.plzEnterAmount"),
      trigger: "blur"
    }
  ],
  note: [
    { required: true, message: $t("dashboard.plzEnterRemark"), trigger: "blur" }
  ]
});
