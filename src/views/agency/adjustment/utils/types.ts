// 代理上下分申請單列表項
interface AdjustmentItem {
  id?: number;
  subject?: string;
  type?: number;
  status?: number;
  applyAdminAccount?: string;
  applyDate?: string;
  reviewAdminAccount?: string;
  reviewDate?: string;
  desc?: string;
  applyCount?: number;
  auditCount?: number;
  turnoverTimes?: number;
}

// 詳情/審核單裡的單筆代理申請
interface AdjustmentDetailListItem {
  id?: number;
  agencyID?: number;
  agencyAccount?: string;
  memberID?: number;
  memberAccount?: string;
  status?: number;
  amount?: number;
  remark?: string;
}

// 詳情/審核單完整結構
interface AdjustmentDetail extends AdjustmentItem {
  list?: AdjustmentDetailListItem[];
}

// 操作紀錄
interface AdjustmentLogItem {
  action?: string;
  operator?: string;
  updatedAt?: string;
}

// 新增申請單表單
interface AdjustFormItemProps {
  // 名稱
  subject: string;
  // 異動類型[1特殊上分2傭金派發3會員上分4特殊扣款]
  type: number;
  // 流水倍數
  turnoverTimes: number | string;
  // 備註
  desc: string;
  // 代理帳號 + 金額清單
  targetList: { agencyAccount: string; amount: number | string }[];
}

interface AdjustFormProps {
  formInline: AdjustFormItemProps;
}

// 審核表單
interface ReviewFormProps {
  // 詳情資料
  detail: AdjustmentDetail;
  // 是否已審核（已審核則為唯讀詳情）
  isReviewed: boolean;
}

export type {
  AdjustmentItem,
  AdjustmentDetailListItem,
  AdjustmentDetail,
  AdjustmentLogItem,
  AdjustFormItemProps,
  AdjustFormProps,
  ReviewFormProps
};
