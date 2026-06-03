// 报表查询参数
interface SearchFormProps {
  reportDateStart: string;
  reportDateEnd: string;
  memberAccount: string;
  gameAccount: string;
}

// 报表列（树状：父=游戏类型，子=各厂商）
interface ReportRow {
  gameGroupID?: string | number;
  gameGroupName?: string;
  gameTypeName?: string;
  betAmount?: number | string;
  kill?: number | string;
  totalWinAmount?: number | string;
  betPeople?: number | string;
  betCount?: number | string;
  eventBetAmount?: number | string;
  children?: ReportRow[];
}

export type { SearchFormProps, ReportRow };
