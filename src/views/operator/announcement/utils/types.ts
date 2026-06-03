interface AnnouncementMultiple {
  language: string;
  title: string;
  context: string;
}

interface FormItemProps {
  /** id（編輯時帶入） */
  id?: number;
  /** 前台排序 */
  sort: number;
  /** 隱藏 */
  hidden: boolean;
  /** 是否置頂 */
  top: boolean;
  /** 上架時間 */
  start: string;
  /** 顯示語系 */
  language: string;
  /** 標題 */
  title: string;
  /** 內容 */
  context: string;
}

interface FormProps {
  formInline: FormItemProps;
  /** 模式：Create / Edit */
  mode: string;
  /** 編輯時的多語系原始資料，供切換語系時回填 */
  announcementMultiple: AnnouncementMultiple[];
  /** 可選語系清單 */
  languageList: string[];
}

export type { FormItemProps, FormProps, AnnouncementMultiple };
