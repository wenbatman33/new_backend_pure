// 銀行卡明細列表單筆資料
interface BankCardLogItem {
  ID: number;
  logTime: string;
  bankcardID: number;
  subjectID: number;
  /** 收支類型[1收2支] */
  type: number;
  amount: number;
  fee: number;
  balance: number;
  tradeID: number;
  thirdParty: string;
  tradeObjectType: number;
  tradeObject: string;
  note: string;
  updatedUser: string;
  updatedAt: string;
}

// 編輯備註表單
interface FormItemProps {
  /** 銀行卡明細 ID */
  bankcardLogID: number;
  /** 備註 */
  note: string;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { BankCardLogItem, FormItemProps, FormProps };
