interface FormItemProps {
  /** 代理商 ID（唯讀） */
  id: number | string;
  /** 代理商名稱（唯讀） */
  name: string;
  /** 旗下廠商（唯讀，顯示用字串） */
  gameGroups: string[];
  /** 代理遊戲類型（唯讀，顯示用字串） */
  gameLists: string[];
  /** 狀態：1 開啟 / 2 關閉 / 3 維護中 / 4 隱藏 */
  status: number | string;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
