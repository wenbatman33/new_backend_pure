// 簡訊供應商列表項
interface SmsVendorItem {
  id: number;
  status: number; // 1 啟用 / 2 停用
  displayName: string;
  quota: number;
  credit: number;
  successRate: number | string;
  backendUrl: string;
  username?: string;
  password?: string;
  key?: string;
  secret?: string;
  apiUrl?: string;
  template?: string;
  param?: string;
  apiParam?: Record<string, string>;
  pendingStatus?: boolean;
}

// 編輯表單欄位
interface FormItemProps {
  id: number;
  displayName: string;
  username: string;
  password: string;
  key: string;
  secret: string;
  apiUrl: string;
  backendUrl: string;
  template: string;
  param: string;
  apiParam: Record<string, string>;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { SmsVendorItem, FormItemProps, FormProps };
