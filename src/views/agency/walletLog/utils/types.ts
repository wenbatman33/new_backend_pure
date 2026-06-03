// 代理钱包异动纪录 查询条件
interface WalletLogSearch {
  agencyID: string;
  agencyAccount: string;
  exactlyMatching: number; // 1 完全符合 / 2 模糊
  startTime: string;
  endTime: string;
  depoWithType: number; // 0 全部 / 1 增加 / 2 减少
  adjUseType: number; // 调整用途
}

// 表格列资料
interface WalletLogItem {
  date: string;
  agencyID: number | string;
  agencyAccount: string;
  depoWithType: number | string;
  adjUseType: number | string;
  adjustMoney: number | string;
  afterMoney: number | string;
  remark: string;
}

export type { WalletLogSearch, WalletLogItem };
