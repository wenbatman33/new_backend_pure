import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 新增流水表單校驗規則 */
export const createRules = reactive(<FormRules>{
  members: [
    { required: true, message: $t("faketools.inputAccountOrId"), trigger: "blur" }
  ],
  betAt: [
    { required: true, message: $t("faketools.selectBetDate"), trigger: "change" }
  ],
  betTime: [
    { required: true, message: $t("faketools.selectBetTime"), trigger: "change" }
  ],
  turnover: [
    { required: true, message: $t("faketools.inputTurnover"), trigger: "blur" }
  ],
  winAmount: [
    { required: true, message: $t("faketools.inputWinAmount"), trigger: "blur" }
  ]
});

/** 查詢流水表單校驗規則 */
export const searchRules = reactive(<FormRules>{
  members: [
    { required: true, message: $t("faketools.inputAccountOrId"), trigger: "blur" }
  ],
  qStartTime: [
    { required: true, message: $t("faketools.selectStartDate"), trigger: "change" }
  ],
  qEndTime: [
    { required: true, message: $t("faketools.selectEndDate"), trigger: "change" }
  ]
});
