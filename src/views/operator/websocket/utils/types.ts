interface FormItemProps {
  id?: number;
  /** 對象：1 全站 / 2 指定 */
  memberType: string;
  /** 指定會員帳號（tags 多筆） */
  memberAccounts: string[];
  /** 廣播時間：1 立即 / 2 預約 */
  startType: string;
  /** 預約時間 */
  startTime: string;
  /** 廣播持續時間（分） */
  time: number;
  /** 標題 */
  title: string;
  /** 啟動位置（deeplink 型別） */
  deeplinkType: number;
  /** deeplink 連結 */
  deeplinkLink: string;
  /** 顯示方式：1 彈窗 / 2 toast / 3 站內信 / 4 圖片 */
  displayType: number;
  /** Web 圖 */
  imageWeb: string;
  /** H5 圖 */
  imageH5: string;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
