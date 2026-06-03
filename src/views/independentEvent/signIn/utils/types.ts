interface FormItemProps {
  /** 群組代碼（編輯時帶入，新增為空） */
  code?: string | number;
  /** 活動名稱 */
  name: string;
  /** 內部名稱 */
  internalName: string;
  /** 狀態：1 啟用 / 2 停用 */
  status: number;
  /** 開始時間 */
  startTime: string;
  /** 結束時間 */
  endTime: string;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
