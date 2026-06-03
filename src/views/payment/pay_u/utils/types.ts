// U 帐户（USDT 钱包）表单型别

// 新增/编辑 U 帐户
interface UcardFormItemProps {
  id?: number;
  name: string;
  /** 钱包类型：2 ERC / 3 TRC */
  type: number;
  /** 用途类型：0 不限 / 1~4 */
  useType: number;
  address: string;
  /** 初始金额（仅新增时可填） */
  originalAmount?: number | string;
  /** 编辑时禁用初始金额 */
  isUpdate?: boolean;
}
interface UcardFormProps {
  formInline: UcardFormItemProps;
}

// 商户下发 / 充值商户号（money in/out）
interface MoneyFormItemProps {
  id: number;
  /** 商户号（输入用，对应旧 targetSN） */
  targetSN?: string;
  /** 商户 ID（取得资讯后回填） */
  targetID?: number;
  /** 商户名称（取得资讯后回填） */
  payChannelName?: string;
  amount: number | string;
  exchangeRate: number | string;
  exchangeAmount: number | string;
  fee: number | string;
}
interface MoneyFormProps {
  formInline: MoneyFormItemProps;
  /** in 下发 / out 充值 */
  mode: "in" | "out";
}

// 冻结 / 解冻
interface FreezeFormItemProps {
  id: number;
  amount: number | string;
  note: string;
}
interface FreezeFormProps {
  formInline: FreezeFormItemProps;
  /** lock 冻结 / unlock 解冻 */
  mode: "lock" | "unlock";
}

// U 转帐
interface TransferFormItemProps {
  id: number;
  targetID?: number | string;
  amount: number | string;
  fee: number | string;
  thirdID: number | string;
  note?: string;
}
interface TransferFormProps {
  formInline: TransferFormItemProps;
  /** 可转入的目标 U 帐户下拉 */
  targetOptions: Array<{ label: string; value: number }>;
}

// 资金异动（trade）
interface TradeFormItemProps {
  id: number | string;
  name?: string;
  subjectID: number | string;
  tradeTime: string;
  amount: number | string;
  fee?: number | string;
  description: string;
}
interface TradeFormProps {
  formInline: TradeFormItemProps;
}

export type {
  UcardFormItemProps,
  UcardFormProps,
  MoneyFormItemProps,
  MoneyFormProps,
  FreezeFormItemProps,
  FreezeFormProps,
  TransferFormItemProps,
  TransferFormProps,
  TradeFormItemProps,
  TradeFormProps
};
