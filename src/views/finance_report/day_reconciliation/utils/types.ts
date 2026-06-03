// 日對帳報表 - 列表單筆資料結構
interface DayReconciliationItem {
  id: number;
  payChannelSn: string; // 商戶號
  payChannelName: string; // 商戶名稱
  serviceName: string; // 支付方式
  serviceCode: string;
  startingSystemBalance: number; // 系統餘額(起始時間)
  depositAmount: number; // 代收金額
  payoutAmount: number; // 代付金額
  payoutNum: number; // 代付筆數
  settlementUAmount: number; // 已發金額
  settlementUNum: number; // 已發筆數
  frozenAmount: number; // 商戶號凍結金額
  endingSystemBalance: number; // 系統餘額(結束時間)
  endingChannelBalance: number; // 三方餘額(結束時間)
  endingBalanceDiff: number; // 差異
  note: string; // 備註
}

// 搜尋條件
interface SearchFormProps {
  reportDateStart: string;
  reportDateEnd: string;
  payChannelName: string;
  payChannelSn: string;
  balanceDiff: number;
  balanceChange: number;
}

export type { DayReconciliationItem, SearchFormProps };
