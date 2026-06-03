// 子代理申請列表項目
interface ChildApplicationItem {
  id: number | string;
  agencyID: number | string;
  agencyAccount: string;
  childAgencyID: number | string;
  childAgencyAccount: string;
  applyTime: string;
  reviewTime: string;
  auditStatus: number; // 1 待审核 2 通过 3 拒绝
  adminAccount: string;
}

// 詳情/審核資料結構
interface ChildApplicationDetail {
  id: number | string;
  agencyAccount: string;
  agencyName: string;
  applyTime: string;
  childAgencyAccount: string;
  childAgencyName: string;
  reviewTime: string;
  auditStatus: number;
  agencyRemark: string;
  remark: string;
  childAgencyApplyTime?: string;
  childAgencyReviewTime?: string;
}

// 審核表單（備註）
interface AuditFormProps {
  formInline: {
    id: number | string;
    remark: string;
    detail: ChildApplicationDetail;
  };
}

export type { ChildApplicationItem, ChildApplicationDetail, AuditFormProps };
