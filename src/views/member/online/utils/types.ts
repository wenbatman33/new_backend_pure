interface MemberOnlineItem {
  /** 會員 ID */
  ID: number | string;
  /** 帳號 */
  account: string;
  /** 姓名 */
  name: string;
  /** 登入區域 */
  loginArea: string;
  /** 登入 IP */
  loginIP: string;
  /** 登入裝置 */
  loginDevice: string;
  /** 登入時間 */
  loginAt: string;
}

interface SearchFormProps {
  id: string;
  account: string;
  /** 帳號比對方式：1 模糊 / 2 完全相符 */
  isFuzzy: number;
  name: string;
  loginIP: string;
  loginDevice: string;
}

export type { MemberOnlineItem, SearchFormProps };
