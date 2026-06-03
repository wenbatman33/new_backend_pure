interface FormItemProps {
  /** Tag ID（編輯時存在） */
  id?: number | string;
  /** 標籤名稱 */
  name: string;
  /** 排序 */
  sort?: number | string;
  /** 是否左側顯示 */
  isLeftShow?: boolean;
  /** 標籤圖片 URL */
  tagImg?: string;
  /** 標籤 icon URL */
  tagIcon?: string;
  /** 所屬遊戲類型 ID */
  gameTypeID?: number | string;
  /** 對話框模式：Create / Edit */
  mode?: "Create" | "Edit";
}

interface FormProps {
  formInline: FormItemProps;
}

/** 遊戲類型下拉項 */
interface GameTypeItem {
  key: string | number;
  value: string;
}

/** Tag 列表項 */
interface TagItem {
  id: number | string;
  name: string;
  sort?: number;
  isLeftShow?: boolean;
  tagImg?: string;
  tagIcon?: string;
}

export type { FormItemProps, FormProps, GameTypeItem, TagItem };
