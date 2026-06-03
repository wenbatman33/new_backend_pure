// 代理日报表列項目
export interface DailyReportItem {
  date: string;
  activeAgencyCount: number;
  activeMemberCount: number;
  betAmount: number;
  regMemberCount: number;
  regAlsoDepositMemberCount: number;
  firstDepositCount: number;
  totalWinAmount: number;
  rechargeMemberCount: number;
  rechargeAmount: number;
  rechargeFee: number;
  withdrawMemberCount: number;
  withdrawAmount: number;
  payoutFee: number;
  transferMemberCount: number;
  transferMember: number;
  promotionAmount: number;
  vipGift: number;
  returnAmount: number;
  platformCharge: number;
  netProfit: number;
  agencyWallet: number;
  [key: string]: any;
}

// 活跃代理明细列項目
export interface ActiveAgencyItem {
  agencyID: number;
  agencyAccount: string;
  activeMemberCount: number;
  betAmount: number;
  totalWinAmount: number;
  rechargeAmount: number;
  rechargeFee: number;
  withdrawAmount: number;
  payoutFee: number;
  depositWithdrawDiff: number;
  totalBonus: number;
  transferMember: number;
  platformCharge: number;
  netProfit: number;
  [key: string]: any;
}

// 搜寻表单
export interface DailyReportSearch {
  reportDateStart: string;
  reportDateEnd: string;
  giveOffer: number;
}
