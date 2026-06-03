// 下拉項目
interface OptionItem {
  label: string;
  value: string | number;
}

// 搜尋表單欄位
interface SearchFormProps {
  reportDateStart: string;
  reportHourStart: string;
  reportDateEnd: string;
  reportHourEnd: string;
  payChannelServiceID: string | number | "";
  serviceCode: string;
}

// 進款統計報表回傳資料結構
interface DepositReportResult {
  // 線路名稱對照（key -> 顯示名稱）
  channels?: Record<string, string> | string[];
  // 報表列資料（每列含 date / time / {channel}_amount / {channel}_count）
  list?: Record<string, any> | any[];
  count?: number;
  updatedAt?: string;
}

export type { OptionItem, SearchFormProps, DepositReportResult };
