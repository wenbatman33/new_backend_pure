// 代理出款（手動拆單）相關型別

// key-value 結構（後端常見回傳）
export interface KeyValueItem {
  key?: number | string;
  value?: string | number;
}

// 單筆出款項目
export interface PayoutItem {
  id?: number;
  send_id?: string | number;
  amount?: number;
  payType?: KeyValueItem;
  payID?: KeyValueItem;
  fee?: number;
  otherAmount?: number;
  exchangeRate?: number;
  status?: KeyValueItem;
  updatedAt?: string;
  thirdSn?: string;
  editorName?: string;
}

// 出款資訊（getPayoutInfo 回傳）
export interface PayoutInfo {
  payAmount?: number;
  payouts?: PayoutItem[];
}

// 提款主資料
export interface WithdrawalData {
  id?: number | string;
  createdAt?: string;
  amount?: number;
  statusStr?: string;
  status?: number | KeyValueItem;
  agencyAccount?: string;
  bankName?: string;
  bankcard?: string;
  thirdID?: string;
  member?: KeyValueItem;
}

// 銀行卡
export interface BankcardItem {
  ID?: number;
  cardNo?: string;
}

// 三方通道
export interface PayChannelItem {
  id?: number;
  name?: string;
  sn?: string;
  apFee?: number;
  apPerFee?: number;
}

// USDT 卡
export interface UsdtItem {
  id?: number;
  name?: string;
  address?: string;
}

// 出款 form（editForm 對話框）
export interface FormItemProps {
  status: number | "";
  reason: string;
}

export interface FormProps {
  formInline: FormItemProps;
}
