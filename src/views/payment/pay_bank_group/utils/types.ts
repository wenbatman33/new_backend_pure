interface FormItemProps {
  /** 主鍵 ID（編輯時帶入） */
  ID?: number;
  /** 組別名稱 */
  name: string;
  /** 組別名稱（英文） */
  nameEn: string;
  /** 來源：1 會員 / 2 代理 */
  source: number | string;
  /** 入款下限 */
  depositLower: number | string;
  /** 入款上限 */
  depositUpper: number | string;
  /** 備註 */
  remark?: string;
}

interface FormProps {
  formInline: FormItemProps;
  /** 是否為編輯模式 */
  isUpdate: boolean;
}

/** 加入會員 / 加入代理 對話框表單 */
interface AccountFormItemProps {
  /** 帳號（多筆，以換行/逗號分隔） */
  accounts: string;
}

interface AccountFormProps {
  formInline: AccountFormItemProps;
  /** 是會員(member) 還是代理(agency) */
  mode: "member" | "agency";
}

export type {
  FormItemProps,
  FormProps,
  AccountFormItemProps,
  AccountFormProps
};
