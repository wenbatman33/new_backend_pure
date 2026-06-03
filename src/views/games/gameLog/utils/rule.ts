import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

// 投注紀錄查詢：會員帳號 / 廠商 / 遊戲 / 注單號 四選一（依站台設定）
// 規則於 hook 內依當前輸入動態判斷，這裡僅提供基本提示用空規則占位
export const formRules = reactive<FormRules>({
  memberAccount: [
    { required: false, message: $t("games.choseOne"), trigger: "blur" }
  ]
});
