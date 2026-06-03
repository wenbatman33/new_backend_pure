// 時段對帳報表（hour_reconciliation）型別

// 單筆對帳資料列
interface ReconciliationRow {
  id?: number;
  payChannelSn?: string;
  payChannelName?: string;
  serviceCode?: string;
  startingSystemBalance?: number;
  depositAmount?: number;
  payoutAmount?: number;
  payoutNum?: number;
  settlementUAmount?: number;
  settlementUNum?: number;
  frozenAmount?: number;
  endingSystemBalance?: number;
  endingChannelBalance?: number;
  endingBalanceDiff?: number;
  note?: string;
}

// 單一時段表（後端以時段名稱為 key，value 為此結構）
interface ShiftTable {
  list: ReconciliationRow[];
}

// 搜尋條件
interface SearchFormProps {
  reportDateStart: string;
  reportDateEnd: string;
  shift: number;
  payChannelName: string;
  payChannelSn: string;
  balanceDiff: number;
  balanceChange: number;
}

export type { ReconciliationRow, ShiftTable, SearchFormProps };
