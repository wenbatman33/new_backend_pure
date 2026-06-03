// 銀行卡查詢 列表項型別
interface BankCardItem {
  memberId: number | string;
  memberAccount: string;
  type: number; // 1 銀行卡 / 2 USDT / 3 ecny / 4 手機 / 5 其他
  name: string;
  serviceCode: string;
  address: string;
  bankCode: string;
  area: string;
  branch: string;
  isDefault: number; // 1 是 / 0 否
  status: number; // 1 啟用 / 其他 停用
  createdAt: string;
  updatedAt: string;
}

// 搜尋表單（bankNo 與 type 為必填）
interface SearchFormProps {
  bankNo: string;
  type: number | string;
}

export type { BankCardItem, SearchFormProps };
