import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 編輯遊戲廠商表單校驗規則 */
export const formRules = reactive<FormRules>({
  name: [
    { required: true, message: $t("games.required"), trigger: "blur" }
  ],
  displayName: [
    { required: true, message: $t("games.required"), trigger: "blur" }
  ],
  status: [
    { required: true, message: $t("games.required"), trigger: "change" }
  ],
  sort: [
    {
      pattern: /^\d{1,4}$/,
      message: `${$t("games.theRangeIs")} 0~9,999`,
      trigger: ["change", "blur"]
    }
  ]
});

/** 設定賽事推薦表單校驗規則 */
export const configSportRules = reactive<FormRules>({
  recommendGroupId: [
    { required: true, message: $t("games.required"), trigger: "blur" }
  ],
  luckysportGroupId: [
    { required: true, message: $t("games.required"), trigger: "blur" }
  ],
  isVirtual: [
    { required: true, message: $t("games.required"), trigger: "change" }
  ],
  countRecord: [
    { required: true, message: $t("games.required"), trigger: "blur" }
  ],
  countDay: [
    { required: true, message: $t("games.required"), trigger: "blur" }
  ]
});
