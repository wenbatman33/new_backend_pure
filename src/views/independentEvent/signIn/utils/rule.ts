import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 簽到活動表單校驗規則 */
export const formRules = reactive(<FormRules>{
  name: [
    { required: true, message: $t("independentEvent.nameTip"), trigger: "blur" }
  ],
  internalName: [
    {
      required: true,
      message: $t("independentEvent.internalNameTip"),
      trigger: "blur"
    }
  ],
  startTime: [
    {
      required: true,
      message: $t("independentEvent.startTimeTip"),
      trigger: "change"
    }
  ],
  endTime: [
    {
      required: true,
      message: $t("independentEvent.endTimeTip"),
      trigger: "change"
    }
  ]
});
