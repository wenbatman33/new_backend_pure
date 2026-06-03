interface YuebaoItem {
  id: number;
  memberID: number;
  memberAccount: string;
  calcMoney: number;
  profit: number;
  status: number;
  createdAt: string;
  numero: string;
  sendAt: string;
  updatedAt: string;
  updatedUser: string;
}

interface YuebaoTotal {
  count: number;
  sendTotal: number;
  reciveTotal: number;
  giveupTotal: number;
}

export type { YuebaoItem, YuebaoTotal };
