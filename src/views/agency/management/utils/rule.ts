import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 公告 / 活動表單校驗規則 */
export const formRules = reactive(<FormRules>{
  title: [{ required: true, message: $t("agency.managementModal5"), trigger: "blur" }],
  sort: [{ required: true, message: $t("agency.managementModal7"), trigger: "blur" }],
  endTime: [{ required: true, message: $t("agency.managementModal10"), trigger: "change" }],
  contents: [{ required: true, message: $t("agency.managementModal15"), trigger: "blur" }]
});
