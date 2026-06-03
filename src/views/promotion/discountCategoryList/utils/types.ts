interface FormItemProps {
  /** 主鍵 id（編輯時帶入，新增不需要） */
  id?: number;
  /** 分類 ID（promotionTypeID），編輯時禁用 */
  promotionTypeID: number | string;
  /** 語系 */
  locale: string;
  /** 分類名稱 */
  typeName: string;
  /** 排序 */
  sort: number | string;
}

interface FormProps {
  formInline: FormItemProps;
  /** 操作狀態：add / edit */
  status: string;
}

export type { FormItemProps, FormProps };
