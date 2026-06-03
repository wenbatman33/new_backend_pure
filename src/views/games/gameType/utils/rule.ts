import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 遊戲類型編輯表單校驗規則 */
export const formRules = reactive(<FormRules>{
  name: [{ required: true, message: $t("games.name"), trigger: "blur" }],
  sort: [{ required: true, message: $t("games.sort"), trigger: "blur" }],
  isRecommended: [
    { required: true, message: $t("games.gameTypeIsRecommended"), trigger: "change" }
  ],
  isTagRecommended: [
    { required: true, message: $t("games.gameTypeIsTagRecommended"), trigger: "change" }
  ],
  isShow: [
    { required: true, message: $t("games.gameTypeIsShow"), trigger: "change" }
  ],
  dynamic: [
    { required: true, message: $t("games.gameTypeDynamic"), trigger: "change" }
  ]
});
