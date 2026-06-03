// 上下分報表搜尋表單欄位
interface SearchFormProps {
  /** 上下分類型："" 全部 / "1" 上分 / "2" 下分 */
  adjustmentType: string;
  /** 報表類型：d 日報 / w 週報 / m 月報 */
  reportType: string;
  /** 報表起始日期（YYYY-MM-DD HH:mm:ss） */
  reportDateStart: string;
  /** 報表結束日期（YYYY-MM-DD HH:mm:ss） */
  reportDateEnd: string;
  /** 代理帳號 */
  agencyAccount: string;
  /** 原因 0 全部 */
  reason: number;
}

// 報表列資料（樹狀，含 children）
interface ReportRow {
  date: string;
  amountAdd: number;
  amountSub: number;
  applyCount: number;
  applyMember: number;
  approvedMember: number;
  applyAmount: number;
  approvedAmount: number;
  children?: ReportRow[];
}

export type { SearchFormProps, ReportRow };
