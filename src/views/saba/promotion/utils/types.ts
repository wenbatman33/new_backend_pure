// 活動主表單欄位（step1：建立/編輯活動主檔）
interface FormItemProps {
  /** 活動 ID（編輯/檢視時帶入） */
  id?: number;
  /** 活動名稱 */
  name: string;
  /** 體育類型 */
  sportId: number | "";
  /** 是否指定特定賽事（暫不顯示，預設 false） */
  specificCompetition: boolean;
  /** 指定賽事 ID（多選） */
  competitionId: number[];
  /** 開始時間 */
  start: string;
  /** 結束時間 */
  end: string;
  /** 站內路由（建立後不可更動） */
  route: string;
  /** 隱藏旗標 */
  hidden: boolean;
  /** 是否檢視模式（唯讀） */
  isReview?: boolean;
}

interface FormProps {
  formInline: FormItemProps;
  /** 體育類型下拉選項 */
  sportIdOptions: Array<{ label: string; value: number; ProductId?: number }>;
}

/** 列表單筆資料 */
interface PromotionItem {
  id: number;
  name: string;
  route: string;
  status: number;
  sportId: number;
  start: string;
  end: string;
}

export type { FormItemProps, FormProps, PromotionItem };
