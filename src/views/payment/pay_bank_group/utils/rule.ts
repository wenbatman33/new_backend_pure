import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 新增/編輯 銀行卡金流組別 表單校驗規則 */
export const formRules = reactive(<FormRules>{
  name: [
    {
      required: true,
      message: $t("payment.pleaseInputName"),
      trigger: "blur"
    }
  ],
  nameEn: [
    {
      required: true,
      message: $t("payment.pleaseInputNameEn"),
      trigger: "blur"
    }
  ],
  source: [
    {
      required: true,
      message: $t("payment.pleaseSelectSource"),
      trigger: "change"
    }
  ],
  depositLower: [
    {
      required: true,
      message: $t("payment.pleaseInputDepositLower"),
      trigger: "blur"
    }
  ],
  depositUpper: [
    {
      required: true,
      message: $t("payment.pleaseInputDepositUpper"),
      trigger: "blur"
    }
  ]
});

/** 加入會員/代理 表單校驗規則 */
export const accountFormRules = reactive(<FormRules>{
  accounts: [
    {
      required: true,
      message: $t("payment.pleaseInputAccounts"),
      trigger: "blur"
    }
  ]
});
