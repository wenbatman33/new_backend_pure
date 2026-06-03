/** VIP 等級單列資料（可編輯表格的一行） */
interface LevelItem {
  level: number;
  /** 等級圖（相對路徑，顯示時需組合 imgPath） */
  vipImage: string;
  /** 顯示用完整圖片網址（前端組合，不送後端） */
  vipImageUrl?: string;
  /** 圖片大小超標旗標 */
  vipImageSizeCheck?: boolean;
  name: string;
  upgradeBetAmount: number | string;
  upgradeRechargeAmount: number | string;
  keepBetAmount: number | string;
  keepRechargeAmount: number | string;
  upgradeGift: number | string;
  upgradeGiftMultiple: number | string;
  dailyGift: number | string;
  dailyGiftRechargeMultiple: number | string;
  dailyGiftBetMultiple: number | string;
  dailyGiftMultiple: number | string;
  weeklyGift: number | string;
  weeklyGiftRechargeMultiple: number | string;
  weeklyGiftBetMultiple: number | string;
  weeklyGiftMultiple: number | string;
  monthlyGift: number | string;
  monthlyGiftRechargeMultiple: number | string;
  monthlyGiftBetMultiple: number | string;
  monthlyGiftMultiple: number | string;
  birthdayGift: number | string;
  birthdayGiftMultiple: number | string;
  withdrawAmountLimit: number | string;
  withdrawTimesLimit: number | string;
  singleWithdrawAmountLimit: number | string;
}

/** VIP 機制設定（頁面上方那一大塊開關/下拉） */
interface ConfigForm {
  vipStatus: boolean;
  isSpeedLevelUp: boolean;
  isUpgradeGift: boolean;
  isWeeklyGift: boolean;
  isMonthlyGift: boolean;
  isDailyGift: boolean;
  isBdGift: boolean;
  vipWeek: number;
  vipMonth: number;
  giftDeadline: number;
  isBindCard: boolean;
  isShowRefund: boolean;
  customizedService: number;
  isKeep: boolean;
  vipKeep: number;
  vipKeepAging: number;
  vipDowngrade: number;
  bdGiftDeadline: number;
}

/** 新增等級對話框表單欄位 */
interface FormItemProps {
  name: string;
  vipImage: string;
  vipImageUrl?: string;
  upgradeBetAmount: number | string;
  upgradeRechargeAmount: number | string;
  upgradeGift: number | string;
  upgradeGiftMultiple: number | string;
  birthdayGift: number | string;
  birthdayGiftMultiple: number | string;
  dailyGift: number | string;
  dailyGiftRechargeMultiple: number | string;
  dailyGiftBetMultiple: number | string;
  dailyGiftMultiple: number | string;
  weeklyGift: number | string;
  weeklyGiftRechargeMultiple: number | string;
  weeklyGiftBetMultiple: number | string;
  weeklyGiftMultiple: number | string;
  monthlyGift: number | string;
  monthlyGiftRechargeMultiple: number | string;
  monthlyGiftBetMultiple: number | string;
  monthlyGiftMultiple: number | string;
  withdrawAmountLimit: number | string;
  withdrawTimesLimit: number | string;
  singleWithdrawAmountLimit: number | string;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { LevelItem, ConfigForm, FormItemProps, FormProps };
