// 優惠上架列表 - 表單型別

interface FormItemProps {
  ID?: number;
  /* 名稱 */
  name: string;
  /* 摘要 */
  summary: string;
  /* 類型(多選) */
  type: number[];
  /* 內容 */
  content: string;
  /* 裝置(多選) */
  device: number[];
  /* 排序 */
  orderNo: number;
  /* 置頂 1是 0否 */
  top: number;
  /* 顯示 1顯示 2隱藏 */
  display: number;
  /* 上架時間 */
  startTime: string;
  /* 下架時間 */
  endTime: string;
  /* 圖片WEB */
  imageWeb: string;
  /* 圖片h5 */
  imageH5: string;
  /* 關聯優惠 ID 陣列 */
  promotions: number[];
}

interface FormProps {
  formInline: FormItemProps;
  // 是否唯讀檢視模式
  readonly?: boolean;
  // 關聯優惠下拉選項
  promotionOptions?: Array<{ label: string; value: number }>;
}

export type { FormItemProps, FormProps };
