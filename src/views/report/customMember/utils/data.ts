import { transformI18n as $t } from "@/plugins/i18n";

// 會員狀態選項
export const statusOptions = [
  { label: $t("report.all"), value: "all" },
  { label: $t("report.enable"), value: "1" },
  { label: $t("report.disable"), value: "2" },
  { label: $t("report.lock"), value: "3" }
];

// 數值比較符號
export const compareOptions = [
  { label: "=", value: "1" },
  { label: ">", value: "2" },
  { label: ">=", value: "3" },
  { label: "<", value: "4" },
  { label: "<=", value: "5" }
];

// 認證(是/否)選項
export const certOptions = [
  { label: $t("report.all"), value: "all" },
  { label: $t("report.certOption1"), value: "1" },
  { label: $t("report.certOption2"), value: "2" }
];

// 實名認證(是/否)選項
export const nameCertOptions = [
  { label: $t("report.all"), value: "all" },
  { label: $t("report.certOption1"), value: "1" },
  { label: $t("report.certOption2"), value: "0" }
];

/** 報表欄位分類（條件設定 / 報表欄位設定 共用） */
export const selectCategory = [
  {
    label: $t("report.accountInfo"),
    value: "accountInfo",
    children: [
      "memberStatus",
      "memberCreatedAt",
      "agencyID",
      "topAgencyID",
      "firstDepostAt",
      "lastLoginAt",
      "loginCount",
      "lastDepositAt",
      "lastWithdrawAt",
      "lastbetAt",
      "money"
    ]
  },
  {
    label: $t("report.personalProfile"),
    value: "personalProfile",
    children: [
      "phoneCert",
      "phone",
      "nameCert",
      "memberName",
      "memberBankCard",
      "memberUsdt",
      "memberEcny",
      "eWallet",
      "registerIp",
      "vipLevel"
    ]
  },
  {
    label: $t("report.promotionActivity"),
    value: "promotionActivity",
    children: [
      "promotionCount",
      "promotionAmount",
      "totalBonusAmount",
      "otherBonusAmount",
      "promotionID"
    ]
  },
  {
    label: $t("report.depositAndWithdrawal"),
    value: "depositAndWithdrawal",
    children: [
      "depositCount",
      "withdrawCount",
      "firstDepositAmount",
      "depositAmount",
      "withdrawAmount"
    ]
  },
  {
    label: $t("report.bet"),
    value: "bet",
    children: [
      "totalBetAmount",
      "betAmount",
      "winAmount",
      "betAmountLm",
      "winAmountLm"
    ]
  }
];

/** 條件欄位元資料：取代舊 step2Schema
 * type: input | select | date | number(帶 sign 比較符號)
 */
export type FieldType = "input" | "select" | "date" | "number";
export interface FieldMeta {
  field: string;
  type: FieldType;
  labelKey: string; // report.<key>
  options?: { label: string; value: any }[];
  multiple?: boolean; // select 多選（vipLevel）
}

export const fieldMetaMap: Record<string, FieldMeta> = {
  memberStatus: {
    field: "memberStatus",
    type: "select",
    labelKey: "memberStatus",
    options: statusOptions
  },
  memberCreatedAt: {
    field: "memberCreatedAt",
    type: "date",
    labelKey: "memberCreatedAt"
  },
  agencyID: { field: "agencyID", type: "input", labelKey: "agencyID" },
  topAgencyID: { field: "topAgencyID", type: "input", labelKey: "topAgencyID" },
  firstDepostAt: {
    field: "firstDepostAt",
    type: "date",
    labelKey: "firstDepostAt"
  },
  lastLoginAt: { field: "lastLoginAt", type: "date", labelKey: "lastLoginAt" },
  loginCount: { field: "loginCount", type: "number", labelKey: "loginCount" },
  lastDepositAt: {
    field: "lastDepositAt",
    type: "date",
    labelKey: "lastDepositAt"
  },
  lastWithdrawAt: {
    field: "lastWithdrawAt",
    type: "date",
    labelKey: "lastWithdrawAt"
  },
  lastbetAt: { field: "lastbetAt", type: "date", labelKey: "lastbetAt" },
  money: { field: "money", type: "number", labelKey: "money" },
  phoneCert: {
    field: "phoneCert",
    type: "select",
    labelKey: "phoneCert",
    options: certOptions
  },
  phone: { field: "phone", type: "input", labelKey: "phone" },
  nameCert: {
    field: "nameCert",
    type: "select",
    labelKey: "nameCert",
    options: nameCertOptions
  },
  memberName: { field: "memberName", type: "input", labelKey: "memberName" },
  memberBankCard: {
    field: "memberBankCard",
    type: "select",
    labelKey: "memberBankCard",
    options: certOptions
  },
  memberUsdt: {
    field: "memberUsdt",
    type: "select",
    labelKey: "memberUsdt",
    options: certOptions
  },
  memberEcny: {
    field: "memberEcny",
    type: "select",
    labelKey: "memberEcny",
    options: certOptions
  },
  eWallet: {
    field: "eWallet",
    type: "select",
    labelKey: "eWallet",
    options: certOptions
  },
  registerIp: { field: "registerIp", type: "input", labelKey: "registerIp" },
  vipLevel: {
    field: "vipLevel",
    type: "select",
    labelKey: "vipLevel",
    options: [],
    multiple: true
  },
  promotionCount: {
    field: "promotionCount",
    type: "number",
    labelKey: "promotionCount"
  },
  promotionAmount: {
    field: "promotionAmount",
    type: "number",
    labelKey: "promotionAmount"
  },
  totalBonusAmount: {
    field: "totalBonusAmount",
    type: "number",
    labelKey: "totalBonusAmount"
  },
  otherBonusAmount: {
    field: "otherBonusAmount",
    type: "number",
    labelKey: "otherBonusAmount"
  },
  promotionID: { field: "promotionID", type: "input", labelKey: "promotionID" },
  depositCount: {
    field: "depositCount",
    type: "number",
    labelKey: "depositCount"
  },
  withdrawCount: {
    field: "withdrawCount",
    type: "number",
    labelKey: "withdrawCount"
  },
  firstDepositAmount: {
    field: "firstDepositAmount",
    type: "number",
    labelKey: "firstDepositAmount"
  },
  depositAmount: {
    field: "depositAmount",
    type: "number",
    labelKey: "depositAmount"
  },
  withdrawAmount: {
    field: "withdrawAmount",
    type: "number",
    labelKey: "withdrawAmount"
  },
  totalBetAmount: {
    field: "totalBetAmount",
    type: "number",
    labelKey: "totalBetAmount"
  },
  betAmount: { field: "betAmount", type: "number", labelKey: "betAmount" },
  winAmount: { field: "winAmount", type: "number", labelKey: "winAmount" },
  betAmountLm: {
    field: "betAmountLm",
    type: "number",
    labelKey: "betAmountLm"
  },
  winAmountLm: { field: "winAmountLm", type: "number", labelKey: "winAmountLm" }
};

/** 所有條件欄位（依分類順序攤平） */
export const allFields: string[] = selectCategory.flatMap(c => c.children);
