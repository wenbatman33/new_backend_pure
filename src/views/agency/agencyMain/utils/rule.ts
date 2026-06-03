import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

// 審核時間搜尋：起訖只填一邊時需提示（保留規則供未來擴充）
export const searchRules = reactive<FormRules>({
  reviewStartTime: [
    {
      required: false,
      message: $t("agency.agencyMainForm7"),
      trigger: "change"
    }
  ]
});
