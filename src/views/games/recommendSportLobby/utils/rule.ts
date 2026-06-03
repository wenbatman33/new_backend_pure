import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 体育游戏推荐表單校驗規則 */
export const formRules = reactive(<FormRules>{
  recommendedSort: [
    { required: true, message: $t("games.recommendedSort"), trigger: "change" }
  ],
  gameGroupID: [
    { required: true, message: $t("games.gameGroupName"), trigger: "change" }
  ],
  gameID: [{ required: true, message: $t("games.gameName"), trigger: "change" }],
  showStatus: [
    { required: true, message: $t("games.frontStatus"), trigger: "change" }
  ]
});
