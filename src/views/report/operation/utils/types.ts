// 营运报表搜寻条件
interface SearchFormProps {
  reportType: "d" | "w" | "m"; // 日报 / 周报 / 月报
  reportDateStart: string;
  reportDateEnd: string;
  agencyAccount: string;
  queryMemberMoney: boolean;
  includesTest: 0 | 1;
}

// 营运报表合计/单笔资料结构
interface ReportRow {
  reportDate: string;
  betAmount: string;
  groupBetAmount: string;
  winAmount: string;
  kill: string;
  rechargeAmount: string;
  withdrawAmount: string;
  rechargeWithdrawDiff: string;
  promotionAmount: string;
  vipGift: string;
  returnAmount: string;
  agencyRechargeAmount: string;
  agencyWithdrawAmount: string;
  transferMainWallet: string;
  transferLuckMoney: string;
  registerPeople: string;
  loginPeople: string;
  betPeople: string;
  depositNum: string;
  withdrawNum: string;
  registerFirstDepositPeople: string;
  firstDepositPeople: string;
  maxOnlineMember: string;
  memberMoney: string | number;
  lastUpdatedAt?: string;
}

export type { SearchFormProps, ReportRow };
