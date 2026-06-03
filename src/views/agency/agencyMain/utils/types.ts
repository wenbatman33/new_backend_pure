// 代理列表查詢條件
interface AgencySearchForm {
  agencyID: string;
  agencyAccount: string;
  exactlyMatching: number; // 1 精確 / 2 模糊
  rankGroupID: string;
  isCredit: number; // 0 全部 / 1 是 / 2 否
  giveOffer: number; // 0 全部 / 1 是 / 2 否
  reviewStartTime: string;
  reviewEndTime: string;
  activeStatus: number; // 0 全部 / 1 活躍 / 2 不活躍
  status: number; // 0 全部 / 1 待審 / 2 通過 / 3 拒絕
  ignoreZeroWallet: boolean;
  parentAgencyAccount: string;
  businessType: number; // 0 全部 / 1 / 2
}

// 代理列表單筆
interface AgencyItem {
  id: number;
  account: string;
  phone: string;
  businessType: number;
  isCredit: number;
  billingCycle: number;
  name: string;
  parentAgencyAccount: string;
  childAgencyCount: number;
  memberCount: number;
  giveOffer: number;
  offerPercent: number;
  rankGroupName: string;
  netProfitOption: Array<{ key: string; value: number }>;
  netProfitBase: number;
  agencyWallet: number;
  agencyReturnProportion: number;
  promotionLinks: Array<{ promotionLink: string }>;
  memberReturnProportion: number;
  activeStatus: number;
  reviewTime: string;
  lastLoginTime: string;
  adminRemark: string;
}

// 上層代理麵包屑
interface ParentAgency {
  parentAgencyID: number;
  parentAgencyAccount: string;
}

export type { AgencySearchForm, AgencyItem, ParentAgency };
