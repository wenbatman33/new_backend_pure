// 代理报表查询条件
interface SearchFormProps {
  startTime: string;
  endTime: string;
  agencyAccount: string;
  parentAgencyAccount: string;
  businessType: string;
  memberType: number | string;
}

// 代理报表列表项目（仅列出 hook 会读取的栏位）
interface PhDailyReportItem {
  agencyID: string | number;
  agencyAccount: string;
  businessType: string;
  parentAgencyAccount: string;
  agencyChildCnt: number;
  rankSettingOfferPercent: string | number;
  rankSettingGroupName: string;
  rechargeAmount: number;
  billingCycle: string;
  withdrawAmount: number;
  betAmount: number;
  totalWinAmount: number;
  depositWithdrawDiff: number;
  regMemberCount: number;
  rechargeMemberCount: number;
  withdrawMemberCount: number;
  betMemberCount: number;
  firstDepositCount: number;
  firstDepositAmount: number;
  continueDepositCount: number;
  continueDepositAmount: number;
  transferMemberCount: number;
  transferMemberAmount: number;
}

// 上级代理面包屑
interface ParentAgencyItem {
  parentAgencyAccount: string;
}

export type { SearchFormProps, PhDailyReportItem, ParentAgencyItem };
