// 下級代理报表 搜尋表單型別
interface SearchFormProps {
  agencyID: string;
  agencyAccount: string;
  memberType: number | string;
  reportDateStart: string;
  reportDateEnd: string;
}

// 报表單筆資料型別
interface ChildAgencyReportItem {
  agencyID: number | string;
  agencyAccount: string;
  agencyName: string;
  rechargeAmount: number;
  withdrawAmount: number;
  betAmount: number;
  totalWinAmount: number;
  netProfit: number;
  commissionPercent: string;
  totalCommission: number;
  totalCommissionPaid: number;
  regMemberCount: number;
  firstDepositCount: number;
  platformCharge: number;
  totalBonus: number;
  totalCharge: number;
  activeMemberCount: number;
  lastLoginTime: string;
  isActive: number;
}

export type { SearchFormProps, ChildAgencyReportItem };
