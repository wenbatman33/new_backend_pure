// 會員存款報表搜尋表單型別
interface SearchFormProps {
  reportDateStart: string;
  reportDateEnd: string;
  currency: string | number;
  showNum: string | number;
  paymentGroup: string | number;
  bankcardGroup: string | number;
}

// 表格列資料型別
interface MemberReportItem {
  memberID?: number | string;
  memberName?: string;
  amount?: string | number;
  maxAmount?: string | number;
  minAmount?: string | number;
  avgAmount?: string | number;
  dayAvgAmount?: string | number;
  payGroupName?: string;
  bankGroupName?: string;
  registedDate?: string;
}

export type { SearchFormProps, MemberReportItem };
