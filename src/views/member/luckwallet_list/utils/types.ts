interface LuckWalletItem {
  id: number | string;
  createdAt: string;
  name: string;
  status: number;
  initialMoney: number | string;
  totalBonus: number | string;
  money: number | string;
  adjustMoney: number | string;
  maxWithdrawal: number | string;
  expirationDate: string;
  orderID: string;
  source: string | number;
  gameItem: Array<{ gameGroupName?: string }>;
  assignedGameGroup: string;
  gameAccount: string;
  gameAccountCreatedAt: string;
  updatedAt: string;
}

export type { LuckWalletItem };
