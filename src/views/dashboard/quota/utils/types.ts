// 站台水位資訊（主頁資料結構）
interface QuotaData {
  /** 站台名稱 */
  websiteName: string;
  /** 水位開關（入金驗證） */
  verify: boolean;
  /** 用量百分比 */
  percent: number;
  /** 平台保證金 */
  siteQuotaMoney: number;
  /** 總額度 */
  quota: number;
  /** 平台輸贏 */
  winAmount: number;
  /** 資料起始日（結算日） */
  settlementDate: string;
  /** 結算輸贏（結算彈窗用） */
  configWinAmount: number;
  /** 圖表資料：時段輸贏 */
  list: Array<{ date: string; winAmount: number }>;
}

// 新增入金明細表單
interface FormItemProps {
  /** 用途類型 */
  useType: number | "";
  /** 交易時間 */
  createdAt: string;
  /** 異動金額 */
  adjustMoney: number | "";
  /** 備註 */
  note: string;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { QuotaData, FormItemProps, FormProps };
