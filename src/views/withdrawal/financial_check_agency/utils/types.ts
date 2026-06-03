// 代理提款財審詳情頁型別

/** 鍵值結構（後端常見 {key,value} 形式） */
export interface KeyValue {
  key?: number;
  value?: string;
}

/** 代理提款 / 會員資訊詳情 */
export interface AgencyWithdrawDetail {
  agencyID?: number;
  agencyAccount?: string;
  /** 提款單號 */
  id?: string;
  createdAt?: string;
  amount?: number | string;
  statusStr?: string;
  bankName?: string;
  bankcard?: string;
  thirdID?: string;
  /** 是否曾成功儲值 */
  hasSuccessDeposit?: boolean;
  /** 代理可提款狀態 */
  agencyWithdrawStatus?: boolean;
  limitLower?: number | string;
  limitUpper?: number | string;
  limitStatus?: boolean;
  withdrawDayLimit?: number | string;
  dayUpperStatus?: boolean;
  todayDepositAmount?: number | string;
  spread?: number | string;
  money?: number | string;
  lockMoney?: number | string;
  todayWithdrawalAmount?: number | string;
  /** 流水差 */
  turnover?: number | string;
  turnoverStatus?: boolean;
}

/** 提款單項目 */
export interface WithdrawalItem {
  transactionID?: string;
  transactionTime?: string;
  amount?: number | string;
  bankCode?: string;
  status?: KeyValue;
  financialCheck?: KeyValue;
  updatedBy?: string;
  checkNote?: string[];
  [key: string]: any;
}

/** 錢包異動記錄 */
export interface WalletLogItem {
  date?: string;
  inOut?: number;
  type?: number;
  before?: number | string;
  amount?: number | string;
  after?: number | string;
  turnoverMultiple?: number | string;
  turnoverLimit?: number | string;
  note?: string;
  refID?: string;
}

/** 進出款型別 */
export interface InOutType {
  inOutTypeID?: number;
  inOutTypeName?: string;
}

/** 使用型別 */
export interface UseType {
  useTypeID?: number;
  useTypeName?: string;
  useTypeEnName?: string;
}

/** 退回 / 通過彈窗表單 */
export interface FormItemProps {
  /** 提款單號（唯讀顯示） */
  transactionID?: string;
  /** 提款金額（唯讀顯示） */
  amount?: number | string;
  /** 申請時間（唯讀顯示） */
  transactionTime?: string;
  /** 退回原因 ID（reject 用） */
  rejectID?: string | number;
  /** 備註 */
  note?: string;
  /** 是否為退回模式（true=reject / false=pass） */
  isReject?: boolean;
}

export interface FormProps {
  formInline: FormItemProps;
}
