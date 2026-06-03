interface MemberReportRow {
  memberID?: number;
  memberAccount?: string;
  platformType?: number | string;
  useSameDeviceId?: number;
  betAmount?: number | string;
  totalWinAmount?: number | string;
  rechargeAmount?: number | string;
  rechargeCount?: number | string;
  withdrawAmount?: number | string;
  withdrawDepositDiff?: number | string;
  transferMember?: number | string;
  activeStatus?: number | string;
  lastLoginTime?: string;
  regTime?: string;
  tags?: TagItem[];
}

interface TagItem {
  id: number;
  name: string;
  tagGroupID: number;
  updatedAt?: string;
}

interface TagGroup {
  id: number;
  color: string;
}

// 搜尋條件
interface SearchFormProps {
  agencyID?: string;
  agencyAccount?: string;
  startTime?: string;
  endTime?: string;
  platformType?: number;
}

export type { MemberReportRow, TagItem, TagGroup, SearchFormProps };
