import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 編輯幸運金遊戲廠商表單校驗規則 */
export const formRules = reactive(<FormRules>{
  name: [
    { required: true, message: $t("games.lmGameGroupRequired"), trigger: "blur" }
  ],
  displayName: [
    { required: true, message: $t("games.lmGameGroupRequired"), trigger: "blur" }
  ],
  status: [
    { required: true, message: $t("games.lmGameGroupRequired"), trigger: "change" }
  ],
  sort: [
    {
      pattern: /^\d{1,4}$/,
      message: `${$t("games.lmGameGroupRangeIn")} 0~9,999`,
      trigger: ["change", "blur"]
    }
  ]
});
