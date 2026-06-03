import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 新增 / 編輯商戶號表單校驗規則 */
export const formRules = reactive(<FormRules>{
  payChannelNameID: [
    { required: true, message: $t("payment.merchant2"), trigger: "change" }
  ],
  sn: [{ required: true, message: $t("payment.merchant"), trigger: "blur" }]
});

/** 新增商戶名校驗規則 */
export const nameFormRules = reactive(<FormRules>{
  name: [{ required: true, message: $t("payment.merchant2"), trigger: "blur" }]
});

/** 線下 Gcash 商戶名校驗規則 */
export const gcashFormRules = reactive(<FormRules>{
  name: [{ required: true, message: $t("payment.name"), trigger: "blur" }],
  phone: [{ required: true, message: $t("payment.phone"), trigger: "blur" }],
  qrcode: [{ required: true, message: "QRCODE", trigger: "blur" }]
});

/** 餘額異動（充值 / 結算）校驗規則 */
export const amountFormRules = reactive(<FormRules>{
  amount: [{ required: true, message: $t("payment.amount"), trigger: "blur" }]
});
