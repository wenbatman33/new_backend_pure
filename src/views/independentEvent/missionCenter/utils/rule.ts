import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

// 任務編輯表單校驗規則
export const formRules = reactive(<FormRules>{
  name: [
    {
      required: true,
      message: $t("independentEvent.taskName"),
      trigger: "blur"
    }
  ],
  type: [
    {
      required: true,
      message: $t("independentEvent.taskType"),
      trigger: "change"
    }
  ],
  week: [
    {
      // type=2（每週）時必填，於 form.vue 內依 type 動態切換
      required: false,
      message: $t("independentEvent.refreshCycleMsg"),
      trigger: "change"
    }
  ],
  startTime: [
    {
      required: true,
      message: $t("independentEvent.taskStartTime"),
      trigger: "change"
    }
  ],
  endTime: [
    {
      required: true,
      message: $t("independentEvent.taskEndTime"),
      trigger: "change"
    }
  ]
});
