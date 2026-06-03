/** 多語系導覽名稱 */
interface NavLanguageName {
  language: string;
  name: string;
}

interface FormItemProps {
  /** 編輯時的 id（新增為 undefined） */
  id?: number;
  /** 導覽類型 1 遊戲分類 / 2 啟動遊戲 / 3 前往指定頁面 */
  lobbyType: number;
  /** 各語系導覽名稱 */
  navigationName: NavLanguageName[];
  /** 排序 */
  sort: number;
  /** 是否顯示（true 顯示 / false 隱藏） */
  status: boolean;
  /** 是否動態（true 動態 / false 非動態） */
  dynamic: boolean;
  /** icon 圖（URL） */
  icon: string;
  /** iconColor 圖（URL） */
  iconColor: string;
  /** iconColor2 圖（URL） */
  iconColor2: string;
  /** 指定頁面內容（lobbyType=3 時為網址；lobbyType=2 時送遊戲 id） */
  content: string | number;
  /** 備註 */
  note: string;
  /** lobbyType=2 時選擇的廠商 id */
  gameGroup?: number;
  /** lobbyType=2 時選擇的遊戲 id */
  gameListId?: number;
}

interface FormProps {
  formInline: FormItemProps;
  /** 可選語系清單，例 ["cn","en"] */
  languageList: string[];
  /** 廠商下拉 [{label,value}] */
  gameGroupOptions: { label: string; value: number }[];
  /** 遊戲清單原始資料（含 gameGroup 以供過濾） */
  gameList: { id: number; displayName: string; gameGroup: number }[];
}

export type { FormItemProps, FormProps, NavLanguageName };
