// 提款資料列表項目
interface WithdrawalInfoItem {
  userID: number;
  userAccount: string;
  name: string;
  serviceCode: string;
  serviceName: string;
  address: string;
  bankName: string;
  bankCode: string;
  area: string;
  branch: string;
  isDefault: number; // 1 是 / 0 否
  status: number; // 1 啟用 / 0 停用
  createdAt: string;
  updatedAt: string;
}

// 服務代碼下拉選項
interface ServiceOption {
  serviceCode: string;
  name: string;
}

export type { WithdrawalInfoItem, ServiceOption };
