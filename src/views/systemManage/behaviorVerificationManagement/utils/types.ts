interface FormItemProps {
  /** 主鍵 ID */
  id: number;
  /** 廠商顯示名稱（唯讀） */
  name: string;
  /** PC App ID */
  pcAppID: string;
  /** PC App Secret */
  pcAppSecret: string;
  /** H5 App ID */
  h5AppID: string;
  /** H5 App Secret */
  h5AppSecret: string;
  /** captcha api url */
  captchaUrl: string;
  /** 廠商後台網址 */
  boUrl: string;
  /** secret id */
  secretID: string;
  /** secret key */
  secretKey: string;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
