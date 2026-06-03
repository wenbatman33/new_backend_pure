interface SocialItem {
  /** 前端用唯一識別（client 端產生，非後端欄位） */
  id?: string;
  /** 顯示排序 */
  order: string | number;
  /** 圖標路徑 */
  iconUrl: string;
  /** 名稱 */
  name: string;
  /** 副標題（僅 member 用） */
  subtitle?: string;
  /** 開啟方式：1 另開 / 2 內嵌 / 3 Livechat / 4 tawk.to */
  openWay: number;
  /** 網址 */
  link: string;
  /** 授權 */
  license: string;
  /** 分組 */
  group: string;
  /** 顯示：1 顯示 / 2 隱藏 */
  show: number;
}

/** member 或 agent */
type SocialType = "member" | "agent";

interface SocialConfig {
  member: SocialItem[];
  agent: SocialItem[];
}

interface FormItemProps extends SocialItem {}

interface FormProps {
  formInline: FormItemProps;
  /** 表單所屬類型，控制副標題欄位是否顯示 */
  socialType: SocialType;
}

export type { SocialItem, SocialType, SocialConfig, FormItemProps, FormProps };
