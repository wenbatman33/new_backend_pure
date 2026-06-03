// 新增存款單表單欄位
interface CreateFormItemProps {
  /** 會員帳號 */
  memberAccount: string;
  /** 入帳時間 */
  balanceDate: string;
  /** 存款金額 */
  amount: string | number;
  /** 三方單號 */
  thirdID: string;
  /** 線路 id */
  payChannelServiceID: string | number;
  /** 交易手續費 */
  fee: string | number;
  /** 幣別 1:法幣 2:USDT-ERC 3:USDT-TRC 4:數位人民幣 */
  currency: number;
  /** 其他幣別金額（USDT 時填） */
  otherAmount: string | number;
  /** 備註前綴（單選） */
  notePrefix: string;
  /** 備註內容 */
  noteSuffix: string;
}

interface CreateFormProps {
  formInline: CreateFormItemProps;
  /** 線路下拉選項 */
  serviceOptions: { label: string; value: number | string }[];
}

// 強制失敗 / 強制成功 表單
interface ForceFormItemProps {
  /** 備註 */
  note: string;
  /** 三方單號（強制成功才需要） */
  thirdID?: string;
}

interface ForceFormProps {
  formInline: ForceFormItemProps;
  /** 是否需要三方單號欄位（強制成功） */
  needThirdID: boolean;
}

// 修改入帳日 表單
interface BalanceDateFormItemProps {
  /** 入帳日 */
  balanceDate: string;
  /** 備註 */
  note: string;
}

interface BalanceDateFormProps {
  formInline: BalanceDateFormItemProps;
}

// 新增備註 表單
interface NoteFormItemProps {
  note: string;
}

interface NoteFormProps {
  formInline: NoteFormItemProps;
}

export type {
  CreateFormItemProps,
  CreateFormProps,
  ForceFormItemProps,
  ForceFormProps,
  BalanceDateFormItemProps,
  BalanceDateFormProps,
  NoteFormItemProps,
  NoteFormProps
};
