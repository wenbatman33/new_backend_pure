// 出款頁型別定義

// 鍵值物件（後端慣用 key/value 結構）
interface KeyValueItem {
  key?: number;
  value?: string;
}

// 出款單列（payout 表格的一列）
interface PayoutItem {
  id?: number;
  send_id?: string;
  amount?: number;
  payType?: KeyValueItem;
  payID?: KeyValueItem;
  fee?: number;
  otherAmount?: number;
  exchangeRate?: number;
  status?: KeyValueItem;
  thirdSn?: string;
  editorName?: string;
  updatedAt?: string;
}

// 編輯出款單狀態（轉成功/轉失敗）表單欄位
interface FormItemProps {
  // 1 轉失敗 2 轉成功
  status: number;
  // 備註原因
  reason: string;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { KeyValueItem, PayoutItem, FormItemProps, FormProps };
