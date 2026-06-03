// 排行榜列表項目
interface RankItem {
  id: number;
  eventCode: string;
  name: string;
  startTime: string;
  endTime: string;
  status: number; // 1 啟用 / 2 停用
  updatedAt: string;
  updatedUser: string;
}

// 排行榜會員項目（編輯排行用）
interface RankMemberItem {
  order?: number;
  memberAccount: string;
  eventBetAmount: string | number;
}

// 設定表單欄位（idModal）
interface FormItemProps {
  id?: number;
  status: number; // 1 啟用 / 2 停用
  name: string;
  cycleType: number; // 2 日 / 3 週 / 1 自訂
  startTime: string;
  endTime: string;
  finalEndTime: string;
  rankAmount: number | null;
  type: number; // 1 投注額 / 2 流水
  gameItem: any[];
  tag: number[];
  eventCode: string;
  displayStartTime: string;
  displayEndTime: string;
  bonusShow: number; // 1 / 2
  typeShow: number; // 1 / 2
  imgUrl: string;
  announcement: string;
}

interface FormProps {
  formInline: FormItemProps;
  mode: "create" | "edit";
}

export type { RankItem, RankMemberItem, FormItemProps, FormProps };
