// 會員提款統計報表搜尋條件
interface SearchFormProps {
  reportDateStart: string; // 提款日期-起
  reportDateEnd: string; // 提款日期-迄
  currency: number | string; // 幣別
  showNum: number | string; // 顯示筆數
  paymentGroup: number | string; // 三方金流群組
  bankcardGroup: number | string; // 銀行卡金流群組
}

// 單列報表資料
interface ReportItem {
  memberID?: number;
  memberName?: string;
  amount?: number | string; // 提款金額
  maxAmount?: number | string; // 單筆最大金額
  minAmount?: number | string; // 單筆最小金額
  avgAmount?: number | string; // 平均提款金額
  dayAvgAmount?: number | string; // 日均提款金額
  payGroupName?: string; // 三方金流群組
  bankGroupName?: string; // 銀行卡金流群組
  registedDate?: string; // 註冊日期
}

export type { SearchFormProps, ReportItem };
