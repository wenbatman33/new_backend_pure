interface FormItemProps {
  /** 代理商 ID */
  id: number | string;
  /** 代理商名稱 */
  name: string;
  /** 旗下廠商（唯讀展示用，逗號字串） */
  gameGroups: string;
  /** 代理遊戲類型（唯讀展示用，逗號字串） */
  gameLists: string;
  /** 狀態：1 開啟 / 2 關閉 / 3 維護中 / 4 隱藏 */
  status: number;
  /** H5 圖預覽完整網址 */
  srcH5: string;
  /** PC 圖預覽完整網址 */
  srcPc: string;
  /** H5 圖檔路徑（送後端） */
  imageH5: string;
  /** PC 圖檔路徑（送後端） */
  imagePc: string;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
