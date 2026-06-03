// 用途類型（usaType）下拉項目
interface UseTypeItem {
  useTypeID: number;
  useTypeName: string;
  useTypeEnName?: string;
  color?: string;
}

// 錢包紀錄列表單筆
interface WalletLogItem {
  createdAt: string;
  inOutType: number; // 1: in / 2: out
  useType: number;
  beforeMoney: number | string;
  adjustMoney: number | string;
  afterMoney: number | string;
  note: string;
  refId: string;
}

// 錢包資訊（搜尋後展開區塊）
interface WalletInfo {
  createdAt?: string;
  status?: number;
  expirationDate?: string;
  orderID?: string;
  source?: string;
  initialMoney?: number | string;
  totalBonus?: number | string;
  withdrawalLimit?: number | string;
  gameAccount?: string;
  gameAccountCreatedAt?: string;
  gameItem?: { gameGroupName?: string }[];
  assignedGameGroup?: string;
  maxWithdrawal?: number | string;
  minWithdrawal?: number | string;
  depositAmount?: number | string;
  memberID?: number | string;
  [key: string]: any;
}

// 搜尋表單
interface SearchFormProps {
  inOut: number | "";
  startTime: string;
  endTime: string;
  refId: string;
  type: number[];
  ignore: string;
}

export type { UseTypeItem, WalletLogItem, WalletInfo, SearchFormProps };
