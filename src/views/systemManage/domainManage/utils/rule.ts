import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

// 正整數校驗
const positiveInt = (_rule, value, callback) => {
  if (value === "" || value === undefined || value === null) {
    callback();
    return;
  }
  if (!/^[0-9]\d*$/.test(String(value))) {
    callback(new Error($t("systemManage.pleaseInputPositiveInt")));
  } else {
    callback();
  }
};

/** 域名群組表單校驗規則 */
export const groupFormRules = reactive(<FormRules>{
  name: [
    { required: true, message: $t("systemManage.domainName"), trigger: "blur" }
  ],
  sort: [
    { required: true, message: $t("systemManage.sort"), trigger: "blur" },
    { validator: positiveInt, trigger: "blur" }
  ],
  setName: [
    {
      required: true,
      message: $t("systemManage.setNameAndDisplayName"),
      trigger: "blur"
    }
  ]
});

/** 域名表單校驗規則 */
export const domainFormRules = reactive(<FormRules>{
  groupID: [
    {
      required: true,
      message: $t("systemManage.belongGroup"),
      trigger: "change"
    }
  ],
  name: [
    { required: true, message: $t("systemManage.domainName"), trigger: "blur" }
  ],
  displayName: [
    {
      required: true,
      message: $t("systemManage.setNameAndDisplayName"),
      trigger: "blur"
    }
  ],
  domain: [
    { required: true, message: $t("systemManage.domain"), trigger: "blur" }
  ],
  sort: [{ validator: positiveInt, trigger: "blur" }]
});

/** 快速置換搜尋表單校驗規則 */
export const replaceFormRules = reactive(<FormRules>{
  searchDomain: [
    {
      required: true,
      message: $t("systemManage.searchDomain"),
      trigger: "blur"
    }
  ],
  replaceDomain: [
    {
      required: true,
      message: $t("systemManage.replaceTo"),
      trigger: "blur"
    }
  ],
  matchType: [
    {
      required: true,
      message: $t("systemManage.matchType"),
      trigger: "change"
    }
  ]
});
