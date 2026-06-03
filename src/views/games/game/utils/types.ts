interface FormItemProps {
  /** 主鍵 ID（編輯時帶入；新增為空） */
  id?: number | string;
  /** 廠商（遊戲群組）ID */
  gameGroupID?: number;
  /** 遊戲類型 ID */
  gameTypeID?: number;
  /** 遊戲名稱 */
  name: string;
  /** 顯示名稱 */
  displayName: string;
  /** 排序 */
  sort: number | string;
  /** 投注代碼 */
  bettingCode?: string;
  /** PC 遊戲代碼 */
  gameCodePc: string;
  /** H5 遊戲代碼 */
  gameCodeH5: string;
  /** 狀態：1 開啟 / 2 關閉 / 3 維護 / 4 隱藏 */
  status: number;
  /** 試玩：1 否 / 2 是 */
  trialPlay: number;
  /** 是否熱門遊戲（表單用 boolean） */
  isHotGame: boolean;
  /** 是否新遊戲（表單用 boolean） */
  isNewGame: boolean;
  /** 推薦排序：0 不推薦，1~20 */
  recommendedSort?: number;
  /** 是否參與老虎機：1 不參與 / 2 參與 */
  isSlot?: number;
  /** 是否返水：1 是 / 2 否 */
  isReturn?: number;
  /** 標籤 ID 陣列 */
  tagIDs?: number[];
  /** H5 圖片路徑 */
  imageH5?: string;
  /** PC 圖片路徑 */
  imagePc?: string;
  /** H5 截圖路徑 */
  screenShotH5?: string;
  /** PC 截圖路徑 */
  screenShotPc?: string;
  /** 推薦圖片路徑 */
  recommendedImageH5?: string;
}

interface FormProps {
  formInline: FormItemProps;
  /** 是否新增模式（新增隱藏 id / 圖片 / 標籤等欄位） */
  isAdd: boolean;
  /** 廠商選項 */
  gameGroupOptions: Array<{ label: string; value: number; gameTypeID?: number }>;
  /** 遊戲類型選項 */
  gameTypeOptions: Array<{ label: string; value: number }>;
  /** 標籤選項 */
  tagOptions: Array<{ label: string; value: number }>;
}

/** 批次修改狀態表單 */
interface BatchFormProps {
  formInline: {
    status: number;
    isNewGame: number;
    isHotGame: number;
    isReturn: number;
    isSlot: number;
  };
}

export type { FormItemProps, FormProps, BatchFormProps };
