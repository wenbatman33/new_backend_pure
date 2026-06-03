// 遊戲報表搜尋條件
interface SearchFormProps {
  /** 開始時間 YYYY-MM-DD HH:mm:ss */
  start: string;
  /** 結束時間 YYYY-MM-DD HH:mm:ss */
  end: string;
  /** 會員帳號 */
  memberAccount: string;
  /** 代理帳號 */
  agencyAccount: string;
  /** 遊戲廠商 ID */
  gameGroupId: string | number | "";
  /** 遊戲 ID */
  gameListId: string | number | "";
  /** 遊戲類型 ID */
  gameTypeId: string | number | "";
}

// 投注人數會員明細彈窗：父層帶入資料
interface BetPeopleRecord {
  gameListId: string | number;
  gameListName: string;
  gameGroupName: string;
  gameTypeName: string;
  gameTypeID: string | number;
  gameGroupID: string | number;
  start: string;
  end: string;
}

// 下拉選項
interface OptionItem {
  label: string;
  value: string | number;
  status?: number;
}

export type { SearchFormProps, BetPeopleRecord, OptionItem };
