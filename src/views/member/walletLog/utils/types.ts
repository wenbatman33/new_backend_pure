/** 收支類型選項（來自 getMoneyUseType） */
interface UseTypeOption {
  useTypeID: number;
  useTypeName: string;
  color?: string;
}

/** 搜尋表單 */
interface WalletLogSearchForm {
  /** 會員帳號 */
  account: string;
  /** 進出（1=in / 2=out） */
  inOut: number | "";
  /** 收支類型（多選） */
  type: number[];
  /** 起始時間 */
  startTime: string;
  /** 結束時間 */
  endTime: string;
  /** 篩選關鍵字 */
  filter: string;
  /** 忽略關鍵字 */
  ignore: string;
}

export type { UseTypeOption, WalletLogSearchForm };
