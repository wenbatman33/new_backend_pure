import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 步驟一：基本資料校驗規則 */
export const step1Rules = reactive(<FormRules>{
  title: [{ required: true, message: $t("report.title"), trigger: "blur" }],
  dateRange: [
    {
      // 自訂時間(dateRangeType==="2")時必填區間
      validator: (rule, value, callback) => {
        callback();
      },
      trigger: "change"
    }
  ]
});
