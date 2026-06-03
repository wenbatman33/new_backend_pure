import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 抢红包新增/编辑表单校验规则 */
export const formRules = reactive(<FormRules>{
  name: [
    { required: true, message: $t("promotion.lotteryNamePlaceholder"), trigger: "blur" }
  ],
  eventTime: [
    { required: true, message: $t("promotion.lotteryEventTime"), trigger: "change" }
  ],
  time: [
    { required: true, message: $t("promotion.lotteryDuration"), trigger: "change" }
  ],
  verifyType: [
    {
      required: true,
      message: $t("promotion.lotteryVerifyTypeRequired"),
      trigger: "change"
    }
  ],
  websocketTitle: [
    { required: true, message: $t("promotion.lotteryBroadcastContent"), trigger: "blur" }
  ]
});
