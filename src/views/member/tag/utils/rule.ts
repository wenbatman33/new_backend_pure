import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 標籤群組表單校驗規則 */
export const groupFormRules = reactive(<FormRules>{
  name: [{ required: true, message: $t("member.name"), trigger: "blur" }]
});

/** 標籤表單校驗規則 */
export const tagFormRules = reactive(<FormRules>{
  name: [{ required: true, message: $t("member.name"), trigger: "blur" }],
  tagGroupID: [
    { required: true, message: $t("member.tagGroup"), trigger: "change" }
  ]
});
