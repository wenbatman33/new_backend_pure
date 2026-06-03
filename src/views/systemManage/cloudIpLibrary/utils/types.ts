interface FormItemProps {
  /** ID（編輯時帶入） */
  id?: number;
  /** IP 段（CIDR） */
  ipRange: string;
  /** 名稱 */
  name: string;
  /** 分類 */
  category: string;
  /** 來源 */
  source: string;
  /** 備註 */
  remark: string;
  /** 狀態：1 啟用 / 2 停用 */
  status: number;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
