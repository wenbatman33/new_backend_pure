interface FormItemProps {
  /** 編輯時的主鍵 id */
  id?: string | number;
  /** IP 位址（新增必填；編輯時唯讀） */
  ip: string;
  /** 原因 */
  reason: string;
}

interface FormProps {
  formInline: FormItemProps;
  /** 是否為編輯模式（編輯時 IP 唯讀） */
  isEdit: boolean;
}

export type { FormItemProps, FormProps };
