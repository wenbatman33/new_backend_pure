import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 新增存款表單校驗規則 */
export const createRules = reactive(<FormRules>{
  members: [
    { required: true, message: $t("faketools.depositMembersTip"), trigger: "blur" }
  ],
  depositAt: [
    { required: true, message: $t("faketools.selectDepositDate"), trigger: "change" }
  ],
  depositTime: [
    { required: true, message: $t("faketools.selectDepositTime"), trigger: "change" }
  ],
  depositAmount: [
    { required: true, message: $t("faketools.inputAmount"), trigger: "blur" }
  ],
  payChannelServiceID: [
    { required: true, message: $t("faketools.selectDepositChannel"), trigger: "change" }
  ],
  currency: [
    { required: true, message: $t("faketools.currency"), trigger: "change" }
  ]
});
