// 商戶名（商戶列表項）
interface PayChannelNameItem {
  id: number;
  name: string;
}

// 新增/編輯商戶號表單欄位
interface FormItemProps {
  /** 編輯時的商戶號 id */
  id?: number;
  /** 商戶 id（對應 payChannelNameID） */
  payChannelNameID: number | "";
  /** 商戶號 */
  sn: string;
  /** 結算方式 T0:0 T1:1 D0:2 D1:3 */
  method: number;
  /** 是否支援代付 */
  supplyAp: boolean;
  /** 代付每筆下限 */
  apLowerLimit: number;
  /** 代付每筆上限 */
  apUpperLimit: number;
  /** 代付每日上限 */
  apDayLimit: number;
  /** 商戶號充值上限 */
  depositLimit: number | string;
  /** 備註 */
  note: string;
  /** 狀態 1:啟用 2:停用 */
  status: number;
}

interface FormProps {
  formInline: FormItemProps;
  /** 商戶下拉清單 */
  nameList: PayChannelNameItem[];
}

// 新增商戶名表單
interface NameFormItemProps {
  name: string;
}
interface NameFormProps {
  formInline: NameFormItemProps;
}

// 線下 Gcash 商戶名表單
interface GcashFormItemProps {
  name: string;
  phone: string;
  qrcode: string;
}
interface GcashFormProps {
  formInline: GcashFormItemProps;
}

// 充值 / 結算（餘額異動）表單
interface AmountFormItemProps {
  amount: number | string;
  fee: number | string;
  thirdID: string;
  note: string;
}
interface AmountFormProps {
  formInline: AmountFormItemProps;
}

export type {
  PayChannelNameItem,
  FormItemProps,
  FormProps,
  NameFormItemProps,
  NameFormProps,
  GcashFormItemProps,
  GcashFormProps,
  AmountFormItemProps,
  AmountFormProps
};
