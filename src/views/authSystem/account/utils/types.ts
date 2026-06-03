// 帳號表單欄位（新增/編輯共用）
interface FormItemProps {
  /** 主鍵 ID（編輯時帶入） */
  adminID?: number;
  /** 帳號 */
  account: string;
  /** 密碼（新增時必填） */
  password: string;
  /** 確認密碼 */
  password2: string;
  /** 姓名 */
  name: string;
  /** Email */
  email: string;
  /** 部門 ID */
  deptID: number | "";
  /** 職稱 */
  title: string;
  /** VPN IP */
  vpnIP: string;
  /** 備註分類 */
  commentCategory: string;
  /** 狀態：1 啟用 / 2 停用 */
  status: number;
  /** 功能角色 ID */
  fnRole: number | "";
  /** 標籤 ID */
  tagID: number | "" | null;
  /** 是否為編輯模式 */
  isUpdate: boolean;
}

interface FormProps {
  formInline: FormItemProps;
  /** 部門下拉選項 */
  deptList: OptionItem[];
  /** 功能角色下拉選項 */
  roleList: OptionItem[];
  /** 標籤下拉選項 */
  tagList: OptionItem[];
}

// 修改密碼表單欄位
interface PasswordItemProps {
  adminID?: number;
  account?: string;
  newpassword: string;
  password2: string;
}

interface PasswordProps {
  formInline: PasswordItemProps;
}

interface OptionItem {
  label: string;
  value: number | string;
}

export type {
  FormItemProps,
  FormProps,
  PasswordItemProps,
  PasswordProps,
  OptionItem
};
