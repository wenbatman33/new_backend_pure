interface FormItemProps {
  /** 設定 ID（編輯時帶入，新增為 0） */
  id?: number;
  /** 開始時間（發送時間起） */
  startTime: string;
  /** 結束時間（發送時間迄） */
  endTime: string;
  /** 標題 */
  title: string;
  /** 標題（當地語系） */
  titlePh?: string;
  /** 內容（HTML） */
  content: string;
  /** 內容（當地語系，HTML） */
  contentPh?: string;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
