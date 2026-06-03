import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

// 新增/編輯圖片尺寸表單校驗規則
export const formRules = reactive(<FormRules>{
  type: [
    {
      required: true,
      message: $t("systemManage.dataSheet"),
      trigger: "change"
    }
  ],
  id: [{ required: true, message: "ID", trigger: "change" }]
});
