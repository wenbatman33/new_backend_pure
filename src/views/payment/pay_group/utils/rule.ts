import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 新增/編輯金流組別表單校驗規則 */
export const formRules = reactive(<FormRules>{
  name: [
    {
      required: true,
      message: $t("payment.pleaseInput") + $t("payment.name"),
      trigger: "blur"
    }
  ],
  nameEn: [
    { required: true, message: $t("payment.pleaseInput") + "GroupName", trigger: "blur" }
  ],
  source: [
    { required: true, message: $t("payment.source"), trigger: "change" }
  ],
  depositLower: [
    {
      required: true,
      message: $t("payment.pleaseInput") + $t("payment.depositLower"),
      trigger: "blur"
    }
  ],
  depositUpper: [
    {
      required: true,
      message: $t("payment.pleaseInput") + $t("payment.depositUpper"),
      trigger: "blur"
    }
  ]
});

/** 加入會員 / 加入代理表單校驗規則 */
export const memberFormRules = reactive(<FormRules>{
  accounts: [
    { required: true, message: $t("payment.memberAccounts2"), trigger: "blur" }
  ]
});
