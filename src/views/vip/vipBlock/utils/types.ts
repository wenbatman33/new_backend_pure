interface FormItemProps {
  /** 會員帳號（新增時可多筆，以逗號分隔） */
  memberAccounts: string;
  /** 黑名單型別（多選）：1 禮金 / 2 反水 */
  types: number[];
  /** 原因 */
  reason: string;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
