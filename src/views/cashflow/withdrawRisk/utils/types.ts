/** key/value 物件（後端常見回傳格式，key 為狀態碼，value 為文字） */
interface KeyValueItem {
  key: number;
  value: string;
}

/** 提款風控列表單筆資料 */
interface WithdrawRiskItem {
  /** 交易單號 */
  transactionID: string;
  /** 提款交易時間 */
  transactionTime: string;
  /** 代理 ID */
  agencyID: string;
  /** 會員（key=memberID, value.account=帳號） */
  member: { key: string; value: { account: string } };
  /** 提款戶名 */
  bankAccount: string;
  /** 狀態 */
  status: KeyValueItem;
  /** 提款金額 */
  amount: number;
  /** 銀行名稱 */
  bankName: string;
  /** 銀行代碼 */
  bankCode: string;
  /** 會員銀行帳號 */
  memberBankNo: string;
  /** 財務審核 */
  financialCheck: KeyValueItem;
  /** 風控狀態 */
  riskCheck: KeyValueItem;
  /** 風控審核人員 */
  riskCheckName: string;
  /** 最後更新時間 */
  lastUpdate: string;
  /** 更新人員 */
  updatedBy: string;
  /** 備註 */
  remark: string;
}

/** 搜尋條件 */
interface SearchFormProps {
  /** 提款交易時間 起 */
  withdrawalStart: string;
  /** 提款交易時間 迄 */
  withdrawalEnd: string;
  /** 會員帳號 */
  memberAccount: string;
  /** 交易單號 */
  orderSn: string;
  /** 狀態（Number.MIN_VALUE 代表全部） */
  status: number;
  /** 最後更新 起 */
  updatedStart: string;
  /** 最後更新 迄 */
  updatedEnd: string;
  /** 風控狀態 */
  riskCheck: number;
  /** 風控審核人員 */
  riskAuditName: string;
  /** 風控審核分鐘數 */
  riskAuditMinutes: string;
}

/** 審核查詢對話框表單 */
interface AuditFormItemProps {
  /** 會員 ID */
  memberID: string;
  /** 會員帳號 */
  memberAccount: string;
  /** 起始時間 */
  startTime: string;
  /** 結束時間 */
  endTime: string;
  /** 是否隱藏遊戲資金 */
  hiddenGameMoney: boolean;
}

interface AuditFormProps {
  formInline: AuditFormItemProps;
}

export type {
  KeyValueItem,
  WithdrawRiskItem,
  SearchFormProps,
  AuditFormItemProps,
  AuditFormProps
};
