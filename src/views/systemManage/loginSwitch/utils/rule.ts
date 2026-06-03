import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

// 白名單群組數可設範圍 0~999
const limitPattern = /^(\d{1,3})$/;

export const formRules = reactive<FormRules>({
  ipTwoPhaseWhiteListLimit: [
    {
      pattern: limitPattern,
      message: `${$t("systemManage.canBeSet")}0~999`,
      trigger: "blur"
    }
  ],
  deviceIDTwoPhaseWhiteListLimit: [
    {
      pattern: limitPattern,
      message: `${$t("systemManage.canBeSet")}0~999`,
      trigger: "blur"
    }
  ]
});
