/** 團隊報表單一時間區段（今天/昨天/本週/上週/本月/上月/自訂）資料 */
interface TeamAgencyColumn {
  /** 登入人數 */
  loginMemberCount: number;
  /** 註冊人數 */
  registerMemberCount: number;
  /** 首存人數 */
  firstDepositMemberCount: number;
  /** 紅利總金額 */
  totalBonus: number;
  /** 紅利總人數 */
  totalBonusMemberCount: number;
  /** 有效投注 */
  betAmount: number;
  /** 公司輸贏 */
  winAmount: number;
  /** 投注人數 */
  betMemberCount: number;
  /** 存款總金額 */
  rechargeAmount: number;
  /** 存款人數 */
  rechargeMemberCount: number;
  /** 提款總金額 */
  withdrawAmount: number;
  /** 提款人數 */
  withdrawMemberCount: number;
  /** 團隊盈虧 */
  netProfit: number | null;
}

/** 搜尋表單 */
interface TeamSearchForm {
  agencyID: string;
  agencyAccount: string;
  startDate: string;
  endDate: string;
}

export type { TeamAgencyColumn, TeamSearchForm };
