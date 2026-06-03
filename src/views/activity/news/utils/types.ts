interface FormItemProps {
  id?: string | number;
  /** 標題 */
  title: string;
  /** 上架時間 */
  startTime: string;
  /** 下架時間 */
  endTime: string;
  /** 類型：1 新聞 / 2 紅單推薦 */
  category: number;
  /** 狀態：0 隱藏 / 1 顯示 */
  status: number;
  /** 熱門 */
  hot: boolean;
  /** 置頂 */
  top: boolean;
  /** 投注設置開關 */
  betSetting: boolean;
  /** 連結廠商 Event ID */
  eventId: number | string;
  /** 圖片 */
  image: string;
  /** 內文（HTML） */
  context: string;
  /** 唯讀模式（查看用） */
  isView?: boolean;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
