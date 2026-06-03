interface GameTypeRef {
  id: number;
  name: string;
}

/** 幸運金遊戲廠商列表項 */
interface LmGameGroupItem {
  id: number;
  name: string;
  displayName: string;
  sort: number;
  gameAgencyName: string;
  walletType: number;
  gameType: GameTypeRef;
  openWayPc: number;
  openWayH5: number;
  platformFeeRatio: string | number;
  status: number;
  maintainTime?: string;
  gameListID?: string;
  gameListIDTurnover?: number;
}

/** 編輯表單欄位 */
interface FormItemProps {
  id?: number;
  /** 廠商代理（唯讀） */
  gameAgencyName?: string;
  /** 錢包類型（唯讀，顯示文字） */
  walletTypeText?: string;
  /** PC 開啟方式 */
  openWayPc?: number;
  /** H5 開啟方式 */
  openWayH5?: number;
  /** 廠商預設名稱 */
  name?: string;
  /** 網站顯示名稱 */
  displayName?: string;
  /** 廠商遊戲類型 ID */
  gameTypeID?: number;
  /** 維護結束時間 */
  maintainTime?: string;
  /** 網站排序 */
  sort?: number;
  /** 平台抽成（唯讀） */
  platformFeeRatio?: string | number;
  /** 打開遊戲列表 ID（流水用） */
  gameListIDTurnover?: number;
  /** 狀態 */
  status?: number;
  /** 打開遊戲列表 ID */
  gameListID?: string;
}

interface FormProps {
  formInline: FormItemProps;
  /** 廠商遊戲類型選項 */
  gameTypeListOption: { label: string; value: any }[];
  /** 該廠商底下遊戲列表選項 */
  gameListOption: { label: string; value: any }[];
}

export type { LmGameGroupItem, GameTypeRef, FormItemProps, FormProps };
