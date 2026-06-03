interface FormItemProps {
  /** 主鍵 ID（唯讀） */
  id: string | number;
  /** 名稱 */
  name: string;
  /** 第二名稱 */
  secondName: string;
  /** 排序 */
  sort: number | string;
  /** 退水 */
  refund: number | string;
  /** 是否推薦：1 是 / 2 否 */
  isRecommended: number;
  /** 是否標籤推薦：1 是 / 2 否 */
  isTagRecommended: number;
  /** 是否顯示：1 是 / 2 否 */
  isShow: number;
  /** 是否動態：1 是 / 2 否 */
  dynamic: number;
  /** display（隨原資料帶回） */
  display: string;
  /** 圖示路徑 */
  icon: string;
  /** 彩色圖示路徑 */
  iconColor: string;
  /** 彩色圖示2路徑 */
  iconColor2: string;
  /** 圖示本地預覽（dataURL，僅前端用） */
  srcIcon?: string;
  /** 彩色圖示本地預覽 */
  srcIconColor?: string;
  /** 彩色圖示2本地預覽 */
  srcIconColor2?: string;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
