// 站台頁面（page）表單
interface PageFormItemProps {
  id?: number;
  /** 頁面名稱 */
  name: string;
  /** 是否顯示：0 隱藏 / 1 顯示 */
  status: number;
  /** 頁面 code */
  code: string;
}

interface PageFormProps {
  formInline: PageFormItemProps;
}

// 頁面列表資料
interface PageItem {
  id: number;
  name: string;
  code: string;
  status: number;
  content: string;
  updatedAt: string;
  updatedUser: string;
}

// 頁面內容（content）資料
interface ContentItem {
  id: number;
  sort: number;
  /** 內容型別：1 文字 / 2 圖片 / 3 html / 4 超連結 */
  type: number;
  content: string;
  contentH5: string;
  language: string;
  group: string;
  description: string;
  startTime: string;
  endTime: string;
}

// 內容編輯表單（文字/圖片/html/超連結 共用）
interface ContentFormItemProps {
  /** 1 文字 / 2 圖片 / 3 html / 4 超連結 */
  type: number;
  /** new / edit */
  status: string;
  /** 所屬頁面 id */
  platformPageID: number;
  /** 編輯時的內容 id */
  contentId?: number;
  sort?: number;
  content: string;
  contentH5: string;
  group: string;
  description: string;
  language: string;
  startTime: string;
  endTime: string;
}

interface ContentFormProps {
  formInline: ContentFormItemProps;
}

export type {
  PageFormItemProps,
  PageFormProps,
  PageItem,
  ContentItem,
  ContentFormItemProps,
  ContentFormProps
};
