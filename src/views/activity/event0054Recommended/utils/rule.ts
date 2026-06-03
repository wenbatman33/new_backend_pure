import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

// 搜尋表單校驗：推薦人帳號必填
export const searchRules = reactive<FormRules>({
  recommenderAccount: [
    {
      required: true,
      message: $t("activity.event0054RecommenderAccountRequired"),
      trigger: "blur"
    }
  ]
});
