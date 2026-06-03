import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 新增/编辑埋点表单校验规则 */
export const pointFormRules = reactive(<FormRules>{
  name: [
    {
      required: true,
      message: $t("operator.plzEnterName"),
      trigger: "blur"
    }
  ],
  eventType: [
    {
      required: true,
      message: $t("operator.chooseText"),
      trigger: "change"
    }
  ],
  eventCode: [
    {
      required: true,
      message: $t("operator.plzEnterCode"),
      trigger: "blur"
    }
  ],
  url: [
    {
      required: true,
      type: "array",
      message: $t("operator.plzSelectURL"),
      trigger: "change"
    }
  ]
});

/** 新增/编辑域名表单校验规则 */
export const domainFormRules = reactive(<FormRules>{
  displayName: [
    {
      required: true,
      message: $t("operator.plzEnterName"),
      trigger: "blur"
    }
  ],
  domain: [
    {
      required: true,
      message: $t("operator.plzEnterDomain"),
      trigger: "blur"
    }
  ]
});
