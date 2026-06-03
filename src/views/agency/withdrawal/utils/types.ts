// key/value 結構（後端常見回傳）
interface KeyValueItem {
  key: number;
  value: string;
}

interface MemberKeyValueItem {
  key: number | string;
  value: { account: string };
}

// 提款列表單筆
interface WithdrawalItem {
  transactionID: string;
  transactionTime: string;
  amount: number | string;
  member: MemberKeyValueItem;
  bankAccount: string;
  snList: string[] | string;
  bankCode: string;
  bankName: string;
  memberBankNo: string;
  status: KeyValueItem;
  financialCheck: KeyValueItem;
  riskCheck: KeyValueItem;
  lastUpdate: string;
  updatedBy: string;
}

// 新增提款表單
interface FormItemProps {
  /** 提款金額 */
  amount: number | string;
  /** 提款方式：1 銀行卡 / 2 USDT-ERC / 3 USDT-TRC / 4 其他 */
  type: number;
  /** 是否使用既有帳號 */
  useExists: boolean;
  /** 既有帳號 ID */
  existsID?: number;
  /** 提款戶名 */
  withdrawalName?: string;
  /** 銀行卡號 */
  bankcard?: string;
}

interface FormProps {
  formInline: FormItemProps;
}

export type {
  KeyValueItem,
  MemberKeyValueItem,
  WithdrawalItem,
  FormItemProps,
  FormProps
};
