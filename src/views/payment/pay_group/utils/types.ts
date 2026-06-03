/** 金流組別（三方）新增/編輯表單欄位 */
interface FormItemProps {
  /** 當前編輯 ID（新增時為 0） */
  ID: number;
  /** 群組中文名稱 */
  name: string;
  /** 群組英文名稱 */
  nameEn: string;
  /** 來源 [1會員 2代理] */
  source: number | string;
  /** 存款單筆下限 */
  depositLower: number | string;
  /** 存款單筆上限 */
  depositUpper: number | string;
  /** 備註 */
  remark: string;
  /** 是否為編輯模式 */
  isUpdate: boolean;
}

interface FormProps {
  formInline: FormItemProps;
}

/** 加入會員 / 加入代理表單欄位 */
interface MemberFormItemProps {
  /** 群組 ID */
  payGroupID: number;
  /** 群組中文名稱（顯示用） */
  name: string;
  /** 群組英文名稱（顯示用） */
  nameEn: string;
  /** 帳號（可多筆，一行一個） */
  accounts: string;
}

interface MemberFormProps {
  formInline: MemberFormItemProps;
}

export type {
  FormItemProps,
  FormProps,
  MemberFormItemProps,
  MemberFormProps
};
