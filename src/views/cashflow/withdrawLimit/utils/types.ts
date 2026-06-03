/** 提現渠道動態設定 */
interface DynamicPaymentConfig {
  serviceCode: string;
  serviceName: string;
  min: number | string;
  max: number | string;
  minAgency: number | string;
  maxAgency: number | string;
  maxAddressCount: number | string;
  icon: string;
  available: boolean;
  maintain: boolean;
  type?: number;
  docTitle?: string;
  docURL?: string;
  downloadTitle?: string;
  downloadURL?: string;
}

/** 存提款設定主物件 */
interface PaymentConfig {
  dynamicConfigs: DynamicPaymentConfig[];
  depositTimeoutMinutes: number | string;
  depositProcessLimit: number | string;
  autoPayoutEnable: boolean;
  depositRemarkShow: boolean;
  autoPayoutDayTotalAmount: number | string;
  autoPayoutAmountMax: number | string;
  skipPayingThird: boolean;
  defaultWithdrawTimesLimit: number | string;
  defaultWithdrawAmountLimit: number | string;
  defaultSingleWithdrawAmountLimit: number | string;
}

/** USDT 匯率設定列 */
interface UsdtRateItem {
  displayName: string;
  type: number;
  percentageMultiplier: number | string;
  addendRate: number | string;
  customRate: number | string;
  scale: number;
  publicRate: number | string;
  finalRate: number | string;
}

/** USDT 匯率設定（存款/提款） */
interface UsdtPaymentConfig {
  deposit: UsdtRateItem[];
  withdrawal: UsdtRateItem[];
}

/** 更新說明與連結表單 */
interface DescFormItemProps {
  serviceCode?: string;
  docTitle: string;
  docURL: string;
  downloadTitle: string;
  downloadURL: string;
}

interface DescFormProps {
  formInline: DescFormItemProps;
}

export type {
  DynamicPaymentConfig,
  PaymentConfig,
  UsdtRateItem,
  UsdtPaymentConfig,
  DescFormItemProps,
  DescFormProps
};
