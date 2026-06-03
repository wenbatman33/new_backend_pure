import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 新增/編輯帳號表單校驗規則 */
export const formRules = reactive(<FormRules>{
  account: [
    { required: true, message: $t("authSystem.accountValidate1"), trigger: "blur" },
    {
      validator: (_rule, value, callback) => {
        if (value && value.length < 6) {
          callback(new Error($t("authSystem.accountValidate2")));
        } else {
          callback();
        }
      },
      trigger: "change"
    }
  ],
  password: [
    { required: true, message: $t("authSystem.password"), trigger: "blur" }
  ],
  name: [{ required: true, message: $t("authSystem.name"), trigger: "blur" }],
  deptID: [{ required: true, message: $t("authSystem.dept"), trigger: "change" }],
  title: [
    { required: true, message: $t("authSystem.titleValidate1"), trigger: "blur" },
    {
      validator: (_rule, value, callback) => {
        if (value && value.length < 2) {
          callback(new Error($t("authSystem.titleValidate2")));
        } else {
          callback();
        }
      },
      trigger: "change"
    }
  ],
  vpnIP: [{ required: true, message: "VPN IP", trigger: "blur" }]
});

/** 修改密碼表單校驗規則 */
export const passwordRules = reactive(<FormRules>{
  newpassword: [
    {
      required: true,
      validator: (_rule, value, callback) => {
        if (!value) {
          callback(new Error($t("authSystem.newpasswordValidate1")));
        } else if (value.length < 6 || value.length > 20) {
          callback(new Error($t("authSystem.newpasswordValidate2")));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  password2: [
    { required: true, message: $t("authSystem.newpasswordValidate1"), trigger: "blur" }
  ]
});
