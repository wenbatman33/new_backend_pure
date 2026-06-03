// 報表類型選項
interface OptionItem {
  label: string;
  value: string;
}

// 會員相關報表單列資料（欄位眾多，統一以可選字串/數字承載）
interface MemberReportRow {
  reportDate?: string;
  registerPeople?: number | string;
  organicRegisterPeople?: number | string;
  firstDepositPeople?: number | string;
  firstDepositAmount?: number | string;
  continueDepositCount?: number | string;
  continueDepositAmount?: number | string;
  organicRegisterFirstDepositPeople?: number | string;
  registerFirstDepositPeople?: number | string;
  organicRegisterNotFirstDepositPeople?: number | string;
  agentRegisterNotFirstDepositPeople?: number | string;
  loginPeople?: number | string;
  loginCount?: number | string;
  betPeople?: number | string;
  maxOnlineMember?: number | string;
  retentionRateDay1?: number | string;
  retentionRateDay3?: number | string;
  retentionRateDay7?: number | string;
  retentionRateDay15?: number | string;
  retentionRateDay30?: number | string;
  registerRetentionDay1?: number | string;
  registerRetentionRateDay1?: number | string;
  registerRetentionDay3?: number | string;
  registerRetentionRateDay3?: number | string;
  registerRetentionDay7?: number | string;
  registerRetentionRateDay7?: number | string;
  registerRetentionDay15?: number | string;
  registerRetentionRateDay15?: number | string;
  registerRetentionDay30?: number | string;
  registerRetentionRateDay30?: number | string;
  registerFirstDepositRetentionDay1?: number | string;
  registerFirstDepositRetentionRateDay1?: number | string;
  registerFirstDepositRetentionDay3?: number | string;
  registerFirstDepositRetentionRateDay3?: number | string;
  registerFirstDepositRetentionDay7?: number | string;
  registerFirstDepositRetentionRateDay7?: number | string;
  registerFirstDepositRetentionDay15?: number | string;
  registerFirstDepositRetentionRateDay15?: number | string;
  registerFirstDepositRetentionDay30?: number | string;
  registerFirstDepositRetentionRateDay30?: number | string;
  [key: string]: any;
}

// 合計列資料（後端回傳 total 物件）
type MemberReportTotal = Partial<MemberReportRow> & {
  lastUpdatedAt?: string;
};

export type { OptionItem, MemberReportRow, MemberReportTotal };
