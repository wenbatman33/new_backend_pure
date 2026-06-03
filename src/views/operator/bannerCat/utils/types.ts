interface FormItemProps {
  /** id（編輯時帶入） */
  id?: number;
  /** 分類名稱 */
  name: string;
  /** 分類說明 */
  description: string;
  /** 是否隱藏 */
  hidden: boolean;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
