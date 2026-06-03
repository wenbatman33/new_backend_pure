// 商戶號存提報表：列表單列資料型別
interface PayChannelReportItem {
  reportDate: string; // 日期
  serviceCode: string; // 商戶支付方式
  payChannelSn: string; // 商戶號
  depositAmount: number | string; // 存款总额(RMB)
  depositOtherAmount: number | string; // 存款总额(其他幣)
  depositNum: number | string; // 存款单数
  successDepositNum: number | string; // 存款完成数
  successDepositRate: number | string; // 存款成功率
  withdrawalAmount: number | string; // 提款总额(RMB)
  withdrawalOtherAmount: number | string; // 提款总额(其他幣)
  withdrawalNum: number | string; // 提款数
  successWithdrawalNum: number | string; // 提款完成数
  successWithdrawalRate: number | string; // 提款成功率
}

// 搜尋表單欄位
interface SearchFormProps {
  payChannelIDList: Array<number | string>; // 商戶號(多選)
  payGroupIdList: Array<number | string>; // 用戶組別(多選)
  reportDateStart: string; // 建立時間起
  reportDateEnd: string; // 建立時間迄
  completedDateStart: string; // 完成時間起
  completedDateEnd: string; // 完成時間迄
}

export type { PayChannelReportItem, SearchFormProps };
