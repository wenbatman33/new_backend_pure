interface FormItemProps {
  /** 結算方式類型 type 2 為銀行卡組別 */
  type?: number | string;
  /** 線路ID */
  id?: number | string;
  /** 商戶ID */
  payChannelID?: number | string;
  /** 狀態 1啟用 0停用 */
  status?: number | string;
  /** 是否顯示 1是 2否 */
  show?: number | string;
  /** 線路名稱 */
  name?: string;
  /** 支援裝置 */
  device?: string;
  /** 排序權重 */
  weight?: number | string;
  /** 支付方式（多選） */
  serviceCode?: string[];
  /** QRcode 圖片 */
  qrcodeImage?: string;
  /** 前台顯示名稱 */
  displayName?: string;
  /** 備註 */
  note?: string;
  /** 單筆下限 */
  lowerLimit?: number | string;
  /** 單筆上限 */
  upperLimit?: number | string;
  /** 每日限額 */
  dayLimit?: number | string;
  /** 每千手續費 */
  fee?: number | string;
  /** 每筆手續費 */
  perFee?: number | string;
}

interface FormProps {
  formInline: FormItemProps;
  /** 模式 Create / Edit / ShowRowData */
  mode: string;
  /** 支付方式下拉選項 */
  serviceCodeOptions: Array<{ label: any; value: any }>;
  /** 商戶號下拉選項 */
  payChannelOptions: Array<{ label: any; value: any }>;
  /** 是否顯示前台名稱欄位 */
  showFrontDeskName: boolean;
}

/** 金流群組設定（穿梭框）項目 */
interface GroupTransferItem {
  key: string;
  label: string;
  value: any;
  type: number;
}

export type { FormItemProps, FormProps, GroupTransferItem };
