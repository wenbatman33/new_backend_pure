// 速度報表 API 回傳資料結構
export interface SpeedResult {
  depositTotalSpeed: number; // 存款平均完成速度
  withdrawalTotalSpeed: number; // 提款平均完成速度
  // 以下皆為長度 24 的陣列（對應 0~23 時段）
  depositCount: (number | string)[]; // 存款筆數
  depositAmount: (number | string)[]; // 存款金額
  depositSpeed: (number | string)[]; // 存款每筆完成速度（秒）
  withdrawalCount: (number | string)[]; // 提款筆數
  withdrawalAmount: (number | string)[]; // 提款金額
  withdrawalSpeed: (number | string)[]; // 提款每筆完成速度（秒）
  payoutSpeed: (number | string)[]; // 出款時間（秒）
  withdrawalRiskCheckSpeed: (number | string)[]; // 風控審核時間（秒）
  withdrawalFinancialCheckSpeed: (number | string)[]; // 財務審核時間（秒）
}

// 表格列：title + 0~23 共 24 個時段欄位
export type SpeedRow = {
  title: string;
} & Record<string, number | string>;

// 搜尋表單
export interface SpeedSearchForm {
  date: string;
}
