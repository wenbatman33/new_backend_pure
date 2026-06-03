// 設備關聯（幽靈設備）模組型別

/** 搜尋表單 */
interface SearchFormProps {
  /** 會員帳號 */
  memberName: string;
  /** 設備 ID */
  deviceID: string;
  /** 區間天數 */
  interval: number | string;
  /** 是否精準比對：true 精準(selectAmount=1) / false 模糊(selectAmount=2) */
  isAccurate: boolean;
}

/** 標籤群組顏色 */
interface TagColorItem {
  id: number;
  color: string;
}

/** 會員身上的標籤 */
interface MemberTag {
  id: number;
  name: string;
  tagGroupID: number;
  updatedAt: string;
  color?: string;
}

/** 單一會員列 */
interface GhostMember {
  id: number;
  memberID: number;
  account: string;
  realName: string;
  agent: string;
  agencyParent: string;
  registerIp: string;
  registerArea: string;
  loginIp: string;
  lastLoginArea: string;
  registerDate: string;
  loginDate: string;
  tags: MemberTag[];
  depositLimit: number;
  withdrawLimit: number;
  status: number;
  gameLogin: number;
}

/** 單一設備分組 */
interface GhostDevice {
  deviceID: string;
  lastLoginAccount: string;
  deviceIdLastLoginAt: string;
  list: GhostMember[];
}

/** 重複設備列（最近可疑設備） */
interface RepeatDevice {
  deviceID: string;
  totalMemberCount: number;
  lockMemberCount: number;
  multiAccountTag: number;
  relateAgent: number;
  full: boolean;
}

/** 狀態切換確認對話框 props */
interface CheckFormProps {
  /** 後端欄位 key：depositLimit / withdrawLimit / status */
  type: string;
  /** 顯示用功能名稱 */
  checkType: string;
  /** 會員帳號 */
  memberName: string;
  /** 會員 ID */
  memberID: number;
  /** 目前狀態（1 開啟 / 2 關閉） */
  status: number;
  /** 備註 */
  comment: string;
}

interface CheckProps {
  formInline: CheckFormProps;
}

export type {
  SearchFormProps,
  TagColorItem,
  MemberTag,
  GhostMember,
  GhostDevice,
  RepeatDevice,
  CheckFormProps,
  CheckProps
};
