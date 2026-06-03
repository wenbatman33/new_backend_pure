// 團隊貢獻報表 - 單筆代理統計資料結構
interface ContributionItem {
  /** 代理帳號 */
  agencyAccount: string;
  /** 上層代理帳號 */
  parentAgencyAccount: string;
  /** 下層代理人數 */
  childAgencyCount: number;
  /** 所屬會員人數 */
  belongMemberCount: number;
  /** 投注會員數 */
  betMember: number;
  /** 投注筆數 */
  betCount: number;
  /** 投注金額 */
  betAmount: number;
  /** 中獎金額 */
  winAmount: number;
  /** 返水金額 */
  returnAmount: number;
  /** 總輸贏 */
  totalWinAmount: number;
  /** 建立時間 */
  createdAt: string;
}

// 報表 API 回傳結構：mainList 為主代理統計，childList 為下層代理列表
interface ContributionReport {
  mainList: ContributionItem;
  childList: ContributionItem[];
}

// 搜尋表單
interface SearchForm {
  agencyAccount: string;
  startTime: string;
  endTime: string;
}

export type { ContributionItem, ContributionReport, SearchForm };
