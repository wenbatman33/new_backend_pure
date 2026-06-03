// 鍵值物件：key 傳後端、value 前台顯示
interface KeyValueItem {
  key?: number;
  value?: string;
}

// 會員鍵值物件
interface MemberKeyValueItem {
  key?: number;
  value?: {
    account: string;
    name: string;
  };
}

// 提款單列表項目
interface WithdrawalItem {
  transactionID?: string;
  transactionTime?: string;
  transactionTimeUTC?: string;
  amount?: number;
  payAmount?: number;
  status?: KeyValueItem;
  bankGroup?: KeyValueItem;
  thirdGroup?: KeyValueItem;
  member?: MemberKeyValueItem;
  bankAccount?: string;
  bankCode?: string;
  bankName?: string;
  memberBankNo?: string;
  snList?: string[];
  agencyName?: string;
  agencyID?: string;
  financialCheck?: KeyValueItem;
  riskCheck?: KeyValueItem;
  riskCheckName?: string;
  lastUpdate?: string;
  lastUpdateUTC?: string;
  updatedBy?: string;
  remark?: string;
  creditDate?: string;
  isWithdrawalColor?: boolean;
}

// 搜尋表單
interface SearchFormProps {
  withdrawalStart: string;
  withdrawalEnd: string;
  memberAccount: string;
  orderSn: string;
  status: number;
  withdrawalName: string;
  bankName: string;
  bankcardNo: string;
  updatedStart: string;
  updatedEnd: string;
  riskCheck: number;
  payGroupID: number;
  bankcardGroupID: number;
  riskAuditName: string;
  riskAuditMinutes: string;
  snList: string;
}

export type {
  KeyValueItem,
  MemberKeyValueItem,
  WithdrawalItem,
  SearchFormProps
};
