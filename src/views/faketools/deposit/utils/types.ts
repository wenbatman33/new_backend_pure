// 新增存款表單
interface CreateFormProps {
  type: number; // 1 会员帐号 / 2 输入ID
  members: string; // 帐号或ID，逗点区隔
  depositAt: string; // 存款日期 YYYY-MM-DD
  depositTime: string; // 存款时间 HH:mm
  depositAmount: string;
  payChannelServiceID: number | string;
  currency: number; // 1 人民币 / 2 USDT-ERC / 3 USDT-TRC / 4 ECNY
}

// 删除区查询表單
interface SearchFormProps {
  type: number; // 1 会员帐号 / 2 输入ID
  members: string;
  qStartTime: string;
  qEndTime: string;
}

// 存款列表項
interface DepositItem {
  orderID: string;
  payChannelServiceName: string;
  currency: string;
  memberAccount: string;
  memberID: number;
  depositAmount: number;
  depositAt: string;
}

export type { CreateFormProps, SearchFormProps, DepositItem };
