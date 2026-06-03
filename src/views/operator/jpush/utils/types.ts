interface JpushItem {
  id: number;
  title: string;
  alert: string;
  deeplinkType: number;
  deeplinkPage?: string;
  deeplinkID?: string | number;
  sendTime: string;
  status: number;
  updatedAt: string;
  updatedUser: string;
}

interface FormItemProps {
  id?: number;
  /** 發送時間類型：1 立即 / 2 預約 */
  startType: number;
  /** 預約發送時間 */
  sendTime: string;
  /** 對象：1 全站 */
  memberType: number;
  /** 平台：1 Android App */
  platform: number;
  /** 引導位置類型 */
  deeplinkType: number;
  /** 引導頁面 */
  deeplinkPage: string;
  /** 引導 ID */
  deeplinkID: string | number;
  /** 標題 */
  title: string;
  /** 內容 */
  content: string;
}

interface FormProps {
  formInline: FormItemProps;
  isEdit: boolean;
}

export type { JpushItem, FormItemProps, FormProps };
