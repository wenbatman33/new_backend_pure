// 優惠列表單筆資料
interface PromotionItem {
  ID: number;
  /** 優惠名稱 */
  name: string;
  /** 內部名稱 */
  internalName: string;
  /** 優惠模板類型清單 */
  promotionCondTypes: number[];
  /** 狀態[1啟用2停用] */
  status: number;
  /** 上架時間 */
  startTime: string;
  /** 下架時間 */
  endTime: string;
  /** 更新時間 */
  updatedAt: string;
  /** 自由度[1背景機制2獨立機制3指定存款] */
  freedom: number;
  /** 優惠代碼 */
  code: string;
  /** 類型[1銷售2代理] */
  online: number;
  /** 更新人員 */
  updatedUser: string;
}

// 搜尋表單
interface PromotionSearchForm {
  ID: string;
  name: string;
  status: string;
  online: string;
  startTime: string;
  endTime: string;
  walletType: string;
  eventCode: string;
  freedom: string;
  internalName: string;
}

export type { PromotionItem, PromotionSearchForm };
