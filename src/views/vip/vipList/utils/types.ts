interface FormItemProps {
  /** 會員帳號 */
  account: string;
  /** 期數（單一日期，格式 YYYY-MM-DD） */
  peroid: string;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
