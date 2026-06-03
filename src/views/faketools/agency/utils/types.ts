// 批次建立代理參數
interface BulkAgencyParams {
  /** 帳號前綴 */
  accountPrefix?: string;
  /** 起始數字 */
  startNumber?: number;
  /** 結束數字 */
  endNumber?: number;
  /** 註冊日期 */
  regDate?: string;
  /** 二級代理數 */
  childAgencyCnt?: number;
  /** 直屬會員數 */
  memberCnt?: number;
}

// 批次建立代理直屬會員參數
interface BulkMemberParams {
  /** 所屬代理ID */
  agencyID?: number;
  /** 帳號前綴 */
  accountPrefix?: string;
  /** 起始數字 */
  startNumber?: number;
  /** 結束數字 */
  endNumber?: number;
  /** 註冊日期 */
  regDate?: string;
}

// 存款單與流水參數
interface AgencyLogParams {
  /** 代理ID，以逗號隔開 */
  agencyIDs?: string;
  /** 會員數 */
  memberCnt?: number;
  /** 存款金額 */
  depositAmount?: number;
  /** 遊戲代理 */
  gameAgency?: string;
  /** 遊戲id */
  gameListID?: number;
  /** 流水金額 */
  bettingAmount?: number;
  /** 產生日期 */
  date?: string;
}

// 更新報表日期區間
interface ReportDateParams {
  startTime: string;
  endTime: string;
}

export type {
  BulkAgencyParams,
  BulkMemberParams,
  AgencyLogParams,
  ReportDateParams
};
