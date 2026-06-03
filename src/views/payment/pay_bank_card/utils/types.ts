// 銀行卡管理：下拉選單項目（後端回 [{ "1": "label" }] 結構）
interface DropdownItem {
  [key: string]: string;
}

// 銀行下拉
interface BankItem {
  id: string | number;
  bankCode: string;
  bankName: string;
}

// 城市列表（原始扁平）
interface CityItem {
  id?: string;
  name?: string;
  province?: string;
  province_id?: string;
}

// 重組後的省市
interface ProvinceItem {
  province?: string;
  province_id?: string;
  city: { id: string; name: string }[];
}

// 銀行卡列表單筆
interface BankCardRow {
  ID?: number;
  cardNo?: number | string;
  payBankID?: number;
  bankName?: string;
  bankCode?: string;
  accountName?: string;
  type?: number;
  dayUpper?: number;
  dayIn?: number;
  dayOut?: number;
  balance?: number;
  limitLower?: number;
  limitUpper?: number;
  originalAmount?: number;
  broker?: string;
  province?: string;
  city?: string;
  branch?: string;
  status?: string | number;
  note?: string;
  bankAccount?: string;
  oriLoginPw?: string;
  oriUPw?: string;
  oriWithdrawalPw?: string;
  loginPw?: string;
  uPw?: string;
  withdrawalPw?: string;
  identity?: string;
  gender?: string | number;
  verifyDate?: string;
  phone?: number | string;
  updatedAt?: string;
}

// 新增/編輯銀行卡表單
interface FormItemProps {
  ID?: number;
  /** 模式：Create / Edit */
  mode?: string;
  cardNo: number | string;
  accountName: string;
  /** 對應 payBankID，表單以 bankCode 對應銀行 id */
  bankCode: string | number;
  province?: string;
  city?: string;
  branch?: string;
  broker?: string;
  verifyDate?: string;
  limitLower?: number;
  limitUpper?: number;
  dayUpper?: number;
  type: number;
  status: number;
  originalAmount?: number;
  note?: string;
  showWebBankInfo?: boolean;
  bankAccount?: string;
  oriLoginPw?: string;
  oriUPw?: string;
  oriWithdrawalPw?: string;
  loginPw?: string;
  uPw?: string;
  withdrawalPw?: string;
  showPersonalInfo?: boolean;
  identity?: string;
  gender?: number;
  phone?: string | number;
}

interface FormProps {
  formInline: FormItemProps;
  /** 銀行下拉 */
  banks: BankItem[];
  /** 用途下拉 */
  typeOptions: { label: string; value: number }[];
  /** 性別下拉 */
  genderOptions: { label: string; value: number }[];
  /** 省市資料 */
  provinces: ProvinceItem[];
  /** 是否唯讀（查看） */
  readonly?: boolean;
}

// 凍結 / 解凍表單
interface LockFormItemProps {
  amount: number | undefined;
  note: string;
}

interface LockFormProps {
  formInline: LockFormItemProps;
}

// 轉帳表單
interface TransferFormItemProps {
  amount: number | undefined;
  cardNo: string;
  fee: number | undefined;
  logTime: string;
  note?: string;
}

interface TransferFormProps {
  formInline: TransferFormItemProps;
}

// 資金異動（trade）表單
interface TradeFormItemProps {
  cardNo: number | string;
  bankcardLogType: string;
  subjectID: string | number;
  tradeTime: string;
  amount: number | undefined;
  fee?: number;
  description: string;
}

interface TradeFormProps {
  formInline: TradeFormItemProps;
  /** 收支類型下拉 */
  logTypeOptions: { label: string; value: string }[];
  /** 科目（依收支類型分組） */
  subjectsByType: Record<string, { label: string; value: string | number }[]>;
}

export type {
  DropdownItem,
  BankItem,
  CityItem,
  ProvinceItem,
  BankCardRow,
  FormItemProps,
  FormProps,
  LockFormItemProps,
  LockFormProps,
  TransferFormItemProps,
  TransferFormProps,
  TradeFormItemProps,
  TradeFormProps
};
