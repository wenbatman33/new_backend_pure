import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 新增 / 編輯銀行卡 校驗規則 */
export const formRules = reactive(<FormRules>{
  cardNo: [
    { required: true, message: $t("payment.cardNo"), trigger: "blur" }
  ],
  accountName: [
    { required: true, message: $t("payment.accountName"), trigger: "blur" }
  ],
  bankCode: [
    { required: true, message: $t("payment.payBankID"), trigger: "change" }
  ],
  verifyDate: [
    { required: true, message: $t("payment.verifyDate"), trigger: "change" }
  ],
  type: [{ required: true, message: $t("payment.type"), trigger: "change" }]
});

/** 凍結 / 解凍 校驗規則 */
export const lockFormRules = reactive(<FormRules>{
  amount: [{ required: true, message: $t("payment.amount2"), trigger: "blur" }],
  note: [{ required: true, message: $t("payment.remark"), trigger: "blur" }]
});

/** 轉帳 校驗規則 */
export const transferFormRules = reactive(<FormRules>{
  amount: [{ required: true, message: $t("payment.amount2"), trigger: "blur" }],
  cardNo: [{ required: true, message: $t("payment.cardNo"), trigger: "blur" }],
  fee: [
    { required: true, message: $t("payment.handlingFee"), trigger: "blur" }
  ],
  logTime: [
    { required: true, message: $t("payment.logTime"), trigger: "change" }
  ]
});

/** 資金異動 校驗規則 */
export const tradeFormRules = reactive(<FormRules>{
  subjectID: [
    { required: true, message: $t("payment.subjectID"), trigger: "change" }
  ],
  tradeTime: [
    { required: true, message: $t("payment.tradeTime"), trigger: "change" }
  ],
  amount: [{ required: true, message: $t("payment.amount"), trigger: "blur" }],
  description: [
    { required: true, message: $t("payment.description"), trigger: "blur" }
  ]
});
