interface GameTypeInfo {
  id: number | string;
  name: string;
}

/** 遊戲廠商列表項 */
interface GameGroupItem {
  id: number | string;
  name: string;
  displayName: string;
  sort: number;
  gameAgencyName: string;
  gameAgencyID?: number | string;
  walletType: number;
  gameType: GameTypeInfo;
  platformFeeRatio: number | string;
  status: number;
}

/** 平台費率編輯表單欄位 */
interface FormItemProps {
  /** 廠商 ID（送出用） */
  id: number | string;
  /** 所屬代理 */
  gameAgencyName: string;
  /** 錢包類型（顯示文字） */
  walletType: string;
  /** 廠商預設名稱 */
  name: string;
  /** 網站顯示名稱 */
  displayName: string;
  /** 平台費率（可編輯） */
  platformFeeRatio: number | string;
  /** 廠商遊戲類型（顯示文字） */
  gameTypeName: string;
  /** 狀態 */
  status: number;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { GameTypeInfo, GameGroupItem, FormItemProps, FormProps };
