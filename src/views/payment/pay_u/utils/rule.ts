import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 新增/编辑 U 帐户校验规则 */
export const ucardRules = reactive(<FormRules>{
  name: [{ required: true, message: $t("payment.payUName"), trigger: "blur" }],
  type: [
    { required: true, message: $t("payment.payUWalletType"), trigger: "change" }
  ],
  useType: [
    { required: true, message: $t("payment.payUUseType"), trigger: "change" }
  ],
  address: [
    { required: true, message: $t("payment.payUAddress"), trigger: "blur" }
  ],
  originalAmount: [
    {
      required: true,
      message: $t("payment.payUOriginalAmount"),
      trigger: "blur"
    }
  ]
});

/** 商户下发 / 充值校验规则 */
export const moneyRules = reactive(<FormRules>{
  amount: [{ required: true, message: $t("payment.payUAmount"), trigger: "blur" }],
  exchangeRate: [
    { required: true, message: $t("payment.payUExchangeRate"), trigger: "blur" }
  ],
  exchangeAmount: [
    { required: true, message: $t("payment.payUExchangeAmount"), trigger: "blur" }
  ],
  fee: [{ required: true, message: $t("payment.handlingFee"), trigger: "blur" }]
});

/** 冻结 / 解冻校验规则 */
export const freezeRules = reactive(<FormRules>{
  amount: [
    { required: true, message: $t("payment.payUFreezeAmount"), trigger: "blur" }
  ],
  note: [{ required: true, message: $t("payment.remark"), trigger: "blur" }]
});

/** U 转帐校验规则 */
export const transferRules = reactive(<FormRules>{
  targetID: [
    { required: true, message: $t("payment.payUTargetAccount"), trigger: "change" }
  ],
  amount: [{ required: true, message: $t("payment.payUAmount"), trigger: "blur" }],
  fee: [{ required: true, message: $t("payment.handlingFee"), trigger: "blur" }],
  thirdID: [
    { required: true, message: $t("payment.payUThirdID"), trigger: "blur" }
  ]
});

/** 资金异动校验规则 */
export const tradeRules = reactive(<FormRules>{
  subjectID: [
    { required: true, message: $t("payment.payUSubjectID"), trigger: "change" }
  ],
  tradeTime: [
    { required: true, message: $t("payment.payUTradeTime"), trigger: "change" }
  ],
  amount: [
    { required: true, message: $t("payment.payUChangeAmount"), trigger: "blur" }
  ],
  description: [
    { required: true, message: $t("payment.payUDescription"), trigger: "blur" }
  ]
});
