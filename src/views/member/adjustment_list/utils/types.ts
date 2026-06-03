// 調整單列表搜尋表單欄位型別
interface SearchFormProps {
  memberName: string;
  reason: string | number;
  status: string | number;
  adjustmentType: string | number;
  transactionID: string;
  updateUser: string;
  amountTimes: string;
  verifyDateStart: string;
  verifyDateEnd: string;
}

export type { SearchFormProps };
