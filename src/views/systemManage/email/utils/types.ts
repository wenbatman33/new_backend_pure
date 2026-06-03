interface FormItemProps {
  /** 主鍵 ID（編輯時帶入） */
  id?: number;
  /** 廠商名稱 */
  name: string;
  /** 寄信網域 */
  domain: string;
  /** API Key */
  key: string;
  /** 寄件者 */
  from: string;
  /** 信件主旨 */
  subject: string;
  /** 信件樣板（HTML） */
  templet: string;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
