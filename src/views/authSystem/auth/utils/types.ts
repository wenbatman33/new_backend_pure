interface FormItemProps {
  /** 功能 ID（編輯時唯讀） */
  fnID?: number;
  /** 功能名稱（簡體） */
  fnName: string;
  /** 功能名稱（英文） */
  displayFnName: string;
  /** 功能 Key */
  fnKey: string;
  /** 上層功能 ID */
  parentID?: number;
  /** 上層功能下拉選項 */
  parentOptions?: Array<{ label: string; value: number }>;
  /** 是否顯示 CN 名稱欄位（依權限） */
  showCN?: boolean;
  /** 是否顯示 EN 名稱欄位（依權限） */
  showEN?: boolean;
  /** 編輯模式 */
  isUpdate?: boolean;
}

interface FormProps {
  formInline: FormItemProps;
}

/** 樹狀功能列資料 */
interface FnRow {
  fnID: number;
  fnName: string;
  displayFnName: string;
  fnKey: string;
  parentID: number;
  hide: number;
  createdAt: string;
  updatedAt: string;
  children?: FnRow[];
}

export type { FormItemProps, FormProps, FnRow };
