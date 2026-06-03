/** 遊戲列表項目（單一遊戲） */
interface GameItem {
  gameListId: number;
  gameGroupId: number;
  displayName: string;
}

/** 遊戲廠商分組 */
interface GameGroupItem {
  Id: number;
  name: string;
  gameGroupList: GameItem[];
}

/** 流水列表單列 */
interface BetlogRow {
  betAt: string;
  memberAccount: string;
  memberID: number;
  gameGroupName: string;
  gameGroupID: number;
  betID: string;
  turnover: number;
  winAmount: number;
}

/** 新增流水表單 */
interface CreateFormProps {
  /** 一般流水：1 會員帳號 / 2 輸入 ID */
  type: number;
  /** 會員帳號或 ID（以逗點區隔） */
  members: string;
  /** 流水日期 YYYY-MM-DD */
  betAt: string;
  /** 流水時間 HH:mm */
  betTime: string;
  /** 流水 */
  turnover: string;
  /** 盈利 */
  winAmount: string;
}

/** 查詢流水表單 */
interface SearchFormProps {
  type: number;
  members: string;
  /** 起始日期 */
  qStartTime: string;
  /** 起始時間 HH:mm */
  qStartTime2: string;
  /** 結束日期 */
  qEndTime: string;
  /** 結束時間 HH:mm */
  qEndTime2: string;
}

export type {
  GameItem,
  GameGroupItem,
  BetlogRow,
  CreateFormProps,
  SearchFormProps
};
