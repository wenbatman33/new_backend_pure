interface MemberItem {
  id: number;
  account: string;
  name: string;
  phone: string;
  email?: string;
  money: number | string;
  isFirstDeposit?: number;
  vipLevel?: number | string;
  current_status?: number;
  deposit_limit?: number;
  withdraw_limit?: number;
  status?: number;
  created_at?: string;
  last_login_at?: string;
  register_ip?: string;
  register_area?: string;
  last_login_ip?: string;
  last_login_area?: string;
  topAgencyID?: number | string;
  agency_id?: number | string;
  recommenderAccount?: string;
  payment_groups?: string;
  bankcard_groups?: string;
  careerDepositAmount?: number | string;
  careerWithdrawAmount?: number | string;
  [key: string]: any;
}

/** 搜尋表單欄位 */
interface SearchFormProps {
  id: string;
  account: string;
  name: string;
  phone: string;
  email: string;
  vip_level: string | number | "";
  status: number | "";
  deposit_limit: number | "";
  withdraw_limit: number | "";
  created_at_start: string;
  created_at_end: string;
  registerArea: string;
  registerIp: string;
  topAgencyID: string;
  recommenderAccount: string;
  loginDeviceID: string;
}

export type { MemberItem, SearchFormProps };
