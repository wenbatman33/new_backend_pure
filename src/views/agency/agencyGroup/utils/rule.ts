import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";

// 净利：最多 7 位数字
const profitPattern = /^\d{1,7}$/;
// 活跃会员数：最多 3 位数字
const countPattern = /^\d{1,3}$/;
// 佣金百分比：最多 2 位数字
const percentPattern = /^\d{1,2}$/;

const profitRule = {
  required: true,
  pattern: profitPattern,
  message: $t("agency.agencyGroupProfitTip"),
  trigger: ["change", "blur"]
};
const countRule = {
  required: true,
  pattern: countPattern,
  message: $t("agency.agencyGroupCountTip"),
  trigger: ["change", "blur"]
};
const percentRule = {
  required: true,
  pattern: percentPattern,
  message: $t("agency.agencyGroupPercentTip"),
  trigger: ["change", "blur"]
};

/** 分层设定表单校验规则 */
export const formRules = reactive(<FormRules>{
  groupName: [
    {
      required: true,
      message: $t("agency.agencyGroupNameTip"),
      trigger: "blur"
    }
  ],
  rank1MinProfit: [profitRule],
  rank2MinProfit: [profitRule],
  rank3MinProfit: [profitRule],
  rank4MinProfit: [profitRule],
  rank5MinProfit: [profitRule],
  rank6MinProfit: [profitRule],
  rank7MinProfit: [profitRule],
  rank1ActiveMemberCount: [countRule],
  rank2ActiveMemberCount: [countRule],
  rank3ActiveMemberCount: [countRule],
  rank4ActiveMemberCount: [countRule],
  rank5ActiveMemberCount: [countRule],
  rank6ActiveMemberCount: [countRule],
  rank7ActiveMemberCount: [countRule],
  rank1CommissionPercent: [percentRule],
  rank2CommissionPercent: [percentRule],
  rank3CommissionPercent: [percentRule],
  rank4CommissionPercent: [percentRule],
  rank5CommissionPercent: [percentRule],
  rank6CommissionPercent: [percentRule],
  rank7CommissionPercent: [percentRule]
});
