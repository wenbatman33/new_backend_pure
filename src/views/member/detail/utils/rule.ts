import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

// 會員明細頁主要為唯讀展示，僅保留搜尋欄位的簡易校驗以符合範本約定
export const searchRules = reactive<FormRules>({
  searchAccount: [
    { required: true, message: $t("member.searchMember"), trigger: "blur" }
  ]
});
