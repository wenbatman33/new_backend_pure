// 廣告分類下拉項
interface BannerCategoryItem {
  bannerCategoryID: number;
  name: string;
  description?: string;
  hidden: boolean;
}

// 裝置 / 上架平台下拉項（{ "1": "WEB" } 形式）
type DropdownItem = Record<string, string>;

// 廣告表單欄位
interface FormItemProps {
  id?: number | string;
  /** 分類 ID */
  bannerCategoryID: string | number;
  /** 標題 */
  title: string;
  /** 說明 */
  description: string;
  /** 前台排序 */
  sort: number | string;
  /** 語系 */
  language: string;
  /** 是否隱藏 */
  hidden: boolean;
  /** web 圖（路徑字串，上傳元件未移植，先以字串輸入） */
  imageWeb: string;
  /** h5 圖 */
  imageH5: string;
  /** logo */
  logo: string;
  /** 上架平台（多選） */
  device: number[];
  /** 上架時間 */
  start: string;
  /** 下架時間 */
  end: string;
  /** 推薦類型（多選） */
  recommendType: number[];
  /** 內容 */
  context: string;
  /** 備註 */
  note: string;
}

interface FormProps {
  formInline: FormItemProps;
  // 分類下拉
  categoryOptions: BannerCategoryItem[];
  // 上架平台下拉
  deviceOptions: { label: string; value: number }[];
  // 推薦類型下拉
  recommendTypeOptions: { label: string; value: number }[];
  // 語系下拉
  languageOptions: { label: string; value: string }[];
  // 模式：Create / Edit
  mode: string;
}

export type { FormItemProps, FormProps, BannerCategoryItem, DropdownItem };
