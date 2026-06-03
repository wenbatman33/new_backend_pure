/** 代理錢包人工操作 - 調整表單欄位 */
interface FormItemProps {
  /** 異動類型：1 系統上分 / 2 系統下分 / 3 會員下分 / 4 會員上分 */
  type: number | "";
  /** 會員帳號（type===3 時填寫） */
  refMemberAccount: string;
  /** 金額 */
  amount: number;
  /** 流水倍數 */
  turnoverLimit: number;
  /** 備註 */
  remark: string;
}

interface FormProps {
  formInline: FormItemProps;
}

/** 搜尋條件 */
interface SearchFormProps {
  agencyID: string;
  agencyAccount: string;
  exactlyMatching: number;
  type: number;
  status: number;
  applyStartTime: string;
  applyEndTime: string;
  reviewStartTime: string;
  reviewEndTime: string;
}

export type { FormItemProps, FormProps, SearchFormProps };
