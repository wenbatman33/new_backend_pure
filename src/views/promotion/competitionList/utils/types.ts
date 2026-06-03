// 聯賽編輯表單
interface FormItemProps {
  /** 聯賽 ID（編輯時帶入，0 代表新增） */
  ID: number;
  /** 聯賽名稱 */
  name: string;
  /** 狀態：1 啟用 / 2 停用 */
  status: number;
  /** 聯賽報表計算：1 啟用 / 2 停用 */
  leagueReportCalc: number;
}

interface FormProps {
  formInline: FormItemProps;
}

// 關鍵字編輯表單（廠商與聯賽關鍵字設定）
interface KeywordFormItemProps {
  /** 遊戲類型 ID */
  gameTypeID: number | "";
  /** 遊戲群組 ID */
  gameGroupID: number | "";
  /** 關鍵字 */
  keyword: string;
  /** 排除關鍵字 */
  exclude: string;
}

interface KeywordFormProps {
  formInline: KeywordFormItemProps;
  /** 所屬聯賽 ID */
  leagueID: number;
}

export type {
  FormItemProps,
  FormProps,
  KeywordFormItemProps,
  KeywordFormProps
};
