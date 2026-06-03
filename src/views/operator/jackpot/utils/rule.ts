import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

// 正數到小數點後兩位（或整數）
const decimalReg = /^[0-9]+$|^[0-9]+\.[0-9]{1,2}$/;
// 跳動金額允許帶正負號
const signedDecimalReg = /^[-+]?[0-9]+$|^[-+]?[0-9]+\.[0-9]{1,2}$/;
// 正整數
const positiveIntReg = /^[1-9]\d*$/;

/** 假 Jackpot 設定表單校驗規則 */
export const formRules = reactive(<FormRules>{
  min: [
    {
      required: true,
      trigger: "change",
      validator: (_rule, value, callback) => {
        if (!value && value !== 0) {
          callback(new Error($t("operator.inputText")));
        } else if (!decimalReg.test(String(value))) {
          callback(new Error($t("operator.jackpotError1")));
        } else {
          callback();
        }
      }
    }
  ],
  max: [
    {
      required: true,
      trigger: "change",
      validator: (_rule, value, callback) => {
        if (!value && value !== 0) {
          callback(new Error($t("operator.inputText")));
        } else if (!decimalReg.test(String(value))) {
          callback(new Error($t("operator.jackpotError1")));
        } else {
          callback();
        }
      }
    }
  ],
  cycle: [
    {
      required: true,
      trigger: "change",
      validator: (_rule, value, callback) => {
        if (!value && value !== 0) {
          callback(new Error($t("operator.inputText")));
        } else if (!positiveIntReg.test(String(value))) {
          callback(new Error($t("operator.jackpotError3")));
        } else {
          callback();
        }
      }
    }
  ],
  min_cycle: [
    {
      required: true,
      trigger: "change",
      validator: (_rule, value, callback) => {
        if (!value && value !== 0) {
          callback(new Error($t("operator.inputText")));
        } else if (!signedDecimalReg.test(String(value))) {
          callback(new Error($t("operator.jackpotError1")));
        } else {
          callback();
        }
      }
    }
  ],
  max_cycle: [
    {
      required: true,
      trigger: "change",
      validator: (_rule, value, callback) => {
        if (!value && value !== 0) {
          callback(new Error($t("operator.inputText")));
        } else if (!signedDecimalReg.test(String(value))) {
          callback(new Error($t("operator.jackpotError1")));
        } else {
          callback();
        }
      }
    }
  ]
});
