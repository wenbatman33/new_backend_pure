// 手動上下分申請列表項目
interface AdjustmentItem {
  adjustmentID: number;
  subject: string;
  type: number;
  reason: number;
  description: string;
  feDescription?: string;
  status: number;
  createdAt: string;
  updatedAt: string;
  applyCount: number;
  passCount: number;
  adjustmentType: string;
  amountTimes?: string;
  currency?: string;
  createUser?: string;
  verifyUser?: string;
  memberList?: AdjustmentMember[];
}

// 申請名單內的會員（審核用）
interface AdjustmentMember {
  memberID: number;
  memberAccount: string;
  amount: number | string;
  status: number; // 1 同意 / 2 不同意
  reason: string;
  lockID?: number;
}

// 搜尋表單
interface SearchFormProps {
  subject: string;
  status: number;
  type: number;
  start: string;
  end: string;
}

export type { AdjustmentItem, AdjustmentMember, SearchFormProps };
