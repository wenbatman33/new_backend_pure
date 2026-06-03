import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 首頁推薦遊戲編輯表單校驗規則 */
export const formRules = reactive(<FormRules>{
  gameGroupID: [
    { required: true, message: $t("games.gameGroupName"), trigger: "change" }
  ],
  gameID: [
    { required: true, message: $t("games.gameName"), trigger: "change" }
  ],
  showStatus: [
    { required: true, message: $t("games.frontShowStatus"), trigger: "change" }
  ]
});
