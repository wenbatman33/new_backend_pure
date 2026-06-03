// 佣金資料列（一代/二代/派發共用，欄位為超集）
interface CommissionItem {
  id: number;
  date: string;
  deliveredAt: string;
  childDeliveredAt?: string;
  agencyID: number;
  agencyName: string;
  agencyAccount: string;
  parentAgencyId: number;
  wallet: number | string;
  commissionPercent?: number | string;
  activeMemberCount?: number;
  firstDepositCount?: number;
  totalWinAmount?: number | string;
  childTotalWinAmount?: number | string;
  rechargeAmount?: number | string;
  withdrawAmount?: number | string;
  betAmount?: number | string;
  platformCharge?: number | string;
  totalBonus?: number | string;
  totalCharge?: number | string;
  netProfit?: number | string;
  totalCommission: number;
  lastTotalCommission?: number | string;
  childCommissionAmount: number;
  childBonusAmount: number;
  percentOfSameDevice?: number | string;
  billingCycle?: number;
  status: number;
  childStatus?: number;
  // 前端暫存：本次審核要設定的狀態（2 通過 / 3 拒絕 / 4 延期）
  setStatus?: number;
}

// 派發計算合計（一代）
interface DistributedCalc {
  cnt: number;
  amount: number;
}

// 派發計算合計（二代/派發）
interface ChildDistributedCalc {
  cnt: number;
  childCommissionAmount: number;
  childBonusAmount: number;
}

export type { CommissionItem, DistributedCalc, ChildDistributedCalc };
