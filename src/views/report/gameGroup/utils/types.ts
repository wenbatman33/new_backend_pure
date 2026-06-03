// 游戏类型组报表 搜寻表单栏位
interface SearchFormProps {
  /** 报表起始时间（YYYY-MM-DD HH:mm:ss） */
  reportDateStart: string;
  /** 报表结束时间（YYYY-MM-DD HH:mm:ss） */
  reportDateEnd: string;
  /** 会员帐号（可空） */
  memberAccount: string;
  /** 是否含测试帐号 0 否 / 1 是 */
  includesTest: number;
}

// 报表列资料（树状，父层为游戏类型、children 为厂商明细）
interface ReportRow {
  /** 类型/厂商名称（树状显示用，父层来自 gameTypeName） */
  gameGroupName?: string;
  gameGroupID?: number | string;
  gameTypeName?: string;
  /** 总流水 */
  betAmount?: number | string;
  /** 杀数 */
  kill?: number | string;
  /** 公司盈亏 */
  totalWinAmount?: number | string;
  /** 投注人数 */
  betPeople?: number | string;
  /** 投注笔数 */
  betCount?: number | string;
  /** 活动流水 */
  eventBetAmount?: number | string;
  children?: ReportRow[];
}

// 合计列资料结构
interface ReportTotal {
  gameGroupName?: string;
  betAmount?: number | string;
  kill?: number | string;
  totalWinAmount?: number | string;
  betPeople?: number | string;
  betCount?: number | string;
  eventBetAmount?: number | string;
  lastUpdatedAt?: string;
}

export type { SearchFormProps, ReportRow, ReportTotal };
