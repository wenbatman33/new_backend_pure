// 下拉選單項目（後端回傳 { key, value } 結構）
interface DropdownItem {
  key: string;
  value: string;
}

// 優惠列表單筆資料
interface PromotionItem {
  ID: number;
  name: string;
  internalName?: string;
  promotionCondTypes?: number[];
  status: number; // 1 啟用 2 停用
  startTime: string;
  endTime: string;
  updatedAt: string;
  freedom: number; // 1 後台機制 2 獨立機制 3 指定存款
  code: string;
  online: number; // 1 線上 2 線下
  updatedUser: string;
  walletType?: number;
  [key: string]: any;
}

// 搜尋表單
interface SearchFormProps {
  ID: string;
  name: string;
  promotionCondType: string;
  status: string;
  activity: string;
  online: string | number;
  startTime: string;
  endTime: string;
  walletType: string | number;
  eventCode: string;
  freedom: string | number;
  internalName: string;
}

export type { DropdownItem, PromotionItem, SearchFormProps };
