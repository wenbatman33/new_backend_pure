import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 代理錢包人工操作調整表單校驗規則 */
export const formRules = reactive(<FormRules>{
  type: [
    { required: true, message: $t("agency.walletLogTable5"), trigger: "change" }
  ],
  amount: [
    { required: true, message: $t("agency.walletLogTable19"), trigger: "blur" }
  ],
  turnoverLimit: [
    { required: true, message: $t("agency.walletData7"), trigger: "blur" }
  ],
  remark: [
    { required: true, message: $t("agency.agencyMainTable9"), trigger: "blur" }
  ]
});
