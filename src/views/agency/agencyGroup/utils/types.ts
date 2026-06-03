// 单一分层内容（S~F 共 7 阶）
interface RankContent {
  /** 最低净利 */
  minProfit: number;
  /** 活跃会员数 */
  activeMemberCount: number;
  /** 佣金百分比 */
  commissionPercent: number;
}

// 列表行资料
interface AgencyGroupItem {
  id: number;
  groupName: string;
  /** 1=分层(S~F) 2=不分层(仅 S) */
  type: number;
  rankContent: RankContent[];
}

// 编辑/新增表单：把 7 阶拍平成 rankNxxx 栏位
interface FormItemProps {
  id?: number;
  groupName: string;
  type: number;
  rank1MinProfit: number | string;
  rank1ActiveMemberCount: number | string;
  rank1CommissionPercent: number | string;
  rank2MinProfit: number | string;
  rank2ActiveMemberCount: number | string;
  rank2CommissionPercent: number | string;
  rank3MinProfit: number | string;
  rank3ActiveMemberCount: number | string;
  rank3CommissionPercent: number | string;
  rank4MinProfit: number | string;
  rank4ActiveMemberCount: number | string;
  rank4CommissionPercent: number | string;
  rank5MinProfit: number | string;
  rank5ActiveMemberCount: number | string;
  rank5CommissionPercent: number | string;
  rank6MinProfit: number | string;
  rank6ActiveMemberCount: number | string;
  rank6CommissionPercent: number | string;
  rank7MinProfit: number | string;
  rank7ActiveMemberCount: number | string;
  rank7CommissionPercent: number | string;
}

interface FormProps {
  formInline: FormItemProps;
  // Create / Edit
  mode: string;
  // 是否为周报国别（IN/PH/CN）：影响净利标题文案
  isReportDateTypeWeek: boolean;
}

export type { RankContent, AgencyGroupItem, FormItemProps, FormProps };
