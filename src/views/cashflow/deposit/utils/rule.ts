import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 新增存款單表單校驗規則 */
export const createFormRules = reactive(<FormRules>{
  memberAccount: [
    { required: true, message: $t("cashflow.memberAC"), trigger: "blur" }
  ],
  balanceDate: [
    { required: true, message: $t("cashflow.balanceDate"), trigger: "change" }
  ],
  amount: [
    { required: true, message: $t("cashflow.tableAmount"), trigger: "blur" },
    {
      pattern: /^[\d.]+$/,
      message: $t("cashflow.depositForm5"),
      trigger: "blur"
    },
    {
      pattern: /^(?!^0+$).*$/,
      message: $t("cashflow.depositForm5"),
      trigger: "blur"
    }
  ],
  payChannelServiceID: [
    { required: true, message: $t("cashflow.gateway"), trigger: "change" }
  ],
  fee: [
    { required: true, message: $t("cashflow.fee"), trigger: "blur" },
    { pattern: /^[\d.]+$/, message: $t("cashflow.depositForm6"), trigger: "blur" }
  ],
  notePrefix: [
    { required: true, message: $t("cashflow.description"), trigger: "change" }
  ],
  noteSuffix: [
    { required: true, message: $t("cashflow.description"), trigger: "blur" }
  ]
});

/** 強制失敗 / 強制成功 校驗規則 */
export const forceFormRules = reactive(<FormRules>{
  note: [{ required: true, message: $t("cashflow.depositForceFail2"), trigger: "blur" }],
  thirdID: [
    { required: true, message: $t("cashflow.depositForceFail5"), trigger: "blur" }
  ]
});

/** 修改入帳日校驗規則 */
export const balanceDateFormRules = reactive(<FormRules>{
  balanceDate: [
    { required: true, message: $t("cashflow.balanceDate"), trigger: "change" }
  ],
  note: [{ required: true, message: $t("cashflow.description"), trigger: "blur" }]
});

/** 新增備註校驗規則 */
export const noteFormRules = reactive(<FormRules>{
  note: [{ required: true, message: $t("cashflow.description"), trigger: "blur" }]
});
