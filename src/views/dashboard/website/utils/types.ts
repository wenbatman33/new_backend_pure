// 整站即時報表（每小時）資料結構，所有欄位皆為長度 23 的數值陣列
interface HourReport {
  winAmount?: number[]; // 每小時盈利
  totalWinAmount?: number[]; // 累積盈利
  registerMember?: number[]; // 每小時註冊數
  totalRegisterMember?: number[]; // 累積註冊數
  firstDepositMember?: number[]; // 每小時首存數
  totalFirstDepositMember?: number[]; // 累積首存數
  gameMember?: number[]; // 每小時遊戲人數
  rechargeMember?: number[]; // 每小時唯一存款人數
  withdrawMember?: number[]; // 每小時唯一提款人數
  rechargeAmount?: number[]; // 存款金額
  withdrawAmount?: number[]; // 提款金額
  rechargeCount?: number[]; // 存款次數
  withdrawCount?: number[]; // 提款次數
}

export type { HourReport };
