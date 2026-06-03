// 編輯類型：1 銀行卡二元素 / 2 銀行卡歸屬地 / 3 手機二元素
type EditType = 1 | 2 | 3;

// 廠商設定參數（依不同廠商動態出現的欄位）
interface VerifyParams {
  APPID?: string;
  APP_SECURITY?: string;
  KEY_CHECK_NAME?: string;
  KEY_GET_BELONG?: string;
  OPEN_ID?: string;
  APP_ID?: string;
  APP_KEY?: string;
  URL_CHECK_QUOTA?: string;
}

// 表格列資料（廠商設定）
interface VerifyRow {
  id: number;
  type?: number;
  status: number; // 1 啟用 / 2 停用
  name: string;
  times?: number | string; // 剩餘額度
  url?: string; // 廠商後台網址
  check_name_url?: string;
  get_belong_url?: string;
  boURL?: string;
  apiDomain?: string;
  api_domain?: string;
  params?: VerifyParams;
  pendingStatus?: boolean;
}

// 編輯對話框表單
interface FormItemProps {
  id: number;
  // 來源 record，用於決定哪些欄位要顯示
  record: VerifyRow;
  editType: EditType;
  backendUrl: string;
  checkNameUrl: string;
  getBelongUrl: string;
  boURL: string;
  apiDomain: string;
  params: VerifyParams;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { EditType, VerifyParams, VerifyRow, FormItemProps, FormProps };
