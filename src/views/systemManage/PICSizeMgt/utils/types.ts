// 圖片尺寸限制（單筆欄位設定）
interface ContentItem {
  /** 欄位名稱 */
  column: string;
  /** 限制大小（kb） */
  size: number;
}

// 列表資料項
interface PicSizeItem {
  id: number;
  /** 1 廣告 / 2 站內頁 */
  type: number;
  /** 類別名稱 */
  name: string;
  /** 尺寸設定內容 */
  content: ContentItem[];
  updatedAt: string;
  updatedUser: string;
}

// 下拉選項（廣告類別 / 樂透類別）
interface IdOption {
  label: string;
  value: number;
}

interface FormItemProps {
  /** 是否編輯模式 */
  isUpdate: boolean;
  /** 1 廣告 / 2 站內頁 */
  type: number;
  /** 選中的類別 ID */
  id: number | string;
  /** 類別名稱（編輯顯示用） */
  name: string;
  /** 尺寸設定內容 */
  content: ContentItem[];
  /** 類別下拉選項 */
  idOptions: IdOption[];
}

interface FormProps {
  formInline: FormItemProps;
}

export type { ContentItem, PicSizeItem, IdOption, FormItemProps, FormProps };
