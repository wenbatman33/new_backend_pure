// 網站功能設定表單型別（前端布林表現；送出時轉 1/2）
interface SiteFunctionForm {
  phone_edit: boolean;
  phone_active: boolean;
  child_account: boolean;
  subagency_benefits: boolean;
  modify_password_mode: number;
  modify_withdraw_password_mode: number;
  create_new_member: boolean;
  create_new_member_black_list: string;
}

// 後端回傳的原始設定（以 1/2 表示開關）
interface SiteFunctionSettings {
  phone_edit: number;
  phone_active: number;
  child_account: number;
  subagency_benefits: number;
  modify_password_mode: number;
  modify_withdraw_password_mode: number;
  create_new_member: number;
  create_new_member_black_list: string;
}

export type { SiteFunctionForm, SiteFunctionSettings };
