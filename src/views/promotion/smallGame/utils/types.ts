// 小遊戲(優惠上架)列表型別
interface SmallGameItem {
  ID: number;
  internalName?: string;
  display: number; // 1 顯示 2 隱藏
  type: string; // 逗號分隔的上架類型 key
  imageSmallGame?: string;
  updatedAt?: string;
  updatedUser?: string;
  languageText?: Array<{
    language: string;
    name: string;
    imageWeb?: string;
    imageH5?: string;
  }>;
  promotions?: Array<{
    ID: number;
    id?: number;
    name: string;
    internalName?: string;
    status: number; // 1 上架 2 下架
  }>;
  timeInterval?: Array<{ startTime?: string; endTime?: string }>;
}

// 編輯表單欄位（簡化版，完整多步驟表單見 notes 之 TODO）
interface FormItemProps {
  ID?: number;
  internalName: string;
  name: string;
  display: number;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { SmallGameItem, FormItemProps, FormProps };
