// 代理申請 列表項
interface AgencyApplicationItem {
  id: number;
  businessType: number; // 0 直營 / 1 全反水 / 2 淨利
  memberID: number | string;
  agencyAccount: string;
  name: string;
  phone: string;
  email?: string;
  telegram?: string;
  whatsapp?: string;
  qqAccount?: string;
  wechatAccount?: string;
  createdAt: string;
  reviewTime: string;
  adminAccount?: string;
  adminUserID?: string;
  auditStatus: number; // 1 待審核 / 2 通過 / 3 拒絕
  remark?: string;
  promoteDescription?: string;
}

// 搜尋表單
interface SearchFormProps {
  id: string;
  agencyAccount: string;
  memberAccount: string;
  exactlyMatching: boolean;
  auditStatus: number;
  applicationStartTime: string;
  applicationEndTime: string;
  reviewStartTime: string;
  reviewEndTime: string;
}

// 審核表單項
interface AuditFormItemProps {
  calculative: boolean;
  remark: string;
  agencyAccount: string;
  isFirstLayerAgency: number; // 1 是 / 2 否
  rankGroupID: number | "";
  offerPercent: number;
  businessType: number;
  netProfitBase: number;
  totalBonus: boolean;
  totalCharge: boolean;
  platformCharge: boolean;
  billingCycle: string;
}

interface AuditFormProps {
  formInline: AuditFormItemProps;
  detail: AgencyApplicationItem;
  rankGroupOptions: { label: string; value: number }[];
}

export type {
  AgencyApplicationItem,
  SearchFormProps,
  AuditFormItemProps,
  AuditFormProps
};
