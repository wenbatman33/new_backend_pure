import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 新增 / 編輯遊戲表單校驗規則 */
export const formRules = reactive(<FormRules>{
  name: [{ required: true, message: $t("games.name"), trigger: "blur" }],
  displayName: [
    { required: true, message: $t("games.displayName"), trigger: "blur" }
  ],
  sort: [
    { required: true, message: $t("games.sort"), trigger: "blur" },
    {
      pattern: /^\d{1,6}$/,
      message: $t("games.rangeIn") + " 0~999,999",
      trigger: ["change", "blur"]
    }
  ],
  gameCodePc: [
    { required: true, message: $t("games.gameCodePc"), trigger: "blur" }
  ],
  gameCodeH5: [
    { required: true, message: $t("games.gameCodeH5"), trigger: "blur" }
  ],
  status: [{ required: true, message: $t("games.status"), trigger: "change" }],
  trialPlay: [
    { required: true, message: $t("games.trialPlay"), trigger: "change" }
  ]
});
