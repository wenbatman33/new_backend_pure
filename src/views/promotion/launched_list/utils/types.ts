// 優惠上架列表項
interface LaunchedListItem {
  ID: number;
  /** 排序 */
  orderNo: number;
  /** 類型（逗號分隔字串，例 "1,2"） */
  type: string;
  /** 名稱（後端回 languageText 陣列，前端組成 string[]） */
  name: string[];
  /** 語言文案原始資料 */
  languageText?: { language: string; name: string }[];
  /** 裝置 */
  device: string;
  /** 置頂 1=是 */
  top: number;
  /** 顯示 1=顯示 2=隱藏 */
  display: number;
  /** 關聯優惠 */
  promotions: { id: number; name: string }[];
  /** WEB 圖片 */
  imageWeb: string;
  /** H5 圖片 */
  imageH5: string;
  /** 上架時間 */
  startTime: string;
  /** 下架時間 */
  endTime: string;
  /** 最後更新時間 */
  updatedAt: string;
  /** 執行人 */
  updatedUser: string;
}

// 新增/編輯優惠上架表單
interface FormItemProps {
  ID?: number;
  /** 名稱 */
  name: string;
  /** 摘要 */
  summary?: string;
  /** 類型（多選） */
  type: number[];
  /** 裝置（多選） */
  device: number[];
  /** 內容 */
  content?: string;
  /** 排序 */
  orderNo?: number;
  /** 置頂 1=是 2=否 */
  top?: number;
  /** 顯示 1=顯示 2=隱藏 */
  display?: number;
  /** 上架時間 */
  startTime: string;
  /** 下架時間 */
  endTime?: string;
  /** WEB 圖片 */
  imageWeb?: string;
  /** H5 圖片 */
  imageH5?: string;
  /** 關聯優惠 ID 陣列 */
  promotions: number[];
}

interface FormProps {
  formInline: FormItemProps;
  /** 類型選項 */
  typeOptions: { label: string; value: number }[];
  /** 裝置選項 */
  deviceOptions: { label: string; value: number }[];
  /** 關聯優惠選項 */
  promotionOptions: { label: string; value: number }[];
  /** 檢視模式（不可編輯） */
  readonly?: boolean;
}

export type { LaunchedListItem, FormItemProps, FormProps };
