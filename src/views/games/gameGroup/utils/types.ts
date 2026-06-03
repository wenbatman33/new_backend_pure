interface FormItemProps {
  id?: number | string;
  gameAgencyName?: string;
  walletType?: number | string;
  name: string;
  displayName: string;
  gameTypeID?: number | string;
  openWayPc?: number;
  openWayH5?: number;
  sort?: number;
  status: number;
  platformFeeRatio?: number | string;
  gameListID?: number | string;
  gameListIDTurnover?: number | string;
  ishow?: number;
  maintainTime?: string;
  imageH5?: string;
  imagePc?: string;
  logoImage?: string;
  logoImage2?: string;
  imgRecommend1?: string;
  gameResultType?: number;
  showDetailLinkButton?: number;
  // 遊戲類型選單（編輯時帶入）
  gameTypeOptions?: { label: string; value: number | string }[];
}

interface FormProps {
  formInline: FormItemProps;
}

// 設定賽事推薦表單
interface ConfigSportFormItemProps {
  recommendGroupId: string;
  luckysportGroupId: string;
  isVirtual: number;
  countRecord: string | number;
  countDay: string | number;
  rankingGameGroupList: (number | string)[];
}

export type { FormItemProps, FormProps, ConfigSportFormItemProps };
