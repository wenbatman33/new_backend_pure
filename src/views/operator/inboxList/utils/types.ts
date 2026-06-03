// 站內信列表項目
interface InboxItem {
  letterSettingId: number;
  /** 類型：1 系統 / 2 人工 */
  type: number;
  title: string;
  titlePh?: string;
  content: string;
  contentPh?: string;
  memberCount: number;
  /** 狀態：1 待發送 / 3 已發送 / 4 失敗 / 5 已回收 */
  status: number;
  sendAt: string;
  updatedAt: string;
  updatedUser: string;
}

// 新增/編輯站內信表單
interface FormItemProps {
  /** 收件人帳號（多筆） */
  memberAccounts: string[];
  /** 發送方式：1 立即 / 2 預約 */
  sendTimeType: number;
  /** 預約發送時間 */
  sendAt: string;
  title: string;
  titlePh: string;
  content: string;
  /** 模式：Create / Edit / read */
  mode: string;
  /** 編輯時帶入的目標 ID */
  id?: number;
}

interface FormProps {
  formInline: FormItemProps;
}

// 站內信收件會員
interface LetterMemberItem {
  memberAccount: string;
  sendAt: string;
  status: string | number;
}

export type { InboxItem, FormItemProps, FormProps, LetterMemberItem };
