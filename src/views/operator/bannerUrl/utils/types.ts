interface BannerUrlItem {
  ID: number;
  name: string;
  /** 關鍵字標籤陣列 */
  keyword: string[];
  /** 推薦類型排序值陣列 */
  recommendTypeSort: number[];
  /** 狀態：1 啟用 / 2 停用 */
  status: number;
  updatedAt: string;
  editor: string;
}

interface FormItemProps {
  ID?: number | string;
  name: string;
  /** 狀態：1 啟用 / 2 停用 */
  status: number;
  /** 關鍵字標籤（el-select tags 模式） */
  keyword: string[];
  /** 推薦類型排序值陣列 */
  recommendTypeSort: number[];
}

interface FormProps {
  formInline: FormItemProps;
  /** 推薦類型下拉選項 */
  recommendTypeOptions: Array<{ label: string; value: number }>;
}

export type { BannerUrlItem, FormItemProps, FormProps };
