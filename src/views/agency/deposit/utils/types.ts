// 代理存款 — 新增存款單表單欄位
interface FormItemProps {
  /** 代理帳號 */
  memberAccount: string;
  /** 入帳時間 */
  balanceDate: string;
  /** 存款金額 */
  amount: string;
  /** 三方單號 */
  thirdID: string;
  /** 線路 id */
  payChannelServiceID: string;
  /** 線路啟用狀態篩選 1 啟用 2 停用 */
  payChannelServiceIDIsEnable: number;
  /** 手續費 */
  fee: string;
  /** 幣別 1 本幣 2 USDT-ERC 3 USDT-TRC 4 數位人民幣 */
  currency: number;
  /** 其他幣別金額 */
  otherAmount: string;
  /** 備註前綴（固定選項） */
  notePrefix: string;
  /** 備註說明 */
  noteSuffix: string;
}

interface FormProps {
  formInline: FormItemProps;
  /** 線路下拉清單 */
  serviceOptions: Array<{ id: number; name: string; status: number }>;
}

// 修改入帳日期表單欄位
interface BalanceDateFormItemProps {
  id: string;
  memberAccount: string;
  createdAt: string;
  amount: string | number;
  thirdID: string;
  gatway: string;
  balanceDate: string;
  note: string;
}

interface BalanceDateFormProps {
  formInline: BalanceDateFormItemProps;
}

export type {
  FormItemProps,
  FormProps,
  BalanceDateFormItemProps,
  BalanceDateFormProps
};
