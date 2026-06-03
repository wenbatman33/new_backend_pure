// 代理詳情頁基本資料（聚合各 API 回傳）
interface AgencyBasic {
  id: string | number;
  account: string;
  name: string;
  memberAccount: string;
  parentAgencyID: string | number;
  parentAgencyAccount: string;
  childAgencyCount: string | number;
  memberCount: string | number;
  phone: string;
  email: string;
  wechat: string;
  qq: string;
  reivewAgencyTime: string;
  lastLoginTime: string;
  applyAgencyIp: string;
  lastLoginIp: string;
  // 可編輯狀態旗標
  editableName: boolean;
  editablePhone: boolean;
  editableEmail: boolean;
  editableWechat: boolean;
  editableAdminRemark: boolean;
  editableBankcardGroups: boolean;
  editablePaymentGroups: boolean;
  editableQQ: boolean;
  editablePassword: boolean;
  editableTransPassword: boolean;
  promotionLinks: PromotionLinkItem[];
  defaultCard: string;
  defaultUSDT: string;
  defaultEcny: string;
  password: string;
  transPassword: string;
  adminRemark: string;
  updateAdmin: string;
  bankcardGroups: any;
  paymentGroups: any;
  phoneCert: number;
  businessType: string | number;
  telegram: string;
  whatsapp: string;
  netProfitBase: string | number;
  platformCharge: boolean;
  totalCharge: boolean;
  totalBonus: boolean;
}

interface PromotionLinkItem {
  id: number | string;
  promotionLink: string;
  type?: number;
}

// 推廣連結 Modal 表單
interface PromotionLinkFormProps {
  formInline: {
    mode: "Add" | "Edit";
    id: number | string;
    promotionLink: string;
    newpromotionLink: string;
  };
}

// 平台費率新增 Modal 表單
interface AddPlatformRatesFormProps {
  formInline: {
    agencyID: number;
    gameGroupID: any;
    gameRates: number;
  };
}

// 平台費率編輯 Modal 表單
interface EditPlatformRatesFormProps {
  formInline: {
    id: number;
    gameGroupID: number;
    gameGroupDisplayName: string;
    platformFeeRatio: number;
  };
}

export type {
  AgencyBasic,
  PromotionLinkItem,
  PromotionLinkFormProps,
  AddPlatformRatesFormProps,
  EditPlatformRatesFormProps
};
