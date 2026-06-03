import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

// 金額：只允許數字與小數點，且不可全為 0
const amountValidator = (_rule, value, callback) => {
  if (!value && value !== 0) {
    callback(new Error($t("agency.depositAmountPositive")));
  } else if (!/^[\d.]+$/.test(String(value)) || /^0+$/.test(String(value))) {
    callback(new Error($t("agency.depositAmountPositive")));
  } else {
    callback();
  }
};

// 手續費：只允許數字與小數點
const feeValidator = (_rule, value, callback) => {
  if (!value && value !== 0) {
    callback(new Error($t("agency.depositFeeNumber")));
  } else if (!/^[\d.]+$/.test(String(value))) {
    callback(new Error($t("agency.depositFeeNumber")));
  } else {
    callback();
  }
};

/** 新增存款單表單校驗規則 */
export const createFormRules = reactive(<FormRules>{
  memberAccount: [
    { required: true, message: $t("agency.agencyAccount"), trigger: "blur" }
  ],
  balanceDate: [
    { required: true, message: $t("agency.debitTime"), trigger: "change" }
  ],
  amount: [{ required: true, validator: amountValidator, trigger: "blur" }],
  thirdID: [
    { required: true, message: $t("agency.thirdPartyID"), trigger: "blur" }
  ],
  payChannelServiceID: [
    { required: true, message: $t("agency.lineName"), trigger: "change" }
  ],
  fee: [{ required: true, validator: feeValidator, trigger: "blur" }],
  otherAmount: [
    { required: true, validator: amountValidator, trigger: "blur" }
  ],
  notePrefix: [
    { required: true, message: $t("agency.description"), trigger: "change" }
  ],
  noteSuffix: [
    { required: true, message: $t("agency.description"), trigger: "blur" }
  ]
});

/** 修改入帳日期表單校驗規則 */
export const balanceDateFormRules = reactive(<FormRules>{
  balanceDate: [
    { required: true, message: $t("agency.debitTime"), trigger: "change" }
  ],
  note: [{ required: true, message: $t("agency.description"), trigger: "blur" }]
});
