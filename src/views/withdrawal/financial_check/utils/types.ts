// 提款財務審核 detail 頁型別

/** key/value 包裝（後端慣例：status/member/financialCheck/riskCheck 等） */
export interface KeyValue {
  key?: number;
  value?: string | any;
}

/** 提款單資料 */
export interface WithdrawalItem {
  transactionID?: string;
  id?: string;
  createdAt?: string;
  transactionTime?: string;
  amount?: string | number;
  status?: KeyValue;
  member?: KeyValue;
  financialCheck?: KeyValue;
  riskCheck?: KeyValue;
  financialCheckName?: string;
  withdrawalName?: string;
  bankcard?: string;
  bankName?: string;
  bankCode?: string;
  bankGroup?: KeyValue;
  thirdGroup?: KeyValue;
  checkNote?: string[];
  [key: string]: any;
}

/** 會員資訊（withdrawal/member/info） */
export interface MemberInfo {
  hasSuccessDeposit?: boolean;
  createdAt?: string;
  turnoverDurationStart?: string;
  turnoverDurationEnd?: string;
  needTurnover?: string | number;
  betAmount?: string | number;
  diffWithdrawLimitation?: string | number;
  [key: string]: any;
}

/** 退回/通過/送風控 對話框表單欄位 */
export interface ActionFormProps {
  /** 對話框模式：reject | pass | submitRisk */
  mode: "reject" | "pass" | "submitRisk";
  formInline: {
    transactionID?: string;
    amount?: string | number;
    transactionTime?: string;
    status?: string;
    /** 退回原因 ID（reject 用） */
    rejectID?: number | string;
    /** 退回前台說明（reject 用） */
    rejectReason?: string;
    /** 備註 */
    note?: string;
  };
  /** 退回原因下拉（reject 用），TODO: dropdown 未移植，先空陣列 */
  rejectOptions: Array<{ label: string; value: number | string }>;
}
