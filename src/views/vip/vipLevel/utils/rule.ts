import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

/** 新增等級表單校驗規則（沿用舊 schema 的 required 欄位） */
export const formRules = reactive(<FormRules>{
  upgradeRechargeAmount: [
    { required: true, message: $t("vip.upgradeRechargeAmount"), trigger: "blur" }
  ],
  upgradeGift: [
    { required: true, message: $t("vip.upgradeGift"), trigger: "blur" }
  ],
  upgradeGiftMultiple: [
    { required: true, message: $t("vip.upgradeGift"), trigger: "blur" }
  ],
  birthdayGift: [
    { required: true, message: $t("vip.bdGift"), trigger: "blur" }
  ],
  birthdayGiftMultiple: [
    { required: true, message: $t("vip.bdGift"), trigger: "blur" }
  ],
  dailyGift: [{ required: true, message: $t("vip.dailyGift"), trigger: "blur" }],
  dailyGiftRechargeMultiple: [
    { required: true, message: $t("vip.dailyGift"), trigger: "blur" }
  ],
  dailyGiftBetMultiple: [
    { required: true, message: $t("vip.dailyGift"), trigger: "blur" }
  ],
  dailyGiftMultiple: [
    { required: true, message: $t("vip.dailyGift"), trigger: "blur" }
  ],
  weeklyGift: [
    { required: true, message: $t("vip.weeklyGift"), trigger: "blur" }
  ],
  weeklyGiftRechargeMultiple: [
    { required: true, message: $t("vip.weeklyGift"), trigger: "blur" }
  ],
  weeklyGiftBetMultiple: [
    { required: true, message: $t("vip.weeklyGift"), trigger: "blur" }
  ],
  weeklyGiftMultiple: [
    { required: true, message: $t("vip.weeklyGift"), trigger: "blur" }
  ],
  monthlyGift: [
    { required: true, message: $t("vip.monthlyGift"), trigger: "blur" }
  ],
  monthlyGiftRechargeMultiple: [
    { required: true, message: $t("vip.monthlyGift"), trigger: "blur" }
  ],
  monthlyGiftBetMultiple: [
    { required: true, message: $t("vip.monthlyGift"), trigger: "blur" }
  ],
  monthlyGiftMultiple: [
    { required: true, message: $t("vip.monthlyGift"), trigger: "blur" }
  ],
  withdrawAmountLimit: [
    { required: true, message: $t("vip.withdrawAmountLimit"), trigger: "blur" }
  ],
  withdrawTimesLimit: [
    { required: true, message: $t("vip.withdrawTimesLimit"), trigger: "blur" }
  ],
  singleWithdrawAmountLimit: [
    {
      required: true,
      message: $t("vip.singleWithdrawAmountLimit"),
      trigger: "blur"
    }
  ]
});
