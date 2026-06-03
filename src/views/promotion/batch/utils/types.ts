// 批次派發列表 row
interface BatchItem {
  ID: number;
  batchID: number;
  promotionID: number;
  promotionName: string;
  internalName: string;
  batchCycle: string;
  sendWay: number;
  totalAmount: number;
  memberNumber: number;
  memberFailNumber: number;
  sendAt: string;
  updatedUser: string;
}

// 搜尋表單
interface SearchFormProps {
  promotionID: string;
  promotionName: string;
  batchID: string;
  sendAtStart: string;
  sendAtEnd: string;
  send_way: string | number;
  internalName: string;
}

// 審核列表 row
interface ApproveItem {
  ID: number;
  memberAccount: string;
  bonus: number;
  promotionCondRange: { rangeMin: number; rangeMax: number; amount: number }[];
  createdAt: string;
  updatedAt: string;
  updatedUser: string;
}

export type { BatchItem, SearchFormProps, ApproveItem };
