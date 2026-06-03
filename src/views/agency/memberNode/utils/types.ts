// 會員換線模組型別

/** 列表項 */
interface MemberNodeItem {
  memberID: number | string;
  memberAccount: string;
  memberName: string;
  orgAgencyID: number | string;
  orgAgencyAccount: string;
  newAgencyID: number | string;
  newAgencyAccount: string;
  date: string;
  remark: string;
}

/** 換線對話框表單資料 */
interface FormItemProps {
  /** 會員帳號（用於查詢會員） */
  memberAccount: string;
  /** 目標代理帳號（用於查詢代理） */
  agencyID: string;
  /** 備註（送出換線時帶上） */
  remark: string;
}

interface FormProps {
  formInline: FormItemProps;
}

/** 查詢會員回傳資料 */
interface MemberCheckData {
  id: number | string;
  name: string;
  phone: string;
  betAmount: number | string;
  totalAmount: number | string;
  depositAmount: number | string;
  parentAgencyID: number | string;
  parentAgencyName: string;
  parentAgencyAccount: string;
  memberTags: Array<{ id: number | string; name: string; color?: string }>;
}

/** 查詢代理回傳資料 */
interface AgencyCheckData {
  id: number | string;
  name: string;
  account: string;
}

export type {
  MemberNodeItem,
  FormItemProps,
  FormProps,
  MemberCheckData,
  AgencyCheckData
};
