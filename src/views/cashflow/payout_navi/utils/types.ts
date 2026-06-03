// 出款面板（payout navi）單列資料結構
interface PayoutNaviItem {
  /** 主鍵 */
  id: number;
  /** 排序值 */
  sort: number;
  /** 商戶號 / 名稱 */
  name: string;
  /** 三方餘額（後端以逗號分隔多行字串） */
  thirdBalance: string;
  /** 三方代收餘額 */
  thirdSecondBalance: string;
  /** 是否出款中 */
  paying: boolean;
  /** 狀態：1 開啟 / 2 關閉 */
  status: number;
  /** 18 單筆下限 */
  eighteenApLowerLimit: string;
  /** 18 單筆上限 */
  eighteenApUpperLimit: string;
}

export type { PayoutNaviItem };
