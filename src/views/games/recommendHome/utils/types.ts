interface FormItemProps {
  /** 記錄 id（編輯時帶入） */
  id?: string | number;
  /** 前台排序（唯讀） */
  recommendedSort: number | string;
  /** 廠商 id */
  gameGroupID: string | number;
  /** 遊戲 id */
  gameID: string | number;
  /** 前台狀態：0 隱藏 / 1 顯示 */
  showStatus: number | string;
  /** 所屬遊戲類型（提交時帶入，不顯示） */
  gameTypeID?: string | number;
}

interface FormProps {
  formInline: FormItemProps;
  /** 廠商下拉選項 */
  gameGroupOptions: Array<{ label: string; value: string | number }>;
  /** 遊戲下拉選項（依廠商連動） */
  gameOptions: Array<{ label: string; value: string | number }>;
  /** 廠商切換時重新載入遊戲清單 */
  onGameGroupChange: (gameGroupID: string | number) => void;
}

export type { FormItemProps, FormProps };
