interface FormItemProps {
  /** 主鍵（編輯時帶入） */
  id?: number;
  /** 標題 */
  title: string;
  /** 排序 */
  sort: number;
  /** 是否立即上架（true 立即上架，false 走起始時間） */
  online: boolean;
  /** 起始時間 */
  startTime: string;
  /** 結束時間 */
  endTime: string;
  /** PC 圖片 URL */
  imagePc: string;
  /** H5 圖片 URL */
  imageH5: string;
  /** 狀態：1 上架 / 2 下架 */
  status: number;
  /** 內容（HTML） */
  contents: string;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
