// 搜尋表單型別
interface SearchFormProps {
  /** 代理 ID */
  agencyID: string;
  /** 代理帳號 */
  agencyAccount: string;
  /** 是否贈送優惠：3 全部 / 1 是 / 2 否 */
  giveOffer: number;
  /** 報表開始時間 YYYY-MM-DD HH:mm:ss */
  startTime: string;
  /** 報表結束時間 YYYY-MM-DD HH:mm:ss */
  endTime: string;
  /** 是否包含下層代理資料 */
  getChildAgencyData: boolean;
}

// 明細彈窗開啟參數
interface DetailDialogParams {
  /** 1 註冊明細 / 2 首儲明細 / 3 活躍會員明細 */
  type: number;
  /** 當列報表資料 */
  record: Record<string, any>;
  /** 報表日期區間文字 */
  searchDate: string;
  /** 主頁查詢參數 */
  postParams: Record<string, any>;
}

export type { SearchFormProps, DetailDialogParams };
