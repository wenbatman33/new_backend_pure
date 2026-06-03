// 會員明細 - 型別定義

// 會員主資料（僅列出頁面實際讀取的欄位，其餘以索引簽章承接）
interface MemberDetail {
  id?: number;
  account?: string;
  name?: string;
  status?: number;
  depositLimit?: number;
  withdrawLimit?: number;
  agencyID?: number | string;
  agency?: string;
  agencyIDSelf?: number | string;
  agencyAccountSelf?: string;
  phone?: string;
  phoneArea?: string;
  phoneCert?: number;
  email?: string;
  emailCert?: number;
  fullAddress?: string;
  vipLevel?: number;
  vipLevelName?: string;
  vip2Level?: number;
  createdAt?: string;
  lastLoginAt?: string;
  birthday?: string;
  withdrawQuota?: string | number;
  vipWithdrawQuota?: string | number;
  currentStatus?: boolean;
  [key: string]: any;
}

// 錢包資料
interface WalletData {
  [key: string]: any;
}

// 標籤
interface MemberTag {
  id: number;
  name: string;
  tagGroupID: number;
  updatedAt?: string;
}

// 備註
interface CommentItem {
  id: number;
  title: string;
  content: string;
  creator?: string;
  updator?: string;
  createdAt?: string;
  updatedAt?: string;
}

// el-descriptions 用的欄位設定
interface DescItem {
  field: string;
  label: string;
  span?: number;
}

export type { MemberDetail, WalletData, MemberTag, CommentItem, DescItem };
